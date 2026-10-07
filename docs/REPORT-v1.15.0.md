# REPORT v1.15.0 — findings, actions done, as left (2026-10-07) — documentation revision 1 — RELEASED

Built from `logic-sim-v1.14.3.html` by `tools/patch-1.15.1.js` (= `patch-blocks.js` + `patch-defaults.js` + `patch-signals.js` + `patch-selector.js`; data in `tools/assumed-data.js` and `tools/data/`). The DITL page is byte-identical to the baseline (`tools/guard-ditl.js` → IDENTICAL; the guard now also ignores the LN tables `<script id="aln">`, which are analog data like the sheets and the descriptions).

## 1. What the user asked → what was done → as left
| # | Request (2026-10-07) | Done | As left |
|---|---|---|---|
| 0 | Compensation file: record it in the docs and the app so it is never asked again | 8 TP blocks read the operating temperature of their flow from the file; docs/DATA-FILES.md describes the file (and all other files of the zip); app: block panel text + button **Assumed values** | **Done.** Only temperature compensation exists in the file (pressure columns = 0). at / bt of the file agree with the operating temperatures (8 of 8) |
| 1 | ALM limits HH / H / L / LL: assistant sets them for a 150 MW CFB with reheat | 104 alarms have limits (`tools/assumed-data.js`), listed with the reason in docs/ASSUMED-VALUES.md section 4, shown in the panel as "ASSUMED DEFAULT", editable | **ASSUMED, not the DCS values.** Replace by the DCS analog database when available |
| 2 | Realistic rates for the ramp boxes with no number | 8 boxes (the user said 9; the 9th, ABC-034 "1% / min", does have its number and is read; ABC-052 is ignored by the user; the 4 limiters of ABC-003E take their limits from inputs) | **ASSUMED**: 1 T/H per s for coal feeders 004A / B / C (the sister box of the same loop says "(1T / Sec)"), 1 % per s for the bottom ash screw coolers 009A ×3 / 009B, 2 % per s for the flue gas damper ABC-020 |
| 3 | PIDV / PO pulse cycle: assistant decides | PO now gives real pulses: cycle 2 s, full stroke 60 s, shortest pulse 0.2 s (position model), editable | **ASSUMED.** PIDV itself still runs as the velocity-form PID (as before) |
| 4 | Every value put in must be recorded and appear in the documentation | `tools/assumed-data.js` (single source) → `docs/ASSUMED-VALUES.md` (generated) → button **Assumed values** + block panels; DESIGN.md rule 14 | **Done** |
| 5 | All findings and corrections visible and tabulated; document the files sent | docs/FINDINGS.md (sections A, G, H, I, B, C, F), this report, docs/DATA-FILES.md | **Done** |
| 6 | All analog and digital signals reach their destination; all symbols work; lit when they should be, grey when they should be; energize / de-energize correct — ALL sheets | See sections 3 – 5: dead-end audit on all 51 sheets (227 → 0), every link carries its value, paint test (5 865 digital wire states = 51 sheets × 3 input patterns: lit only when the value is 1), legend truth tables, 36 more AND gates, 44 AI pins, 4-way selectors | **Done for what can be tested without the real plant** (section 6 lists what is NOT) |
| 7 | Report before "go" | This report + the tables in the chat | **Done: go received, released as v1.15.0** |

## 2. Numbers that are not on the drawings (details: docs/ASSUMED-VALUES.md)
| Kind | Count | Status | Where |
|---|---|---|---|
| TP operating temperature | 8 | FILE (Compensation) | 302 °C (4 burner flows) · 35 °C (SAF, PAF inlet) · 91 °C (FA blower) · 287 °C (primary air) |
| S1-LN38 / S1-LN39 (ABC-010 drum level) | 2 tables, 19 points | FILE (Drum Level Calculation), units deduced | LN38 y = N × 100 %, LN39 y = K (ratio): level out = level in at 0 kg/cm2 (identity), 300 mm → 531 mm at 145 kg/cm2 |
| ALM limits | 104 alarms | ASSUMED | by tag class: furnace bed 960 / 1020 °C (H / HH), drum level ±75 / ±150 mm, drum pressure 158 / 168, main steam 550 / 560 °C, reheat, air flows, heaters ±100 / ±200 mm … |
| Ramp rates | 8 | ASSUMED | 1, 1, 1 T/H per s · 1, 1, 1, 1 % per s · 2 % per s |
| PO pulse | 1 set (3 PO) | ASSUMED | 2 s cycle · 60 s stroke · 0.2 s shortest pulse |

