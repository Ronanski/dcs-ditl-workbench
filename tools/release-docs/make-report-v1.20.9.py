#!/usr/bin/env python3
"""Gumagawa ng docs/LogicSim_v1.20.8_Report.html at docs/LogicSim_v1.20.8_Manual_Testing_Guide.html mula sa docs/TEST-RESULTS-*.json.
Pagkatapos: node tools/release-docs/html-to-pdf.js <html> <pdf>"""
import json,collections,html,subprocess,sys
V='1.20.9';DATE='2026-10-10';REL='https://github.com/Ronanski/dcs-ditl-workbench/releases/tag/v%s'%V
DL='https://github.com/Ronanski/dcs-ditl-workbench/releases/download/v%s/'%V
RUN=open('docs/.release-run-url').read().strip() if __import__('os').path.exists('docs/.release-run-url') else 'https://github.com/Ronanski/dcs-ditl-workbench/actions'
e=html.escape
CSS="""
body{font:11.5px/1.45 'Segoe UI',Arial,sans-serif;color:#1b2430;margin:0}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:18px 0 6px;border-bottom:2px solid #2a6fb0;padding-bottom:2px;color:#17406b}h3{font-size:12.5px;margin:12px 0 4px}
table{border-collapse:collapse;width:100%;margin:6px 0 10px}th,td{border:1px solid #b8c2cc;padding:3px 5px;vertical-align:top;text-align:left}th{background:#e8eff6}
.PASS{background:#d8f0dc}.FAIL{background:#f7d6d6}.NR{background:#fff0c2}.NT{background:#e6e6e6}
.box{border:1px solid #b8c2cc;background:#f5f8fb;padding:6px 9px;margin:6px 0}small{color:#4a5766}code{background:#eef1f4;padding:0 3px}
.pb{page-break-before:always}a{color:#17406b}
"""
def page(title,body):return '<!doctype html><html><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s</body></html>'%(e(title),CSS,body)
def st(s):
    c={'PASS':'PASS','FAIL':'FAIL','NEEDS REVIEW':'NR','NOT TESTED':'NT'}[s];return '<td class="%s"><b>%s</b></td>'%(c,s)
def table(head,rows,raw=False):
    o='<table><tr>'+''.join('<th>%s</th>'%e(h) for h in head)+'</tr>'
    for r in rows:o+='<tr>'+''.join(c if (isinstance(c,str) and c.startswith('<td')) else '<td>%s</td>'%(c if raw else e(str(c))) for c in r)+'</tr>'
    return o+'</table>'
def load(k):return json.load(open('docs/TEST-RESULTS-%s.json'%k))
def cnt(k):
    c=collections.Counter(r['status'] for r in load(k));return c
# ---------- coverage per sheet
SHEETS=['ABC-000A','ABC-000B','ABC-000','ABC-001A','ABC-001B','ABC-001C','ABC-001D','ABC-002','ABC-003A','ABC-003B','ABC-003C','ABC-003D','ABC-003E','ABC-004A','ABC-004B','ABC-004C','ABC-005','ABC-006','ABC-007','ABC-008','ABC-009A','ABC-009B','ABC-010','ABC-011','ABC-012','ABC-013','ABC-014','ABC-015','ABC-016','ABC-017','ABC-019','ABC-020','ABC-026','ABC-027','ABC-028','ABC-029','ABC-030','ABC-031','ABC-032','ABC-033','ABC-034','ABC-035','ABC-036','ABC-037','ABC-038','ABC-039','ABC-050','ABC-051','ABC-052','ABC-053','ABC-054','ABC-055','ABC-056','ABC-057']
cols=[('FX','F(X) LINEAR'),('NOT','NOT gate'),('SEL','SIG.AB / SEL'),('RATE','RATE / ramp'),('FINAL','Valve / actuator'),('RANGE','MAN range'),('HS','High/Low sel.')]
cv={k:collections.defaultdict(collections.Counter) for k,_ in cols}
for k,_ in cols:
    for r in load(k):cv[k][r.get('sheet')][r['status']]+=1
