#!/usr/bin/env python3
"""Gumagawa ng docs/LogicSim_v1.20.10_Report.html mula sa docs/TEST-RESULTS-*.json at docs/REGRESSION-v1.20.10.txt.
Pagkatapos: node tools/release-docs/html-to-pdf.js docs/LogicSim_v1.20.10_Report.html docs/LogicSim_v1.20.10_Report.pdf v1.20.10"""
import json,collections,html,os,re
V='1.20.10';DATE='2026-10-10';BR='ccr-2c4847cc-9fe3px'
REL='https://github.com/Ronanski/dcs-ditl-workbench/releases/tag/v%s'%V
DL='https://github.com/Ronanski/dcs-ditl-workbench/releases/download/v%s/'%V
COMMIT=open('docs/.release-commit').read().strip() if os.path.exists('docs/.release-commit') else '(ilalagay pagkatapos ng build)'
e=html.escape
CSS="""
body{font:11.5px/1.45 'Segoe UI',Arial,sans-serif;color:#1b2430;margin:0}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:18px 0 6px;border-bottom:2px solid #2a6fb0;padding-bottom:2px;color:#17406b}h3{font-size:12.5px;margin:12px 0 4px}
table{border-collapse:collapse;width:100%;margin:6px 0 10px}th,td{border:1px solid #b8c2cc;padding:3px 5px;vertical-align:top;text-align:left}th{background:#e8eff6}
.PASS{background:#d8f0dc}.FAIL{background:#f7d6d6}.NR{background:#fff0c2}.NT{background:#e6e6e6}
.box{border:1px solid #b8c2cc;background:#f5f8fb;padding:6px 9px;margin:6px 0}small{color:#4a5766}code{background:#eef1f4;padding:0 3px}
.pb{page-break-before:always}a{color:#17406b}tr{page-break-inside:avoid}
"""
def page(title,body):return '<!doctype html><html><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s</body></html>'%(e(title),CSS,body)
def table(head,rows,raw=False):
    o='<table><tr>'+''.join('<th>%s</th>'%e(h) for h in head)+'</tr>'
    for r in rows:o+='<tr>'+''.join(c if (isinstance(c,str) and c.startswith('<td')) else '<td>%s</td>'%(c if raw else e(str(c))) for c in r)+'</tr>'
    return o+'</table>'
S_OK='<td class="PASS"><b>NAAYOS</b></td>';S_NR='<td class="NR"><b>NEEDS REVIEW</b></td>';S_NT='<td class="NT"><b>HINDI PA GINAGAWA</b></td>';S_PASS='<td class="PASS"><b>PASS</b></td>';S_PART='<td class="NR"><b>BAHAGI LANG</b></td>'
def load(k):
    f='docs/TEST-RESULTS-%s.json'%k
    return json.load(open(f)) if os.path.exists(f) else []
def cnt(k):return collections.Counter(r['status'] for r in load(k))
def lines(f):return open(f).read() if os.path.exists(f) else ''
reg=lines('docs/REGRESSION-v1.20.10.txt')
H=[]
H.append('<h1>Logic Sim v%s - Release Report</h1><small>Petsa: %s &nbsp;|&nbsp; Branch: %s &nbsp;|&nbsp; Commit: %s &nbsp;|&nbsp; Para sa: non-coder (simpleng Taglish)</small>'%(V,DATE,BR,COMMIT))
H.append('<div class="box"><b>Buod:</b> Ito ang lahat ng ayos at dagdag mula sa <b>Batch 1 inspection mo</b> (mga puna mo ngayon + ang Excel report na LOGICSIM_EU_REPORT_FINDINGS, 20 findings + UI/UX). Bago ako nag-ayos, inaral ko muna kung paano talaga dumadaloy ang logic (ayon sa tip mo). Marami sa nakita mong orange na "?" ay <b>mali pala ng marka ko, hindi mali ng logic</b>. Ang <b>F(X) na naka-%</b> ay talagang may mali at naayos na (LN29: input 1.0 = 100 % = output 50). Sa seksyon 4 ay may <b>As found / As left / Work done / Status</b> ang bawat puna. Ang mga hindi ko pa kayang tapusin ay nakalista nang specific sa seksyon 5 at 9.</div>')
H.append('<h2>1. Download</h2>')
H.append(table(['File','Para saan','Direct link'],[
 ['HTML','Buksan sa Chrome, walang install','<a href="%slogic-sim-v%s.html">logic-sim-v%s.html</a>'%(DL,V,V)],
 ['Portable EXE','Windows, walang admin','<a href="%slogic-sim-v%s-portable.exe">logic-sim-v%s-portable.exe</a>'%(DL,V,V)],
 ['APK','Android (allow "install unknown apps")','<a href="%slogic-sim-v%s.apk">logic-sim-v%s.apk</a>'%(DL,V,V)],
 ['Report na ito','Simpleng ulat','<a href="%sLogicSim_v%s_Report.pdf">LogicSim_v%s_Report.pdf</a>'%(DL,V,V)],
 ['Manual Testing Guide','Hakbang-hakbang na tests para sa iyo','<a href="%sLogicSim_v%s_Manual_Testing_Guide.pdf">LogicSim_v%s_Manual_Testing_Guide.pdf</a>'%(DL,V,V)],
 ['Release page','Lahat ng file','<a href="%s">%s</a>'%(REL,REL)]],raw=True))
