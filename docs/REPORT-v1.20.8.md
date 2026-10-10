# REPORT v1.20.8 - requirements batch "LogicSim v1.20.7 Claude Requirements GROUPED" (2026-10-10)

Input from the user: the grouped requirements PDF (Groups A-F + section 9 UI scope + section 10 deliverable), the 20-finding xlsx (LOGICSIM_EU_REPORT_FINDINGS), LINEAR / Memory / IO list files (already embedded, see docs/DATA-FILES.md), logic-sim-v1.20.7.html.
Build: `node tools/patch-1.20.8.js` (from v1.20.7) -> `logic-sim-v1.20.8.html`. DITL guard: IDENTICAL.
Terminology: values in Simulation mode are simulation values (input value / converted value / output value), never "actual plant values".

## 1. What was changed (files / functions)
| File | Change | Why (requirement) |
|---|---|---|
| tools/patch-1.20.8.js | new patch script (v1.20.7 -> v1.20.8): title, toolbar, Ctrl+S, procPanel | Section 9 |
| tools/patch-fx-1.20.8.js | `anFXs()` (new, exported), engine `case 'FX'`, FX panel line, Health column, RATE `s.rev` flag | Group A, D |
| analog toolbar | REMOVED from the UI: Plant model, Plant (window), Save, Save as, Open, project label + file input, Import ABC DXF, Imports. Ctrl+S does nothing. The Process-model block of the PID panel is not shown. Code is kept, nothing reachable. Audit-report save/export is a separate future feature and is not touched. Dark theme + built-in LINEAR tables kept. | Section 9 |
| `anFXs(P,x)` -> {y,st} | st = OK / WARN (table chosen with a warning) / NOTABLE (no table: y = x only a placeholder) / OUT (input outside the domain of the table: end value held) / NAN. Stored in `S.rt.st[id].fxs`. Before: no table = silent y = x, outside the table = silent clamp. | Group A "no silent pass-through / no silent clamp" |
| FX block panel | red line "NEEDS REVIEW: ..." when st is NOTABLE / OUT / NAN or the table has a warning | Group A |
| Health table | new column "LINEAR / RATE review" (FX without table or chosen by warning, RATE / ramp with no rate) | Group A, D |
| RATE / RAMPB engine | `s.rev='NO RATE'` when the rate is missing / 0 and the block has no own limit inputs (value unchanged: the old behaviour was an instant step) | Group D |
| tools/test-verify-fx.js, -sel.js, -rate.js, -not.js, lib-records.js, test-ui-1.20.8.js | reusable tests with the record format of Group E | Group E |
| docs/TEST-RESULTS-{FX,SEL,RATE,NOT}.md / .json | test records (all non-PASS in the md, everything in the json) | section 10 |

## 2. Tests that were really run (v1.20.8 html, headless Chromium / node)
| Test | Result |
|---|---|
| guard-ditl | IDENTICAL |
| test-ui-1.20.8 (toolbar has none of the removed items, no file input, Ctrl+S inert, Health opens with the new column, no page error) | PASS |
| test-verify-fx: all 112 FX blocks / 54 sheets: low / midpoint / high of the table range, below / above the table domain, expected = independent interpolation of the original LINEAR.xls points; plus, where the FX input is a transmitter (6 FX): transmitter range = table x range, and the field value -> FX output through the drawn wiring | 574 records: 522 PASS, 52 NEEDS REVIEW, 0 FAIL |
| test-verify-sel: SIG.AB cases 1, 2, 3, 5 (+ case 4) on the 24 average-select circuits that have a SIG.AB flag on every input | 96 PASS, 24 NEEDS REVIEW (case 4, see below), 0 FAIL, 8 SEL NOT TESTED (no flag tied to every input by the reader) |
| test-verify-rate: ramp path vs bypass path, same input change, all RATE / RAMPB with main input | 47 PASS, 23 NEEDS REVIEW (unit of rate), 10 NOT TESTED (own-limit RATE x 7, simple ramps without bypass pin) , 0 FAIL |
| test-verify-not: NOT gate truth table on all 244 NOT gates (input forced, traced nets in the record) | 488 / 488 PASS |
| Regression (engine unchanged except FX / RATE flags): test-blocks 526/0 failures, test-math 998 checks 0 mismatches (ADD, SUB, MUL, DIV, SUM, DEV, LAG, limits...), test-rate 43/0, test-comparators 240/0, test-switch 210/0, test-legend (FF 282, TON 35, TOF 19, TPS 108) 0 mismatch, test-loops 68/68, test-pidsign 64/64, test-runaway 0 runaway on 51 sheets, test-links-all 183/183 carry the signal, test-paint (same output as v1.20.7) | PASS, identical to v1.20.7 |

NOT run in this batch: the complete browser suite of DESIGN.md section 3 (test-project, test-storage, test-numinput, test-hmi ...): the project / Save / Open / Import UI is removed on purpose, so those tests are obsolete until it comes back; the others were not re-run. exe / apk not built or run.