def cell(k,s):
    c=cv[k].get(s)
    if not c:return '<td class="NT">-</td>'
    t=sum(c.values());p=c.get('PASS',0);nr=c.get('NEEDS REVIEW',0);nt=c.get('NOT TESTED',0);f=c.get('FAIL',0)
    cls='FAIL' if f else ('NR' if nr else ('NT' if p==0 else 'PASS'))
    return '<td class="%s">%d/%d</td>'%(cls,p,t)
covrows=[[s]+[cell(k,s) for k,_ in cols] for s in SHEETS]
nocov=[r[0] for r in covrows if all('>-<' in c for c in r[1:])]

import re,os
def lines(f):
    return open(f).read() if os.path.exists(f) else ''
ui=lines('docs/TEST-RESULTS-UI-1.20.9.txt')
def uicount(tag):
    seg=ui.split('### '+tag+'\n')[1].split('### ')[0] if '### '+tag in ui else ''
    return seg.count('PASS '),seg.count('FAIL ')
reg=lines('docs/REGRESSION-v1.20.9.txt')
H=[]
H.append('<h1>Logic Sim v%s - Release Report</h1><small>Petsa: %s &nbsp;|&nbsp; Branch: ccr-2c4847cc-9fe3px &nbsp;|&nbsp; Para sa: non-coder (simpleng Taglish)</small>'%(V,DATE))
H.append('<div class="box"><b>Pinakamahalagang buod:</b> Ito ang ayos pagkatapos ng <b>manual test mo sa v1.20.8</b>. Inayos ko ang mga FAIL mo (typed value sa AI, value sa ALM at instrument tag, lampas na range, grey na path papunta sa SELECT CIRCUIT, ang division, ang pag-reset ng settings, at ang SIG.AB pairing). Bumalik ang <b>Wire values</b>. Nakuha ko ang DCS patterns 038 at 039 mula sa screenshot mo. <b>Walang FAIL</b> sa automated tests na pinatakbo ko, pero <b>hindi pa lahat ng ABC sheets ay na-validate</b> at <b>may dalawang tanong</b> na kailangan ng sagot mo (seksyon 4). Ang EXE at APK ay na-build ng GitHub pero <b>hindi ko pa na-install o na-run</b>.</div>')
H.append('<h2>1. Download links</h2>')
H.append(table(['File','Para saan','Direct link'],[
 ['HTML','Buksan sa Chrome, walang install','<a href="%slogic-sim-v%s.html">%slogic-sim-v%s.html</a>'%(DL,V,DL,V)],
 ['Portable EXE','Windows, walang admin','<a href="%slogic-sim-v%s-portable.exe">%slogic-sim-v%s-portable.exe</a>'%(DL,V,DL,V)],
 ['APK','Android (allow "install unknown apps")','<a href="%slogic-sim-v%s.apk">%slogic-sim-v%s.apk</a>'%(DL,V,DL,V)],
 ['Report na ito (PDF)','Simpleng ulat','<a href="%sLogicSim_v%s_Report.pdf">%sLogicSim_v%s_Report.pdf</a>'%(DL,V,DL,V)],
 ['Manual Testing Guide (PDF)','Hakbang-hakbang na tests para sa iyo','<a href="%sLogicSim_v%s_Manual_Testing_Guide.pdf">%sLogicSim_v%s_Manual_Testing_Guide.pdf</a>'%(DL,V,DL,V)],
 ['Manual ng app (PDF)','User manual','<a href="%slogic-sim-v%s-manual.pdf">%slogic-sim-v%s-manual.pdf</a>'%(DL,V,DL,V)],
 ['Release page','Lahat ng file','<a href="%s">%s</a>'%(REL,REL)]],raw=True))
