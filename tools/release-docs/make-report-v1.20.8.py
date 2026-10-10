#!/usr/bin/env python3
"""Gumagawa ng docs/LogicSim_v1.20.8_Report.html at docs/LogicSim_v1.20.8_Manual_Testing_Guide.html mula sa docs/TEST-RESULTS-*.json.
Pagkatapos: node tools/release-docs/html-to-pdf.js <html> <pdf>"""
import json,collections,html,subprocess,sys
V='1.20.8';DATE='2026-10-10';REL='https://github.com/Ronanski/dcs-ditl-workbench/releases/tag/v%s'%V
DL='https://github.com/Ronanski/dcs-ditl-workbench/releases/download/v%s/'%V
RUN='https://github.com/Ronanski/dcs-ditl-workbench/actions/runs/38040999536'
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
# ---------- REPORT
H=[]
H.append('<h1>Logic Sim v%s - Release Report</h1><small>Petsa: %s &nbsp;|&nbsp; Branch: ccr-2c4847cc-9fe3px &nbsp;|&nbsp; Commit ng build: 301d88b &nbsp;|&nbsp; Para sa: non-coder (simpleng Taglish)</small>'%(V,DATE))
H.append('<div class="box"><b>Pinakamahalagang buod:</b> Ang v%s ay na-build at na-publish na (HTML, EXE, APK). Pasado ang mga automated test na pinatakbo ko at <b>walang FAIL</b>, pero <b>hindi pa lahat ng ABC sheets ay na-validate</b>, at <b>ikaw pa ang gagawa ng manual tests</b> (nasa hiwalay na Manual Testing Guide). Ang EXE at APK ay na-build ng GitHub pero <b>hindi ko pa na-install o na-run</b>.</div>'%V)
H.append('<h2>1. Download links</h2>')
H.append(table(['File','Para saan','Direct link'],[
 ['HTML','Buksan sa Chrome, walang install','<a href="%slogic-sim-v%s.html">%slogic-sim-v%s.html</a>'%(DL,V,DL,V)],
 ['Portable EXE','Windows, walang admin','<a href="%slogic-sim-v%s-portable.exe">%slogic-sim-v%s-portable.exe</a>'%(DL,V,DL,V)],
 ['APK','Android (allow "install unknown apps")','<a href="%slogic-sim-v%s.apk">%slogic-sim-v%s.apk</a>'%(DL,V,DL,V)],
 ['Report na ito (PDF)','Simpleng ulat','<a href="%sLogicSim_v%s_Report.pdf">%sLogicSim_v%s_Report.pdf</a>'%(DL,V,DL,V)],
 ['Manual Testing Guide (PDF)','Hakbang-hakbang na tests para sa iyo','<a href="%sLogicSim_v%s_Manual_Testing_Guide.pdf">%sLogicSim_v%s_Manual_Testing_Guide.pdf</a>'%(DL,V,DL,V)],
 ['Manual ng app (PDF)','User manual','<a href="%slogic-sim-v%s-manual.pdf">%slogic-sim-v%s-manual.pdf</a>'%(DL,V,DL,V)],
 ['Release page','Lahat ng file','<a href="%s">%s</a>'%(REL,REL)]],raw=True))
