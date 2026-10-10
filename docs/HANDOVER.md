# HANDOVER - isang connect sa repo, alam na ang gagawin (huling update: v1.20.8, 2026-10-10)

## 0. Paste-in prompt para sa bagong session
```
Ituloy natin ang Logic Sim (repo ronanski/dcs-ditl-workbench, branch ccr-2c4847cc-9fe3px; tingnan ang docs/HANDOVER.md §1 kung may mas bago).
BASAHIN MUNA, sa ayos: CLAUDE.md -> docs/HANDOVER.md -> docs/RELEASE-PROTOCOL.md -> DESIGN.md -> PROJECT-NOTES-v1.20.8.md -> docs/REPORT-v1.20.8.md.
Sundin ang protocol ko: simpleng Taglish (80 % Tagalog), PASS / FAIL / NEEDS REVIEW / NOT TESTED, walang hula, ipadala sa chat ang PDF report at HTML, huwag galawin ang DITL, walang bagong release nang walang "go" ko.
Pagkabasa, ibuod sa 5 linya kung nasaan tayo at ano ang uunahin mo (HANDOVER §4), at magsimula.
```

## 1. Estado ngayon
- **Latest release: v1.20.8** (GitHub Release `v1.20.8`, 2026-10-10; html + exe + apk + manual pdf + `LogicSim_v1.20.8_Report.pdf` + `LogicSim_v1.20.8_Manual_Testing_Guide.pdf`). Code commit `301d88b`; huling commit sa branch ay docs / workflow / handover lang. Workflow runs: 25 (unang build) at 26 (nag-attach ng PDF; na-rebuild ang exe/apk, parehong code).
- **Working branch:** `ccr-2c4847cc-9fe3px` (galing sa `main` + v1.20.8 work). Ang `main` ay may v1.20.7. Walang PR na ginawa (hindi hiningi). Kapag na-merge na ang branch ng user sa main, i-restart ang branch mula sa main (tingnan ang cloud-session rules) bago magtrabaho.
- Ang root ay may ISANG html lang: `logic-sim-v1.20.8.html`. Ang nakaraang html ay nasa `archive/html/`. Build = `node tools/patch-1.20.8.js` (nagbabasa ng `archive/html/logic-sim-v1.20.7.html`, sumusulat ng root html) + `tools/patch-fx-1.20.8.js`. Para sa v1.20.9: kopyahin ang v1.20.8 patch scheme (patch script mula sa nakaraang html -> bagong html; ilipat ang lumang html sa archive/html at ang lumang patch sa tools/history).
- **DITL page ay hindi ginagalaw.** Guard: `node tools/guard-ditl.js baseline/ditl-workbench-v1.0.0.html logic-sim-v1.20.8.html` = IDENTICAL.

- **Awtomatikong handoff (2026-10-10):** `.claude/settings.json` + `.claude/hooks/session-start.sh` (briefing sa simula, nire-record ang HEAD) + `.claude/hooks/stop-handoff-check.sh` (hinaharang ang pagtatapos kung may nagawa pero hindi na-update ang HANDOVER). Bago tapusin ang bawat session: i-update ang §1 at §4 dito, i-commit, i-push. Kung hindi gumana ang hooks sa isang environment, gawin nang mano-mano.

## 2. Ano ang nagawa sa v1.20.8 (buod; buong detalye sa docs/REPORT-v1.20.8.md at ng PDF)
Inalis sa UI: Plant model, Plant window, Save / Save as / Open, Import DXF / Imports. LINEAR F(X) NEEDS REVIEW flags. % RATE / ramp -> engineering unit gamit ang span ng signal (14 blocks nagbago, 5 hindi malutas). ABC-002 minimum airflow editable (T/H, default 400, 32 % kept, conversion 0.08 %/T/H = NEEDS REVIEW). Bad Signal (SIG.AB) button OFF / FORCED BAD + marka sa diagram. High/Low selector: napiling wire lang ang naka-ilaw. LINEAR na-verify laban sa LINEAR.xls (376 PASS).

## 3. Mga desisyon ng user (hindi na itatanong ulit)
- Terminology: simulation values (input / converted / output), hindi "actual plant values".
- % RATE: gamitin ang tunay na span ng signal; ABC-001D FM403 = 0.00075 T/s; ABC-032 "1%/sec" sa 0-200 T/H = 2 T/H/s.
- ABC-002 minimum airflow: editable, default 400 T/H, huwag ipalagay na 32 % = 400 T/H palagi; ipakita ang orihinal.
- LINEAR: gamitin ang `data/reference/LMYP-1_1-LINEAR.xls` (nasa repo na; huwag hingin ulit). S1-LN15 / S1-LN21 = Y / 100 (H-33, dokumentado).
- SIG.AB: user-controlled, OFF default; walang bagong hold-last logic; zero ay hindi bad; simulation lang.
- Hindi pa gagawin: malaking independent Test Bench; side-by-side sheets / cosmetic UI (P4).
- Mga requirements file ng user: `docs/requirements/` (grouped PDF, findings xlsx).