## 3. Findings, actions, as left (IDs are those of docs/FINDINGS.md)
### 3.1 Signals that did not reach their destination (section H — new this round)
| ID | Finding | Action | As left |
|---|---|---|---|
| H-01 | 44 AI boxes with the triangle pointing UP had in / out swapped (ABC-015 ×12, 016 ×10, 020 ×8, 008 ×3, 007 ×2, 014 ×2, 003A / B / C / D, 030, 050, 052): the value never left the AI | OUT = pin at the apex | fixed, 0 AI dead ends |
| H-02 | 22 position-feedback AIs duplicated by the AI of the same tag that feeds the MAN PV (ABC-015, 016): the loop never saw the valve | the free twin follows the feedback AI | fixed |
| H-03 | **36 AND gates not read** (prongs on layer 0 / DCS-LP): ABC-003E 8, 009A 11, 009B 4, 004A 5, 004B 2, 004C 2, 001D 2, 001C 1, 020 1 | prongs / closing line accepted on all gate layers; closing line must lie between the prongs | fixed; truth tables 282 / 282 still pass |
| H-04 | Pulse timer written "TP" (ABC-004A TR16) not a timer | label accepted | fixed |
| H-05 / H-06 | ABC-005 OR M.0148 (168 long bar, circle r 6.8) not a gate | limits raised (bar 200, r 7.2) | fixed |
| H-07 | AI → junction → comparator + SIG.AB: the SIG.AB rule cut both sides (ABC-007 AI0192, ABC-020 8 AIs) | cut only the SIG.AB side | fixed (9 nets merged) |
| H-08 | Large timer D (ABC-001D TOF TR221): label 15.9 away, search radius 14.9 | radius ≥ r + 10 | fixed |
| H-09 | Contact glyph with control arrow 0.6 from the axis (ABC-055 M.000A BU-CMD) | arrow window 5.8 | fixed |
| H-10 | 45 chained touching circles (fan-out) read as receivers: 003A "12" never reached 003B / C / D; ABC-027 "A" unpaired | touching circle with the same wire / number = sender | fixed |
| H-11 | ABC-003E CMPK set point "3%" looked like an orphan | it is a text constant (already read) | explained (O-03 closed) |
| H-12 | Arrow glyph in a gap of a straight wire split the wire (ABC-001C "MW" row: unit MW never left the sheet; 009A / B) | collinear pieces joined | fixed |
| H-13 | Junction dots drawn as circles on layer MEM (001A / B / D: 26 nets) | small circles on MEM are dots | fixed (001D inputs 15 → 5) |
| H-14 | A receiving wire typed digital although the sender is analog (ABC-052 SW#13 ← LPB) | receiver takes the sender's type | fixed |
| G-10 | 4-way selector tables "(1) IF … ( M.021A ) SELECT to "a" …" ignored (ABC-009A, 003E) | condition inputs in the panel, first true wins | done (14 checks) |

Remaining dead-end wires (all looked at on the drawing, 0 unexplained): 231 outputs of terminal blocks (AO / ALM / MAN / PO …), 27 AI wires that feed only their SIG.AB box, 91 "TO DITL" exits, 10 annunciator / "TO TCS" texts, 5 memory-bit exits, 6 instruction contacts, 30 duplicate PID pins, 4 stubs inside blocks (docs/FINDINGS.md H2).

### 3.2 Reading and function fixes of this WIP (sections A and G, found in the previous rounds, not yet released)
F-01 MUL gain constants · F-02 SUB signs · F-03 LAG time left of the box (5 blocks) · F-04 TPS 300 s · F-05 RATE LIMITER "V⟩" symbol (3 blocks, was a high limit) · F-06 grey blocks not recognised (7) · F-07 rates per minute / hour · F-08 / F-09 / F-10 OR / AND gates on other layers or with bars > 130 (13 gates) · F-11 FROM text 70 units away (ABC-004A circles 6 / 8 / 9) · F-12 motor "M" circle · G-01 SUMA / SUMP integrators · G-03 SEL modes PRI / SEC / AVG · G-04 DIV / SQRT invalid conditions · G-05 TP · G-06 PO · G-07 instructions "IF M = 1 SET SIxxxx => TAG.SV" (7) and "SET SI0200 => AB0117" · G-08 circle click walks all ends · G-09 998 math checks. As left: all fixed in the WIP, tests below.

### 3.3 Checks against the user's own files (section I)
| ID | Check | Result |
|---|---|---|
| I-01 | 153 timers with a TR label against the TR table of the memory lists | 150 equal; 2 artefacts of the check; **1 real difference: ABC-001C TR228** (drawing TON 2 s, memory list TPs 2): simulated as drawn, to confirm |
| I-02 | 157 AI ranges against the IO list | 157 equal |
| I-04 | S1-LN38 / LN39 | missing in LINEAR.xls: ABC-010 had used the HEATER tables (S2): now from the Drum Level file |

## 4. Tests run on the final WIP build
| Test | Result |
|---|---|
| `tools/guard-ditl.js` | DITL part IDENTICAL |
| `test-blocks.js` (blocks incl. defaults, TP of 8 blocks, PO pulses, 4-way selectors) | 519 checks, 0 failures |
| `test-math.js` | 998 checks, 0 mismatches |
| `test-legend.js` | FF 282 / 282; TON 35, TOF 19, TPS 108: 0 mismatches |
| `test-rate.js` | 43 ramps / limiters, 0 problems |
| `test-pid-all.js` | 68 PID / PIDV, 0 problems |
| `test-comparators.js` | 240 outputs, 0 problems |
| `test-switch.js` | 382 T switches ok (2 not testable), 210 pick the leg of their selector |
| `justify.js` | 2191 of 2192 digital outputs reach 0 and 1 (the 1 = O-05) |
| `audit-reach.js` | 0 dead ends, 0 orphans (classified exits listed above) |
| `test-links-all.js` | 182 / 182 link groups carry their value |
| `audit-links.js` | 4 circles not linked (O-07 ×2, O-08, ABC-054 HRP by tag) |
| `test-paint.js` | 51 sheets × 3 patterns: 5 865 digital wire states, 0 lit with value 0; 4 grey with value 1 = not selected T legs |
| `audit-timers.js` / `audit-ai-ranges.js` / `test-drum.js` | see 3.3 |
| `audit-signs.js` | 486 pins, 1 difference (ABC-004A ADD #46, known) |
| Browser: test-modes, project, storage, storage2, numinput, pid, ln, anim, circles, ades, addr-ui, back-manual, blocks-ui, defaults-ui | see section 7 (final run) |

## 5. NOT tested / not done (honest)
- **exe and apk** are built by GitHub Actions only at release; nothing was run on a real Windows / Android device.
- **The real look of the new screens** (Assumed values list, 4-way selector check boxes) was tested for content, not judged by eye on the user's screen.
- **The sheet-by-sheet comparison with the PDFs** is not finished (docs/FINDINGS.md section E); the reach / link / paint tests prove the simulation is complete and consistent, not that it equals the plant.
- **DCS values** for ALM limits, ramp rates, PO timing, PID gains, the PRI / SEC / AVG default mode: assumed or default.
- ABC → DITL crossings are not simulated (the DITL page is never touched).
- The effect of the new TP / SEL / integrator / PO blocks on closed loops was tested block by block, not as a running plant.
- Units of S1-LN38 / LN39 are deduced (identity at 0 kg/cm2), to be confirmed with the DCS table.

## 6. Open items (docs/FINDINGS.md section C)
O-05 ABC-003E TR256 (TPS #70) not reached by the scan · O-07 ABC-004A circles A ×2 · O-08 ABC-020 circle 9 · O-09 "tags differ" lines (45) · O-11 ABC-001C TR228 type · ALM / ramp / PO DCS values.

## 7. Release checklist state
Patch `tools/patch-1.15.1.js` ready · AN_PV 14 → 15 (saved values of v1.14.x are dropped on first start; the user has none saved) · manual updated (PDF not rebuilt yet) · notes (PROJECT-NOTES) to be written at release · old html to `archive/html/`, old patch to `tools/history/` at release · **released on the user's go (version history: docs/RELEASES.md)**.

## 8. After v1.15.0 (released as v1.15.1): legend matrix
Requested by the user 2026-10-07: use the legend to test every sheet. Done as `tools/legend-matrix.js` → `docs/LEGEND-MATRIX.md` (per kind, per sheet and group, all failures). Found 2 real reader defects, both fixed in the patch (not in the released html yet): H-15 (ABC-001D mirrored AND without pins, M.2034 never computed) and H-16 (3 positioner boxes read as SUB). Result: 2 973 of 2 973 blocks pass. The 45 "tags differ" link lines were all looked at: 0 wrong pairs (docs/FINDINGS.md J2). MAN: 58 of 58; SUMA: 10 of 10. Full node and browser regression of this build: see the chat report of that round.