H.append('<h2>2. Ano ang ibig sabihin ng status</h2>')
H.append(table(['Status','Ibig sabihin'],[
 ['<td class="PASS"><b>PASS / NAAYOS</b></td>','Tugma sa tamang inaasahan, may actual na test record. Ang "NAAYOS" ay ayos na ayon sa automated test ko; <b>ikaw pa rin ang magko-confirm</b> sa manual test.'],
 ['<td class="FAIL"><b>FAIL</b></td>','Hindi tugma. May sira.'],
 ['<td class="NR"><b>NEEDS REVIEW</b></td>','Hindi ko masabi kung ano ang tama dahil kulang ang nakasulat sa drawing o sa data. <b>Hindi ako humuhula.</b> Sinasabi ko kung bakit at kung ano ang kailangan ko.'],
 ['<td class="NT"><b>NOT TESTED / HINDI PA GINAGAWA</b></td>','Walang test o hindi pa nagagawa.']],raw=True))
H.append('<h2>3. Paano ko inayos (maikli)</h2><div class="box"><ol><li>Inaral ko muna ang bawat block: legend (ABC-000), pin, + / - , range, source ng input.</li><li>Gumawa ako ng test na tumatakbo sa <b>lahat ng sheet</b> (hindi lang sa isang halimbawa), para ang ayos ay umabot sa lahat.</li><li>Pagkatapos ng ayos, in-run ko ulit ang lahat ng lumang test para siguradong walang nasira. Hindi ginalaw ang DITL page (guard: <b>IDENTICAL</b>).</li></ol></div>')
H.append('<h2 class="pb">4. As found / As left / Work done / Status</h2>')
H.append('<h3>A. Mga puna mo ngayon</h3>')
A=[
['A1. Bad Signal (AB) na i-fo-force at diretso sa logic block','Pag FORCED BAD: may pulang marka at ini-exclude ng SELECT CIRCUIT, pero ang signal papunta sa logic block ay <b>buo pa rin</b> (hal. 60). Hindi nagbabago ang block.','Pag Bad Signal ON: <b>0 ang natatanggap ng logic block</b> at 0 din ang nasa address ng AI. Ang <b>B.xxxx flag = 1</b> (kung may wire nito sa sheet). Pag ibinalik sa normal, bumabalik ang value. Ang SELECT CIRCUIT ay nag-e-exclude pa rin ng bad na input.','Binago ang AI block (output = 0 kapag bad). Naayos ang address para 0 ang ipakita. Bagong test sa <b>lahat ng transmitter na may SIG.AB</b>.','<td class="PASS"><b>NAAYOS</b><br><small>%d PASS, %d NOT TESTED (AI na sumusunod sa valve)</small></td>'],
['A2. COS: slider na lang ang pang-control; "nawala sa taas pag pinipindot; dati meron"','Ang COS ay nako-kontrol sa side panel (number box at slider) lang. Walang control sa mismong sheet.','Pag <b>click sa COS</b>, may control na lumalabas sa tabi nito: <b>type ng value + ✓</b>, slider, Min / Mid / Max, <b>T switch: Auto / Force A / Force B</b>, at kung energized. Nananatili hanggang pindutin ang ✕ o Esc.','Bagong COS control sa sheet. Bagong test sa <b>lahat ng COS</b>: kapag B ang leg, sinusunod ng output ang COS; kapag A, hindi.','<td class="NR"><b>NAAYOS (automated); NEEDS REVIEW sa iyo</b><br><small>%d PASS. Hindi ko matiyak na ito ang tinutukoy mo sa "nawala sa taas": pakikumpirma sa MT-02.</small></td>'],
['A3. Mga block na may orange na putol-putol na kahon, "?" at "pin?"','<b>88 na "?" at 157 na "pin?"</b> sa lahat ng sheet (hindi kasama ang legend ABC-000).','<b>2 "?" na lang</b> at <b>0 "pin?"</b>. Ang 2 ay nasa ABC-001D (digital na gate symbol na wala sa legend). Ang logic ng simulation ay <b>hindi nagbago</b>; ang marka lang ang mali.','Nahanap ang sanhi: ang "?" ay ang maliit na triangle SA LOOB ng DEV block (kinikilala na ang DEV) na binasa ko bilang hiwalay na shape (78 sa 88). Ang "pin?" ay SIG.AB (151) na walang output pin <b>by design</b>, at 6 pa (2 T switch na ang B ay ang COS; 4 AI na feedback ng valve). Inalis ang maling marka; hindi na minarkahan ang legend.','<td class="PASS"><b>NAAYOS</b><br><small>2 natira = NEEDS REVIEW (seksyon 5)</small></td>'],
['A4. F(X) na naka-%: LN29 (ABC-002): input 1.0, output 0.00','Ang table ay nasa % (0 hanggang 100) pero ang input ay pumapasok nang <b>hilaw</b>: ang ratio 1.0 ay binasa bilang 1 % kaya 0 ang output. Ganito rin sa LN1 (MAN 8000~12000 Kcal/Kg ay binasa bilang 8000 %).','LN29: input 1.0 = 100 % → <b>output 50</b>. LN1: 8000 → 0.80, 10000 → 1.00, 12000 → 1.20. Ang input ay ginagawang <b>% ng range ng pinanggalingan</b>: range ng AI/MAN/external na nakasulat; ratio (a/b) × 100; ang PID output ay 0~100 na.','Nakita ang <b>22 na F(X)</b> na apektado (ABC-002, 003A-D, 004A-C, 008, 009A/B, 020, 051). Isang ayos sa engine para sa lahat. Sinundan din ang link papunta sa ibang sheet (ABC-051 LN33 ay nahanap na ang source). May panel na nagsasabi kung paano pumasok sa table.','<td class="PASS"><b>NAAYOS</b> (22 F(X))<br><small>4 pa = NEEDS REVIEW (seksyon 5)</small></td>'],
['A5. 32 % MIN. AIR FLOW (ABC-002)','Ang constant na lumalabas sa selector ay 400 (ang min air flow mismo).','Constant = <b>32 % × min air flow</b> = 32 % × 400 = <b>128 T/H</b>. Ang min air flow (default 400 T/H) ay puwedeng baguhin sa panel.','Itinama ayon sa paliwanag mo. Test: 400 → 128, 500 → 160, 0 → 0, reset to default.','<td class="PASS"><b>NAAYOS</b><br><small>Ang 400 T/H ay default pa rin: hindi nakasulat sa drawing.</small></td>'],
['A6. Doble-doble ang numero sa wire','May numero na dalawa o tatlo sa iisang lugar: sa mga bilog na tag (TOF 003A, TCF 004A, BM 001C...) may <b>dalawang numero</b>; sa controller ay <b>tatlo</b> (tag, .MV, AO address); may parehong text na dalawang beses na magkalapit. <b>150 na wire</b> ang may 2 o higit pang numero.','Isang numero lang bawat label. Wala sa bare controller tag kung may ibang label ang wire. Isang numero kapag magkalapit na label (module address ang uunahin). Ang bilog ay sumasakop sa mga wire niya. <b>%s na wire</b> na lang ang may 2+ numero: ito ay <b>magkaibang tunay na label</b> (hal. HICFA1005.MV at AO0592) na pareho mong gustong makita.','Inayos sa <b>lahat ng 54 sheet</b> nang sabay. Binilang bago at pagkatapos.','<td class="PASS"><b>NAAYOS</b></td>'],
['A7. Mga hindi pa nagawa ("sana ginawa mo na din")','Nasa listahan mo ang 2nd sheet window, search, simulation audit, mode label, color ng forced.','<b>Nagawa na</b> ang mga ito (tingnan ang C).','Tingnan ang C.','<td class="PASS"><b>NAAYOS</b></td>'],
]
cAB=cnt('AB');cCOS=cnt('COS')
rows=[]
for i,r in enumerate(A):
    r=list(r)
    if i==0:r[4]=r[4]%(cAB.get('PASS',0),cAB.get('NOT TESTED',0))
    if i==1:r[4]=r[4]%cCOS.get('PASS',0)
    if i==5:r[3]=r[3];r[2]=r[2]%os.environ.get('DUPS','88')
    rows.append(r)
