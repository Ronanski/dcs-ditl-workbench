# REPORT v1.20.8 - requirements batch "LogicSim v1.20.7 Claude Requirements GROUPED" + decisions of 2026-10-10 (revision 2)

Inputs: grouped requirements PDF (Groups A-F, section 9 UI scope, section 10 deliverable), findings xlsx (20 findings), `LMYP-1 #1-LINEAR.xls`, Memory / IO list files (already in docs/DATA-FILES.md), logic-sim-v1.20.7.html.
User decisions applied in this revision: (1) RATE / ramp in % corrected with verified span; (2) ABC-002 minimum air flow editable, default 400 T/H; (3) LINEAR verified against the supplied LINEAR.xls; (4) SIG.AB Bad Signal = simple user control, OFF by default, no new hold-last logic.
Build: `node tools/patch-1.20.8.js` (from archive/html/logic-sim-v1.20.7.html, patch script tools/patch-1.20.8.js + tools/patch-fx-1.20.8.js) -> `logic-sim-v1.20.8.html`. DITL guard: IDENTICAL (135a852d87c5).
Terminology: values in Simulation mode are simulation values (input / converted / output value), never "actual plant values".

## 1. What was changed
| Area | Change | Where |
|---|---|---|
| UI scope (section 9) | removed from the toolbar: Plant model, Plant window, Save, Save as, Open, project label / file input, Import ABC DXF, Imports; Ctrl+S inert; PID "Process model" block hidden. Code kept, unreachable. Dark theme and built-in LINEAR tables kept. | patch-1.20.8.js |
| LINEAR FX (Group A) | `anFXs`: status OK / WARN / NOTABLE / OUT / NAN; red "NEEDS REVIEW" in the FX panel; Health column "LINEAR / RATE review". No silent y = x, no silent clamp. Tables unchanged (they were already equal to the reference, see 3.3). | patch-fx-1.20.8.js |
| RATE / RAMPB (Group D, decision 1) | % rates are converted to engineering units with the span of the signal: (a) the drawn range of the controller the ramp feeds (data path verified), else (b) the unambiguous instrument / FX-table / MAN range upstream. A rate written in engineering units is used as written (T / Sec, kg/cm2 / min, "2.7T / HR"). Unresolved span: old behaviour kept + NEEDS REVIEW. Missing / zero rate: flagged `NO RATE`. | anInit, model parse |
| ABC-002 min airflow (decision 2) | CONST "32% MIN. AIR FLOW": editable setting in T/H (default 400), conversion % per T/H (default 0.08 = 32/400, shown, NEEDS REVIEW), original 32 % kept and shown, "Back to the drawing value" button; saved with the sheet. | CONST engine + panel |
| Bad Signal (decision 4) | SIG.AB flag control labelled "Bad Signal: OFF / FORCED BAD (ON)", OFF by default, per transmitter, in the SIG.AB list and in the transmitter's own panel; red "FORCED BAD" mark above the transmitter on the diagram. Existing logic (SEL, T switches, comparators) reacts; nothing new added to it. Simulation only. | panel + `badMarks()` |
| High / low selector (findings 1, 6) | HS / LS: only the selected input wire is lit, the other is dimmed like an unselected T leg (`anHL`, `anDead`). | patch-fx-1.20.8.js |
| Tests / records | tools/test-verify-{fx,sel,rate,not,minair,range,final}.js, test-verify-linear-xls.py, test-ui-{1.20.8,sigab,minair,hs}.js, lib-records.js; results in docs/TEST-RESULTS-*.md / .json | tools/, docs/ |

