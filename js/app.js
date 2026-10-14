import {DATA} from './content.js';
import {Lesson,CLOSEOUT,COMPLETION,frontier,shuffled,decodeState,encodeState,
  scoreSummary,currency,balancesAfter,unitsAfter,eventCountThrough} from './engine.js';

const $=id=>document.getElementById(id);
const create=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
let lesson,orders=new Map(),saveSequence=0,initializeSequence=0;
const showMessage=text=>{const node=create('p',text,'notice warning');node.setAttribute('role','alert');$('lesson').prepend(node);};
async function save() {
  const sequence=++saveSequence,state=structuredClone(lesson.state),view=lesson.view;
  document.documentElement.dataset.saving='true';
  try {
    const token=await encodeState(state);if(sequence!==saveSequence)return;
    const url=new URL(location.href);url.searchParams.set('progress',token);url.searchParams.set('view',String(view));
    history.replaceState(null,'',url);$('save-error').hidden=true;
  }catch(error){if(sequence!==saveSequence)return;$('save-error').textContent='Your address could not be updated. Keep this tab open; copying or refreshing may not preserve the latest input.';
    $('save-error').hidden=false;console.error(error);
  }finally{if(sequence===saveSequence)document.documentElement.dataset.saving='false';}
}
async function prepareOrders(state) {
  const entries=[...DATA.decisions.map(item=>[item,`decision-answer-order:${item.id}`]),
    ...DATA.questions.map(item=>[item,`statement-answer-order:${item.id}`])];
  return new Map(await Promise.all(entries.map(async([item,salt])=>[item.id,await shuffled(item.options,state.z,salt)])));
}
function resetScroll(){window.scrollTo({top:0,left:0,behavior:'instant'});$('lesson').focus({preventScroll:true});}
function move(direction){if(document.documentElement.dataset.ready==='true'&&lesson?.move(direction)){render();save();resetScroll();}}
function radio(node) {
  if(lesson.reviewing)return document.createDocumentFragment();
  const statement=lesson.view===CLOSEOUT;
  const item=statement?DATA.questions.find(item=>node.key===`widget_statement_${item.id}`):DATA.decisions[lesson.view-1];
  const selected=statement?lesson.state.qd[item.id]??lesson.state.q[item.id]:lesson.state.d[item.id];
  const fieldset=create('fieldset'),legend=create('legend',node.label);fieldset.append(legend);
  orders.get(item.id).forEach((option,index)=>{
    const label=create('label',undefined,'choice'),input=create('input'),text=create('span',option);
    input.type='radio';input.name=node.key;input.value=option;input.id=`${node.key}_${index}`;input.checked=option===selected;
    input.addEventListener('change',()=>{if(statement?lesson.draftStatement(item.id,option):lesson.draftDecision(option))save();});
    label.append(input,text);fieldset.append(label);
  });return fieldset;
}
function updateBoard(board) {
  let count=DATA.events.length,event=null;
  if(lesson.view===0)count=0;
  else if(lesson.view<CLOSEOUT){const item=DATA.decisions[lesson.view-1],correct=lesson.state.r[item.id]===item.correct;
    count=eventCountThrough(lesson.view-1-(correct?0:1));
    if(correct)event=DATA.events.find(event=>event.id===item.event_id)??null;}
  const balances=balancesAfter(count),changes=Object.fromEntries(event?.changes??[]);
  [...board.children].forEach((box,index)=>{
    const account=Object.keys(DATA.opening)[index-1],amount=index===0?event?.unit_change??0:changes[account]??0;
    box.querySelector('.account-value').textContent=index===0?String(unitsAfter(count)):currency(balances[account]);
    const delta=box.querySelector('.account-delta');delta.className=`account-delta ${amount===0?'neutral':amount>0?'positive':'negative'}`;
    delta.textContent=amount===0?'—':`${amount>0?'+':'−'}${index===0?Math.abs(amount):currency(Math.abs(amount))}`;
  });
}
function category(items,prefix){return `${items.filter(item=>lesson.state.f[`${prefix}:${item.id}`]===true).length}/${items.length}`;}
function html(node) {
  const template=document.createElement('template');template.innerHTML=node.text;
  for(const board of template.content.querySelectorAll('.account-board'))updateBoard(board);
  if(lesson.view===CLOSEOUT&&lesson.state.qs)for(const row of template.content.querySelectorAll('.feedback-row')) {
    const label=row.querySelector('.feedback-label'),index=Number(label.textContent.match(/Connection (\d+)/)[1])-1;
    const item=DATA.questions[index],correct=lesson.state.q[item.id]===item.correct;
    row.classList.toggle('correct',correct);row.classList.toggle('review',!correct);
    label.textContent=`Connection ${index+1} - ${correct?'Correct':'Review'}`;
    row.querySelector('.feedback-detail').textContent=correct?item.explanation:`Hint: ${item.hint}`;
  }
  if(lesson.view===COMPLETION) {
    const ownership=DATA.decisions.filter(item=>[0,2].includes(item.phase)&&!item.event_id);
    const account=DATA.decisions.filter(item=>!ownership.includes(item));
    const scores=[category(ownership,'decision'),category(account,'decision'),category(DATA.questions,'statement')];
    template.content.querySelectorAll('.score-box strong').forEach((node,index)=>node.textContent=scores[index]);
  }
  return template.content;
}
function action(label) {
  if(document.documentElement.dataset.ready!=='true')return;
  let accepted=false;
  if(label==='Check the account analysis') {
    accepted=lesson.submitDecision();if(!accepted)showMessage('Choose a response before checking your analysis.');
  }else if(label==='Revise my analysis')accepted=lesson.reviseDecision();
  else if(label==='Check the ending financial story') {
    accepted=lesson.submitStatements();if(!accepted)showMessage('Answer all three financial-statement questions before checking the complete story.');
  }else if(label==='Revise the financial-statement connections')accepted=lesson.reviseStatements();
  else if(label==='Start over'){reset();return;}
  else accepted=lesson.advance();
  if(accepted){render();save();if(['Open the receiving file','Continue','Finish the case'].includes(label))resetScroll();}
}
function markdown(text) {
  const lines=text.split('\n').map(line=>line.trim()).filter(Boolean),fragment=document.createDocumentFragment();
  const numbered=lines.every(line=>/^\d+\./.test(line)),bulleted=lines.every(line=>/^- /.test(line));
  if(numbered||bulleted){const list=create(numbered?'ol':'ul');for(const line of lines)list.append(create('li',line.replace(numbered?/^\d+\.\s*/:/^-\s*/,'')));fragment.append(list);}
  else for(const line of lines)fragment.append(create('p',line));return fragment;
}
function renderNode(node) {
  if(node.kind==='html')return html(node);
  if(node.kind==='radio')return radio(node);
  if(node.kind==='markdown')return markdown(node.text);
  if(node.kind==='button') {
    if(lesson.reviewing)return document.createDocumentFragment();
    const button=create('button',node.label,node.primary?'primary':undefined);button.type='button';
    button.addEventListener('click',()=>action(node.label));return button;
  }
  if(node.kind==='progress') {const box=create('div',node.text,'case-progress'),bar=create('progress');
    bar.max=1;bar.value=node.value;bar.setAttribute('aria-label',node.text);box.append(bar);return box;}
  let text=node.text;
  if(node.kind==='caption'&&lesson.view===COMPLETION&&text.startsWith('First-pass decisions:')) {
    const score=scoreSummary(lesson.state);text=`First-pass decisions: ${score.correct} of ${score.total} | Practice revisions used: ${score.revisions} | Final mastery: complete`;
  }
  const tag=node.kind==='header'?'h2':node.kind==='subheader'?'h3':'p';
  const notice=['success','warning','info'].includes(node.kind),element=create(tag,text,notice?`notice ${node.kind}`:node.kind==='caption'?'caption':undefined);
  if(notice)element.setAttribute('role','status');return element;
}
function render() {
  let variant='unanswered';
  if(lesson.view>0&&lesson.view<CLOSEOUT){const item=DATA.decisions[lesson.view-1],response=lesson.state.r[item.id];
    variant=response===undefined?'unanswered':response===item.correct?'correct':'wrong';}
  else if(lesson.view===CLOSEOUT&&lesson.state.qs)variant=DATA.questions.every(item=>lesson.state.q[item.id]===item.correct)?'correct':'wrong';
  $('hero').replaceChildren(...DATA.hero.map(html));
  $('page-counter').textContent=`Page ${lesson.view+1} of ${COMPLETION+1}`;
  $('back').disabled=lesson.view===0;$('forward').disabled=lesson.view>=frontier(lesson.state);$('reset').disabled=lesson.reviewing;
  const phase=lesson.view===0?0:lesson.view<CLOSEOUT?DATA.decisions[lesson.view-1].phase:5;
  $('stages').replaceChildren(...DATA.phases.map((label,index)=>create('div',`${index+1}. ${label}`,'stage-pill '+(index<phase?'complete':index===phase?'active':''))));
  $('review-message').replaceChildren();
  if(lesson.reviewing){const message=create('p','Review only. Return to your current page to continue the activity.','notice info');message.setAttribute('role','status');$('review-message').append(message);}
  $('lesson').replaceChildren(...DATA.screens[lesson.view].variants[variant].map(renderNode));
  $('lesson').setAttribute('aria-busy','false');document.documentElement.dataset.view=String(lesson.view);
  document.documentElement.dataset.reached=String(frontier(lesson.state));
}
async function reset(){if(document.documentElement.dataset.ready!=='true'||!lesson?.reset())return;
  const sequence=++initializeSequence;++saveSequence;document.documentElement.dataset.ready='false';
  document.documentElement.dataset.saving='true';$('lesson').setAttribute('aria-busy','true');
  for(const button of document.querySelectorAll('button'))button.disabled=true;
  orders=await prepareOrders(lesson.state);if(sequence!==initializeSequence)return;
  render();await save();document.documentElement.dataset.ready='true';resetScroll();}