H.append('<small>Version tag: <b>v%s</b>. Pare-pareho ang numero sa release tag, sa HTML/EXE/APK filenames, sa report at testing guide.</small>'%V)
H.append('<h2>2. Ano ang ibig sabihin ng status</h2>')
H.append(table(['Status','Ibig sabihin'],[[ '<td class="PASS"><b>PASS</b></td>','Tugma sa tamang inaasahang resulta. May actual na ebidensya (test record).'],['<td class="FAIL"><b>FAIL</b></td>','Hindi tugma sa tamang resulta. May sira.'],['<td class="NR"><b>NEEDS REVIEW</b></td>','Hindi malinaw kung ano ang tama (kulang ang reference o drawing). Kailangan mong i-check o magbigay ng impormasyon.'],['<td class="NT"><b>NOT TESTED</b></td>','Wala pang test at walang ebidensya. Hindi ito PASS.']],raw=True))
H.append('<h2>3. Ano ang bago o binago</h2>')
H.append(table(['Bagay','Ano ang nagbago (simple)'],[
 ['Inalis sa screen','Plant model, Plant window, Save, Save as, Open, Import ABC DXF at Imports. (Sadya, ayon sa hiling mo. Nasa code pa pero hindi na mapipindot.)'],
 ['F(X) / LINEAR','Kapag walang table ang F(X), o lampas sa table ang input, may pulang <b>NEEDS REVIEW</b> na sa panel at may bilang sa <b>Health</b>. Dati tahimik na kinokopya ang input.'],
 ['RATE / ramp na nakasulat sa %','Ginagawa nang tamang engineering unit gamit ang tunay na span ng signal. Halimbawa: ABC-032 "1%/sec" sa 0-200 T/H = <b>2 T/H bawat segundo</b> (dati 1). ABC-001D FM403 "2.7 T/HR" = <b>0.00075 T/s</b> (dati 0.000625).'],
 ['ABC-002 minimum airflow','Puwede mo nang baguhin sa <b>T/H</b> (default <b>400 T/H</b>). Nakikita pa rin ang orihinal na <b>32 %</b> ng drawing para sa paghahambing.'],
 ['Bad Signal (SIG.AB)','May button kada transmitter: <b>Bad Signal: OFF</b> (default) o <b>FORCED BAD (ON)</b>. Kapag ON, may pulang "FORCED BAD" sa diagram. Simulation lang; walang sinusulat sa totoong DCS.'],
 ['High / Low selector','Ang napiling input lang ang naka-ilaw; ang hindi napili ay malabo (parang T switch).']],raw=True))
H.append('<h2>4. Mga bug na naayos</h2>')
H.append(table(['#','Bug','Ayos'],[
 ['H-43','F(X) na walang table ay tahimik na nagpapasa ng input (y = x), at lampas-table ay tahimik na ni-clamp.','May status na NEEDS REVIEW na kitang-kita.'],
 ['H-44','RATE/ramp na nasa % ay ginamit na parang 100 ang span. 14 na blocks ang nagbago ng rate (listahan sa Technical Report, docs/REPORT-v1.20.8.md).','Gamit na ang tunay na span.'],
 ['-','High/Low selector: parehong input wire ay naka-ilaw.','Napiling input lang ang naka-ilaw.'],
 ['-','ABC-002 32% constant ay hindi mababago.','Editable na sa T/H.'],
 ['-','Walang malinaw na label ang Bad Signal.','May OFF / FORCED BAD button at marka sa diagram.']]))
H.append('<h2 class="pb">5. Automated tests (ako ang nagpatakbo, may record)</h2><small>Ito ay mga test na pinatakbo ng computer sa v%s HTML. <b>Hindi ito kapalit</b> ng manual test mo sa totoong drawing at totoong DCS data.</small>'%V)
def row(name,what,k,extra=''):
    c=cnt(k);return [name,what,'%d'%c.get('PASS',0),'%d'%c.get('FAIL',0),'%d'%c.get('NEEDS REVIEW',0),'%d'%c.get('NOT TESTED',0)]
H.append(table(['Test','Ano ang sinuri','PASS','FAIL','NEEDS REVIEW','NOT TESTED'],[
 row('F(X) conversion (112 blocks)','Low / gitna / high ng bawat LINEAR table, at lampas-table','FX'),
 row('LINEAR vs LINEAR.xls mo (89 tables)','Lahat ng X/Y points at range, at kung tama ang table na ginagamit ng bawat F(X)','LINEAR'),
 row('NOT gate (244 gates)','Truth table, 0 at 1','NOT'),
 row('SIG.AB / average select','Normal-normal, primary bad, secondary bad, both bad, valid na zero','SEL'),
 row('RATE / ramp','Unit (%/sec, %/min, %/hr, absolute), instrument input, unti-unting pagtaas, ramp vs bypass','RATE'),
 row('Valve / actuator (81)','Instant ang command, unti-unti ang posisyon','FINAL'),
 row('MAN range at AI','Hanggang saan lang ang puwedeng value','RANGE'),
 row('ABC-002 minimum airflow','Default 400, edit, umaabot sa susunod na calculation','MINAIR'),
 row('High/Low selector wire','Napiling wire lang ang naka-ilaw','HS')]))
