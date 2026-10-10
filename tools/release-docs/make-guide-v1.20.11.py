#!/usr/bin/env python3
"""Manual Testing Guide v1.20.11 (Taglish, paper-like). usage: python3 tools/release-docs/make-guide-v1.20.11.py ; node tools/release-docs/html-to-pdf.js docs/LogicSim_v1.20.11_Manual_Testing_Guide.html docs/LogicSim_v1.20.11_Manual_Testing_Guide.pdf v1.20.11"""
import json,base64,os,html
src=open('tools/release-docs/make-report-v1.20.10.py').read().split("reg=lines(")[0]
exec(src)
V='1.20.11'
exec(open('tools/release-docs/style.py').read())  # paper-like look (rule)
DL='https://github.com/Ronanski/dcs-ditl-workbench/releases/download/v%s/'%V
def im(n,cap):
    f='docs/guide-img/%s.png'%n
    if not os.path.exists(f):return ''
    return '<div style="margin:4px 0"><img src="data:image/png;base64,%s" style="max-width:100%%;border:1px solid #a8966a"><br><small>%s</small></div>'%(base64.b64encode(open(f,'rb').read()).decode(),cap)
vals=json.load(open('docs/TEST-RESULTS-VALUES.json')) if os.path.exists('docs/TEST-RESULTS-VALUES.json') else []
G=[]
G.append('<h1>Logic Sim v%s - Manual Testing Guide</h1><small>Para sa non-coder. Petsa: %s. HTML: <a href="%slogic-sim-v%s.html">logic-sim-v%s.html</a> (Chrome).</small>'%(V,DATE,DL,V,V))
G.append('<div class="box"><b>Paano gamitin:</b> gawin ang hakbang, isulat ang nakita mo at PASS o FAIL. Ang "Rehearsal result" ay ang nakita ko sa headless browser (hindi ang test mo). Mag-report gamit ang <b>Audit</b> button (PASS / FAIL / NEEDS REVIEW sa ilalim ng pangalan ng block) at <b>Export CSV</b>. <b>Ang mga MT-01 hanggang MT-14 ng v1.20.10 guide ay hindi pa nagagawa</b>: bukas natin pag-usapan; ito ay para sa mga bago lang.</div>')
def mt(i,sheet,block,start,steps,expected,rehearsal,bad,image=''):
    o='<h3>%s - %s</h3>'%(i,e(sheet))
    o+=table(['Item','Detalye'],[['Sheet',sheet],['Block / tag',block],['Starting condition',start],['Mga hakbang','<ol>'+''.join('<li>%s</li>'%s for s in steps)+'</ol>'],['Inaasahang resulta',expected],['Rehearsal result (ako, hindi mo test)',rehearsal],['Actual result mo','&nbsp;<br>&nbsp;'],['Status','<b>NOT TESTED</b> (PASS / FAIL: ________ )'],['Kapag hindi tugma',bad]],raw=True)
    return o+image
tot=lambda k:sum(int(r['actual'].split(k+' ')[1].split(',')[0]) for r in vals) if vals else 0
G.append(mt('MT-V1','ABC-002, ABC-057, ABC-026, ABC-003B, ABC-004A','Lahat ng numero (live values) sa drawing','Piliin ang sheet. Pindutin ang <code>▶ Run</code>. Naka-ON ang <b>Values</b> at <b>Wire values</b>.',
 ['Tingnan ang mga numero sa tabi ng address (hal. SI0033, AI0273) at sa tabi ng mga wire.','Tanungin ang sarili: <b>may numero bang tumatakip</b> sa text, sa block (kahon), sa wire, o sa ibang numero?','Sa <b>gilid</b> ng wire o address: pantay ba (parehong taas)? Sa <b>taas o baba</b>: naka-center ba?','Gawin ito sa ABC-057 (maraming wire), ABC-026 (maiikling wire sa pagitan ng kahon) at ABC-003B.','Pindutin ang <b>Wire values</b> (off / on) at tingnan na bumabalik ang mga numero sa parehong lugar.'],
 'Walang numerong tumatakip sa text / block / ibang numero. Walang dumadampi sa wire (maaaring 1 o 2 sa buong app). Pantay sa gilid, center sa taas / baba. Bawat analog wire ay may numero (maliban kung may address, o AO / I/P / valve na may sariling indikasyon).',
 'Sukat sa 51 sheet, 2128 na numero: tumatakip sa text 0, sa block 0, sa ibang numero 0, dumadampi sa wire 2, hindi pantay 0. Analog net na walang numero: 0 sa 2207.',
 'Kunan ng screenshot ang lugar at isulat ang sheet at address / wire. I-press ang <b>FAIL</b> sa Audit.',
 im('v11_057_before','ABC-057 BAGO (v1.20.10)')+im('v11_057_after','ABC-057 PAGKATAPOS (v1.20.11)')))