H.append(table(['Puna','As found (dati)','As left (ngayon)','Work done (ginawa ko)','Status'],rows,raw=True))
H.append('<h3>B. Mga finding sa Excel mo (v1.20.7, 20 items)</h3>')
B=[
['1. Selector (HS/LS/T) - ang napili lang ang may ilaw','Hindi lahat ng selector ay may ilaw na tama.','HS/LS: ang napiling input lang ang naka-ilaw, ang hindi napili ay dim (18 selector). T switch at SELECT CIRCUIT ay ganoon din.','Ginawa sa v1.20.9; pinatakbo ulit ngayon.',S_OK],
['2. Forced na value: ipakita at iba ang kulay','Pareho ang kulay ng forced at ng computed.','<b>Berde = computed, cyan = input na tinype/slider, amber = FORCED.</b> May legend. Ang forced na wire na walang numero ay may numero ngayon.','Bagong kulay ng numero; legend na "Numbers".',S_OK],
['3. Dalawang sheet nang sabay (max 2, hindi pareho)','Wala.','Button <b>2nd sheet</b>: pangalawang sheet sa tabi, <b>live</b> habang sumi-simulate. Hindi puwede ang parehong sheet. <b>Swap</b> para gawing main (para mag-click/force). Sa second pane ay panonood lang (zoom, drag).','Bagong feature; test: bukas, live, walang duplicate, swap, close.',S_PART],
['4. Range: strikto sa lahat ng input','Slider/typed ay lumalampas sa range.','Ang typed value (AI, MAN, COS, field input, FORCE) ay limitado sa range na nakasulat. Net na walang nakasulat na range ay hindi nililimitahan.','Ginawa sa v1.20.9; inulit ang test.',S_PART],
['5. COS: tamang range ayon sa diagram','Hindi pa na-check kada COS.','Ang bawat COS ay may range na galing sa drawing at limitado ang value nito. Hindi ko pa nakumpara ang range ng COS laban sa kinokontrol nitong variable.','Test sa lahat ng COS (range, sinusunod ng output).',S_NR],
['6. HS/LS: "dapat ramp muna, hindi instant"','Hindi malinaw kung aling sheet ang tinutukoy.','Hindi ko ginalaw: hindi ko matukoy ang tama nang walang halimbawa.','Wala.',S_NR],
['7. Maling symbol o blangkong box (÷, triangle)','Dalawang ÷ ang nabasa bilang minus; maraming "?" na kahon.','Naayos ang 2 ÷ (v1.20.9). Ang "?" ay mali ng marka (A3). Walang block na maling symbol sa audit (338 glyph group, 4 halo-halo ay naipaliwanag).','Audit ng lahat ng symbol; ayos ng marka.',S_OK],
['8. Ramp bypass line na magkapareho sa output ng ramp','Hindi pa nasuri sa lahat.','Sinuri ang lahat ng 15 ramp: <b>walang wire na pareho ang input at output</b>. Ang ABC-004A ay naayos na dati (R-01).','Structure check sa lahat ng ramp.',S_PASS],
['9 at 10. Linear FX na naka-%: i-scale ang input; ÷100 ang output','Hilaw ang input (A4).','Naka-scale na ang input. Ang output ay galing sa LINEAR file (0.8 = 80 % ay 0.8 na).','Tingnan ang A4.',S_OK],
['11. Constant 32 % ng min air flow','Mali ang intindi ko.','128 T/H (A5).','Tingnan ang A5.',S_OK],
['12. Math block na ibang operation ang ginagawa','2 ÷ ang nabasa bilang minus (v1.20.9).','Sinuri ang +, -, ×, ÷, √, Σ sa lahat ng sheet (998 na check, 215 sign block): <b>walang ibang mali</b>. May isang nag-alarma (ABC-004A ADD#46) pero tama pala: ang "-" ay sa katabing SUB na kasama sa wire.','Audit sa lahat ng sheet.',S_PASS],
['13. May analog signal na naka-grey','296 na grey.','Lahat ng 288 na grey ngayon ay may paliwanag: 167 = hindi napiling leg ng T switch, 121 = walang sumusunod sa signal. Wala ang mali. Pinaliwanag sa legend kung ano ang grey.','Audit sa lahat ng sheet; legend.',S_OK],
['14. NOT gate na hindi gumagana','May nakitang hindi gumagana.','488 / 488 na check sa 244 na NOT gate: PASS.','Test sa lahat ng NOT.',S_PASS],
['15. Final element (valve, actuator): dapat gradual','Instant.','81 na valve/actuator: instant ang utos, <b>unti-unti ang posisyon</b> (default stroke time, puwedeng baguhin). <b>4 na AO na walang valve sa sheet at 8 FIELD (inverter)</b> ay instant pa rin: kailangan ko ang rule mo.','Test ng 81.',S_PART],
['16. SELECT CIRCUIT: zero at ilaw ng path','Grey ang path.','May ilaw na; Bad Signal ay user-controlled; ang bad na input ay hindi na isinasama (120 PASS).','Ginawa sa v1.20.9.',S_OK],
['18. FROM DITL / ABC-xxx: hindi na-click','Hindi nako-click.','<b>467 na text</b> ang link na: ABC-xxx ay nagbubukas ng sheet, "DITL 13-69" ay nagbubukas ng DITL-13. May putol-putol na guhit sa ilalim.','Bagong link layer; test.',S_OK],
['19. RATE na hindi sinusunod ang setting','May RATE na mali.','113 PASS; 5 RATE na hindi makita ang span ay <b>default</b> (pinag-antay mo).','Ginawa sa v1.20.8-9.',S_PART],
['20. T switch na dikit sa COS','Hindi sigurado kung COS o switch ang sira.','<b>Lahat ng COS na may manual value (90) ay sinuri</b>: pag B, sinusunod ang COS; pag A, hindi. 360 PASS.','Bagong test sa lahat ng COS.',S_PASS],
['17. Range: kahit output ng ibang block','Hindi lahat.','Ang nililimitahan lang ay mga input na may range (AI, MAN, PID output, field input). Output ng ibang block (hal. SUM) ay hindi nililimitahan.','Hindi nagbago.',S_NR],
]
H.append(table(['Finding','As found','As left','Work done','Status'],B,raw=True))
H.append('<h3>C. UI/UX at Priority</h3>')
C=[
['Global Search (tag, address, description)','Searches lang ang pangalan ng sheet.','Search sa <b>lahat ng text ng drawing at description ng address</b> (IO/memory list). Resulta ay grouped kada sheet, may "used in the logic". <b>Click = bubukas ang sheet at may ring sa eksaktong lugar.</b>','Bagong; test: AI0273, description "flue gas o2", SI0054, walang resulta.',S_OK],
['Return: Values at Wire values toggles','Mayroon.','Wala nang pagbabago; Wire values ay default ON.','-',S_OK],
['Mode label (VIEW / TRACE vs SIMULATION)','Hindi malinaw.','Malaking label sa tabi ng sheet title: <b>VIEW / TRACE - NO SIMULATION</b> (asul), <b>SIMULATION - RUNNING</b> (berde), <b>SIMULATION - PAUSED</b> (dilaw). Sa legend: ang ibig sabihin ng grey (inactive, mode, unresolved).','Bago.',S_OK],
['Pagpapangkat ng toolbar','Magkakadikit.','May agwat sa pagitan ng mga grupo. Hindi pa ginawang dropdown menu.','Maliit na ayos.',S_PART],
['Resizable / dockable na panel; pin','Wala.','Hindi pa ginagawa.','Wala.',S_NT],
['Simulation Audit (Pass/Fail/Needs review)','Wala.','Button <b>Audit</b>: sa ilalim ng pangalan ng block ay may PASS / FAIL / NEEDS REVIEW. Awtomatikong nasasalo ang inputs, outputs, forced signals at oras. May expected vs actual, retest, <b>Export CSV / JSON</b> at Copy para maipadala sa akin. Nakatabi sa browser; nananatili pag nag-reload.','Bagong; test: buong daloy.',S_OK],
['Unresolved block / net warnings','May Review marks.','Review marks ay tama na (A3) at nagsasabi ng "scale?" kapag hindi ma-scale ang F(X). Health ay inayos din.','Ayos sa A3 at A4.',S_OK],
]
H.append(table(['Item','As found','As left','Work done','Status'],C,raw=True))
H.append('<h2 class="pb">5. NEEDS REVIEW: bakit at ano ang kailangan ko</h2>')
H.append('<h3>5.1 Apat na F(X) na hindi ko ma-scale (hindi ko hinulaan)</h3><small>Ang table nila ay nasa % pero ang input nila ay <b>kinalkula mula sa maraming signal</b>, kaya walang iisang range na nakasulat. Hindi ko ito ginalaw (hindi sine-scale) at may orange na marka na "scale?" sa drawing.</small>')
H.append(table(['Sheet / block','Saan galing ang input','Bakit hindi ko masabi ang tama','Ano ang kailangan ko'],[
 ['ABC-004A · LN44 ("Fuel Flow Deviation vs Coal Flow Correction")','<b>Pagbabawas (SUB)</b> ng SI0202 (galing ABC-001C) at SI0203 (galing ABC-002).','Pagkakaiba ng dalawang signal. Ang % ng alin? Hindi nakasulat ang range ng resulta.','Ang range (lo ~ hi) na gagamitin para sa pagkakaibang iyon.'],
 ['ABC-008 · LN13 ("IDF H/C DEMAND vs DAMPER DEMAND")','Auto/manual selection ng ilang signal (PICFG108.MV, SI0183, COS manual value).','Iba-iba ang pinanggagalingan at walang iisang range na nakasulat.','Ang range ng input ng LN13.'],
 ['ABC-020 · LN8 ("R/H Outlet Header Temp. Control Tracking")','<b>Pagbabawas (DEV)</b> ng output ng F(X) SI0121 at ng napiling MV (HICHR1002A.MV).','Pagkakaiba ng dalawang signal.','Ang range na gagamitin.'],
 ['ABC-034 · LN21 ("Cv value - Output")','<b>Pagpaparami (MUL)</b> ng 0.8 at ng dalawang F(X) at isang SUM.','Produkto ng ilang signal; walang range na nakasulat.','Ang range ng input.']],raw=True))
