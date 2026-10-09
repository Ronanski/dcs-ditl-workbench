# REPORT v1.20.7 - plant model OFF + whole-sheet flow check
User (2026-10-10, screenshot of ABC-002 on v1.20.5): SI0012 showed 1.00 while SI0061 showed 61.25; "idisable ang plant model at lagyan ng on / off button ... focus sa simulation debugging ... ayaw magcheck sa buong logic flow per sheet ... walang hulaan."

## What changed
1. **Plant model OFF by default**, new toolbar button **Plant model: OFF / ON** (kept in this browser). OFF = every transmitter / PV is a free input and only the drawn logic runs; the Plant window refuses to open while it is OFF. (tools/patch-plantoff.js, tools/test-plantmodel.js)
2. **Whole-sheet flow check** `tools/audit-flow.js`: per sheet, every origin input gets its own distinct value, the sheet runs to steady state, then (F1) every ADD / SUM / SUB / DEV / MUL / DIV / ABS / AO / IP / HLLIM block is recomputed from the VALUES OF ITS INPUT WIRES with a formula written in the audit (signs from the drawn "+ / -" at the pins, numerator from the "a / b" or "b / a" text of the block) and compared with its output wire; (F2) the number beside every address equals the net it is tied to; (F3) one net = one number; (F4) every wire that feeds a block has a source; (F5) engine pin signs = drawn signs.
3. The address table of v1.20.6 (docs/ADDRESS-METHOD.md) is included unchanged.

## The case of the screenshot (ABC-002, SI0061 = 61.25)
| address | v1.20.5 | v1.20.7 | by hand from the drawing |
|---|---|---|---|
| SI0012 (X, gain 1) | **1.00** (tied to the wire of the constant "1") | 61.25 | 61.25 x 1 |
| SI0013 | 0.02 | 0.02 | 61.25 x (1.20 / 4450) |
| SI0004 | 0.00 | 0.00 | 0.0165 x 140 / 1200 |
SI0140 / SI0017 (22.71 / 22.72 in the screenshot) came from the plant model writing the transmitters of other sheets; with the model OFF they are 0 until the owner sets the inputs.

## Numbers
audit-flow: 366 blocks recomputed from their input wires (AO 90, DEV 80, SUM 64, MUL 53, SUB 48, ADD 9, DIV 6, ABS 7, IP 8, HLLIM 1): 0 differences; 1517 / 1517 badges equal their net; 0 nets with two numbers; 0 block inputs without a source; 0 sign differences. The same audit on v1.20.5 finds 1 (ABC-008 SUB#44 2737.9 vs 2734.2, a false link).
NOT checkable by formula (listed by the audit): 12 DEV + 4 SUB without drawn signs, 6 DIV without a / b labels, 37 IP with more than one input.
Not covered by the audit: PID, LAG, RATE / RAMP, FX tables, SEL / AVG, AMT / SW, comparators and gates (they are covered by tools/test-blocks.js, test-legend, test-pid-all, test-switch, legend-matrix, which read the same engine and the legend of docs/FUNCTIONALITY.md; no independent second implementation exists for them).

## Open
- Cross-sheet inputs ("FROM ABC-xxx") are read-only links: with the plant model OFF they are 0 until the source sheet's own inputs are set.
- Circle `tags` of the page-link matcher (audit-links 43 "TAGS DIFFER") unchanged.