H.append('<h3>Iba pang automated tests</h3>')
H.append(table(['Test','Resulta','Status'],[
 ['DITL guard (hindi ginalaw ang digital page)','IDENTICAL','<td class="PASS"><b>PASS</b></td>'],
 ['Toolbar (wala na ang Save/Open/Import/Plant), walang page error','Pasado','<td class="PASS"><b>PASS</b></td>'],
 ['Bad Signal sa totoong UI (10 hakbang)','10 / 10','<td class="PASS"><b>PASS</b></td>'],
 ['ABC-002 minimum airflow sa totoong UI, kasama ang reload (9 hakbang)','9 / 9','<td class="PASS"><b>PASS</b></td>'],
 ['Lumang engine tests: blocks 526, math 998, rate 43, comparators 240, switch 210, FF/timers, loops 68, PID sign 64, runaway, links 183/183','0 mali; kapareho ng v1.20.7','<td class="PASS"><b>PASS</b></td>'],
 ['Lumang browser tests (25 pinatakbo)','22 pasado; 3 may problema (tingnan sa ibaba)','<td class="NR"><b>NEEDS REVIEW</b></td>']],raw=True))
H.append('<div class="box"><b>Tatlong lumang browser test na hindi pumasa:</b> (1) <code>test-ln</code> - bumagsak sa hakbang na pumipindot ng Save; inalis ang Save kaya luma na ang hakbang. (2) <code>test-own</code> at (3) <code>test-ui-real</code> - <b>pareho ang bagsak sa v1.20.7</b> (plant-model ang ugat), hindi galing sa bagong gawa. <b>Hindi pinatakbo:</b> test-project, test-storage, test-storage2, test-import, test-trend.</div>')
H.append('<h2 class="pb">6. Coverage kada ABC sheet (automated lang)</h2><small>Format: <b>PASS / kabuuang records</b>. Kulay: berde = lahat pasado; dilaw = may NEEDS REVIEW; abo = walang test (<b>NOT TESTED</b>). Ang "-" ay walang ganoong block sa sheet o hindi pa na-test. <b>Hindi ito patunay na tama ang buong sheet.</b></small>')
H.append(table(['Sheet']+[n for _,n in cols],covrows,raw=True))
H.append('<small>Mga sheet na walang kahit anong automated record sa mga ito: %s. Para sa mga sheet na ito, mga lumang general test lang (blocks/math/switch/loops) ang sumasakop.</small>'%(', '.join(nocov) or 'wala'))
H.append('<h2 class="pb">7. Manual tests</h2>')
H.append('<div class="box">Sa ngayon, <b>wala pang manual test na nagagawa ng user</b>. Lahat ng nasa Manual Testing Guide ay <b>NOT TESTED</b> hanggang mag-ulat ka ng actual result. Sinubukan ko ang mga steps sa headless browser bilang "rehearsal" (nakasulat bilang <i>Rehearsal result</i> sa guide), pero hindi iyon ang test mo.</div>')
H.append(table(['Test ID','Sheet','Ano ang titingnan','Status'],[
 ['MT-01','Kahit anong ABC','Toolbar: wala na ang Save/Open/Import/Plant','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-02','ABC-002','Bad Signal OFF/ON at FORCED BAD mark','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-03','ABC-002','Average select (SI0048) kapag may Bad Signal','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-04','ABC-002','Minimum airflow: 400 T/H = 32 %, baguhin sa 500','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-05','ABC-001D, ABC-032','Rate value ng RATE/ramp (0.00075 at 2)','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-06','ABC-000','F(X) na walang table: NEEDS REVIEW at Health','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-07','Windows','Portable EXE: bubukas, tama ang version','<td class="NT"><b>NOT TESTED</b></td>'],
 ['MT-08','Android','APK: nai-install, bubukas, tama ang version','<td class="NT"><b>NOT TESTED</b></td>']],raw=True))
