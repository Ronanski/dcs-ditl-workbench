/* external inputs typed ANALOG that only feed digital logic (probably digital: shown as slider instead of 1/0). usage: node tools/ext-type.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);const D=new Set(['AND','OR','NOT','FF','TON','TOF','TPS','TPV']);let tot=0;const by={};
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);for(const n of S.ext){if(S.nets[n].dig)continue;const c=S.cns[n]||[];if(c.length&&c.every(b=>D.has(b.k))){tot++;(by[r.name]=by[r.name]||[]).push((S.lab[n]?S.lab[n].t:'net'+n)+'->'+c.map(b=>b.k).join('/'))}}}
console.log('analog-typed external inputs that only feed digital logic:',tot);for(const s in by)console.log(s,by[s].join('  '));