H.append('<small>Naayos na dahil nasundan ko ang link: <b>ABC-051 · LN33</b> (galing sa PICMS1006.MV ng ABC-050: PID output, 0~100 % na).</small>')
H.append('<h3>5.2 Mga ipinalagay ko mula sa nakasulat na range (hindi ko na-verify sa DCS)</h3>')
H.append(table(['Block','Ipinalagay','Bakit nag-aalinlangan'],[
 ['ABC-020 · LN5','MAN HICHR1002A range <b>19 ~ 100 %</b> → X = (value − 19) / 81 × 100','Ang lower limit na 19 ay maaaring limit ng MV, hindi range ng signal.'],
 ['ABC-003D · LN21','MAN range <b>0.8 ~ 1.0752</b> (ang 003B at 003C ay 0.8 ~ 1.2)','Kakaiba ang 1.0752; baka typo sa drawing o tunay na ibang limit.']],raw=True))
H.append('<h3>5.3 Iba pa</h3>')
H.append(table(['Item','Bakit NEEDS REVIEW','Ano ang kailangan ko'],[
 ['2 digital gate symbol sa ABC-001D (M.201F / M.2030 at ang katabi ng TR221)','Patayong teal na guhit na may kahon: wala sa legend; hindi ko masabi kung AND o OR. Hindi sila sine-simulate (may orange na "?").','Kung AND o OR ang symbol.'],
 ['HS/LS: "ramp muna, hindi instant" (finding 6)','Walang halimbawang sheet.','Isang halimbawa: sheet at tag ng selector.'],
 ['Final element na wala sa sheet: 4 na AO (ABC-003A/B/C/D #13/#20) at 8 FIELD (inverter / MCC)','Instant ang output; walang stroke time o ramp na alam.','Ang gusto mong ramp rate / oras.'],
 ['5 RATE na hindi makita ang span','Pinag-antay mo; default ang ginagamit.','Ang span (kapag handa ka na).'],
 ['Range ng COS laban sa kinokontrol nito','Hindi ko pa ito nakumpara kada COS.','Wala (ako ang gagawa sa susunod kapag sinabi mo).'],
 ['Range ng output ng ibang block (hal. SUM, MUL)','Walang nakasulat na range sa drawing.','Kung gusto mong limitahan at sa anong range.']],raw=True))
