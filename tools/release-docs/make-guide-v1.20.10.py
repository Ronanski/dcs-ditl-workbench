#!/usr/bin/env python3
"""Manual Testing Guide v1.20.10 (Taglish). usage: python3 tools/release-docs/make-guide-v1.20.10.py ; node tools/release-docs/html-to-pdf.js docs/LogicSim_v1.20.10_Manual_Testing_Guide.html docs/LogicSim_v1.20.10_Manual_Testing_Guide.pdf v1.20.10"""
import json,base64,os,html
src=open('tools/release-docs/make-report-v1.20.10.py').read().split("def load(k):")[0]
exec(src)
R=json.load(open('docs/guide-rehearsal.json'))['OUT']
def im(n,cap):
    f='docs/guide-img/%s.png'%n
    if not os.path.exists(f):return ''
    return '<div><img src="data:image/png;base64,%s" style="max-width:100%%;border:1px solid #b8c2cc"><br><small>%s</small></div>'%(base64.b64encode(open(f,'rb').read()).decode(),cap)
G=[]
G.append('<h1>Logic Sim v%s - Manual Testing Guide</h1><small>Para sa non-coder. Petsa: %s. Gamitin ang HTML: <a href="%slogic-sim-v%s.html">logic-sim-v%s.html</a> sa Chrome.</small>'%(V,DATE,DL,V,V))
G.append('<div class="box"><b>Paano gamitin:</b> Gawin ang bawat test ayon sa hakbang. Isulat ang nakita mo sa "Actual result mo" at lagyan ng PASS o FAIL. Kung hindi tugma, gawin ang nasa "Kapag hindi tugma". Lahat ay <b>NOT TESTED</b> hanggang magawa mo. Ang "Rehearsal result" ay ang nakita ko sa headless browser gamit ang parehong hakbang; <b>hindi iyon ang test mo</b>.<br><b>Madaling paraan para mag-report:</b> pindutin ang <b>Audit</b> button sa taas, at sa ilalim ng pangalan ng block ay pindutin ang PASS / FAIL / NEEDS REVIEW. Pagkatapos ay <b>Export CSV</b> at ipadala sa akin.</div>')
def mt(i,sheet,block,start,steps,expected,rehearsal,bad,image=''):
    o='<h3>%s - %s</h3>'%(i,e(sheet))
    o+=table(['Item','Detalye'],[['Sheet',sheet],['Block / tag',block],['Starting condition',start],['Mga hakbang','<ol>'+''.join('<li>%s</li>'%s for s in steps)+'</ol>'],['Inaasahang resulta',expected],['Rehearsal result (ako, hindi mo test)',rehearsal],['Actual result mo','&nbsp;<br>&nbsp;'],['Status','<b>NOT TESTED</b> (PASS / FAIL: ________ )'],['Kapag hindi tugma',bad]],raw=True)
    return o+image
m1=R['mt01'];m2=R['mt02'];m3=R['mt03'];m4=R['mt04'];m5=R['mt05']
G.append(mt('MT-01','ABC-028','Transmitter AI0181 (PT-DO0005, range 0 ~ 25 kg/cm2) na diretso sa DEV block','Piliin ang ABC-028. Pindutin ang <code>▶ Run</code>.',
 ['Sa kanang Panel, sa <b>TRANSMITTERS (AI)</b>, i-type ang <b>12.5</b> sa AI0181 at Enter.','I-click ang tatsulok na <b>AI</b> sa ilalim ng "AI0181" sa drawing.','Sa Panel, hanapin ang <b>Bad Signal (SIG.AB) of this transmitter</b> at pindutin ang button (<b>Bad Signal: OFF</b>).','Tingnan ang numero sa tabi ng AI0181 at ang numero ng wire sa susunod na block.','Pindutin ulit ang button (FORCED BAD) para ibalik.'],
 'Pag Bad Signal ON: may pulang <b>FORCED BAD</b>; ang AI0181 at ang wire papunta sa block ay <b>0.00</b> (hindi 12.5); ang B.0305 (SIG.AB) ay naka-ON. Pag ibinalik: bumabalik ang 12.5.',
 'AI0181 12.5 → Bad Signal ON: signal %s, DEV output %s; ibinalik: %s / %s. May button: %s.'%(m1['after']['signal'],m1['after']['dev'],m1['back']['signal'],m1['back']['dev'],'oo' if m1['hasBadBtn'] else 'hindi'),
 'Kunan ng screenshot ang AI0181 at ang numero sa tabi nito. I-press ang <b>FAIL</b> sa ilalim ng pangalan ng block sa Panel (Audit).',im('mt01_after','Rehearsal: FORCED BAD, AI0181 = 0.00, B.0305 ON')))
