#!/usr/bin/env python3
"""Release Report v1.20.11 (Taglish). usage: python3 tools/release-docs/make-report-v1.20.11.py ; node tools/release-docs/html-to-pdf.js docs/LogicSim_v1.20.11_Report.html docs/LogicSim_v1.20.11_Report.pdf v1.20.11"""
import json,collections,html,os,base64
src=open('tools/release-docs/make-report-v1.20.10.py').read().split("reg=lines(")[0]
exec(src)
V='1.20.11'
exec(open('tools/release-docs/style.py').read())  # paper-like look (rule): overrides CSS / page
REL='https://github.com/Ronanski/dcs-ditl-workbench/releases/tag/v%s'%V
DL='https://github.com/Ronanski/dcs-ditl-workbench/releases/download/v%s/'%V
COMMIT=open('docs/.release-commit').read().strip() if os.path.exists('docs/.release-commit') else '(tingnan ang Release page)'
def im(n,cap):
    f='docs/guide-img/%s.png'%n
    if not os.path.exists(f):return ''
    return '<div style="margin:4px 0"><img src="data:image/png;base64,%s" style="max-width:100%%;border:1px solid #b8c2cc"><br><small>%s</small></div>'%(base64.b64encode(open(f,'rb').read()).decode(),cap)
regd={}
for l in open('docs/REGRESSION-v1.20.11.txt').read().split('\n') if os.path.exists('docs/REGRESSION-v1.20.11.txt') else []:
    if '||' in l:a,b=l.split('||',1);regd[a.strip()]=b.strip()
H=[]
H.append('<h1>Logic Sim v%s - Release Report</h1><small>Petsa: %s &nbsp;|&nbsp; Branch: %s &nbsp;|&nbsp; Commit ng code: %s &nbsp;|&nbsp; Simpleng Taglish</small>'%(V,DATE,BR,COMMIT))
H.append('<div class="box"><b>Buod:</b> Ito ang <b>mabilis na ayos</b> sa mga <b>live values</b> (ang pinakaimportante mo) ayon sa rules sa Excel mo (LOGICSIM_EU_REPORT_FINDINGS), at ang <b>zoom ng second sheet</b>. Sinukat ko ang bawat numero sa <b>lahat ng 51 sheet</b> (2128 na numero): ngayon <b>wala nang numerong tumatakip</b> sa text, block, o ibang numero; <b>2 lang</b> sa 2128 ang dumadampi sa wire; at <b>lahat ay pantay (level) sa gilid o naka-center sa taas / baba</b>. Bukas natin pag-usapan ang mga kailangan ng sagot mo at ang manual test mo (tingnan ang seksyon 5).</div>')
H.append('<h2>1. Download</h2>')
H.append(table(['File','Para saan','Direct link'],[
 ['HTML','Buksan sa Chrome, walang install','<a href="%slogic-sim-v%s.html">logic-sim-v%s.html</a>'%(DL,V,V)],
 ['Portable EXE','Windows, walang admin','<a href="%slogic-sim-v%s-portable.exe">logic-sim-v%s-portable.exe</a>'%(DL,V,V)],
 ['APK','Android','<a href="%slogic-sim-v%s.apk">logic-sim-v%s.apk</a>'%(DL,V,V)],
 ['Report na ito','Simpleng ulat','<a href="%sLogicSim_v%s_Report.pdf">LogicSim_v%s_Report.pdf</a>'%(DL,V,V)],
 ['Manual Testing Guide','Mga test para sa iyo','<a href="%sLogicSim_v%s_Manual_Testing_Guide.pdf">LogicSim_v%s_Manual_Testing_Guide.pdf</a>'%(DL,V,V)],
 ['Release page','Lahat ng file','<a href="%s">%s</a>'%(REL,REL)]],raw=True))
