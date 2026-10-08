# REPORT v1.15.2 — what was done since v1.15.1, as left (2026-10-08) — documentation revision 1 — RELEASED

Built by `tools/patch-1.15.2.js` from `archive/html/logic-sim-v1.14.3.html` (= `patch-blocks.js` + `patch-defaults.js` + `patch-signals.js` + `patch-selector.js` + `patch-import.js` + `patch-trace.js`). DITL page identical (`tools/guard-ditl.js` → IDENTICAL). `AN_PV` stays 16.

## 1. What changed
| # | Item | What it does | Test | As left |
|---|---|---|---|---|
| 1 | **T1 Trace across sheets** (`patch-trace.js`) | In VIEW the pink row "▶ continues in sheet X (circle n)" follows an output into the receiving sheet (the receiving wire is selected, the trace goes on); the ◀ row selects the sending wire on the source sheet; ↩ Back returns one step | `tools/test-trace-x.js`: 144 / 144 links (row, jump, selected wire, panel), Back, ◀ jump | **Done** |
| 2 | **P7 persistent DXF import** (`patch-import.js`) | An imported DXF is stored in the browser (IndexedDB keys `imp:list`, `imp:<sheet>`) and re-applied at every start; button **Imports** = drawing-change report (counts of blocks / nets / connector circles / lines / circles / texts, kinds that changed, blocks and texts only in one side) + **Back to built-in**; saved values of the sheet are cleared at import | `tools/test-import.js` 10 / 10 (unchanged drawing = IDENTICAL, kept after F5, 3 removed texts = DIFFERENT, back to built-in) | **Done**; not tried with a real plant DXF (test DXFs are written from ABC-050) |
| 3 | **H-17** (`patch-signals.js`) | ABC-004A letter circles "A" (194, 354) and (381, 95): two lone connectors with the same number on one sheet, one driven = sender | `test-links-all` 182 / 182; audit-links NOT LINKED 4 → 2 | **Done** (O-07 closed) |
| 4 | **O-05** TR256 (ABC-003E TPS #70) | Pulse when FF M.008F falls: shown by a 7-step sequence test | `tools/test-blocks.js` 526 checks (was 519) | **Closed** |
| 5 | **O-08** ABC-020 circle "9" | No partner on 54 sheets: a drawing exit | searched circles, FROM / TO texts, tags | **Closed** |
| 6 | **P18** closed loops | 68 PID / PIDV with a simple process settle, output in range | `tools/test-loops.js` 68 / 68 | **Done** (simple process, not the plant) |
| 7 | Docs / forms | `docs/DCS-DATA-FORM.pdf` (tools/make-dcs-form.js), `docs/OPC-NOTES.md`, PUNCHLIST in 3 parts, `docs/SIMPLE-SUMMARY.md`; PDF eye-comparison dropped by the user (the sheets are the drawings) → verification rubric 7 checks | | **Done** |

## 2. Tests on the final build (`logic-sim-v1.15.2.html`)
| Test | Result |
|---|---|
| guard-ditl | IDENTICAL |
| test-blocks / test-math | 526 / 998, 0 failures |
| test-legend | FF 282; TON 35, TOF 19, TPS 108: 0 mismatches |
| test-pid-all / test-comparators / test-rate / test-loops | 68 / 240 / 43 / 68, 0 problems |
| legend-matrix | 2 973 / 2 973 |
| audit-reach | 0 dead ends, 0 orphans |
| test-links-all | 182 / 182 |
| test-paint | 0 lit with value 0 |
| audit-timers / audit-ai-ranges | 150 / 153 (known: ABC-052 ignored, TR0228, 1 not in list) / 157 / 157 |
| justify | 2 193 / 2 194 (the last = TR256, proven by the sequence test) |
| audit-signs | 1 known difference (ABC-004A ADD #46) |
| audit-params | 7 lines, all read from the drawing (LAG "900Sec", "2Sec", "100Sec", "30Sec", "180Sec"; TPS 300 s) |
| Browser: project, numinput, circles, storage, storage2, anim, blocks-ui, modes, back-manual, links, ln, addr-ui, ades, defaults-ui, import, trace-x | all pass |

## 3. Not proven (honest)
- Tests prove the blocks follow the legend and the drawings, not that the plant behaves the same; no scenario test of a whole plant sequence (for example a burner start-up) was written.
- DCS-only numbers are ASSUMED (docs/PUNCHLIST.md part 2, docs/ASSUMED-VALUES.md); first look at real PID values in docs/OPC-NOTES.md.
- exe / apk are tested by the user, not here. Progress (html only): 85.9 %.
