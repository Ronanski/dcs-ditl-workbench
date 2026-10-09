/* test helper: the address table function (tools/addr-table-src.js) outside the html, with the engine helpers of the loaded html */
const fs=require('fs'),path=require('path');
module.exports=E=>new Function('anPtSeg','anPins',fs.readFileSync(path.join(__dirname,'addr-table-src.js'),'utf8')+';return anAddr')(E.anPtSeg,E.anPins);