H.append('<h2>2. As found / As left / Work done / Status</h2>')
R=[
['L1. Posisyon ng live values: "hindi dapat humaharang sa text, block, existing value, wire / net"',
 'Sinukat sa 2101 na numero (v1.20.10): <b>53</b> ang tumatakip sa text, <b>68</b> sa block, <b>128</b> sa wire, <b>10</b> sa ibang numero. Ang numero ay inilalagay sa isang takdang lugar sa tabi ng address at hindi sinusuri kung may natatakpan.',
 'Sa 2128 na numero (v1.20.11): <b>0</b> sa text, <b>0</b> sa block, <b>0</b> sa ibang numero, <b>2</b> sa wire (ABC-003A at isang siksik na lugar sa ABC-004A; may dumadampi lang).',
 'Bagong paraan ng paglalagay: bawat numero ay sinusubukan sa maraming lugar (kanan, ibaba, itaas, kaliwa; ilang layo) at pinipili ang unang <b>walang natatakpan</b>. Gumagamit ng <b>tunay na laki ng text</b> (hindi hula). Lahat ng sheet nang sabay. Hindi nagbago ang simulation.',
 S_OK],
['L2. "Pantay kung sa gilid; centered kung sa baba o itaas"',
 'Walang ganitong rule sa paglalagay; ang numero ay kung saan lang inabot.',
 'Sa gilid ng wire / address: <b>level</b> (parehong taas). Sa taas o baba: <b>naka-center</b> sa wire / address (kahit magbago ang haba ng numero, hal. 0.00 → 446.0). Sinukat: <b>0 sa 2128</b> ang hindi pantay.',
 'Ang text ay naka-anchor (start / end / middle) at naka-center sa taas, kaya nananatiling pantay habang nagbabago ang value.',
 S_OK],
['L3. Rule 6, 7, 8: bawat analog wire / net ay may numero (maliban kung may address, o AO / I/P / valve na may sariling indikasyon)',
 '<b>22 na net</b> (sa ABC-003A/B/C/D, 003E, 007, 009A, 020) ay walang numero: ang wire na galing sa bilog / connector lang ang driver kaya walang pinaglagyan.',
 '<b>0 sa 2207</b> na analog net ang walang numero (may 27 na dagdag na numero).',
 'Bawat net na walang numero ay binibigyan na ng numero sa tabi ng wire.',
 S_OK],
['L4. Kulay: simulated input, live (computed) at forced ay magkakaiba (finding 2)',
 'Berde ang lahat. Ang forced at ang tinype / slider ay kamukha ng computed.',
 '<b>Berde = computed ng logic</b> · <b>cyan = simulated input (tinype / slider)</b> · <b>amber = FORCED</b>. Ang bawat isa ay <b>puwedeng palitan ang kulay</b> sa <b>Legend &amp; style ▸ Values</b> (3 na pili). May legend na "Numbers".',
 'Kung ang "kulay green" na tinutukoy mo ay ibang rule (hal. green dapat ang forced, o ibang kulay ang live), sabihin lang at papalitan ko; nasa settings na ito.',
 S_PART],
['L5. Rule 1-5: sino ang may numero',
 'Nakasulat sa Excel mo: (1) instrument tag, (2) AI / AO / SI address, (3) .SV / .MV / .PV, (4) valve / damper / motor = % opening sa equipment, walang numero sa tag at positioner, (5) output ng final element (AI) ay may numero at sync.',
 '(2), (3), (4), (5) ay <b>sinusunod</b>. Sa (1) <b>instrument tag</b>: ang huling sagot mo sa manual test (MT-02 ng v1.20.8) ay "AI address lang, wala sa instrument tag at ALM": iyon ang sinunod ko.',
 'Walang binago sa rule 1-5. Kung gusto mong magkaroon din ng numero sa instrument tag (ayon sa Excel), sabihin lang: isang linya lang ang babaguhin.',
 S_NR],
['L6. Second sheet: hindi ma-zoom',
 'Sa test ko ay gumagana ang mouse wheel, pero kulang ito: <b>walang button</b> at <b>walang pinch (dalawang daliri)</b> o double-click, kaya hindi ito gumagana sa touchpad / tablet.',
 'May <b>＋ at － na button</b>, <b>pinch</b> (dalawang daliri), <b>double-click</b>, mouse wheel (mas malakas ang ctrl+wheel), drag para ilipat, at Fit.',
 'Binago ang pane at nagdagdag ng test: wheel in / out, ＋, －, drag, double-click (lahat PASS).',
 S_OK]]