## 4. Susunod na gawin (ayon sa prayoridad; hintayin ang "go" ng user para sa bagong version)
1. **Kunin ang resulta ng manual tests ng user** (MT-01..MT-08 sa Manual Testing Guide). Ayusin ang anumang FAIL; i-update ang report.
2. **NEEDS REVIEW na kailangan ng sagot ng user:** span ng 5 RATE (ABC-007 RAMPB#18, ABC-057 RATE#67, ABC-001C RATE#47 "18%/Hr", ABC-002 RATE#75 / #76); conversion ng ABC-002 min airflow; S1-LN38 / S1-LN39 (kailangan ang `Drum Level Calculation.xls`, wala sa repo); RATE na walang nakasulat na rate (ABC-004A #75, 004B/C #26, 009A/B, 020 #91) at stroke times ng valves (ASSUMED).
3. **Hindi pa nagawa / hindi na-retest (core ng requirements PDF):** COS na dikit sa T switch (finding 20); grey analog sa Simulation mode (13); range ng COS / MAN setpoint vs MV (4, 5, 17); wire geometry / net-label consistency at marker ng unknown symbol / missing pin sa mismong drawing (Group B); high/low selector test coverage (22 NOT TESTED); pagpares ng transmitter <-> SIG.AB flag ay "pinakamalapit na flag" (≤ 50 units), hindi pa na-audit (DESIGN rule 21); 8 SEL na walang flag sa bawat input; Normal / Manual Test Value / Restore controls; Simulation Audit panel (data model = `docs/TEST-RESULTS-*.json`).
4. Palawakin ang test coverage sheet-por-sheet (coverage table sa report §6 ang listahan; maraming sheet ang walang record sa ilang kategorya). Huwag mag-claim ng full coverage.
5. Bagong release: sundin ang `docs/RELEASE-PROTOCOL.md`.

## 5. Paano mag-test (lahat sa root ng repo)
- Engine (node): `node tools/test-blocks.js <html>`, `test-math`, `test-rate`, `test-comparators`, `test-switch`, `test-legend`, `test-loops`, `test-pidsign`, `test-runaway`, `test-links-all` (mabagal ang ilan; i-background).
- Bagong record tests (v1.20.8): `node tools/test-verify-fx.js <html> docs/TEST-RESULTS-FX`, pareho para sa `-sel`, `-rate`, `-not`, `-minair`, `-range`, `-final`; `python3 tools/test-verify-linear-xls.py <html> data/reference/LMYP-1_1-LINEAR.xls docs/TEST-RESULTS-LINEAR docs/TEST-RESULTS-FX.json` (kailangan ang `pip install xlrd`); UI: `node tools/test-ui-1.20.8.js`, `test-ui-sigab.js`, `test-ui-minair.js`, `test-ui-hs.js`.
- Browser tests gumagamit ng `/opt/node-tools/node_modules/playwright` (Chromium sa cloud). Larawan ng drawing: `node tools/shot-region.js <html> ABC-002 cx cy width out.png`, tapos Read ang png.
- **Alam na pre-existing / obsolete na pagkabigo (hindi bagong sira):** `test-own` (1 FAIL) at `test-ui-real` (4 FAIL) ay pareho sa v1.20.7 (plant-model); `test-modes` "bad 1" at `test-numinput` "no INPUT box" ay pareho sa v1.20.7; `test-ln` ay bumabagsak sa Save step (inalis ang Save); `test-project`, `test-storage*`, `test-import` ay luma na dahil inalis ang Save/Open/Import UI.
- Mga gotcha: sa node test, huwag i-cache ang `rt.st[id]` (pinapalitan ang state objects); ang `AN.settle()` ay para sa kasalukuyang sheet lang (gamitin muna ang `AN.go(index)`); sa playwright, ang click sa panel ay minsan hinaharangan ng ibang div: gamitin ang `dispatchEvent('click')`.

## 6. Build / release (buod; buo sa docs/RELEASE-PROTOCOL.md)
Walang `gh` CLI; gamitin ang GitHub MCP tools. Workflow dispatch sa working branch, i-verify ang run + assets + SHA256, tapos ipadala sa chat ang PDF report at HTML. Ang workflow ay nag-a-attach ng `docs/LogicSim_vX.Y.Z_*.pdf`; ang PDF ay gawin muna at i-commit BAGO i-dispatch.

## 7. Mga file na mahalaga (kasama ang `.claude/` hooks)
`CLAUDE.md` (entry) - `DESIGN.md` (rules) - `docs/RELEASE-PROTOCOL.md` - `docs/REPORT-v1.20.8.md` (technical) - `docs/TEST-RESULTS-*.md/.json` (mga record) - `docs/FINDINGS.md` (H-43..H-47 ang bago) - `docs/DATA-FILES.md` (mga file ng user at saan ginagamit) - `docs/ASSUMED-VALUES.md` (lahat ng ASSUMED na numero) - `data/reference/` (LINEAR.xls) - `docs/requirements/` (requirements PDF + findings xlsx) - `tools/release-docs/` (generator ng report PDF).
