# HANDOVER - isang connect sa repo, alam na ang gagawin (huling update: v1.20.9, 2026-10-10)

## 0. Paste-in prompt para sa bagong session
```
Ituloy natin ang Logic Sim (repo ronanski/dcs-ditl-workbench, branch ccr-2c4847cc-9fe3px o main; tingnan ang docs/HANDOVER.md §1 kung may mas bago).
BASAHIN MUNA, sa ayos: CLAUDE.md -> docs/HANDOVER.md -> docs/RELEASE-PROTOCOL.md -> DESIGN.md -> PROJECT-NOTES-v1.20.10.md -> docs/REPORT-v1.20.10.md.
Sundin ang protocol ko: simpleng Taglish (80 % Tagalog), PASS / FAIL / NEEDS REVIEW / NOT TESTED, walang hula, ipadala sa chat ang PDF report at HTML, huwag galawin ang DITL, walang bagong release nang walang "go" ko.
Pagkabasa, ibuod sa 5 linya kung nasaan tayo at ano ang uunahin mo (HANDOVER §4), at magsimula.
```

## 1. Estado ngayon (v1.20.10 RELEASED at naka-merge sa main)
- **Latest release: v1.20.10** (GitHub Release `v1.20.10`, 2026-10-10; workflow run 28 id 38061966162 = success: version / exe / apk / release; commit ng release `543814e`; assets: html, portable exe, apk, manual pdf, `LogicSim_v1.20.10_Report.pdf`, `LogicSim_v1.20.10_Manual_Testing_Guide.pdf`; SHA256 ng html / report / guide = tugma sa lokal). EXE at APK ay hindi pa tinetest ng Claude.
- Ang user ay nagbigay ng go para sa release at merge sa main (isang beses, para sa v1.20.10). Para sa susunod na version: tanungin ulit.
- Root: `logic-sim-v1.20.10.html`; ang 1.20.9 ay nasa `archive/html/`. Build: `node tools/patch-1.20.10.js` (modules fx, dup, minair, xref, cos, ab, vcol, audit, mode, search, pane2). Para sa v1.20.11: ilipat ang root html sa archive/html, ang patch-1.20.10* sa tools/history, gumawa ng bagong patch.
- **DITL part IDENTICAL** (guard 135a852d87c5): lahat ng bago ay nasa analog script lang (ang second pane `#cv2` at ang placeholder ng search ay ginagawa ng analog script).
- Report generators: `tools/release-docs/make-report-v1.20.10.py` (env `DUPS=88`), `make-guide-v1.20.10.py`, `rehearse-v1.20.10.js` (rehearsal + screenshots sa `docs/guide-img`), `html-to-pdf.js <html> <pdf> vX`. Regression: `docs/REGRESSION-v1.20.10.txt`.
- Awtomatikong handoff: `.claude/hooks/*`. Bago tapusin ang session: i-update ang §1 at §4, i-commit, i-push.

