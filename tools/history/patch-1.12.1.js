/* v1.12.0 -> v1.12.1 : group A reader defect: constants whose value is written as a RATIO next to the box ("SCALE CONVERT  40 / 120") or as a number with unit ("7.6 kg/cm2", "1.0 (100%)") were read as 0 (18 constants, ABC-002, 004A, 005, 006, 010, 032, 052, 056, 001B, 001C). DITL page untouched. */
const fs=require('fs');let h=fs.readFileSync('archive/html/logic-sim-v1.12.0.html','utf8');
const rep=(a,b)=>{const n=h.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));h=h.split(a).join(b)};
rep('<title>Logic Sim v1.12.0</title>','<title>Logic Sim v1.12.1</title>');
rep(`if(tn&&/^-?\\d+(\\.\\d+)?\\s*%?$/.test(tn))P.val=anNum(tn);if(P.val==null){P.val=0;b.warn='value not found'}`,`if(tn&&/^-?\\d+(\\.\\d+)?\\s*%?$/.test(tn))P.val=anNum(tn);
    /* v1.12.1: value written as a ratio next to the box (SCALE CONVERT 40 / 120 = 0.3333) or as a number with a unit / percent note (7.6 kg/cm2, 1.0 (100%)) */
    if(P.val==null){const fr=near(b.cx,b.cy,40,t=>/^\\s*-?\\d+(?:\\.\\d+)?\\s*\\/\\s*-?\\d+(?:\\.\\d+)?\\s*$/.test(t.t.trim()))[0];if(fr){const m=/(-?\\d+(?:\\.\\d+)?)\\s*\\/\\s*(-?\\d+(?:\\.\\d+)?)/.exec(fr.t);if(+m[2]){P.val=+m[1]/+m[2];b.note='ratio '+fr.t.trim()}}}
    if(P.val==null){const nu=near(b.cx,b.cy,24,t=>(Math.abs(t.y-b.cy)<=4||/^\\s*-?\\d+(?:\\.\\d+)?\\s*\\(\\s*\\d+\\s*%\\s*\\)\\s*$/.test(t.t.trim()))&&/^\\s*-?\\d+(?:\\.\\d+)?\\s*(?:[A-Za-z%°][\\w%°\\/²³]*\\s*)?(?:\\(.*\\))?\\s*$/.test(t.t.trim())&&/[A-Za-z%°(]/.test(t.t.trim()))[0];if(nu){P.val=parseFloat(nu.t.trim());b.note='value '+nu.t.trim()}}
    if(P.val==null){P.val=0;b.warn='value not found'}`);
fs.writeFileSync('logic-sim-v1.12.1.html',h);console.log('ok')