G.append(mt('MT-02','ABC-003B','Ang COS (pink na diamond) na kasama ng T switch ng "ACT MCV-FA1043-B"','Piliin ang ABC-003B. Pindutin ang <code>▶ Run</code>.',
 ['I-click mismo ang <b>COS</b> na pink na diamond sa kaliwa-itaas ng PID (katabi ng T na pink).','May lalabas na kahon <b>COS manual value</b> sa tabi nito.','Sa kahon: pumili sa <b>T switch</b> ng <b>Force input B (manual leg)</b>.','I-type ang <b>12.5</b> sa number box at Enter (o ✓). Subukan din ang slider at ang <b>Min / Mid / Max</b>.','Pindutin ang <b>Esc</b> o ang <b>✕</b> para isara.'],
 'Lumalabas ang kahon sa mismong sheet at hindi nawawala hanggang isara mo. Ang value ay napupunta sa wire ng COS (12.5). Ang status ay nagsasabi kung ENERGIZED o NOT ENERGIZED (kung NOT: pumili ng Force input B).',
 'Lumabas ang kahon: oo; laman: %s. Pagkatapos ng Force B at 12.5: target %s, value %s. Isinara ng Esc: %s.'%(e((m2.get('popup') or '')[:140]),m2['after'].get('target'),m2['after'].get('value'),'oo' if m2['closed'] else 'hindi'),
 'Sabihin kung ito ang "nawala sa taas" na tinutukoy mo, o ibang bahagi ng COS ang gusto mong makita.',im('mt02_popup','Rehearsal: ang COS control sa tabi ng COS')))
G.append(mt('MT-03','ABC-002','F(X) LN29 (S1-LN29, "O2 CONTROL FUNCTION"), input galing sa a / b','Piliin ang ABC-002. Run.',
 ['Hanapin ang F(X) na may <b>LN29</b> (sa kanan-ibaba, sa kanan ng T switch, output SI0054).','I-click ang F(X). Sa Panel, basahin ang <b>"Input to the table (%)"</b>.','I-click ang wire na papasok sa F(X) (SI0047). Sa Panel, FORCE = <b>1</b> ✓. Basahin ang <b>Table X now</b> at ang SI0054.','FORCE = <b>0.8</b>, tapos <b>1.2</b>.'],
 'Input 1.0 → Table X = 100 % → <b>SI0054 = 50</b>. Input 0.8 → 80 % → 0. Input 1.2 → 120 % → 100.',
 'Panel: "%s". Input 1: Table X %s %%, output %s.'%(e(m3['panel'][0]),m3.get('x'),m3.get('out')),
 'Kunan ng screenshot ng Panel at ng F(X).',im('mt03','Rehearsal: input 1.0 → Table X 100 % → 50')))
G.append(mt('MT-04','ABC-002','F(X) LN1 (HS-OIL CALORIE) at ang MAN HS-OIL (8000 ~ 12000 Kcal/Kg)','Piliin ang ABC-002. Run.',
 ['I-click ang wire na papasok sa F(X) <b>LN1</b> (HS-OIL.MV). Sa Panel, FORCE = <b>8000</b> ✓. Basahin ang SI0001.','FORCE = <b>10000</b>, tapos <b>12000</b>.'],
 'SI0001: 8000 → <b>0.80</b>; 10000 → <b>1.00</b>; 12000 → <b>1.20</b>.',
 'Nakita: %s.'%e(', '.join('%s → %s'%(a,b) for a,b in m4['points'])),'Kunan ng screenshot ng SI0001.'))
