/* nets with 2+ real drivers (a drawing cannot have them = reader defect).  usage: node tools/multi-driver.js file.html */
const {load,build}=require('./lib.js');const {E,rows}=load(process.argv[2]);let n=0;
for(const r of rows){if(/ABC-000/.test(r.name))continue;const S=build(E,r);
 S.drv.forEach((l,net)=>{const d=l.filter(x=>x.k!=='LINK');if(d.length>1){n++;console.log(r.name,'net',net,S.lab[net]?S.lab[net].t:'', d.map(x=>x.k+'#'+x.id).join(' + '))}})}
console.log('nets with 2+ real drivers:',n)