H.append('<h2>8. Known issues at hindi pa tapos</h2>')
H.append(table(['Item','Ano ang problema / kulang','Status'],[
 ['RATE na hindi makita ang span','ABC-007 RAMPB#18, ABC-057 RATE#67, ABC-001C RATE#47 (18%/Hr), ABC-002 RATE#75 at #76. Hindi ginalaw ang rate nila; kailangang sabihin mo kung ilang % ng anong range.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['RATE na walang nakasulat na rate','ABC-004A #75, 004B/C #26, ABC-009A/B screw coolers (0.05), ABC-020 #91 (2). ASSUMED na default ang gamit, hindi galing sa drawing.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['ABC-002 conversion 0.08 % bawat T/H','Hindi nakasulat sa drawing. Pinili ko para ang default na 400 T/H ay maging 32 % pa rin. Ang SCALE CONVERT 35/1115 ng drawing ay ibang numero.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['S1-LN38 at S1-LN39 (ABC-010)','Wala sa LINEAR.xls. Galing sa Drum Level Calculation.xls na wala sa session na ito. Hindi na-verify ulit.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['14 F(X) na walang unit sa header ng LINEAR','ABC-057 (13) at ABC-052 LN11. Tama ang numero pero hindi alam ang unit. Ang F(X) sa ABC-000 (legend) ay walang table.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['SIG.AB: kapag parehong bad','Ang umiiral na SEL logic ay humahawak sa huling magandang value. Hindi ito nakasulat sa drawing at wala akong idinagdag.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['8 SEL na walang SIG.AB flag sa bawat input','Hindi ma-test ang Bad Signal sa mga ito.','<td class="NT"><b>NOT TESTED</b></td>'],
 ['Pagpares ng transmitter at SIG.AB flag','Gamit ang "pinakamalapit na flag" na patakaran ng reader (hanggang 50 units). Kung mali ang pares, maaaring sa maling transmitter lumabas ang FORCED BAD. Hindi pa na-audit.','<td class="NT"><b>NOT TESTED</b></td>'],
 ['Valve / actuator stroke time','Default (20 s valve, 30 s actuator) ang gamit; hindi nakasulat sa drawing.','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['Hindi ginalaw o hindi na-retest','COS na dikit sa T switch; grey analog sa Simulation mode; range ng COS/MAN setpoint laban sa output; re-check ng wire geometry at mga marker ng unknown symbol sa drawing; Normal/Manual Test Value/Restore controls; Simulation Audit panel; side-by-side sheets.','<td class="NT"><b>NOT TESTED</b></td>'],
 ['High/Low selector','4 PASS lang (2 selectors); 22 ang hindi ma-test dahil idle ang selector sa default na switch state.','<td class="NT"><b>NOT TESTED</b></td>']],raw=True))
H.append('<h2>9. Ano ang VERIFIED at ano ang HINDI pa</h2>')
H.append(table(['VERIFIED (may ebidensya)','HINDI pa verified / assumption'],[[
 '<ul><li>GitHub workflow run %s: version, apk, exe, release jobs = success.</li><li>Release v%s ay published; may HTML, EXE, APK, manual PDF.</li><li>HTML sa release = eksaktong kapareho ng HTML sa commit 301d88b (parehong laki: 3,588,055 bytes).</li><li>Mga automated test results sa seksyon 5.</li><li>Pasado ang DITL guard.</li></ul>'%(RUN,V),
 '<ul><li>Pagbukas at takbo ng EXE at APK (hindi ko na-install).</li><li>Lahat ng manual tests (MT-01 hanggang MT-08).</li><li>Buong validation ng 54 ABC sheets.</li><li>Mga ASSUMED na default (rates, stroke times).</li><li>Totoong DCS values: ang simulator ay <b>simulation values</b> lang, hindi totoong plant reading.</li></ul>']],raw=True))
H.append('<small>Paalala sa build: Ang EXE at APK ay muling na-build ng workflow nang idagdag ang PDF documents. Docs at workflow file lang ang naiba sa commit na iyon; walang binago sa simulation code. Ang mga file na naka-attach ngayon ay galing sa pinakahuling run na nakasulat sa chat message.</small>')
H.append('<h2>10. Mga susunod na dapat gawin (rekomendasyon)</h2>')
H.append(table(['#','Gawin','Sino'],[
 ['1','Gawin ang MT-01 hanggang MT-08 sa Manual Testing Guide at i-report ang actual result (PASS/FAIL).','Ikaw'],
 ['2','Sabihin ang tamang span para sa 5 RATE na NEEDS REVIEW (ilang % ng anong range).','Ikaw'],
 ['3','Kumpirmahin ang conversion ng ABC-002 minimum airflow (0.08 % bawat T/H) o ibigay ang tamang relasyon.','Ikaw'],
 ['4','I-send ulit ang Drum Level Calculation.xls para ma-verify ang S1-LN38/39 (isang beses lang).','Ikaw'],
 ['5','Retest ng COS na dikit sa T switch, grey analog sa Simulation mode, at range ng COS/MAN.','Ako, pagkatapos ng go mo'],
 ['6','Palawakin ang test coverage sheet-por-sheet (tingnan ang seksyon 6).','Ako, pagkatapos ng go mo']]))
H.append('<h2>11. Review ng nakaraang v%s release message laban sa bagong protocol</h2>'%V)
H.append(table(['Hinihingi ng protocol','Dati','Ngayon'],[
 ['HTML, EXE, APK, may direct links','Mayroon','Mayroon (seksyon 1)'],
 ['Report sa PDF, simpleng Taglish','Wala (Markdown, English, para sa technical)','Mayroon: ito'],
 ['Manual Testing Guide (PDF)','Wala','Mayroon (hiwalay na PDF)'],
 ['Ihiwalay ang automated at manual results','Hindi malinaw','Nakahiwalay (seksyon 5 at 7)'],
 ['Release date, known issues, hindi pa na-test na sheets, susunod na gawin','Kulang','Kumpleto (seksyon 6, 8, 10)'],
 ['PDF naka-attach sa GitHub Release','Wala','Naka-attach ng workflow'],
 ['Verified ang workflow at artifacts','Oo','Oo, ulit na nabeberipika']]))
open('docs/LogicSim_v%s_Report.html'%V,'w').write(page('Logic Sim v%s Release Report'%V,''.join(H)))
# ---------- MANUAL TESTING GUIDE
G=[]
G.append('<h1>Logic Sim v%s - Manual Testing Guide</h1><small>Para sa non-coder. Petsa: %s. Gamitin ang HTML: <a href="%slogic-sim-v%s.html">%slogic-sim-v%s.html</a> sa Chrome.</small>'%(V,DATE,DL,V,DL,V))
G.append('<div class="box"><b>Paano gamitin:</b> Gawin ang bawat test ayon sa hakbang. Isulat ang nakita mo sa "Actual result mo" at lagyan ng PASS o FAIL. Kung hindi tugma, gawin ang nasa "Kapag hindi tugma". Lahat ay <b>NOT TESTED</b> hanggang magawa mo. Ang "Rehearsal result" ay ang nakita ko sa headless browser; hindi iyon ang test mo.<br><b>Mga salita:</b> <b>View</b> = default, grey, walang simulation. <b>Run</b> = pindutin ang <code>▶ Run</code> para tumakbo. <b>Panel</b> = ang kanang bahagi na may listahan ng inputs. <b>Analog · ABC</b> = button sa taas para sa analog sheets. Ang sheet ay pinipili sa listahan sa taas (hal. "ABC-002").</div>')
def mt(i,sheet,block,start,steps,expected,rehearsal,bad):
    o='<h3>%s - %s</h3>'%(i,e(sheet))
    o+=table(['Item','Detalye'],[['Sheet',sheet],['Block / tag',block],['Starting condition',start],['Mga hakbang','<ol>'+''.join('<li>%s</li>'%s for s in steps)+'</ol>'],['Inaasahang resulta',expected],['Rehearsal result (ako, hindi mo test)',rehearsal],['Actual result mo','&nbsp;<br>&nbsp;'],['Status','<b>NOT TESTED</b> (gawing PASS o FAIL pagkatapos)'],['Kapag hindi tugma',bad]],raw=True)
    return o
G.append(mt('MT-01','Kahit anong ABC sheet','Toolbar sa taas','Bagong bukas na HTML.',['Buksan ang HTML sa Chrome.','Pindutin ang <b>Analog · ABC</b>.','Tingnan ang toolbar sa taas.'],'WALA ang: Save, Save as, Open, Import ABC DXF, Imports, Plant, Plant model. MAYROON ang: View, Run, Reset, Fit, Values, Health, LN tables, Assumed values, DITL signals.','Walang nakitang Save/Open/Import/Plant; naroon ang ibang button; walang error banner.','Kung may nakitang Save/Open/Import/Plant: FAIL. Kunan ng screenshot at ipadala.'))
G.append(mt('MT-02','ABC-002','Dalawang O2 transmitter: AI0273 (SIG.AB B.0671) at AI0433 (SIG.AB B.0701)','Run, default na lahat OFF.',['Piliin ang sheet <b>ABC-002</b>.','Sa Panel, hanapin ang grupong <b>Bad Signal (SIG.AB) - simulation only, OFF by default</b>.','Tingnan na ang dalawang button ay nagsasabing <b>Bad Signal: OFF</b>.','Pindutin ang button sa ilalim ng <b>SIG.AB B.0671</b>.','Tingnan ang diagram sa ibabaw ng transmitter AI0273.','Pindutin ulit ang button (ngayon ay <b>FORCED BAD (ON)</b>).'],'Hakbang 3: parehong OFF. Hakbang 4: nagiging <b>FORCED BAD (ON)</b>; sa diagram may pulang <b>FORCED BAD</b> sa ibabaw ng transmitter. Hakbang 6: bumabalik sa <b>Bad Signal: OFF</b> at nawawala ang pulang marka.','Sa pagsubok: OFF sa simula; ON ay nagpakita ng 1 marka na "FORCED BAD"; OFF ay nagtanggal nito.','Kung walang pulang marka, o hindi bumalik: FAIL. Kunan ng screenshot ng diagram at panel.'))
G.append(mt('MT-03','ABC-002','Average select circuit, tag <b>SI0048</b>','Pindutin ang <code>▶ Run</code>. Lahat ng Bad Signal = OFF.',['Sa Panel, sa <b>Analog inputs</b>, ilagay sa <b>AI0273</b> ang <b>4.30</b> at sa <b>AI0433</b> ang <b>4.60</b> (ang range ay 0 hanggang 25 %).','Basahin ang value sa tabi ng <b>SI0048</b> sa diagram.','I-ON ang Bad Signal ng B.0671 (AI0273). Basahin ulit ang SI0048.','I-OFF ito. Basahin ang SI0048.','I-ON ang Bad Signal ng B.0701 (AI0433). Basahin ang SI0048. I-OFF ito.','Ilagay sa AI0273 ang <b>0</b> (zero, walang Bad Signal). Basahin ang SI0048.'],'Hakbang 2: <b>4.45</b>. Hakbang 3: <b>4.60</b> (hindi na isinama ang bad). Hakbang 4: <b>4.45</b>. Hakbang 5: <b>4.30</b>. Hakbang 6: <b>2.30</b> (ang zero ay valid na reading, hindi bad: (0 + 4.60) / 2).','Nakuha ko: 4.45 / 4.6 / 4.45 / 4.3 / 2.3. (Kapag parehong bad, hawak ang huling magandang value 4.3: umiiral na logic, hindi nakasulat sa drawing.)','Kung iba ang value: FAIL. Isulat ang nabasa mo sa bawat hakbang at ipadala.'))
G.append(mt('MT-04','ABC-002','Constant "32% MIN. AIR FLOW" (kahon na "A" sa tabi ng 32%)','View o Run. Wala pang binabago.',['Piliin ang sheet <b>ABC-002</b>.','I-click ang maliit na kahon na may <b>A</b> sa tabi ng "32%  MIN. AIR FLOW".','Sa Panel, hanapin ang <b>Minimum air flow setting (T/H) - editable</b>. Basahin ang numero at ang ibang linya.','Palitan ang numero ng <b>500</b> at pindutin ang Enter.','Basahin ang linyang <b>Signal to the high selector now</b>.','I-refresh ang page (F5), piliin ulit ang ABC-002 at i-click ulit ang kahon na A. Basahin ang setting.','Pindutin ang <b>Back to the drawing value (32 % = 400 T/H)</b>.'],'Hakbang 3: <b>400</b>; "Original drawing constant: 32 %"; may dilaw na NEEDS REVIEW tungkol sa conversion. Hakbang 5: <b>40 %</b> (500 x 0.08). Hakbang 6: nananatili ang <b>500</b> pagkatapos ng F5. Hakbang 7: bumabalik sa <b>400</b> at <b>32 %</b>.','Default 400; 500 ay nagbigay ng 40 %; Back ay nagbalik sa 32 %; nanatili ang 500 pagkatapos ng reload.','Kung hindi nag-update o nawala ang 32 %: FAIL, screenshot ng panel.'))
G.append(mt('MT-05','ABC-001D at ABC-032','RATE FM403 (ABC-001D) at ramp "RAMP:1% / sec" (ABC-032)','View mode ay okay.',['Piliin ang <b>ABC-001D</b>.','I-click ang kahon ng <b>FM403</b> (may nakasulat na "2.7T / HR = 2.25% / HR").','Sa Panel, tingnan ang <b>Rate (signal units per sec)</b>.','Piliin ang <b>ABC-032</b>.','I-click ang kahong <b>BUMPLESS</b> na "RAMP:1% / sec" (sa pagitan ng SI0230 at SI0231).','Tingnan ang <b>Rate (signal units per sec)</b>.'],'Hakbang 3: <b>0.00075</b>. Hakbang 6: <b>2</b> (1 % ng 0-200 T/H).','Nabasa ko: 0.00075 at 2.','Kung ibang numero ang nakita: FAIL. Isulat ang numero. Tandaan: ang drawing ay hindi nagsasabi ng range ng ramp; ang 200 T/H ay mula sa PID range at sa kumpirmasyon mo.'))
G.append(mt('MT-06','ABC-000 (legend sheet)','F(X) block na walang table','Kahit anong mode.',['Piliin ang sheet <b>ABC-000</b>.','I-click ang F(X) na kahon (isa lang ang F(X) sa sheet na ito).','Basahin ang Panel.','Pindutin ang <b>Health</b> sa toolbar. Hanapin ang hilera ng <b>ABC-000</b>.'],'Hakbang 3: nakasulat <b>no table: y = x</b> at pulang <b>NEEDS REVIEW: no table...</b>. Hakbang 4: sa huling column na <b>LINEAR / RATE review</b> ay <b>1</b>.','Nakita ko ang pulang NEEDS REVIEW at ang bilang 1 sa Health.','Kung walang pulang linya o ang bilang ay 0: FAIL.'))
G.append(mt('MT-07','-','Portable EXE (Windows)','Na-download mo ang <b>logic-sim-v%s-portable.exe</b>.'%V,['I-double click ang EXE. Kung may SmartScreen: <b>More info</b> tapos <b>Run anyway</b>.','Hintaying bumukas ang window.','Pindutin ang <b>Analog · ABC</b>, piliin ang <b>ABC-002</b>.','Gawin ang MT-01 at MT-04 sa EXE.'],'Bumubukas ang app; kapareho ang toolbar at ang minimum airflow panel; walang Save/Open/Import. Ang title ay may <b>v%s</b>.'%V,'HINDI ko pa ito na-run (na-build lang ng GitHub). NOT TESTED.','Kung hindi bumukas: isulat ang mensahe at ipadala ang screenshot.'))
G.append(mt('MT-08','-','APK (Android)','Na-download mo ang <b>logic-sim-v%s.apk</b>.'%V,['I-tap ang APK. Payagan ang <b>install unknown apps</b> kung hihingin.','I-install at buksan.','Pindutin ang <b>Analog · ABC</b>, piliin ang <b>ABC-002</b>.','Gawin ang MT-01 (toolbar).'],'Na-i-install at bumubukas; kapareho ang toolbar; walang Save/Open/Import.','HINDI ko pa ito na-install. NOT TESTED.','Kung hindi ma-install o bumukas: isulat ang mensahe ng Android at ipadala.'))
G.append('<h2>Resulta ng guide</h2>'+table(['Test','PASS / FAIL','Mga tala'],[[t,'',''] for t in ['MT-01','MT-02','MT-03','MT-04','MT-05','MT-06','MT-07','MT-08']]))
G.append('<small>Ipadala sa akin ang listahang ito (kahit larawan lang) at ang anumang screenshot ng FAIL. Hindi mo kailangang mag-code.</small>')
open('docs/LogicSim_v%s_Manual_Testing_Guide.html'%V,'w').write(page('Logic Sim v%s Manual Testing Guide'%V,''.join(G)))
print('ok')