G.append(mt('MT-05','ABC-002','Constant "32% MIN. AIR FLOW" (kahon na A) at ang HIGH selector na ">" sa ibaba nito','Piliin ang ABC-002. Run.',
 ['I-click ang kahon <b>A</b> sa tabi ng "32% MIN. AIR FLOW".','Sa Panel, basahin ang <b>Minimum air flow (T/H)</b> at ang linyang "32 % x minimum air flow = signal to the high selector".','Palitan ang min air flow ng <b>500</b> Enter.','Pindutin ang <b>Reset this block to default</b>.'],
 '400 → <b>128 T/H</b>; 500 → <b>160 T/H</b>; pagkatapos ng reset: 400 / 128.','Default: min air flow %s, signal %s.'%(m5['th'],m5['out']),
 'Sabihin kung ang 400 T/H ay tama bilang min air flow ng planta. Hindi ito nakasulat sa drawing; ikaw ang may tamang numero.'))
G.append(mt('MT-06','ABC-003B (at iba pa)','Mga orange na putol-putol na kahon (Review marks)','Piliin ang ABC-003B.',
 ['Tingnan ang drawing: dapat <b>wala nang orange na "?"</b> sa mga DEV block (maliit na kahon na may PV, + at -).','Pindutin ang <b>Review marks</b> para i-off at i-on.','Piliin ang <b>ABC-001D</b> at hanapin ang dalawang kahon sa tabi ng M.2030 at TR221.','Piliin ang ilang sheet: ABC-002, 004A, 008, 009A.'],
 'Wala nang "?" sa DEV at wala nang "pin?" sa SIG.AB. Sa ABC-001D lang may <b>2 "?"</b> (digital gate na hindi ko kilala).','ABC-003B: %s na marka. Sa buong app: 2 "?" (ABC-001D) at 0 "pin?".'%m3 .get('marks',R['mt06']['marks']),
 'Kunan ng screenshot ng sheet na may orange pa.',im('mt06','Rehearsal: ABC-003B, Review marks ON, walang orange')))
G.append(mt('MT-07','ABC-002','Mga bilog na tag sa itaas (TOF 003A, TCF 004A, BM 001C)','Run.',
 ['Piliin ang <b>ABC-002</b>. Tingnan ang itaas-kaliwa: ang mga bilog na "TOF 003A", "TCF 004A" at "BM 001C".','Bilangin ang mga numero sa tabi ng bawat bilog.','Pumili ng sheet na may controller (ABC-015) at tingnan ang "HICFA1005", ".MV" at "AO0592".'],
 '<b>Isang numero</b> bawat bilog (hindi dalawa). Sa controller: ang .MV at ang AO address ay may numero; ang bare tag na HICFA1005 ay wala (kung may ibang label ang wire).','Bago ang ayos: 150 na wire ang may 2+ numero. Pagkatapos: 88 (magkaibang tunay na label).',
 'Kunan ng screenshot ng lugar kung saan doble pa rin.'))
G.append(mt('MT-08','ABC-003B at ABC-000A','Mga text na "( FROM DITL 02-63 )", "TO DITL 07-04" at ang listahan ng mga sheet sa ABC-000A','Anumang mode.',
 ['Piliin ang <b>ABC-003B</b>. Hanapin ang text na <b>( FROM DITL 02-63 )</b> (may putol-putol na guhit sa ilalim).','I-click ito.','Bumalik sa <b>Analog · ABC</b>. Piliin ang <b>ABC-000A</b> at i-click ang "ABC-002" sa listahan.'],
 'Ang DITL text ay bubukas ang digital page <b>DITL-02</b>. Ang ABC-002 text ay bubukas ang <b>ABC-002</b>. Sa pag-drag (pag-pan) ay hindi bubukas.','Sa ABC-003B: %s na link area. DITL-02 at ABC-002: nagbukas.'%R['mt08']['links'],
 'Isulat kung aling text ang hindi nag-click.'))
G.append(mt('MT-09','Lahat','Search sa kaliwang listahan','Analog.',
 ['I-type sa search box: <b>AI0273</b>.','I-click ang resulta.','I-type ang <b>flue gas</b> (description).','I-type ang <b>SI0054</b>.'],
 'May listahan kada sheet na may "used in the logic" o "text". Ang click ay bubukas ang sheet, magza-zoom at may <b>dilaw na ring</b> sa lugar.','AI0273: 1 sheet (ABC-002) · description "flue gas": 7 resulta · SI0054: 2.','Isulat ang address na hindi nahanap.'))