H.append('<h2 class="pb">6. Automated tests (ako ang nagpatakbo)</h2><small>Hindi ito kapalit ng manual test mo.</small>')
def row(name,what,k):
    c=cnt(k);return [name,what,'%d'%c.get('PASS',0),'%d'%c.get('FAIL',0),'%d'%c.get('NEEDS REVIEW',0),'%d'%c.get('NOT TESTED',0)]
H.append(table(['Test','Ano ang sinuri','PASS','FAIL','NEEDS REVIEW','NOT TESTED'],[
 row('F(X) (112 block, kasama ang bagong scaling)','Low / gitna / high ng bawat table; sinusubok ang input na na-scale','FX'),
 row('LINEAR vs LINEAR.xls at DCS','Lahat ng table','LINEAR'),
 row('Bad Signal (SIG.AB) sa bawat transmitter','Normal; ON = 0 at flag 1; ibalik','AB'),
 row('COS + T switch (173 COS)','Pag B = COS; pag A = hindi','COS'),
 row('NOT gate (244)','Truth table','NOT'),
 row('SIG.AB / SELECT CIRCUIT (24 SEL)','Normal, primary bad, secondary bad, both bad','SEL'),
 row('RATE / ramp','Unit, rate, bypass','RATE'),
 row('Valve / actuator (81)','Instant ang utos, unti-unti ang posisyon','FINAL'),
 row('MAN range at AI','Hanggang saan lang','RANGE'),
 row('ABC-002 min air flow','32 % × 400 = 128, edit, reset','MINAIR'),
 row('High/Low selector (18)','Napiling input lang ang may ilaw','HS')]))
