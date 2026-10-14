import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {DATA} from '../content.js';
import {Lesson,COMPLETION,CLOSEOUT,newState,validateSnapshot,canonicalJSON,parseSnapshotJSON,
  balancesAfter,unitsAfter,finalValues,currency,shuffled,scoreSummary,decodeState,encodeState} from '../engine.js';

const oracle=JSON.parse(fs.readFileSync(new URL('./python-oracles.json',import.meta.url)));
test('every event prefix, unit count, final statement value and currency rounding matches Python',()=>{
  oracle.balances.forEach((expected,index)=>assert.deepEqual(balancesAfter(index),expected));
  oracle.units.forEach((expected,index)=>assert.equal(unitsAfter(index),expected));
  assert.deepEqual(finalValues(),oracle.final);
  oracle.currency.forEach(([value,expected])=>assert.equal(currency(value),expected));
});
test('all 84 Python shuffle cases retain the exact order, including 63-bit seeds',async()=>{
  for(const item of oracle.orders)assert.deepEqual(await shuffled(item.options,BigInt(item.seed),item.salt),item.expected);
});
test('legacy v3 links and native v3 round trips preserve work, scoring, drafts and the exact seed',async()=>{
  for(const bookmark of oracle.bookmarks) {
    const state=await decodeState(bookmark.token);assert.ok(state,bookmark.name);
    assert.equal(canonicalJSON(state),bookmark.json);
    assert.deepEqual(scoreSummary(state),bookmark.score);
    assert.equal(canonicalJSON(await decodeState(await encodeState(state))),bookmark.json);
    const lesson=new Lesson(state,bookmark.view??undefined);
    const saved=canonicalJSON(lesson.state);
    while(lesson.move(-1))assert.equal(canonicalJSON(lesson.state),saved);
    while(lesson.move(1))assert.equal(canonicalJSON(lesson.state),saved);
  }
});
test('full route: required choices, wrong locks, permitted revisions, unchanged answers and final scoring',()=>{
  const lesson=new Lesson(newState(34107n));
  assert.equal(lesson.move(1),false);assert.equal(lesson.advance(),true);
  assert.equal(lesson.submitDecision(),false);
  const first=DATA.decisions[0],wrong=first.options.find(value=>value!==first.correct);
  assert.equal(lesson.draftDecision(wrong),true);assert.equal(lesson.submitDecision(),true);
  assert.equal(lesson.submitDecision(),false);assert.equal(lesson.advance(),false);
  assert.equal(lesson.draftDecision(first.correct),false);assert.equal(lesson.reviseDecision(),true);
  lesson.draftDecision(first.correct);lesson.submitDecision();
  assert.equal(lesson.move(1),false);assert.equal(lesson.reviseDecision(),false);
  const saved=canonicalJSON(lesson.state);
  for(let repeat=0;repeat<5;repeat++) {
    lesson.move(-1);assert.equal(lesson.reviewing,true);
    for(const result of [lesson.draftDecision(wrong),lesson.submitDecision(),lesson.reviseDecision(),
      lesson.draftStatement(DATA.questions[0].id,DATA.questions[0].correct),lesson.submitStatements(),lesson.reviseStatements(),
      lesson.advance(),lesson.reset()])assert.equal(result,false);
    assert.equal(canonicalJSON(lesson.state),saved);lesson.move(1);assert.equal(canonicalJSON(lesson.state),saved);
  }
  lesson.advance();
  for(const item of DATA.decisions.slice(1)) {lesson.draftDecision(item.correct);lesson.submitDecision();
    assert.equal(lesson.move(1),false);assert.equal(lesson.advance(),true);}
  assert.equal(lesson.view,CLOSEOUT);assert.equal(lesson.advance(),false);
  assert.equal(lesson.submitStatements(),false);
  const question=DATA.questions[0];lesson.draftStatement(question.id,question.options.find(value=>value!==question.correct));
  assert.equal(lesson.submitStatements(),false);assert.deepEqual(lesson.state.q,{});
  for(const item of DATA.questions.slice(1))lesson.draftStatement(item.id,item.correct);
  lesson.submitStatements();assert.equal(lesson.advance(),false);assert.equal(lesson.move(1),false);
  assert.equal(lesson.draftStatement(question.id,question.correct),false);
  lesson.reviseStatements();lesson.submitStatements();assert.equal(lesson.state.a[`statement:${question.id}`],1);
  lesson.reviseStatements();lesson.draftStatement(question.id,question.correct);lesson.submitStatements();
  assert.equal(lesson.state.a[`statement:${question.id}`],2);
  for(const item of DATA.questions.slice(1))assert.equal(lesson.state.a[`statement:${item.id}`],1);
  assert.equal(lesson.reviseStatements(),false);assert.equal(lesson.move(1),false);lesson.advance();
  assert.equal(lesson.view,COMPLETION);assert.deepEqual(scoreSummary(lesson.state),{correct:12,attempted:14,total:14,revisions:2});
  const final=canonicalJSON(lesson.state);
  for(let view=COMPLETION-1;view>=0;view--){assert.equal(lesson.move(-1),true);assert.equal(lesson.advance(),false);
    assert.equal(lesson.reset(),false);assert.equal(canonicalJSON(lesson.state),final);}
  for(let view=1;view<=COMPLETION;view++){assert.equal(lesson.move(1),true);assert.equal(canonicalJSON(lesson.state),final);}
  assert.equal(lesson.move(1),false);assert.equal(lesson.advance(),false);
  const seed=lesson.state.z;assert.equal(lesson.reset(),true);assert.notEqual(lesson.state.z,seed);
  assert.deepEqual(scoreSummary(lesson.state),{correct:0,attempted:0,total:14,revisions:0});
});
test('malformed, future, incomplete, invalid-score and decompression-bomb snapshots are rejected',async()=>{
  for(const token of ['',null,'invalid-token','x'.repeat(12001)])assert.equal(await decodeState(token),null);
  const state=newState(0n),bad=[{...state,p:true},{...state,p:2},{...state,p:3},{...state,z:2n**63n},
    {...state,d:{[DATA.decisions[1].id]:DATA.decisions[1].correct}},
    {...state,a:{'decision:unknown':1}},{...state,a:{'decision:ownership_inbound':100}},
    {...state,f:{'decision:ownership_inbound':'true'}},{...state,qs:'false'},
    {...state,q:{[DATA.questions[0].id]:DATA.questions[0].correct}},
    {...state,r:{[DATA.decisions[1].id]:DATA.decisions[1].correct}}, {...state,extra:0}];
  bad.forEach(value=>assert.throws(()=>validateSnapshot(value)));
  assert.throws(()=>parseSnapshotJSON(canonicalJSON(state).replace('"z":0','"z":"0"')));
  const {deflateSync}=await import('node:zlib');
  assert.equal(await decodeState(deflateSync(Buffer.from(' '.repeat(25000))).toString('base64url')),null);
  const lesson=new Lesson(newState(0n),'999');assert.equal(lesson.view,0);
});
test('over 99 practice attempts keep full scoring and native resume via v4, without changing ordinary v3 links',async()=>{
  const lesson=new Lesson(newState(0n));lesson.advance();const item=DATA.decisions[0],wrong=item.options.find(value=>value!==item.correct);
  for(let i=0;i<102;i++){lesson.draftDecision(wrong);lesson.submitDecision();lesson.reviseDecision();}
  assert.equal(lesson.state.v,4);assert.equal(lesson.state.a[`decision:${item.id}`],102);
  assert.equal(scoreSummary(lesson.state).revisions,101);
  assert.equal(canonicalJSON(await decodeState(await encodeState(lesson.state))),canonicalJSON(lesson.state));
});
test('separate lesson instances have independent progress, seeds and reset behavior',()=>{
  const a=new Lesson(),b=new Lesson();assert.notEqual(a.state.z,b.state.z);
  a.advance();a.draftDecision(DATA.decisions[0].correct);a.submitDecision();assert.deepEqual(b.state.r,{});
  a.reset();assert.equal(b.view,0);assert.deepEqual(b.state.a,{});
});
test('all captured lesson variants contain the original decisions, hints, explanations and debrief, without provisional branding',()=>{
  assert.equal(DATA.screens.length,14);
  const rendered=JSON.stringify(DATA.screens)+JSON.stringify(DATA.hero);
  assert.doesNotMatch(rendered,/\b(?:pilot|preview)\b|\btest app\b|\btest version\b/i);
  DATA.decisions.forEach((item,index)=>{
    const variants=DATA.screens[index+1].variants;
    const unescaped=JSON.stringify(variants.unanswered).replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&amp;','&');
    assert.ok(unescaped.includes(item.story));
    assert.ok(JSON.stringify(variants.wrong).includes(item.hint));
    assert.ok(JSON.stringify(variants.correct).includes(item.explanation));
    assert.ok(JSON.stringify(variants.correct).includes(item.statement_effect));
  });
  assert.ok(rendered.includes('Debrief with your team'));
});