H.append('<h2>2. Ano ang ibig sabihin ng status</h2>')
H.append(table(['Status','Ibig sabihin'],[[ '<td class="PASS"><b>PASS</b></td>','Tugma sa tamang inaasahang resulta. May actual na ebidensya (test record).'],['<td class="FAIL"><b>FAIL</b></td>','Hindi tugma sa tamang resulta. May sira.'],['<td class="NR"><b>NEEDS REVIEW</b></td>','Hindi malinaw kung ano ang tama (kulang ang reference o drawing). Kailangan ng sagot o pagsusuri mo.'],['<td class="NT"><b>NOT TESTED</b></td>','Wala pang test at walang ebidensya. Hindi ito PASS.']],raw=True))
H.append('<h2>3. Sagot sa bawat puna mo (manual test ng v1.20.8)</h2>')
DONE='<td class="PASS"><b>NAAYOS</b></td>';NRq='<td class="NR"><b>NEEDS REVIEW</b></td>';DEF='<td class="NT"><b>PINAG-ANTAY</b></td>';PASSq='<td class="PASS"><b>PASS (mo)</b></td>'
H.append(table(['Puna mo','Ano ang ginawa ko','Status'],[
 ['MT-01 Toolbar','Pasado sa test mo. Nadagdag ang dalawang button: <b>Wire values</b> at <b>Review marks</b>.',PASSq],
 ['MT-02: typed (forced) na value sa AI: ang nag-update ay ang ALM, hindi ang address','Nahanap ko ang sanhi: ang address ay binabasa ang sariling value ng AI, hindi ang forced na net. Ngayon, kapag forced, ang address mismo ang nag-a-update. <b>Inalis na rin ang value sa tabi ng ALM at ng instrument tag</b> (AI address lang).',DONE],
 ['MT-02: nakakapag-input ng lampas sa range (slider lang ang tama)','Ang FORCE box at ang field inputs ay <b>limitado na sa range na nakasulat sa drawing</b> (may mensahe). Hindi nililimitahan ang net na walang nakasulat na range.',DONE],
 ['MT-03: grey ang path papunta sa SELECT CIRCUIT; "check din sa ibang blocks"','Ang wire mula sa SIG.AB junction papunta sa circuit ay binabasa ng reader bilang digital flag kaya grey. Ngayon ay <b>analog na may ilaw</b>; grey lang kapag FORCED BAD ang transmitter. Sinuri ko ang <b>lahat ng sheet</b>: 296 na analog wire na may value pero grey, <b>lahat ay may dahilan</b> (169 ay hindi napiling leg ng T switch, 127 ay walang sumusunod sa signal sa dulo). Wala nang "hindi maipaliwanag".',DONE],
 ['MT-04: 23 pa rin ang output at grey; "32% OF min air flow"; walang values','Natuklasan na ang SI0036 TAF DEMAND ay nasa <b>T/H</b> (446 T/H), kaya ang constant ay dapat nasa T/H din. Ang <b>setting na T/H (default 400) na ang mismong signal</b>; nakikita pa rin ang orihinal na 32 %. Bumalik ang values sa mga wire na walang address (kasama ang output ng constant).',NRq],
 ['MT-05: LN29 at "may mali ata sa division"','<b>May mali nga sa division.</b> Ang ÷ symbol (may dalawang maliit na tuldok) ay nabasa bilang minus (b - a) sa dalawang block: ABC-002 SI0049 at ABC-008. <b>Naayos</b>: a / b na. Pero ang tanong tungkol sa LN29 (ratio 1.0 = 100 % o 1 %?) ay nasa seksyon 4.',NRq],
 ['MT-06 ABC-000','Hindi na isasama ang ABC-000 sa tests.',DEF],
 ['MT-07, MT-08 (EXE, APK)','Pasado sa test mo.',PASSq],
 ['Known 1: RATE na hindi makita ang span','Pinag-antay ayon sa utos mo (default muna).',DEF],
 ['Known 2: RATE na walang rate = 1; bumabalik sa default pag nire-reset','Lahat ng RATE/ramp na walang nakasulat na rate ay <b>1 bawat segundo</b> na. Ang settings ng block (rate, stroke time, tuning, limits) ay <b>hindi na binubura ng Reset</b>; may <b>"Reset this block to default"</b> sa bawat block.',DONE],
 ['Known 3: maling intindi sa constant na 32','Tingnan ang MT-04 sa itaas at ang tanong sa seksyon 4.',NRq],
 ['Known 4: screenshot ng DCS patterns','Binasa ko ang 16 points ng Ptrn038 at Ptrn039. Pareho sa app hanggang 139 kg/cm2, pero <b>iba</b> mula 139 hanggang 219 (hanggang 1.2 % at 2.5 %). <b>Pinalitan ko ng DCS points</b> ang S1-LN38 at S1-LN39. Naka-save ang screenshots sa repo.',DONE],
 ['Known 5: walang unit sa header ng LINEAR','Hindi na ito issue. Informational na lang; walang inaasahang gawin.',DONE],
 ['Known 7: asan ang 8 SEL na walang bad signal','<b>Hindi applicable</b> (walang SIG.AB, kaya walang bad signal). Hindi na itinuturing na NOT TESTED. Ang listahan ay nasa technical report.',DONE],
 ['Known 8: pagpares ng SIG.AB at transmitter ay dapat sa koneksyon, hindi layo','<b>Koneksyon na ang batayan</b> (ang wire ng transmitter ay ang wire ng SIG.AB box). 198 sa 198 ang napares: 180 na kapareho ng dati at 18 na dati ay hindi nahanap. Walang salungatan.',DONE],
 ['Known 9: valve/actuator stroke time ("paano ireview, ang dami")','Hindi na ipapa-review. Default ang stroke time at <b>puwedeng baguhin</b> sa block (may Reset to default).',DONE],
 ['Known 10: balikan ang mga hindi nagalaw','Tingnan ang seksyon 6 (ano ang nagawa at ano ang bukas pa).',NRq],
 ['Known 11: High/Low selector, paano ka tutulong','Ngayon ay <b>18 sa 18 selector</b> ang na-test ko (dati 4 lang) at may eksaktong hakbang sa Manual Testing Guide (MT-09).',DONE]],raw=True))
