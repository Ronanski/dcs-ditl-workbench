/* block-behaviour progress: weighted by how many blocks of each kind the 54 sheets use. usage: node tools/progress.js ditl-workbench-vX.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const st=require('./block-status.json'),L=st._levels;
const cnt={};for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);for(const b of S.blk)cnt[b.k]=(cnt[b.k]||0)+1}
let w=0,s=0;const by={};const unk=[];
for(const k in cnt){const lv=st[k];if(!lv){unk.push(k);continue}const p=L[lv];if(p==null)continue;w+=cnt[k];s+=cnt[k]*p;by[lv]=(by[lv]||0)+cnt[k]}
console.log('blocks counted',w,JSON.stringify(by));console.log('BLOCK BEHAVIOUR PROGRESS = '+(s/w).toFixed(1)+' %');if(unk.length)console.log('NOT IN block-status.json:',unk.join(' '));
