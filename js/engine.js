import {DATA} from './content.js';

const own=(object,key)=>Object.hasOwn(object,key);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const int=(value,min,max)=>Number.isSafeInteger(value)&&value>=min&&value<=max;
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const exactKeys=(value,keys)=>object(value)&&Object.keys(value).length===keys.length&&keys.every(key=>own(value,key));
export const CLOSEOUT=DATA.decisions.length+1, COMPLETION=CLOSEOUT+1;
export const clone=value=>structuredClone(value);
export const validScoreKeys=()=>new Set([
  ...DATA.decisions.map(item=>`decision:${item.id}`),...DATA.questions.map(item=>`statement:${item.id}`),
]);
export function currency(value) {
  const absolute=Math.abs(value),lower=Math.floor(absolute),fraction=absolute-lower;
  const rounded=fraction===0.5?(lower%2===0?lower:lower+1):Math.round(absolute);
  return `${value<0?'-':''}$${rounded.toLocaleString('en-US')}`;
}
export function balancesAfter(count=DATA.events.length) {
  const balances={...DATA.opening};
  for(const event of DATA.events.slice(0,count))for(const [account,amount] of event.changes)balances[account]+=amount;
  return balances;
}
export const unitsAfter=(count=DATA.events.length)=>DATA.events.slice(0,count).reduce((sum,event)=>sum+event.unit_change,0);
export function eventCountThrough(index) {
  return DATA.decisions.slice(0,index+1).reduce((count,item)=>item.event_id?Math.max(count,DATA.events.findIndex(event=>event.id===item.event_id)+1):count,0);
}
export function finalValues() {
  const b=balancesAfter(),net_sales=b['Sales Revenue']-b['Sales Returns and Allowances']-b['Sales Discounts'];
  const cost_of_goods_sold=b['Cost of Goods Sold'],freight_out_expense=b['Freight-Out Expense'];
  const gross_profit=net_sales-cost_of_goods_sold,income_effect=gross_profit-freight_out_expense;
  const total_assets=b.Cash+b['Accounts Receivable']+b.Inventory,total_liabilities=b['Accounts Payable'];
  const common_stock=b['Common Stock'],total_equity=common_stock+income_effect;
  return {cash:b.Cash,accounts_receivable:b['Accounts Receivable'],inventory:b.Inventory,accounts_payable:b['Accounts Payable'],
    net_sales,cost_of_goods_sold,gross_profit,freight_out_expense,income_effect,total_assets,total_liabilities,
    common_stock,retained_earnings:income_effect,total_equity,total_liabilities_and_equity:total_liabilities+total_equity};
}
export function scoreSummary(state) {
  return {correct:Object.values(state.f).filter(Boolean).length,attempted:Object.keys(state.f).length,total:validScoreKeys().size,
    revisions:Object.values(state.a).reduce((sum,value)=>sum+Math.max(0,value-1),0)};
}
export function newState(seed) {
  if(seed===undefined){const words=crypto.getRandomValues(new Uint32Array(2));seed=(BigInt(words[0]&0x7fffffff)<<32n)|BigInt(words[1]);}
  return {v:3,p:0,i:0,z:BigInt(seed),d:{},r:{},qd:{},q:{},qs:false,a:{},f:{}};
}
export function validateSnapshot(raw) {
  assert(exactKeys(raw,['v','p','i','z','d','r','qd','q','qs','a','f'])&&(raw.v===3||raw.v===4),'Unsupported snapshot');
  assert(int(raw.p,0,3)&&int(raw.i,0,DATA.decisions.length-1),'Invalid position');
  assert(typeof raw.z==='bigint'&&raw.z>=0n&&raw.z<2n**63n,'Invalid shuffle seed');
  assert(object(raw.r)&&object(raw.d),'Invalid event work');
  const ids=Object.keys(raw.r),prefix=DATA.decisions.slice(0,ids.length);
  assert(ids.length<=DATA.decisions.length&&prefix.every(item=>own(raw.r,item.id)),'Answers out of order');
  for(const item of prefix)assert(typeof raw.r[item.id]==='string'&&item.options.includes(raw.r[item.id]),'Unknown answer');
  for(const [id,value] of Object.entries(raw.d)) {
    const item=DATA.decisions.find(item=>item.id===id);
    assert(item&&typeof value==='string'&&item.options.includes(value),'Invalid decision draft');
  }
  assert(typeof raw.qs==='boolean'&&object(raw.q)&&object(raw.qd),'Invalid statement work');
  for(const answers of [raw.q,raw.qd])for(const [id,value] of Object.entries(answers)) {
    const item=DATA.questions.find(item=>item.id===id);
    assert(item&&typeof value==='string'&&item.options.includes(value),'Invalid statement answer');
  }
  if(raw.qs)assert(DATA.questions.every(item=>own(raw.q,item.id)),'Incomplete statement submission');
  assert(object(raw.a)&&object(raw.f),'Invalid scoring');
  const scores=validScoreKeys();
  for(const [key,value] of Object.entries(raw.a))assert(scores.has(key)&&int(value,1,raw.v===3?99:Number.MAX_SAFE_INTEGER),'Invalid attempts');
  for(const [key,value] of Object.entries(raw.f))assert(scores.has(key)&&typeof value==='boolean','Invalid first pass');
  if(raw.p===0)assert(Object.keys(raw.d).length===0&&ids.length===0,'Early event work');
  if(raw.p>=2)assert(DATA.decisions.every(item=>raw.r[item.id]===item.correct),'Unresolved event trail');
  if(raw.p<2)assert(!raw.qs&&Object.keys(raw.q).length===0&&Object.keys(raw.qd).length===0,'Early statement work');
  if(raw.p===3)assert(raw.qs&&DATA.questions.every(item=>raw.q[item.id]===item.correct),'Unresolved statements');
  for(const item of DATA.decisions.slice(0,raw.i))assert(raw.r[item.id]===item.correct,'Unresolved prior decision');
  if(raw.p===1) {
    assert(ids.length===raw.i||ids.length===raw.i+1,'Inconsistent decision position');
    assert(Object.keys(raw.d).every(id=>DATA.decisions.slice(0,raw.i+1).some(item=>item.id===id)),'Future draft');
  }
  if(raw.p>=2)assert(raw.i===DATA.decisions.length-1,'Invalid completed event position');
  return clone(raw);
}
export function canonicalJSON(value) {
  if(typeof value==='bigint')return value.toString();
  if(Array.isArray(value))return `[${value.map(canonicalJSON).join(',')}]`;
  if(object(value))return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonicalJSON(value[key])}`).join(',')}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g,c=>`\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`);
}
export function parseSnapshotJSON(text) {
  assert(/"z"\s*:\s*\d+(?=\s*[,}])/.test(text),'Seed must be an integer');
  const raw=JSON.parse(text.replace(/("z"\s*:\s*)(\d+)(?=\s*[,}])/g,'$1"$2"'));
  assert(typeof raw.z==='string'&&/^\d{1,19}$/.test(raw.z),'Invalid seed');raw.z=BigInt(raw.z);
  return validateSnapshot(raw);
}
function base64url(bytes) {
  let text='';for(const byte of bytes)text+=String.fromCharCode(byte);
  return btoa(text).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'');
}
function from64(text) {
  assert(typeof text==='string'&&text.length>0&&text.length<=12000&&/^[A-Za-z0-9+/_-]+={0,2}$/.test(text),'Invalid token');
  const unpadded=text.replace(/=+$/,'');
  return Uint8Array.from(atob(unpadded.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-unpadded.length%4)%4)),c=>c.charCodeAt(0));
}
async function transform(bytes,stream,max) {
  const reader=new Blob([bytes]).stream().pipeThrough(stream).getReader(),chunks=[];let length=0;
  while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;
    if(length>max){await reader.cancel();throw new Error('Saved state too large');}chunks.push(value);}
  const output=new Uint8Array(length);let offset=0;for(const chunk of chunks){output.set(chunk,offset);offset+=chunk.length;}return output;
}
export async function encodeState(state) {
  const raw=new TextEncoder().encode(canonicalJSON(validateSnapshot(state)));
  assert(raw.length<=24000,'Saved state too large');return base64url(await transform(raw,new CompressionStream('deflate'),12000));
}
export async function decodeState(token) {
  try{return parseSnapshotJSON(new TextDecoder('utf-8',{fatal:true}).decode(await transform(from64(token),new DecompressionStream('deflate'),24000)));}
  catch{return null;}
}
export const frontier=state=>state.p===0?0:state.p===1?state.i+1:state.p===2?CLOSEOUT:COMPLETION;
// CPython's integer-seeded MT19937 and _randbelow: imported bookmarks keep their exact option order.
class PythonRandom {
  constructor(seed) {
    const words=[];do{words.push(Number(seed&0xffffffffn));seed>>=32n;}while(seed);
    this.mt=new Uint32Array(624);this.mt[0]=19650218;
    for(let i=1;i<624;i++)this.mt[i]=(Math.imul(1812433253,this.mt[i-1]^(this.mt[i-1]>>>30))+i)>>>0;
    let i=1,j=0;
    for(let k=Math.max(624,words.length);k>0;k--) {
      this.mt[i]=((this.mt[i]^Math.imul(this.mt[i-1]^(this.mt[i-1]>>>30),1664525))+words[j]+j)>>>0;
      if(++i>=624){this.mt[0]=this.mt[623];i=1;}if(++j>=words.length)j=0;
    }
    for(let k=623;k>0;k--) {
      this.mt[i]=((this.mt[i]^Math.imul(this.mt[i-1]^(this.mt[i-1]>>>30),1566083941))-i)>>>0;
      if(++i>=624){this.mt[0]=this.mt[623];i=1;}
    }
    this.mt[0]=0x80000000;this.index=624;
  }
  next() {
    if(this.index>=624) {
      for(let i=0;i<624;i++) {
        const value=(this.mt[i]&0x80000000)|(this.mt[(i+1)%624]&0x7fffffff);
        this.mt[i]=(this.mt[(i+397)%624]^(value>>>1)^((value&1)?0x9908b0df:0))>>>0;
      }
      this.index=0;
    }
    let value=this.mt[this.index++];value^=value>>>11;value^=(value<<7)&0x9d2c5680;value^=(value<<15)&0xefc60000;value^=value>>>18;
    return value>>>0;
  }
  below(n) {const bits=n.toString(2).length;let value;do{value=this.next()>>>(32-bits);}while(value>=n);return value;}
}
export async function shuffled(input,seed,salt) {
  const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${seed}:${salt}`)));
  let number=0n;for(const byte of bytes.slice(0,8))number=(number<<8n)|BigInt(byte);
  const random=new PythonRandom(number),result=[...input];
  for(let i=result.length-1;i>0;i--){const j=random.below(i+1);[result[i],result[j]]=[result[j],result[i]];}
  if(result.length>1&&result.every((value,index)=>value===input[index]))return [...result.slice(1),result[0]];
  return result;
}
export class Lesson {
  constructor(state=newState(),view) {
    this.state=validateSnapshot(state);
    const reached=frontier(state),number=typeof view==='string'&&/^-?\d+$/.test(view)?Number(view):view;
    this.view=int(number,0,reached)?number:reached;
  }
  get reviewing(){return this.view<frontier(this.state);}
  move(direction){if(direction!==-1&&direction!==1)return false;const target=this.view+direction;
    if(!int(target,0,frontier(this.state)))return false;this.view=target;return true;}
  canAdvance(){if(this.reviewing||this.view===COMPLETION)return false;if(this.view===0)return true;
    if(this.view===CLOSEOUT)return this.state.qs&&DATA.questions.every(item=>this.state.q[item.id]===item.correct);
    const item=DATA.decisions[this.view-1];return this.state.r[item.id]===item.correct;}
  advance(){if(!this.canAdvance())return false;this.view++;
    if(this.view<CLOSEOUT){this.state.p=1;this.state.i=this.view-1;}
    else this.state.p=this.view===CLOSEOUT?2:3;validateSnapshot(this.state);return true;}
  draftDecision(value){if(this.reviewing||this.state.p!==1)return false;const item=DATA.decisions[this.state.i];
    if(own(this.state.r,item.id)||!item.options.includes(value))return false;this.state.d[item.id]=value;return true;}
  recordAttempt(key,correct){const count=(this.state.a[key]??0)+1;assert(Number.isSafeInteger(count),'Too many attempts');
    if(count>99)this.state.v=4;this.state.a[key]=count;if(!own(this.state.f,key))this.state.f[key]=Boolean(correct);}
  submitDecision(){if(this.reviewing||this.state.p!==1)return false;const item=DATA.decisions[this.state.i];
    if(own(this.state.r,item.id)||!item.options.includes(this.state.d[item.id]))return false;
    const value=this.state.d[item.id];this.state.r[item.id]=value;this.recordAttempt(`decision:${item.id}`,value===item.correct);return true;}
  reviseDecision(){if(this.reviewing||this.state.p!==1)return false;const item=DATA.decisions[this.state.i];
    if(!own(this.state.r,item.id)||this.state.r[item.id]===item.correct)return false;delete this.state.r[item.id];return true;}
  draftStatement(id,value){if(this.reviewing||this.state.p!==2||this.state.qs)return false;
    const item=DATA.questions.find(item=>item.id===id);if(!item?.options.includes(value))return false;this.state.qd[id]=value;return true;}
  submitStatements(){if(this.reviewing||this.state.p!==2||this.state.qs)return false;
    const answers={};for(const item of DATA.questions){const selected=this.state.qd[item.id]??this.state.q[item.id];
      if(!item.options.includes(selected))return false;answers[item.id]=selected;}
    for(const item of DATA.questions){const key=`statement:${item.id}`;
      if(!own(this.state.f,key)||this.state.q[item.id]!==answers[item.id])this.recordAttempt(key,answers[item.id]===item.correct);}
    this.state.qd={...answers};this.state.q=answers;this.state.qs=true;return true;}
  reviseStatements(){if(this.reviewing||this.state.p!==2||!this.state.qs||this.canAdvance())return false;this.state.qs=false;return true;}
  reset(){if(this.reviewing)return false;this.state=newState();this.view=0;return true;}
}