## 2. Decisions applied - how each was verified
### 2.1 RATE / ramp (decision 1)
Changed blocks (rate per second, old -> new, source of the span). All other RATE / RAMPB blocks are unchanged.
| Sheet | Block | Written | Old (units/s) | New (units/s) | Span used / source |
|---|---|---|---|---|---|
| ABC-001D | RATE#3 FM403 | 2.7T / HR = 2.25% / HR | 0.000625 | **0.00075** | absolute 2.7 T/HR from the drawing (= 0.045 T/MIN; implies 120 T/H span) |
| ABC-001D | RATE#4 | 1.8T / HR = 1.5% / HR | 0.000417 | **0.0005** | absolute 1.8 T/HR (same 120 T/H span) |
| ABC-032 | RAMPB#13 | 1% / sec | 1 | **2** | 0 ~ 200 T/H = drawn range of PID#0 (user-confirmed); an AI of 0 ~ 400 T/H upstream is NOT used |
| ABC-003A / B / C / D | RAMPB#32 / #30 | 1% / sec | 1 | 0.65 | PID drawn range 0 ~ 65 T/H (upstream MAN -10 ~ 10 is a bias, not used) |
| ABC-004A | RAMPB#35 | 1% / sec | 1 | 1.2 | PID 0 ~ 120 T/H |
| ABC-007 | RAMPB#17 | 0.05% / sec | 0.05 | 0.324 | PID 0 ~ 648 T/H |
| ABC-019 | RAMPB#17 | 1% / sec | 1 | 6 | PID 0 ~ 600 degC |
| ABC-020 | RAMPB#52 | 1% / min | 0.01667 | 0.1 | PID 0 ~ 600 degC |
| ABC-034 | RATE#26 | 1% / min | 0.01667 | 0.1 | instrument AI#16 0 ~ 600 degC |
| ABC-050 | RAMPB#23 | 1% / sec | 1 | 1.5 | PID 0 ~ 150 kg/cm2 (agrees with the 2 upstream AI) |
| ABC-051 | RAMPB#24 | 1.67% / min | 0.02783 | 0.01392 | instrument AI#13 0 ~ 50 kg/cm2 |
| ABC-052 | RAMPB#14 | 1% / sec | 1 | 0.5 | PID 0 ~ 50 kg/cm2 (upstream AIs 0 ~ 150 not used) |
| ABC-053 | RAMPB#15 | 0.5% / sec | 0.5 | 0.5 | PID 0 ~ 100 degC (unchanged value) |
| ABC-002 | RAMPB#27 | 1% / sec | 1 | 0.25 | PID 0 ~ 25 % (upstream MAN -4 ~ 4 bias not used) |
Unchanged because the span could not be found (old behaviour kept, NEEDS REVIEW): ABC-007 RAMPB#18, ABC-057 RATE#67, ABC-001C RATE#47 ("18% / Hr ( 0.005% / sec )"), ABC-002 RATE#75 / #76. ABC-050 RATE#83 (5% / sec on a PID output 0 ~ 100) = 5 (unchanged). Own-limit RATE blocks (ABC-003E x 4, ABC-052 #87, ABC-001B #13) are not touched.
Limitation of the method: the span of a ramp that feeds a controller is the controller's drawn range; a ramp that does not feed a controller uses the upstream instrument range only when it is unambiguous. This is a verified-by-data-path rule, not a copy of a DCS database value: the user should spot-check the table above.
### 2.2 ABC-002 minimum air flow
Drawing: `32%` constant "MIN. AIR FLOW" -> HIGH selector with SI0021 -> SI0036 "TAF DEMAND" (%). The setting is now T/H (default 400). The drawing's own SCALE CONVERT 35 / 1115 (= 0.0314 % per T/H) does not give 32 % for 400 T/H, so the conversion is NOT claimed: it starts at 0.08 so that the default equals the drawing value, is displayed, editable and flagged NEEDS REVIEW. Original 32 % is kept (`P.orig`, shown). Change 400 -> 500 T/H moves the high-selector output 32 -> 40 % and the downstream SUM by +8 (tools/test-verify-minair.js, 7 PASS, 1 NEEDS REVIEW = the conversion; tools/test-ui-minair.js 9 PASS incl. reload persistence).
### 2.3 LINEAR vs the supplied LINEAR.xls (decision 3)
tools/test-verify-linear-xls.py reads the supplied xls (90 sheets: DATA + 89 tables) independently: every table's X / Y points, X / Y ranges, LX / LY (normalised) against the table embedded in the app, and the table used by each of the 112 FX blocks against the drawing number (DWG No.) of the xls table. Result: 376 PASS, 4 NEEDS REVIEW, 0 FAIL.
- Documented exception (H-33, user 2026-10-08): S1-LN15 and S1-LN21 are 80 ~ 120 (percent, range 0 ~ 100) in the file; the drawing writes the ratio 0.8 ~ 1.2 and the LY column of the same file is 0.8 ~ 1.2, so the app uses Y / 100. The test checks exactly this transform.
- NEEDS REVIEW: S1-LN38 / S1-LN39 (ABC-010 drum level compensation) are not in LINEAR.xls (the file has S2-LN38 / S2-LN39 only). The app uses the curves of `Drum Level Calculation.xls` (F4(p) / F3(p), 19 points, tools/data/drum-level-ln.json). That file was not part of this session's uploads, so these two tables were NOT re-verified here; what is missing to close it: that xls (or confirmation).
- The conversion of every FX block (all 112, low / mid / high, below / above the table domain) equals independent interpolation of the table points: 522 PASS, 52 NEEDS REVIEW (14 blocks with an empty unit in the xls header: ABC-057 x 13, ABC-052 LN11; ABC-000 legend FX with no table), 0 FAIL. The 6 FX fed directly by a transmitter: instrument range = table x range and field value -> FX output through the drawn wiring PASS.
### 2.4 Bad Signal (SIG.AB)
tools/test-ui-sigab.js (real UI, ABC-002): OFF by default, force ON sets the flag, diagram shows FORCED BAD, panel shows FORCED BAD, restore clears flag and mark, zero reading does not set Bad Signal: 10 / 10 PASS.
tools/test-verify-sel.js (24 average-select circuits with a flag on every input): normal / normal, primary bad, secondary bad, both bad, valid zero (primary = 0 with secondary 60 -> 30, not excluded): 120 PASS, 0 FAIL. Both bad: the EXISTING SEL logic holds the last value (not added by this batch; reported, not extended). 8 SEL have no SIG.AB flag tied to every input by the reader = NOT TESTED.
Limitation: the pairing transmitter <-> SIG.AB flag is the existing nearest-flag rule of the reader (<= 50 units); a wrong pairing would show the FORCED BAD mark on the wrong transmitter (not audited in this batch).