H.append('<h2>4. Dalawang tanong na kailangan ng sagot mo</h2>')
H.append('<div class="box"><b>Tanong 1 - F(X) LN29 at mga katulad (ABC-002):</b> Ang LN29 table ay nasa <b>%</b> (X: 0 hanggang 100). Ang input niya (SI0049) ay galing sa division na a/b, kaya ratio na malapit sa <b>1.0</b>. Sa drawing, ang kabilang leg ng T switch ay nakasulat na <b>"1.0 (100%)"</b>. Ibig sabihin ba, <b>ang 1.0 ay 100 %</b> at dapat gawing 100 bago pumasok sa F(X)? Sa ngayon, ang 1.0 ay binabasa ng app bilang 1 % at ang output ay 0. <b>Hindi ko ito binago dahil hindi ako sigurado.</b> Isang sagot lang: "oo, ratio x 100" o "hindi".<br><br><b>Tanong 2 - 32 % MIN. AIR FLOW:</b> Ginawa kong ang T/H setting (default 400) ang mismong signal. Kung ang ibig mong sabihin ay <b>32 % ng ibang numero</b> (halimbawa 32 % x 1250 T/H = 400 T/H), sabihin lang kung ano ang numerong iyon at gagawin kong iyon ang batayan.</div>')
H.append('<h2>5. Ano ang bago o binago</h2>')
H.append(table(['Bagay','Ano ang nagbago (simple)'],[
 ['Mga value sa drawing','AI address lang ang may value (wala sa ALM at instrument tag). Ang <b>Wire values</b> ay bumalik: may numero ang bawat analog wire na walang address (puwedeng i-off sa button). Ang forced na net ay forced din ang ipinapakita.'],
 ['Review marks','Amber na putol-putol na kahon sa drawing kung saan hindi nakilala ang shape, kulang ang pin, walang table ang F(X), o hindi makita ang span ng RATE. Hindi verified ang resulta doon.'],
 ['Range','Ang typed na value ay hanggang sa range lang na nakasulat sa drawing.'],
 ['SELECT CIRCUIT','May ilaw na ang mga input wire; grey lang kapag FORCED BAD.'],
 ['Division','Dalawang ÷ block ang naayos (dating minus).'],
 ['Settings ng block','Hindi na binubura ng Reset. May "Reset this block to default".'],
 ['RATE','Walang nakasulat na rate = 1 bawat segundo.'],
 ['Bad Signal','Napares sa transmitter base sa koneksyon, hindi sa layo.'],
 ['Min air flow ABC-002','Ang setting na T/H (default 400) ang signal. 32 % ay nakikita pa para sa paghahambing.'],
 ['LINEAR','S1-LN38 at S1-LN39 ay galing na sa DCS screenshots mo.'],
 ['High / Low selector','Pati ang wire na ibinabahagi sa ibang block ay naka-dim sa hindi napiling input.']],raw=True))
