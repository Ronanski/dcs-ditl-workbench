/* shared writer for the verification test records (requirements batch v1.20.8, Group E).
   status: PASS = equals the verified expected result; FAIL = does not; NEEDS REVIEW = expected behaviour / reference unclear; NOT TESTED = no evidence. */
const fs=require('fs');
module.exports=function write(prefix,title,rec,note){const cnt={};rec.forEach(r=>cnt[r.status]=(cnt[r.status]||0)+1);
 fs.writeFileSync(prefix+'.json',JSON.stringify(rec,null,1));
 const md=['# '+title,'','Counts: '+JSON.stringify(cnt),'',note||'','','Record fields: sheet, block, input conditions, expected value/unit, actual value/unit, source of expected, evidence, status, correction, retest status. Full records (incl. PASS): `'+prefix.split('/').pop()+'.json`.','','| sheet | block | input | expected | actual | source of expected | status | evidence |','|---|---|---|---|---|---|---|---|'];
 rec.filter(r=>r.status!=='PASS').forEach(r=>md.push(`| ${r.sheet} | ${r.block} | ${r.input} | ${r.expected} | ${r.actual} | ${r.source||''} | ${r.status} | ${r.evidence||''} |`));
 md.push('','PASS records: '+(cnt.PASS||0)+' (listed only in the json).');fs.writeFileSync(prefix+'.md',md.join('\n'));return cnt};