## 3. Test results (v1.20.8 html)
| Test | Result |
|---|---|
| guard-ditl | IDENTICAL |
| test-ui-1.20.8 (toolbar items gone, no file input, Ctrl+S inert, Health column, no page error) | PASS |
| test-verify-fx (112 FX blocks) | 574 records: 522 PASS, 52 NEEDS REVIEW, 0 FAIL |
| test-verify-linear-xls.py (89 tables vs supplied xls + FX -> table) | 376 PASS, 4 NEEDS REVIEW, 0 FAIL |
| test-verify-rate (RATE / RAMPB: unit conversion, instrument-tag input, gradual response (1 s vs 0.25 s steps), bypass) | 154 records: 105 PASS, 19 NEEDS REVIEW, 30 NOT TESTED, 0 FAIL |
| test-verify-minair + test-ui-minair | 7 PASS + 1 NEEDS REVIEW; 9 / 9 PASS |
| test-verify-sel (SIG.AB cases) + test-ui-sigab | 120 PASS, 8 NOT TESTED; 10 / 10 PASS |
| test-verify-not (244 NOT gates) | 488 / 488 PASS |
| test-verify-final (81 VLV / ACT: command instant, position gradual) | 81 PASS (strokes are the block defaults 20 s / 30 s = ASSUMED, not drawn) |
| test-verify-range (MAN clamp at drawn range, AI) | 212 PASS, 155 NEEDS REVIEW (MAN with track / preset pins override the typed value; AI is limited by the UI box, not by the engine), 1 NOT TESTED, 0 FAIL |
| test-ui-hs (HS / LS: only the selected wire lit) | 4 PASS (2 selectors), 22 NOT TESTED (the selector is idle in the default T / AMT state or shares its input wires), 0 FAIL |
Regression on the frozen final build (engine, node): test-blocks 526 / 0 failures; test-math 998 checks / 0 mismatches; test-rate 43 / 0; test-comparators 240 / 0; test-switch 210 / 0; test-legend (FF 282, TON 35, TOF 19, TPS 108) 0 mismatch; test-loops 68 / 68; test-pidsign 64 / 64; test-runaway 0 runaway on 51 sheets; test-links-all 183 / 183.
Regression (browser, 25 existing tests run on the final build): 22 PASS (circles, anim, ditl-link, ditl-signals, trace-x, path, defaults-ui, badges, cos, fixes, addr-ui, hmi, hmi2, force-all, lock-all, blocks-ui, links, ades, back-manual, drum, pid, pid-all). 3 non-zero:
- test-ln: every step passes up to the project Save step, which fails because Save was removed on purpose (obsolete).
- test-own (1 FAIL "Auto page plant-value widget") and test-ui-real (4 FAIL, plant slider / HMI click): IDENTICAL failures on v1.20.7 (checked), plant-model related, not caused by this batch.
- test-modes "bad 1" and test-numinput "no INPUT box" are identical on v1.20.7 (pre-existing).
Not run: test-project, test-storage, test-storage2, test-import, test-trend (Save / Open / Import UI removed or not re-run).

