# REPORT v1.20.9 (technical) - fixes after the user's manual tests of v1.20.8 (2026-10-10)

Simple-Taglish report for the user: `docs/LogicSim_v1.20.9_Report.pdf` (+ `LogicSim_v1.20.9_Manual_Testing_Guide.pdf`). This file is the technical record.
Build: `node tools/patch-1.20.9.js` (reads archive/html/logic-sim-v1.20.8.html; modules `patch-1.20.9-display.js`, `patch-1.20.9-blocks.js`; writes logic-sim-v1.20.9.html). DITL guard IDENTICAL (135a852d87c5).

## 1. The user's manual test of v1.20.8 -> what was done
| User finding | Root cause (verified) | Change | Status |
|---|---|---|---|
| MT-02 value typed on an AI (FORCE on its OUT net) updated the ALM, not the AI address | address badge of an AI read `st.act`, not the net (a forced net: `v[n]=F[n]` after the block) | forced net shows the net value | fixed, test-ui-1.20.9 |
| value beside the ALM and beside the instrument tag unnecessary | rows "tag of a block" (inside ALM) and "transmitter / instrument tag -> AI block" got a badge; ALM output stub is a wire value | no badge for those rows; ALM added to the pass-through list (no wire value on ALM wires) | fixed |
| typed values beyond the range (slider right) | FORCE box and field-input `setE` had no clamp (AI row, MAN, COS already clamp) | `anNetRange` (AI range text, MAN, PID output) / `anExtRange` (range text near the wire) + `anClamp`; message | fixed for nets with a written range; nets without one are not limited |
| MT-03 path to the SELECT CIRCUIT grey (signal arrives) | the wire that leaves the SIG.AB junction is classed DIGITAL (flag net, H-31); the engine maps the SEL pin to the AI net (`anSelIn`) but the wire kept the flag colour | `S.selw[flagNet] = AI net`; paint: analog colour, grey only when the flag (BAD) is 1 | fixed. "Other blocks, same scenario": `tools/audit-grey-analog.js`: 1571 analog nets with a value, 296 dimmed: 169 unselected T leg + 127 "nobody downstream follows it"; 0 unexplained |
| MT-04 output stays 23 / grey / no values | SI0036 TAF DEMAND is in T/H (446 T/H), the old signal was 32 (%); output wire of a constant had no value (constants were in the skip list) | the T/H setting IS the signal (default 400); constants show values; Wire values back | fixed; the meaning of "32 %" is a QUESTION (below) |
| MT-05 "may mali ata sa division" | the division symbol (bar + two tiny CIRCLES r 0.31) was read as SUB (b - a): ABC-002 #44 (SI0049), ABC-008 #61 | tiny circles count as dots; a / b by the pin labels a / b | fixed, test-math DIV 36 -> 42 checks |
| Known 2 RATE without rate = 1; Reset returns the settings to default | `reset()` wiped AN.sv and restored p0 | settings kept; per-block "Reset this block to default"; RATE / ramp without a written rate = 1 / s | fixed |
| Known 4 DCS patterns 038 / 039 (screenshots) | the app used the 19-point Drum Level curve | the 16 points LX / LY of the DCS (data/reference/DCS-Ptrn038-039-from-screenshot.json + the two png) | fixed; differences old vs DCS: 0 to 139 kg/cm2 <= 0.01; 139 -> 219: up to 1.2 % (LN38), 2.5 % (LN39) |
| Known 5 header unit empty | informational only | no flag | closed |
| Known 7 the 8 SEL | no SIG.AB on every input = no Bad Signal exists | NOT APPLICABLE (not NOT TESTED): ABC-010 #32 #62, ABC-000 #11 #12, ABC-050 #39 #40, ABC-052 #12, ABC-001C #19 | closed |
| Known 8 pairing by connection, not by 50 units | `anInit` and `anSelIn` used the nearest within 50 / 60 units | AI <-> SIGAB: the AI whose output net is a pin net of the SIG.AB box or the trunk wire of the box; SEL input: same; unpaired = flagged | fixed: 198 / 198 paired (180 identical to the distance rule, 18 that the distance rule missed, 0 conflicts) |
| Known 9 valve stroke times | default (VLV 20 s, ACT 30 s) | stays DEFAULT, editable, Reset to default; no longer a review item | closed |
| Known 11 / HS tests | 22 NOT TESTED: shared input wires and idle selectors | HS / LS legs dimmed per input pin (also on a shared wire); the tool finds the single T / AMT click that makes the selector live | 18 / 18 selectors, 36 / 36 cases PASS |
| Group B: show unresolved things on the drawing | Health listed counts only | "Review marks" on the drawing (unknown shape `?`, missing pin `pin?`, F(X) `no table`, RATE `span?`), button, default ON | done |
| Rule 6-8 of the user's findings: values on wires without address | removed in v1.20.5 | "Wire values" back, default ON, only analog wires without an address | done |

