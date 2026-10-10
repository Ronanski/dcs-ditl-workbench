# HANDOVER - isang connect sa repo, alam na ang gagawin (huling update: v1.20.9, 2026-10-10)

## 0. Paste-in prompt para sa bagong session
```
Ituloy natin ang Logic Sim (repo ronanski/dcs-ditl-workbench, branch ccr-2c4847cc-9fe3px o main; tingnan ang docs/HANDOVER.md §1 kung may mas bago).
BASAHIN MUNA, sa ayos: CLAUDE.md -> docs/HANDOVER.md -> docs/RELEASE-PROTOCOL.md -> DESIGN.md -> PROJECT-NOTES-v1.20.9.md -> docs/REPORT-v1.20.9.md.
Sundin ang protocol ko: simpleng Taglish (80 % Tagalog), PASS / FAIL / NEEDS REVIEW / NOT TESTED, walang hula, ipadala sa chat ang PDF report at HTML, huwag galawin ang DITL, walang bagong release nang walang "go" ko.
Pagkabasa, ibuod sa 5 linya kung nasaan tayo at ano ang uunahin mo (HANDOVER §4), at magsimula.
```

## 1. Estado ngayon (v1.20.10 WIP, HINDI pa nire-release)
- **Latest RELEASE: v1.20.9** (GitHub Release `v1.20.9`, commit 21bb674, nasa branch `ccr-2c4847cc-9fe3px`; hindi pa naka-merge sa `main`; tanungin ang user). Sa root ngayon: `logic-sim-v1.20.10.html` = **work in progress**, hindi release. User: "No release. Fix first. Wait for my go signal."
- Build: `node tools/patch-1.20.10.js` (nagbabasa ng `archive/html/logic-sim-v1.20.9.html`; mga module `patch-1.20.10-fx.js`, `-dup.js`, `-minair.js`, `-xref.js`). DITL guard: patakbuhin ulit bago mag-release (`node tools/guard-ditl.js baseline/ditl-workbench-v1.0.0.html logic-sim-v1.20.10.html`; hindi pa nakumpirma sa session na ito).
- Natapos sa WIP (galing sa Batch 1 inspection ng user + LOGICSIM_EU_REPORT_FINDINGS.xlsx): (1) F(X) % table input = percent ng range ng source (H-58; sagot sa tanong: "oo, ratio x 100"); (2) min air flow = 32 % x min air flow (400 T/H default) = 128 T/H (H-59); (3) doble-doble na live values (H-60); (4) click-through ng "FROM/TO DITL xx", ABC-xxx (H-61, finding 18).
- Tests na pumasa sa WIP: test-fxscale 16/16, test-verify-fx 559 PASS + 14 NEEDS REVIEW, test-verify-minair 7 PASS, test-ui-minair, test-xref, engine tests (blocks, math, rate, comparators, switch, legend, loops, pidsign, runaway). **Hindi pa natapos / hindi pa nakita ang resulta:** buong browser regression (`/tmp` scratchpad reg.sh) - patakbuhin ulit lahat ng test sa listahan ng docs/REGRESSION-v1.20.9.txt laban sa v1.20.10.
- Awtomatikong handoff: `.claude/hooks/*` (briefing + stop check). Bago tapusin ang session: i-update ang §1 at §4, i-commit, i-push.

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

## 4. Susunod na gawin (hintayin ang "go" ng user para sa release)
1. Tapusin ang buong regression ng v1.20.10 (tingnan §1), i-record sa docs/REGRESSION-v1.20.10.txt; i-update ang test-ui / report kung kailangan; PROJECT-NOTES-v1.20.10.md at REPORT ay hindi pa nasusulat.
2. Hinihintay ang Batch 2 inspection ng user. NEEDS REVIEW: 5 F(X) na hindi ma-trace ang source range (ABC-004A #72 LN44, ABC-008 #29 LN13, ABC-020 #79 LN8, ABC-034 #13 LN21, ABC-051 #48 LN33); ABC-020 LN5 (MAN 19~100 %) at ABC-003D LN21 (MAN 0.8~1.0752) ay hindi kumpirmado; 5 RATE span (default muna).
3. Hindi pa nagawa mula sa xlsx findings: COS dikit sa T switch retest; range ng COS/MAN vs output; item 2 (kulay ng forced text), 6, 8, 15 (gradual final element) ay hindi nasuri sa session na ito; side-by-side sheets; Simulation Audit panel; wire-value layout audit sa lahat ng sheet.
4. Bagong release: sundin ang `docs/RELEASE-PROTOCOL.md`, kailangan ng "go" ng user; tanungin din kung i-merge sa main.

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