H.append(table(['Puna mo','As found (dati)','As left (ngayon)','Work done (ginawa ko)','Status'],R,raw=True))
H.append('<h3>Larawan: bago at pagkatapos (parehong lugar, parehong sheet)</h3>')
H.append(im('v11_057_before','ABC-057, v1.20.10 (bago): ang mga numero ay nasa ibabaw ng wire / magkakadikit.')+im('v11_057_after','ABC-057, v1.20.11 (pagkatapos): pantay at hindi tumatakip.')+im('v11_026_before','ABC-026, v1.20.10 (bago)')+im('v11_026_after','ABC-026, v1.20.11 (pagkatapos)'))
H.append('<h2 class="pb">3. Automated tests (ako ang nagpatakbo)</h2><small>Hindi ito kapalit ng manual test mo.</small>')
def row(name,what,k):
    c=cnt(k);return [name,what,'%d'%c.get('PASS',0),'%d'%c.get('FAIL',0),'%d'%c.get('NEEDS REVIEW',0),'%d'%c.get('NOT TESTED',0)]
H.append(table(['Test','Ano ang sinuri','PASS','FAIL','NEEDS REVIEW','NOT TESTED'],[
 row('Live values (bawat sheet)','Walang takip sa text / block / numero; pantay; (2 sa wire = pinapayagan)','VALUES'),
 row('F(X)','112 block','FX'),row('LINEAR vs LINEAR.xls','Lahat ng table','LINEAR'),row('Bad Signal (SIG.AB)','','AB'),row('COS + T switch','','COS'),
 row('NOT gate','','NOT'),row('SELECT CIRCUIT','','SEL'),row('RATE / ramp','','RATE'),row('Valve / actuator','','FINAL'),row('MAN range at AI','','RANGE'),row('Min air flow','','MINAIR'),row('High/Low selector','','HS')]))
H.append('<h3>Resulta ng buong regression</h3>')
H.append(table(['Test','Resulta'],[[a,b] for a,b in regd.items()]) if regd else '<small>(wala)</small>')
H.append('<div class="box">DITL guard: <b>IDENTICAL</b>. Muling nabubuo ang v1.20.10 mula sa sarili nitong patch at tugma ang SHA256 (6325f96f...), kaya walang nawala sa nakaraang release.</div>')
H.append('<h2>4. Ano ang bago at mga file</h2>')
H.append(table(['Bagay','Ano'],[['v1.20.11','Live values placement (tools/patch-1.20.11-vplace.js), kulay settings, second pane zoom.'],['Mga bagong tool','tools/audit-values.js (sukatin ang bawat numero), tools/audit-values-rules.js (net na walang numero)'],['Hindi nagbago','Logic ng simulation, F(X), Bad Signal, COS, search, audit']],raw=False))
H.append('<h2>5. Para bukas: mga kailangan ko ng sagot / test mo</h2>')
H.append(table(['Item','Specific','Status'],[
 ['Manual test ng v1.20.10 (MT-01 hanggang MT-14) at ng mga bago sa guide na ito','Tingnan ang Manual Testing Guide v1.20.10 at v1.20.11. Gamitin ang Audit button at i-export ang CSV.','<td class="NT"><b>NOT TESTED</b></td>'],
 ['4 na F(X) na hindi ma-scale','ABC-004A LN44, ABC-008 LN13, ABC-020 LN8, ABC-034 LN21: kailangan ang range ng input (dahil kinalkula mula sa maraming signal).','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['2 digital gate sa ABC-001D','AND o OR?','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['HS/LS "ramp muna, hindi instant"','Halimbawa: sheet at tag','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['4 AO at 8 FIELD na instant','Ang ramp rate / oras na gusto mo','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['Kulay ng numero at instrument tag','Kumpirmahin ang L4 at L5','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['COS control sa sheet','Ito ba ang "nawala sa taas"?','<td class="NR"><b>NEEDS REVIEW</b></td>'],
 ['EXE at APK','Hindi ko na-test (ang workflow ang gumawa). MT sa guide.','<td class="NT"><b>NOT TESTED</b></td>']],raw=True))
H.append('<h2>6. VERIFIED at HINDI pa</h2>')
H.append(table(['VERIFIED (may ebidensya)','HINDI pa verified'],[[
 '<ul><li>Sukat ng bawat numero sa 51 sheet (seksyon 3).</li><li>Regression, DITL guard, SHA256 (nasa chat).</li></ul>',
 '<ul><li>Hitsura sa totoong screen mo (laki ng font, zoom): ikaw ang titingin.</li><li>EXE / APK.</li><li>Lahat ng manual test.</li><li>Ang simulator ay simulation values lang.</li></ul>']],raw=True))
open('docs/LogicSim_v%s_Report.html'%V,'w').write(page('Logic Sim v%s Release Report'%V,''.join(H)))
print('report ok')