## 2. Ano ang nagawa sa v1.20.9 (buod; buo sa docs/REPORT-v1.20.9.md at sa PDF)
Mga ayos mula sa manual test ng user sa v1.20.8 (MT-01..08): forced AI value sa address; walang value sa ALM / instrument tag; typed value limitado sa range; SELECT CIRCUIT input wires may ilaw; ÷ symbol na nabasang minus (ABC-002 #44, ABC-008 #61); settings ng block hindi na nire-reset ng Reset (+ "Reset this block to default"); RATE na walang rate = 1; SIG.AB pairing by connection (198 / 198); min air flow = T/H setting ang signal; S1-LN38 / 39 = DCS patterns; HS / LS legs; **Wire values** at **Review marks** buttons.

## 3. Mga desisyon ng user (hindi na itatanong ulit)
- Terminology: simulation values (input / converted / output), hindi "actual plant values".
- % RATE: gamitin ang tunay na span ng signal; ABC-001D FM403 = 0.00075 T/s; ABC-032 "1%/sec" sa 0-200 T/H = 2 T/H/s. Ang 5 RATE na hindi makita ang span: **pinag-antay ng user, default muna** (ABC-007 RAMPB#18, ABC-057 RATE#67, ABC-001C RATE#47, ABC-002 RATE#75 / #76).
- RATE / ramp na walang nakasulat na rate: **1 bawat segundo**. Settings ng block = config (hindi binubura ng Reset).
- ABC-002 min air flow: editable, default 400 T/H = ang MIN AIR FLOW; ang constant = 32 % x min air flow = 128 T/H (sagot ng user 2026-10-10; mali ang v1.20.9).
- F(X) na ang X ay %: ang input ay % ng range ng source signal (MAN/AI range, ratio x 100); hindi hinuhulaan ang source na walang range = SCALE / NEEDS REVIEW (user 2026-10-10: "oo, ratio x 100").
- Live values: isang numero lang bawat label/circle; wala sa bare controller tag kung may ibang label ang net.
- LINEAR: `data/reference/LMYP-1_1-LINEAR.xls` (nasa repo). S1-LN15 / S1-LN21 = Y / 100 (H-33). S1-LN38 / S1-LN39 = DCS patterns mula sa screenshots ng user (`data/reference/`).
- SIG.AB: user-controlled, OFF default, walang bagong hold-last logic, zero ay hindi bad, **pairing by connection**; SEL na walang SIG.AB sa bawat input = hindi applicable (huwag hanapin).
- Walang value sa ALM at sa instrument tag ng transmitter; AI/SI address lang; analog wire na walang address = may value (Wire values, default ON).
- Hindi ite-test ang ABC-000 (legend). Valve / actuator stroke time = DEFAULT, editable (hindi na review item).
- Hindi pa gagawin: malaking independent Test Bench; side-by-side sheets / cosmetic UI (P4).
- Mga requirements file: `docs/requirements/`.

## 4. Susunod na gawin (hintayin ang "go" ng user para sa bagong version)
1. **Kunin ang resulta ng manual tests ng user** (MT-01..MT-14 sa `LogicSim_v1.20.10_Manual_Testing_Guide.pdf`; puwede niyang gamitin ang Audit button at i-export ang CSV). Ayusin ang FAIL.
2. **NEEDS REVIEW (hinihintay ang sagot ng user):** (a) 4 F(X) na hindi ma-scale: ABC-004A LN44 (SUB ng SI0202 / SI0203), ABC-008 LN13 (auto/manual selection), ABC-020 LN8 (DEV), ABC-034 LN21 (MUL): kailangan ang range ng input; (b) 2 digital gate symbol sa ABC-001D (AND o OR?); (c) HS/LS "ramp muna, hindi instant": kailangan ng halimbawang sheet / tag; (d) 4 AO (ABC-003A-D) at 8 FIELD na instant: rule ng ramp; (e) 5 RATE span (default muna); (f) ABC-020 LN5 (MAN 19~100 %) at ABC-003D LN21 (MAN 0.8~1.0752) ay hindi kumpirmado; (g) COS: kung ang "nawala sa taas" ay ang popover.
3. **Hindi pa nagawa:** resizable / dockable / pin na panel; toolbar dropdown grouping; range ng COS laban sa kinokontrol; range ng output ng ibang block; 83 COS ng ibang uri ay nasa test-cos lang; second pane ay panonood lang (Swap para mag-click).
4. Mga luma nang test failure (pareho sa v1.20.7-9, plant model / luma): pid "direct + negative plant", back-manual / modes "bad 1", numinput, ln (Save step), own (1), ui-real (4).
5. Bagong release: sundin ang `docs/RELEASE-PROTOCOL.md`.

## 5. Paano mag-test (lahat sa root ng repo)
- Engine (node): `node tools/test-blocks.js <html>`, `test-math`, `test-rate`, `test-comparators`, `test-switch`, `test-legend`, `test-loops`, `test-pidsign`, `test-runaway`, `test-links-all` (mabagal ang ilan; i-background).
- Bagong record tests (v1.20.8 / v1.20.9): `node tools/test-verify-fx.js <html> docs/TEST-RESULTS-FX`, pareho para sa `-sel`, `-rate`, `-not`, `-minair`, `-range`, `-final`; `python3 tools/test-verify-linear-xls.py <html> data/reference/LMYP-1_1-LINEAR.xls docs/TEST-RESULTS-LINEAR docs/TEST-RESULTS-FX.json` (kailangan ang `pip install xlrd`); UI: `node tools/test-ui-1.20.9.js`, `test-ui-1.20.8.js`, `test-ui-sigab.js`, `test-ui-minair.js`, `test-ui-hs.js`; audit: `node tools/audit-grey-analog.js <html>`.
- Browser tests gumagamit ng `/opt/node-tools/node_modules/playwright` (Chromium sa cloud). Larawan ng drawing: `node tools/shot-region.js <html> ABC-002 cx cy width out.png`, tapos Read ang png.
- **Alam na pre-existing / obsolete na pagkabigo (hindi bagong sira):** `test-own` (1 FAIL) at `test-ui-real` (4 FAIL) ay pareho sa v1.20.7 (plant-model); `test-modes` "bad 1" at `test-numinput` "no INPUT box" ay pareho sa v1.20.7; `test-ln` ay bumabagsak sa Save step (inalis ang Save); `test-project`, `test-storage*`, `test-import` ay luma na dahil inalis ang Save/Open/Import UI.
- Mga gotcha: sa node test, huwag i-cache ang `rt.st[id]` (pinapalitan ang state objects); ang `AN.settle()` ay para sa kasalukuyang sheet lang (gamitin muna ang `AN.go(index)`); sa playwright, ang click sa panel ay minsan hinaharangan ng ibang div: gamitin ang `dispatchEvent('click')`.

## 6. Build / release (buod; buo sa docs/RELEASE-PROTOCOL.md)
Walang `gh` CLI; gamitin ang GitHub MCP tools. Workflow dispatch sa working branch, i-verify ang run + assets + SHA256, tapos ipadala sa chat ang PDF report at HTML. Ang workflow ay nag-a-attach ng `docs/LogicSim_vX.Y.Z_*.pdf`; ang PDF ay gawin muna at i-commit BAGO i-dispatch.

## 7. Mga file na mahalaga (kasama ang `.claude/` hooks)
`CLAUDE.md` (entry) - `DESIGN.md` (rules) - `docs/RELEASE-PROTOCOL.md` - `docs/REPORT-v1.20.9.md` (technical) - `docs/TEST-RESULTS-*.md/.json` (mga record) - `docs/FINDINGS.md` (H-48..H-57 ang bago) - `docs/DATA-FILES.md` (mga file ng user at saan ginagamit) - `docs/ASSUMED-VALUES.md` (lahat ng ASSUMED na numero) - `data/reference/` (LINEAR.xls) - `docs/requirements/` (requirements PDF + findings xlsx) - `tools/release-docs/` (generator ng report PDF).
