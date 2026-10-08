# PUNCHLIST — what is left to do (updated 2026-10-08, WIP after v1.15.2)

Rule (user, 2026-10-08): this list has THREE parts, kept apart. The numbers that only the DCS can give are NOT tasks: the simulator already runs with its own values (ASSUMED, all visible in "Assumed values").

## 1. Tasks of the assistant (the only ones that count as pending)
| # | Task | Status |
|---|---|---|
| T2 | **CCS scenario test** (internal, by the assistant): scenarios on the coordinated control sheets with the DITL signals as inputs and simple process models; first step = list the CCS sheets and their FROM DITL inputs (docs/BACKLOG.md) | **open** |
| T3 | **HMI view** (overlay in the same app, widgets bound to addresses): design in docs/HMI-VIEW.md; waits for the user's choice of the first screen | **proposal** |
| T4 (DONE, WIP after v1.15.2) | **Following a signal through many sheets**: path (breadcrumbs, Back to start, no loop growth), list of every exit, signal map, one link per destination sheet (H-18); **DITL signals** list (one-click inputs); **Trend** (live graph, zoom) of every block and wire | `test-path.js`, `test-ditl-signals.js`, `test-trend.js`, `test-trace-x.js` 148 / 148 | done |
| T1 (DONE) | **Trace into other sheets.** Outputs now continue into the receiving sheet (pink ▶ row), inputs jump to the sending wire (◀ row), ↩ Back returns. `tools/patch-trace.js`, `tools/test-trace-x.js`: 144 / 144 links, Back and upstream jump tested | **done, no open task of the assistant** |

Closed this round (all tested, see docs/FINDINGS.md and docs/PROGRESS.md): O-05 (TR256, sequence test) · O-07 / P2 (ABC-004A letter circles, H-17) · O-08 / P3 (ABC-020 "9" is a drawing exit) · P4 (45 "tags differ" lines) · P5 · **P6** (PIDV = PID + PO raise / lower pulses, as the legend says; values ASSUMED) · **P7** (persistent DXF import + drawing-change report, `tools/test-import.js` 10 / 10) · P17 · P18 (68 PID / PIDV closed loops, simple process) · P20 (legend matrix 2 973 / 2 973). PDF comparison (old P16): dropped by the user, the sheets are the drawings.

## 2. DCS-only values (NOT pending: the simulator uses its own value, recorded in docs/ASSUMED-VALUES.md; replace when the DCS value is known)
| # | Item | Value used now | Form / source |
|---|---|---|---|
| V1 | ALM limits HH / H / L / LL of 104 alarms | ASSUMED (150 MW CFB) | `docs/DCS-DATA-FORM.pdf` section A |
| V2 | PID gains (Kp, Ti, Td, action, limits) of 68 PID / PIDV | default tuning by loop type. First look at the OPC data: FICFA1043B has P = 200, I = 50, D = 0 (docs/OPC-NOTES.md); unit of P (proportional band?) and I to confirm | form section B, or OPC |
| V3 | Ramp rates of 8 boxes | ASSUMED | form section C |
| V4 | PO pulse cycle / stroke / shortest pulse (2 PO) | 2 s / 60 s / 0.2 s | form section D |
| V5 | PRI / SEC / AVG default of 26 select circuits | AVG | form section E |
| V6 | SUMA unit (10) | per hour | form section F |
| V7 | LN38 / LN39 units (drum level) | N × 100 %, K ratio (identity at 0 kg/cm2) | form section H |
| V8 | ABC-001C TR0228: TON or TP | TON 2 s as drawn | form G1 |

## 3. Confirmations by the user (not tasks of the assistant)
| # | Item | Now |
|---|---|---|
| C1 | Block kinds confirmed on the user's own screen | none yet; block behaviour stays at 60 % until he confirms (checklist can be prepared on request) |
| C2 | exe and apk | built; the user tests them himself; not counted in the progress |

## Known, harmless (not corrections)
O-01 (positioner boxes, closed by H-16) · O-02 tick marks at PID / MAN box edges read as extra pins · ABC-052 AND #112 and ABC-052 (ignored by the user) · ABC → DITL crossings not simulated by design (91 "TO DITL" exits) · 2 T switches (ABC-003E SW#4, ABC-009A SW#32) are 4-way selectors, tested in test-blocks.js · 4 wires grey with value 1 = T legs not selected.
