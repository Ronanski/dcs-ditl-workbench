/* Run before a release is declared done (docs/RELEASE-PROTOCOL.md section 8): is the documentation updated for the version of the root html, and does every PDF generator keep the paper-like look?  usage: node tools/check-release-docs.js */
const fs=require('fs');const ok=[],bad=[];const T=(n,c,x)=>(c?ok:bad).push(n+(x?'  ('+x+')':''));
const html=fs.readdirSync('.').filter(f=>/^logic-sim-v\d+\.\d+\.\d+\.html$/.test(f));T('exactly one logic-sim-vX.Y.Z.html in the root',html.length===1,html.join(','));
const V=(html[0]||'').replace(/^logic-sim-v|\.html$/g,'');const rd=f=>fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
T('HANDOVER.md mentions v'+V,rd('docs/HANDOVER.md').includes('v'+V));
T('PROJECT-NOTES-v'+V+'.md exists with a "## v'+V+'" entry',rd('PROJECT-NOTES-v'+V+'.md').includes('## v'+V));
T('docs/REPORT-v'+V+'.md exists',fs.existsSync('docs/REPORT-v'+V+'.md'));
T('docs/REGRESSION-v'+V+'.txt exists',fs.existsSync('docs/REGRESSION-v'+V+'.txt'));
T('FINDINGS.md has entries for this release (a line mentioning v'+V+' or the last H-xx row is newer than the previous release)',/\| H-\d+ \|/.test(rd('docs/FINDINGS.md')));
T('Report PDF LogicSim_v'+V+'_Report.pdf exists',fs.existsSync('docs/LogicSim_v'+V+'_Report.pdf'));
T('Guide PDF LogicSim_v'+V+'_Manual_Testing_Guide.pdf exists',fs.existsSync('docs/LogicSim_v'+V+'_Manual_Testing_Guide.pdf'));
T('style.py is paper-like (cream, no #fff background)',/PAPER='#efe6cf'/.test(rd('tools/release-docs/style.py'))&&!/background:\s*#fff\b/i.test(rd('tools/release-docs/style.py')));
for(const g of['make-report-v'+V+'.py','make-guide-v'+V+'.py'])T(g+' exists and uses style.py',/style\.py/.test(rd('tools/release-docs/'+g)));
T('RELEASE-PROTOCOL has the paper-like rule (section 7) and the every-release rule (section 8)',/## 7\./.test(rd('docs/RELEASE-PROTOCOL.md'))&&/## 8\./.test(rd('docs/RELEASE-PROTOCOL.md')));
T('DESIGN.md has the document rules (32, 33)',/\n32\. /.test(rd('DESIGN.md'))&&/\n33\. /.test(rd('DESIGN.md')));
T('CLAUDE.md has the document rules',/PAPER-LIKE/.test(rd('CLAUDE.md')));
console.log(ok.map(x=>'PASS '+x).join('\n'));console.log(bad.map(x=>'FAIL '+x).join('\n'));console.log(bad.length?bad.length+' FAIL':'ALL PASS');process.exit(bad.length?1:0);