## 4. Confirmed bugs, NEEDS REVIEW, NOT TESTED, limitations
Confirmed and fixed: H-43 (silent y = x / clamp), H-44 (% rates in signal units, 14 blocks changed), HS / LS lit both inputs, ABC-002 constant not editable, Bad Signal had no label / mark.
NEEDS REVIEW (user input needed): 5 RATE / RAMPB without a resolvable span (2.1); ABC-002 conversion 0.08 % per T/H (2.2); S1-LN38 / S1-LN39 source file (2.3); 14 FX with an empty unit in the xls; RATE blocks with no rate text (ABC-004A #75, 004B / C #26, 009A / B screw coolers 0.05, ABC-020 #91 = 2): ASSUMED defaults listed in docs/ASSUMED-VALUES.md; the 6 field-input RATE (004B / C, 009B, 020) whose input does not follow a single field value in the default switch state.
NOT TESTED / NOT DONE in this batch (core items of the PDF that remain open): Group B wire-geometry / net-label consistency re-audit and unknown-symbol / missing-pin markers on the drawing (Health lists them only); COS vs T-switch adjacency retest (finding 20; test-switch 210 / 0 on the existing cases); grey analog signals in Simulation mode (finding 13) not reproduced; per-signal range enforcement of COS / MAN setpoint vs MV (findings 4, 5, 17): only the MAN clamp and the existing UI boxes were exercised; Normal / Manual Test Value / Restore controls beyond Bad Signal; Simulation Audit panel (the JSON records are the data model); side-by-side sheets and other optional UI. The 54 sheets were NOT fully validated: only the blocks listed above were exercised.

## 5. Build / release
Branch `ccr-2c4847cc-9fe3px`, built commit `301d88b` (docs-only commits after it do not change the html). Workflow "Release (exe + apk + html)" run 25 (workflow_dispatch), https://github.com/Ronanski/dcs-ditl-workbench/actions/runs/38040999536 : jobs version / apk / exe / release all `success`.
Release v1.20.8 (published, checked through the GitHub API): https://github.com/Ronanski/dcs-ditl-workbench/releases/tag/v1.20.8
- logic-sim-v1.20.8.html (3,588,055 bytes, equals the committed file) - https://github.com/Ronanski/dcs-ditl-workbench/releases/download/v1.20.8/logic-sim-v1.20.8.html
- logic-sim-v1.20.8-portable.exe (76,676,268 bytes) - .../download/v1.20.8/logic-sim-v1.20.8-portable.exe
- logic-sim-v1.20.8.apk (5,416,655 bytes) - .../download/v1.20.8/logic-sim-v1.20.8.apk
- logic-sim-v1.20.8-manual.pdf
NOT verified: the exe and apk were built by the workflow but never installed or run by Claude (only the html was tested). The manual PDF was rebuilt from docs/MANUAL.md.