H.append('<h2 class="pb">6. Automated tests (ako ang nagpatakbo, may record)</h2><small>Mga test na pinatakbo ng computer sa v%s HTML. <b>Hindi ito kapalit</b> ng manual test mo.</small>'%V)
def row(name,what,k):
    c=cnt(k);return [name,what,'%d'%c.get('PASS',0),'%d'%c.get('FAIL',0),'%d'%c.get('NEEDS REVIEW',0),'%d'%c.get('NOT TESTED',0)]
H.append(table(['Test','Ano ang sinuri','PASS','FAIL','NEEDS REVIEW','NOT TESTED'],[
 row('F(X) conversion (112 block, wala ang ABC-000)','Low / gitna / high ng bawat LINEAR table, at lampas-table','FX'),
 row('LINEAR vs LINEAR.xls at DCS screenshots','Lahat ng table; S1-LN38 / 39 laban sa DCS Ptrn038 / 039','LINEAR'),
 row('NOT gate (244)','Truth table','NOT'),
 row('SIG.AB / average select (24 SEL)','Normal, primary bad, secondary bad, both bad, valid na zero','SEL'),
 row('RATE / ramp','Unit, instrument input, unti-unting pagtaas, bypass','RATE'),
 row('Valve / actuator (81)','Instant ang command, unti-unti ang posisyon','FINAL'),
 row('MAN range at AI','Hanggang saan lang ang value','RANGE'),
 row('ABC-002 min air flow','Default 400, edit, umaabot sa susunod na calculation','MINAIR'),
 row('High/Low selector (18 selector)','Napiling input lang ang naka-ilaw','HS')]))
def uirow(name,what,tag):
    p_,f_=uicount(tag);return [name,what,'%d / %d'%(p_,p_+f_),'<td class="%s"><b>%s</b></td>'%('PASS' if f_==0 and p_>0 else 'FAIL','PASS' if f_==0 and p_>0 else 'FAIL')]
H.append('<h3>Mga test sa totoong UI (browser)</h3>')
H.append(table(['Test','Ano ang sinuri','Hakbang na pasado','Status'],[
 uirow('Bagong UI test v1.20.9','Typed na AI value, walang value sa ALM / tag, range, Wire values, SELECT CIRCUIT wires, division, Reset at per-block reset, reload','test-ui-1.20.9'),
 uirow('Bad Signal','OFF / FORCED BAD / zero hindi bad','test-ui-sigab'),
 uirow('Min air flow sa UI','400, 500, reload, reset to default','test-ui-minair'),
 uirow('Toolbar','Walang Save / Open / Import / Plant','test-ui-1.20.8')],raw=True))
H.append('<h3>Mga lumang test (regression)</h3>')
H.append(table(['Test','Resulta'],[[a,b] for a,b in [x.split('||') for x in reg.strip().split('\n') if '||' in x]]) if reg.strip() else '<small>(walang regression file)</small>')
H.append('<div class="box">DITL guard: <b>IDENTICAL</b> (hindi ginalaw ang digital page). Ang mga test na hindi pinatakbo o sadyang luma na (dahil inalis ang Save/Open/Import) ay nakalista sa technical report <code>docs/REPORT-v1.20.9.md</code>.</div>')
H.append('<h2 class="pb">7. Coverage kada ABC sheet (automated lang)</h2><small>Format: <b>PASS / kabuuang records</b>. Berde = lahat pasado; dilaw = may NEEDS REVIEW; abo = walang test (<b>NOT TESTED</b>). <b>Hindi ito patunay na tama ang buong sheet.</b></small>')
H.append(table(['Sheet']+[n for _,n in cols],covrows,raw=True))
H.append('<small>Walang kahit anong automated record sa mga ito (mga lumang general test lang ang sumasakop): %s.</small>'%(', '.join(nocov) or 'wala'))
H.append('<h2>8. Manual tests</h2>')
H.append('<div class="box">Ang <b>Manual Testing Guide v%s</b> ay may MT-01 hanggang MT-12 na may eksaktong hakbang. Lahat ay <b>NOT TESTED</b> hanggang mag-ulat ka ng actual result. Ang "Rehearsal result" sa guide ay ang nakita ko sa headless browser; hindi iyon ang test mo.</div>'%V)
H.append(table(['Test ID','Sheet','Ano ang titingnan','Status'],[
 ['MT-01','Kahit anong ABC','Toolbar: wala ang Save/Open/Import/Plant; may Wire values at Review marks','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-02','ABC-002','Typed (forced) na value sa AI0273 at limit sa range','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-03','ABC-002','SELECT CIRCUIT: ilaw ng wires, Bad Signal, SI0048','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-04','ABC-002','Min air flow: setting 400 / 500 / 600 at SI0036','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-05','ABC-002','Division SI0049 = a / b','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-06','ABC-050','Settings ng block: Reset at Reset this block to default','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-07','ABC-002','Bad Signal ng B.0671 ay para sa AI0273 (koneksyon)','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-08','ABC-010','DCS pattern 038: 16 points vs screenshot mo','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-09','ABC-050, 051, 002, 011','High/Low selector: napiling wire lang ang naka-ilaw','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-10','ABC-003B','Wire values at Review marks (on / off)','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-11','Windows','Portable EXE v%s'%V,'<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-12','Android','APK v%s'%V,'<td class="NT"><b>NOT TESTED</b></td>']],raw=True))