G.append(mt('MT-V2','ABC-002','Kulay ng numero at settings','Run.',
 ['I-click ang wire na galing sa transmitter (hal. SI0061) at i-FORCE ng 12 ✓. Tingnan ang kulay ng numero.','Mag-type ng value sa isang input (AI0273 sa Panel) at tingnan ang kulay.','Buksan ang <b>Legend &amp; style</b> at hanapin ang <b>Values (numbers on the drawing)</b>: may <b>Computed by the logic</b>, <b>Simulated input</b> at <b>FORCED value</b>.','Palitan ang kulay ng bawat isa at tingnan kung nagbago sa drawing.'],
 'Berde = computed, cyan = simulated input, amber = FORCED (default). Puwedeng palitan ang tatlo.','Default na kulay: berde / cyan / amber. Settings: 3 na pili.','Isulat kung ano ang kulay na gusto mo para sa bawat isa.'))
G.append(mt('MT-V3','ABC-002 + isa pang sheet','Second sheet (zoom)','Run.',
 ['Pindutin ang <b>2nd sheet</b>.','Sa pangalawang sheet: gamitin ang <b>mouse wheel</b>.','Pindutin ang <b>＋</b> at <b>－</b> sa taas ng pane.','<b>Double-click</b> sa drawing.','Kung touchpad / tablet: <b>pinch</b> (dalawang daliri). Drag para ilipat. <b>Fit</b> para ibalik.'],
 'Lumalaki at lumiliit ang pangalawang sheet sa lahat ng paraan; naililipat ng drag.','Wheel in / out, ＋, －, drag, double-click: PASS (test-pane2, 10 / 10).','Isulat kung anong device at paraan ang hindi gumana (mouse, touchpad, tablet).'))
G.append(mt('MT-V4','-','Portable EXE (Windows)','Na-download mo ang <b>logic-sim-v%s-portable.exe</b>.'%V,['I-double click ang EXE (SmartScreen: More info ▸ Run anyway).','Analog · ABC ▸ ABC-002 ▸ Run.','Gawin ang MT-V1 at MT-V3.'],'Bumubukas; kapareho ang HTML.','HINDI ko na-test.','Isulat ang error.'))
G.append(mt('MT-V5','-','APK (Android)','Na-download mo ang <b>logic-sim-v%s.apk</b>.'%V,['I-tap ang APK (allow install unknown apps).','Analog · ABC ▸ ABC-002 ▸ Run.','Gawin ang MT-V1 at MT-V3 (pinch).'],'Naka-install at bumubukas; kapareho ang HTML.','HINDI ko na-test.','Isulat ang error / screenshot.'))
G.append('<h2>Resulta ng guide</h2>'+table(['Test','PASS / FAIL','Mga tala'],[[t,'',''] for t in ['MT-V1','MT-V2','MT-V3','MT-V4','MT-V5']]))
open('docs/LogicSim_v%s_Manual_Testing_Guide.html'%V,'w').write(page('Logic Sim v%s Manual Testing Guide'%V,''.join(G)))
print('guide ok')