## 3. Confirmed bugs, unconfirmed symptoms, NEEDS REVIEW
### Confirmed (reproduced, fixed in v1.20.8)
1. FX with no table passed the value silently (y = x) and looked valid. (1 block: ABC-000 FX#20, legend sheet.) Now NOTABLE -> NEEDS REVIEW in panel + Health.
2. FX with an input outside the table domain held the end value silently. Now flagged OUT. (Domain of the tables already includes their own extension, e.g. -20 .. 120 % for % tables, so inside the allowed signal range it never triggers.)
3. A RATE / ramp with a missing or 0 rate would step instantly without a word. None exists in the 54 sheets today (0 found); the guard + Health count are in for imported / changed drawings.

### NOT bugs (checked, PASS)
- LINEAR conversion itself: every table of every FX block matches its LINEAR.xls points at low / mid / high, in both directions that exist (% -> eng. unit, eng. unit -> %, eng. -> eng.). Output of a ratio table (e.g. LN21 0.8 ~ 1.2) is the ratio, not a percent. ABC-002 LN29 (S1-LN29, % -> %, domain -20..120) PASS.
- The 6 FX that are fed directly by a transmitter use the same range as the table x range: no unit / percent mismatch there.
- NOT gate, math blocks, comparators, T-switch selection, FF / timers: no mismatch found.
- Average select circuit (SIG.AB): zero is NOT treated as bad (case 5 PASS); a bad flag excludes that input (cases 2, 3 PASS).
- Group B/D wiring tests: links 183/183 carry the signal.

### NEEDS REVIEW (cannot be decided from the drawing alone: user decision / reference needed)
| # | Item | What was seen | Question |
|---|---|---|---|
| R1 | 14 FX with empty x or y unit in the LINEAR header (ABC-057 x 13 "RANGE", ABC-052 LN11 "RANGE ") | numbers match the table, the unit is not in the file | which unit? |
| R2 | RATE / RAMPB written in "% / sec", "% / min", "% / Hr" (23 blocks) | the engine applies the number in SIGNAL UNITS. Correct only when the span of that signal is 100. Examples: ABC-032 "RAMP:1% / sec" (the flow around it is 0 ~ 200 T/H), ABC-001D FM403 "2.7T / HR = 2.25% / HR ( 0.045T / MIN )" - the drawing gives the absolute value 2.7 T/h = 0.00075 T/s, the engine uses 0.000625 | % of which span? For 001D the absolute T/HR value is probably the authority |
| R3 | SIG.AB case 4 (both transmitters bad) on 24 circuits | engine holds the last value; the drawing text does not define it | confirm "hold last" or give the drawing rule |
| R4 | 8 SEL without a SIG.AB flag tied to every input (ABC-010 x 2, ABC-000 x 2 ...) | NOT TESTED | check the wiring of the flags by eye |
| R5 | ABC-002 32 % minimum airflow constant (finding 11) | the drawing text "32%" at (474,358) is read as CONST#1 = 32 (unit %), feeding net 70. The value equals the drawing text. No second reference was provided to compare | give the reference (design / heat balance) if 32 % is doubted |
| R6 | ABC-020 RATE#91 rate 2 and ABC-009A/B screw-cooler rates 0.05 | no rate text found near the block: value is an ASSUMED default (docs/ASSUMED-VALUES.md) | confirm |

### Unconfirmed symptoms / not worked in this batch (honest list)
Group B: wire-geometry / net-label consistency review (the address table audit of v1.20.6 stands), unknown symbol / missing pin warnings on the drawing (Health still lists them, but they do not yet show on the drawing), high/low selector active-wire highlighting (finding 1/6), FROM DITL / ABC click-through retest (test-ditl-link 124/124 existed in v1.20.2, not re-run).
Group C: the per-transmitter simulation controls Normal / Bad Signal / Manual Test Value / Restore Normal and the forced/bad marker on the diagram are NOT built yet (SIG.AB flags already exist as manual inputs, that is what the SEL test used).
Group D: COS vs T-switch adjacency (finding 20) not retested by a new test (test-switch 210/0 passes on the existing ones); actuator command vs position (gradual stroke, finding 15) not retested; grey analog in Simulation mode (finding 13) not reproduced.
Group A: range clamping per signal (findings 4, 5, 17): not changed or retested in this batch; the MAN / COS input-range separation is open.
Optional (P4): side-by-side sheets, UI/UX items, global search, Simulation Audit panel (the test records of this batch are the data model for it: docs/TEST-RESULTS-*.json).

## 4. Remaining risks
- R2 can make ramps 1.2 x too slow / fast on sheets whose signal is not 0-100.
- The full DESIGN.md browser checklist was not re-run (see section 2).
- Nothing in this batch claims full validation of any ABC sheet: only FX (all 112), NOT (all 244), SEL/SIG.AB (24 of 32), RATE/ramp (50 of 60) were exercised by the new records; coverage of other blocks is by the older tests listed above.

## 5. How to re-run
`node tools/patch-1.20.8.js` then `node tools/test-verify-fx.js logic-sim-v1.20.8.html docs/TEST-RESULTS-FX` (same for -sel, -rate, -not), `node tools/test-ui-1.20.8.js logic-sim-v1.20.8.html`.