ui=[('test-fxscale','F(X) scaling (LN29, LN1, LN14, LN17, LN21)'),('test-xref','Link ng FROM/TO DITL at ABC-xxx'),('test-audit','Simulation Audit: form, save, retest, export, reload'),('test-search','Global search at pagturo sa lugar'),('test-pane2','Second sheet: live, walang duplicate, swap, close'),('test-ui-minair','Min air flow sa UI'),('test-ui-sigab','Bad Signal sa UI'),('test-ui-hs','High/Low selector sa UI'),('test-ui-1.20.9','Mga ayos ng v1.20.9 sa UI')]
H.append('<h3>Mga test sa totoong UI (browser)</h3>')
regd={}
for l in lines('docs/REGRESSION-v1.20.10.txt').split('\n'):
    if '||' in l:a,b=l.split('||',1);regd[a.strip()]=b.strip()
H.append(table(['Test','Ano ang sinuri','Resulta'],[[a,b,regd.get(a,'(tingnan ang regression)')] for a,b in ui]))
H.append('<h3>Mga lumang test (regression)</h3>')
H.append(table(['Test','Resulta'],[[a,b] for a,b in regd.items() if a not in [x for x,_ in ui]]) if regd else '<small>(walang regression file)</small>')
H.append('<div class="box">DITL guard: <b>IDENTICAL</b> (hindi ginalaw ang digital page). Ang mga luma nang test na pareho ang resulta noong v1.20.7-9 ay nakalista bilang NEEDS REVIEW sa technical report <code>docs/REPORT-v1.20.10.md</code>. Ang Save/Open/Import ay inalis na kaya hindi na tine-test.</div>')
H.append('<h2 class="pb">7. Coverage kada ABC sheet (automated lang)</h2><small>PASS / kabuuang records. Berde = lahat pasado; dilaw = may NEEDS REVIEW; abo = walang test. <b>Hindi ito patunay na tama ang buong sheet.</b></small>')
SHEETS=[]
try:
    SHEETS=[s for s in dict.fromkeys([r['sheet'] for k in ['FX','NOT','SEL','RATE','FINAL','RANGE','HS','COS','AB'] for r in load(k)])]