G.append(mt('MT-10','ABC-002 at ABC-004A','Button na 2nd sheet','Run.',
 ['Piliin ang ABC-002. Pindutin ang <b>2nd sheet</b>.','May lalabas na pangalawang sheet sa tabi. Pindutin ang Run at tingnan kung gumagalaw ang mga numero doon.','Sa pangalawang sheet: wheel = zoom, drag = ilipat.','Pindutin ang <b>⇄ Swap</b>.','Pumunta (sa listahan) sa sheet na nasa pangalawang pane.','Pindutin ang <b>✕</b>.'],
 'Dalawang sheet nang sabay, <b>live</b>. Hindi puwede ang parehong sheet (magsasara ang pane). Swap = nagpapalit ang main at second.','Pangalawang sheet: %s. Live: oo. Walang duplicate: oo. Swap: oo.'%R['mt10']['second'],
 'Isulat kung may hindi gumagalaw o hindi gumagana.',im('mt10','Rehearsal: ABC-002 at ABC-004A nang sabay')))
G.append(mt('MT-11','ABC-002','Simulation Audit','Anumang sheet.',
 ['I-click ang F(X) na LN29. Sa Panel, sa ilalim ng pangalan ng block, pindutin ang <b>FAIL</b>.','Sa lumabas na form, isulat ang Expected: <b>50</b>, Result FAIL, at <b>Save to report</b>.','Pindutin ang <b>Audit</b> sa toolbar: dapat nasa listahan.','Pindutin ang <b>PASS</b> sa Retest, at <b>Export CSV</b>.','I-reload ang page at buksan ulit ang Audit.'],
 'May entry na may sheet, block, expected / actual, evidence (inputs, outputs, forced, oras). May CSV file. Nananatili pagkatapos mag-reload.','9 hakbang pasado sa test-audit.','Ipadala sa akin ang CSV.'))
G.append(mt('MT-12','ABC-002','Kulay ng numero at mode label','Anumang sheet.',
 ['Tingnan ang label sa tabi ng pangalan ng sheet kapag hindi pa Run: <b>VIEW / TRACE - NO SIMULATION</b>.','Pindutin ang Run: <b>SIMULATION - RUNNING</b>. Pause: <b>SIMULATION - PAUSED</b>.','I-force ang isang wire (FORCE) at tingnan ang kulay ng numero nito.','Buksan ang <b>Legend & style</b> at basahin ang "Numbers".'],
 'Berde = computed, cyan = input na tinype, <b>amber = FORCED</b>. Malinaw ang mode label.','Mode: %s; amber na numero: %s.'%(R['mt12']['mode'],R['mt12']['frc']),'Isulat kung hindi malinaw ang label.',im('mt12','Rehearsal: SIMULATION - RUNNING at amber na forced value')))
G.append(mt('MT-13','-','Portable EXE (Windows)','Na-download mo ang <b>logic-sim-v%s-portable.exe</b>.'%V,['I-double click ang EXE. Kung may SmartScreen: <b>More info</b> tapos <b>Run anyway</b>.','Pindutin ang <b>Analog · ABC</b> at piliin ang <b>ABC-002</b>.','Gawin ang MT-03 at MT-05.'],'Bumubukas; kapareho ang resulta sa HTML.','HINDI ko na-test (ang workflow ang gumawa).','Isulat ang error message.'))
G.append(mt('MT-14','-','APK (Android)','Na-download mo ang <b>logic-sim-v%s.apk</b>.'%V,['I-tap ang APK. Payagan ang <b>install unknown apps</b>.','Buksan. Pindutin ang <b>Analog · ABC</b> at piliin ang <b>ABC-002</b>.','Gawin ang MT-03.'],'Naka-install at bumubukas; kapareho ang resulta.','HINDI ko na-test.','Isulat ang error / screenshot.'))
G.append('<h2>Resulta ng guide</h2>'+table(['Test','PASS / FAIL','Mga tala'],[[t,'',''] for t in ['MT-%02d'%i for i in range(1,15)]]))
G.append('<small>Ipadala sa akin ang listahang ito (o ang CSV mula sa Audit) at ang screenshot ng bawat FAIL.</small>')
open('docs/LogicSim_v%s_Manual_Testing_Guide.html'%V,'w').write(page('Logic Sim v%s Manual Testing Guide'%V,''.join(G)))
print('guide ok')
