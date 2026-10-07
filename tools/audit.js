/* Signal-origin audit of the analog sheets: which wires are INPUTS (user sets), which are COMPUTED, which look wrong. */
const {load,build}=require('./lib.js');
const {E,rows}=load(process.argv[2]);
const cls=t=>!t?'none':/^(S\d\s*)?I\.\d/.test(t)?'DI':/^(S\d\s*)?O\.\d/.test(t)?'DO':/^(S\d\s*)?M\.\d/.test(t)?'M':/^(S\d\s*)?B\.\d/.test(t)?'B':/AI\d/.test(t)?'AI':/AO\d/.test(t)?'AO':'other';
const T={ext:{},extNoLabel:0,drivenDI:[],extDO:[],extM:[],total:0,nonetag:[]};const sus=[];
for(const sh of rows){const S=E.anWire(E.anModel(E.anNets(E.anBuild(sh.R,sh.name))));E.anCompile(S);
 for(const n of S.ext){const l=S.lab[n]&&S.lab[n].t,c=cls(l);T.ext[c]=(T.ext[c]||0)+1;T.total++;
  if(c==='DO')T.extDO.push(sh.name+' '+l);if(c==='M')T.extM.push(sh.name+' '+l);if(c==='none'&&S.nets[n].segs.length>1)T.nonetag.push(sh.name+' net'+n+(S.nets[n].dig?' D':' A'))}
 for(let n=0;n<S.nets.length;n++){const l=S.lab[n]&&S.lab[n].t;if(l&&cls(l)==='DI'&&S.drv[n].some(d=>d.k!=='LINK'))T.drivenDI.push(sh.name+' '+l+' <- '+S.drv[n].map(d=>d.k).join(','))}}
console.log('external inputs by tag class:',T.ext,'total',T.total);
console.log('DI-tag wires that a block DRIVES (suspect):',T.drivenDI.length,T.drivenDI.slice(0,15));
console.log('external inputs tagged O.xxxx (an output used as input, cross-sheet?):',T.extDO.length,T.extDO.slice(0,10));
console.log('external inputs tagged M.xxxx:',T.extM.length,T.extM.slice(0,10));
console.log('external inputs with NO tag found:',T.nonetag.length);