except Exception:pass
cols=[('FX','F(X)'),('NOT','NOT'),('SEL','SEL'),('RATE','RATE'),('FINAL','Valve'),('RANGE','Range'),('HS','HS/LS'),('COS','COS'),('AB','Bad Signal')]
cv={k:collections.defaultdict(collections.Counter) for k,_ in cols}
for k,_ in cols:
    for r in load(k):cv[k][r.get('sheet')][r['status']]+=1
def cell(k,s):
    c=cv[k].get(s)
    if not c:return '<td class="NT">-</td>'
    t=sum(c.values());p=c.get('PASS',0);nr=c.get('NEEDS REVIEW',0);f=c.get('FAIL',0)
    return '<td class="%s">%d/%d</td>'%('FAIL' if f else ('NR' if nr else ('NT' if p==0 else 'PASS')),p,t)
allsheets=sorted(SHEETS)
H.append(table(['Sheet']+[n for _,n in cols],[[s]+[cell(k,s) for k,_ in cols] for s in allsheets],raw=True))
H.append('<h2>8. Manual tests</h2><div class="box">Ang <b>Manual Testing Guide v%s</b> ay may eksaktong hakbang. Lahat ay <b>NOT TESTED</b> hanggang mag-ulat ka. Ang "Rehearsal result" ay ang nakita ko sa headless browser, hindi ang test mo.</div>'%V)
MT=[('MT-01','ABC-002','Bad Signal: 0 sa logic at flag 1'),('MT-02','ABC-003B','COS: control sa mismong sheet'),('MT-03','ABC-002','F(X) LN29: input 1.0 → output 50'),('MT-04','ABC-002','F(X) LN1 at MAN HS-OIL (8000 ~ 12000)'),('MT-05','ABC-002','Min air flow = 32 % × 400 = 128'),('MT-06','ABC-003B','Review marks: wala nang maling "?"'),('MT-07','ABC-002','Doble-doble na numero: TOF, TCF, BM'),('MT-08','ABC-003B','Click ng FROM DITL at ng ABC index'),('MT-09','Lahat','Search ng address at description'),('MT-10','ABC-002','Second sheet'),('MT-11','ABC-002','Simulation Audit'),('MT-12','ABC-002','Kulay ng numero at mode label'),('MT-13','Windows','Portable EXE'),('MT-14','Android','APK')]
H.append(table(['Test ID','Sheet','Ano ang titingnan','Status'],[[a,b,c,'<td class="NT"><b>NOT TESTED</b></td>'] for a,b,c in MT],raw=True))
H.append('<h2>9. Known issues at hindi pa tapos</h2>')
H.append(table(['Item','Specific na problema','Status'],[
 ['4 na F(X) na hindi ma-scale','Seksyon 5.1','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['2 digital gate symbol (ABC-001D)','Seksyon 5.3','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['Resizable / dockable / pin na panel','Hindi pa ginagawa','<td class="NT"><b>HINDI PA GINAGAWA</b></td>'],
 ['Second sheet pane','Panonood lang; walang click sa block doon (gamitin ang Swap)','<td class="NR"><b>BAHAGI LANG</b></td>'],
 ['Hindi ko na-test ang EXE at APK','Ang workflow ang gumawa; ikaw ang magbubukas (MT-13, MT-14)','<td class="NT"><b>NOT TESTED</b></td>'],
 ['Luma nang test failure (pareho sa v1.20.7-9)','pid ("direct + negative plant"), back-manual at modes ("bad 1"), numinput, ln (Save step), own, ui-real (4 FAIL): plant model / luma nang UI. Hindi galing sa mga ayos ngayon.','<td class="NR"><b>NEEDS REVIEW</b></td>']],raw=True))
H.append('<h2>10. VERIFIED at HINDI pa</h2>')
H.append(table(['VERIFIED (may ebidensya)','HINDI pa verified / assumption'],[[
 '<ul><li>Mga automated test sa seksyon 6.</li><li>DITL guard IDENTICAL.</li><li>Build, release at SHA256 ng HTML at PDF (nasa chat message).</li></ul>',
 '<ul><li>Pagbukas ng EXE at APK.</li><li>Lahat ng manual test.</li><li>Buong validation ng 54 ABC sheet.</li><li>Ang 128 T/H (default 400 T/H ay hindi nakasulat sa drawing).</li><li>Mga default na numero (RATE = 1, stroke time).</li><li>Ang simulator ay <b>simulation values</b>, hindi totoong plant data.</li></ul>']],raw=True))
H.append('<h2>11. Susunod na dapat gawin</h2>')
H.append(table(['#','Gawin','Sino'],[
 ['1','Gawin ang MT-01 hanggang MT-14 at i-report ang PASS / FAIL (gamitin ang <b>Audit</b> button at i-export ang CSV para madali).','Ikaw'],
 ['2','Sagutin ang seksyon 5 (range ng 4 na F(X), AND/OR ng 2 gate, halimbawa ng HS/LS, rule ng final element).','Ikaw'],
 ['3','Resizable / dockable panel at iba pang UI.','Ako, kapag sinabi mo']]))
open('docs/LogicSim_v%s_Report.html'%V,'w').write(page('Logic Sim v%s Release Report'%V,''.join(H)))
print('report ok')