## 2. QUESTIONS that block a decision (no guess made)
1. **F(X) input scaling (ABC-002 LN29 and similar).** LN29 (S1-LN29) has X RANGE (%) 0 ~ 100. Its input SI0049 is a / b (ratio ~ 1.0) and the other leg of the T switch is a constant written "1.0 (100%)" on the drawing. The engine feeds 1.0 into the table as 1 % (output 0). If 1.0 means 100 % the input must be x 100 (and the output of a ratio table / 100). Needs the user's answer; the same question applies to every F(X) whose table X is in % and whose input is a ratio.
2. **"32 % MIN. AIR FLOW".** SI0036 TAF DEMAND is 446 T/H; the constant therefore must be T/H. The editable T/H setting (default 400) is the signal; 32 % is kept only for comparison (400 T/H would imply a full scale of 1250 T/H). If the user means 32 % of another number, that number is the base.

## 3. Tests (v1.20.9 html)
| Test | Result |
|---|---|
| guard-ditl | IDENTICAL |
| test-verify-fx (112 FX, ABC-000 excluded by the user) | 573 PASS |
| test-verify-linear-xls.py (89 tables vs LINEAR.xls + S1-LN38 / 39 vs the DCS screenshots + FX -> table) | 380 PASS |
| test-verify-sel (24 SEL, cases normal / primary bad / secondary bad / both bad (existing logic: hold last) / zero is valid) | 120 PASS (8 SEL not applicable) |
| test-verify-rate | 113 PASS, 11 NEEDS REVIEW (5 spans deferred by the user + 6 field-input paths), 30 NOT TESTED (own-limit RATE and simple ramps) |
| test-verify-not (244 NOT) | 488 PASS |
| test-verify-final (81 VLV / ACT) | 81 PASS (stroke = default) |
| test-verify-range (MAN clamp, AI) | 212 PASS, 155 NEEDS REVIEW (MAN with track / preset pins override the typed value; AI limited by the UI), 1 NOT TESTED |
| test-verify-minair | 6 PASS, 1 NEEDS REVIEW (the meaning of 32 %) |
| test-ui-hs | 36 PASS (18 selectors) |
| test-ui-1.20.9 / test-ui-sigab / test-ui-minair / test-ui-1.20.8 | see docs/TEST-RESULTS-UI-1.20.9.txt |
| audit-grey-analog | 0 unexplained grey analog nets |
| regression (engine) | see docs/REGRESSION-v1.20.9.txt |

## 4. Limitations / not done
Group B wire-geometry / net-label re-audit; COS next to a T switch (only test-cos, test-switch); range of COS / MAN setpoint vs output (only the existing clamps); Simulation Audit panel; side-by-side sheets; the user's rule 5 "output of a final element with a signal out must be in sync" not re-audited; coverage per sheet in the PDF report section 7 is the honest list. Wire-value placement uses the older placement code (overlap-aware, not re-audited on all 54 sheets: visual check on ABC-002 and ABC-003B only).