H.append('<h2>9. Known issues at hindi pa tapos</h2>')
H.append(table(['Item','Ano ang kulang','Status'],[
 ['F(X) % input (LN29 at mga katulad)','Hindi pa nalalaman kung ang ratio 1.0 ay 100 % sa F(X). Tingnan ang Tanong 1.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['32 % MIN. AIR FLOW','Tingnan ang Tanong 2.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['RATE na hindi makita ang span','ABC-007 RAMPB#18, ABC-057 RATE#67, ABC-001C RATE#47, ABC-002 RATE#75 at #76. Pinag-antay mo; default ang ginagamit.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['RATE na hindi nakita ang source ng input','Ilang RATE (ABC-004B/C, 009B, 020) na hindi sumusunod ang input sa isang field value sa default na switch state.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['Range ng ibang net','Ang typed value ay nililimitahan lang kung may nakasulat na range (AI, MAN, PID output, field input na may range sa drawing). Ang net na walang range ay hindi nililimitahan.','<td class="NT"><b>NOT TESTED</b></td>'],
 ['Hindi pa nagawa / hindi na-retest','COS na dikit sa T switch (existing tests lang); range ng COS/MAN setpoint laban sa output; wire geometry re-audit; Simulation Audit panel; side-by-side sheets.','<td class="NT"><b>NOT TESTED</b></td>']],raw=True))
H.append('<h2>10. Ano ang VERIFIED at ano ang HINDI pa</h2>')
H.append(table(['VERIFIED (may ebidensya)','HINDI pa verified / assumption'],[[
 '<ul><li>Ang mga automated test results sa seksyon 6 (walang FAIL).</li><li>Pasado ang DITL guard.</li><li>Ang build at release ay beberipikahin sa chat message (workflow run, mga file, SHA256).</li></ul>',
 '<ul><li>Pagbukas at takbo ng EXE at APK (hindi ko na-install).</li><li>Lahat ng manual tests (MT-01 hanggang MT-12).</li><li>Buong validation ng 54 ABC sheets.</li><li>Ang dalawang tanong sa seksyon 4.</li><li>Mga DEFAULT na numero (rate = 1, stroke time).</li><li>Ang simulator ay <b>simulation values</b> lang, hindi totoong plant reading.</li></ul>']],raw=True))
H.append('<h2>11. Susunod na dapat gawin</h2>')
H.append(table(['#','Gawin','Sino'],[
 ['1','Sagutin ang dalawang tanong (seksyon 4).','Ikaw'],
 ['2','Gawin ang MT-01 hanggang MT-12 sa Manual Testing Guide at i-report ang PASS / FAIL.','Ikaw'],
 ['3','Pag may sagot ka sa Tanong 1: ayusin ang F(X) input scaling sa lahat ng apektadong F(X) at i-test.','Ako, pagkatapos ng go mo'],
 ['4','Palawakin ang test coverage sheet-por-sheet (seksyon 7).','Ako, pagkatapos ng go mo']]))
open('docs/LogicSim_v%s_Report.html'%V,'w').write(page('Logic Sim v%s Release Report'%V,''.join(H)))