async function initialize() {
  const sequence=++initializeSequence;document.documentElement.dataset.ready='false';
  if(!globalThis.CompressionStream||!globalThis.DecompressionStream||!globalThis.crypto?.subtle||!globalThis.structuredClone)throw new Error('Required browser APIs are unavailable');
  const query=new URL(location.href).searchParams,token=query.get('progress'),state=token?await decodeState(token):null;
  const restored=new Lesson(state??undefined,query.get('view')??undefined),restoredOrders=await prepareOrders(restored.state);
  if(sequence!==initializeSequence)return;lesson=restored;orders=restoredOrders;render();
  if(token&&!state)showMessage('This saved link could not be restored. A new Dock to Dollar case has been opened.');
  await save();document.documentElement.dataset.ready='true';performance.mark('dock-to-dollar-ready');
}
$('back').addEventListener('click',()=>move(-1));$('forward').addEventListener('click',()=>move(1));
$('reset').addEventListener('click',reset);window.addEventListener('popstate',()=>initialize().catch(failed));
function failed(error){$('lesson').replaceChildren(create('p','This browser could not open the saved activity. Use a current browser with JavaScript, Web Crypto, BigInt, and Compression Streams enabled.','notice warning'));
  $('lesson').setAttribute('aria-busy','false');console.error(error);}
initialize().catch(failed);
