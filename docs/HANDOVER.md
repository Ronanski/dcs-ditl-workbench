# HANDOVER - isang connect sa repo, alam na ang gagawin (huling update: v1.20.8, 2026-10-10)

## 0. Paste-in prompt para sa bagong session
```
Ituloy natin ang Logic Sim (repo ronanski/dcs-ditl-workbench, branch ccr-2c4847cc-9fe3px o main; tingnan ang docs/HANDOVER.md §1 kung may mas bago).
BASAHIN MUNA, sa ayos: CLAUDE.md -> docs/HANDOVER.md -> docs/RELEASE-PROTOCOL.md -> DESIGN.md -> PROJECT-NOTES-v1.20.9.md -> docs/REPORT-v1.20.9.md.
Sundin ang protocol ko: simpleng Taglish (80 % Tagalog), PASS / FAIL / NEEDS REVIEW / NOT TESTED, walang hula, ipadala sa chat ang PDF report at HTML, huwag galawin ang DITL, walang bagong release nang walang "go" ko.
Pagkabasa, ibuod sa 5 linya kung nasaan tayo at ano ang uunahin mo (HANDOVER §4), at magsimula.
```

## 1. Estado ngayon (v1.20.9)
- **Latest release: v1.20.9** (GitHub Release `v1.20.9`, 2026-10-10: html + exe + apk + manual pdf + `LogicSim_v1.20.9_Report.pdf` + `LogicSim_v1.20.9_Manual_Testing_Guide.pdf`). Ang v1.20.8 ay nasa `main` (PR #4, #5). Ang v1.20.9 ay nasa branch `ccr-2c4847cc-9fe3px` hanggang i-merge ng user (tanungin kung gusto niyang i-merge; ang permiso niya sa auto-merge ay "ngayon lang" noong 2026-10-10, hindi standing).
- Root: ISANG html lang, `logic-sim-v1.20.9.html`. Ang nakaraang html ay nasa `archive/html/`. Build = `node tools/patch-1.20.9.js` (nagbabasa ng `archive/html/logic-sim-v1.20.8.html`; mga module `tools/patch-1.20.9-display.js`, `patch-1.20.9-blocks.js`; LN38 / 39 mula sa `data/reference/DCS-Ptrn038-039-from-screenshot.json`). Para sa v1.20.10: ilipat ang root html sa archive/html, ang patch sa tools/history, gumawa ng bagong patch mula sa html na iyon.
- **DITL page ay hindi ginagalaw.** Guard: `node tools/guard-ditl.js baseline/ditl-workbench-v1.0.0.html logic-sim-v1.20.9.html` = IDENTICAL.
- **Awtomatikong handoff:** `.claude/settings.json` + `.claude/hooks/session-start.sh` (briefing + nire-record ang HEAD) at `.claude/hooks/stop-handoff-check.sh` (hinaharang ang pagtatapos kung may nagawa pero hindi na-update ang HANDOVER). Bago tapusin ang session: i-update ang §1 at §4, i-commit, i-push.
- Mga PDF ng release ay ginagawa ng `tools/release-docs/make-report-v1.20.9.py` at `make-guide-v1.20.9.py` (+ `html-to-pdf.js`); kopyahin para sa susunod na version at basahin ang `docs/TEST-RESULTS-*.json`. Ang workflow ay nag-a-attach ng `docs/LogicSim_vX.Y.Z_*.pdf` (gawin at i-commit muna ang PDF bago i-dispatch).

## 2. Ano ang nagawa sa v1.20.9 (buod; buo sa docs/REPORT-v1.20.9.md at sa PDF)
Mga ayos mula sa manual test ng user sa v1.20.8 (MT-01..08): forced AI value sa address; walang value sa ALM / instrument tag; typed value limitado sa range; SELECT CIRCUIT input wires may ilaw; ÷ symbol na nabasang minus (ABC-002 #44, ABC-008 #61); settings ng block hindi na nire-reset ng Reset (+ "Reset this block to default"); RATE na walang rate = 1; SIG.AB pairing by connection (198 / 198); min air flow = T/H setting ang signal; S1-LN38 / 39 = DCS patterns; HS / LS legs; **Wire values** at **Review marks** buttons.

## 3. Mga desisyon ng user (hindi na itatanong ulit)
- Terminology: simulation values (input / converted / output), hindi "actual plant values".
- % RATE: gamitin ang tunay na span ng signal; ABC-001D FM403 = 0.00075 T/s; ABC-032 "1%/sec" sa 0-200 T/H = 2 T/H/s. Ang 5 RATE na hindi makita ang span: **pinag-antay ng user, default muna** (ABC-007 RAMPB#18, ABC-057 RATE#67, ABC-001C RATE#47, ABC-002 RATE#75 / #76).
- RATE / ramp na walang nakasulat na rate: **1 bawat segundo**. Settings ng block = config (hindi binubura ng Reset).
- ABC-002 min air flow: editable, default 400 T/H; ang T/H setting ang signal (SI0036 ay T/H). **Nakabinbin ang tanong** kung ano ang ibig sabihin ng "32 % of min air flow".
- LINEAR: `data/reference/LMYP-1_1-LINEAR.xls` (nasa repo). S1-LN15 / S1-LN21 = Y / 100 (H-33). S1-LN38 / S1-LN39 = DCS patterns mula sa screenshots ng user (`data/reference/`).
- SIG.AB: user-controlled, OFF default, walang bagong hold-last logic, zero ay hindi bad, **pairing by connection**; SEL na walang SIG.AB sa bawat input = hindi applicable (huwag hanapin).
- Walang value sa ALM at sa instrument tag ng transmitter; AI/SI address lang; analog wire na walang address = may value (Wire values, default ON).
- Hindi ite-test ang ABC-000 (legend). Valve / actuator stroke time = DEFAULT, editable (hindi na review item).
- Hindi pa gagawin: malaking independent Test Bench; side-by-side sheets / cosmetic UI (P4).
- Mga requirements file: `docs/requirements/`.

## 4. Susunod na gawin (ayon sa prayoridad; hintayin ang "go" ng user para sa bagong version)
1. **Kunin ang resulta ng manual tests ng user** (MT-01..MT-12 sa `LogicSim_v1.20.9_Manual_Testing_Guide.pdf`). Ayusin ang FAIL; i-update ang report.
2. **Dalawang tanong na hinihintay ang sagot:** (a) F(X) % input: ang ratio 1.0 ba ay 100 % (ABC-002 LN29: input SI0049 = a / b, T-switch leg na "1.0 (100%)")? Kapag oo: ayusin ang input scaling ng lahat ng F(X) na ang table X ay % at ang input ay ratio, at i-test. (b) Ano ang base ng "32 % MIN. AIR FLOW".
3. **Hindi pa nagawa / hindi na-retest:** COS na dikit sa T switch (test-cos, test-switch lang); range ng COS / MAN setpoint laban sa output; wire geometry / net-label re-audit; Simulation Audit panel; side-by-side sheets; layout ng Wire values ay hindi na-audit sa lahat ng 54 sheet (ABC-002, 003B, 017 lang ang nakita).
4. Palawakin ang test coverage sheet-por-sheet (coverage table sa report §7). Huwag mag-claim ng full coverage.
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
`CLAUDE.md` (entry) - `DESIGN.md` (rules) - `docs/RELEASE-PROTOCOL.md` - `docs/REPORT-v1.20.8.md` (technical) - `docs/TEST-RESULTS-*.md/.json` (mga record) - `docs/FINDINGS.md` (H-43..H-47 ang bago) - `docs/DATA-FILES.md` (mga file ng user at saan ginagamit) - `docs/ASSUMED-VALUES.md` (lahat ng ASSUMED na numero) - `data/reference/` (LINEAR.xls) - `docs/requirements/` (requirements PDF + findings xlsx) - `tools/release-docs/` (generator ng report PDF).
