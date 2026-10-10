# REPORT v1.20.11 (technical) - live values of the EU rules + second pane zoom (2026-10-10, night)
Simple-Taglish report for the user: `docs/LogicSim_v1.20.11_Report.pdf` (+ `LogicSim_v1.20.11_Manual_Testing_Guide.pdf`), paper-like look (docs/RELEASE-PROTOCOL.md section 7). This file is the technical record.
Build: `node tools/patch-1.20.11.js` (reads archive/html/logic-sim-v1.20.9.html; modules tools/patch-1.20.11-{fx,dup,minair,xref,cos,ab,vcol,audit,mode,search,pane2,vplace}.js). v1.20.10 still rebuilds with tools/patch-1.20.10.js (SHA256 6325f96f...). DITL guard IDENTICAL (135a852d87c5).

## Changes (FINDINGS H-68 .. H-71)
- `vplace` (patch-1.20.11-vplace.js): one pass at the end of drawSheet. Obstacles: real text boxes (getBBox, rotated texts rotated), blocks, wires and symbol lines (R.seg, S.seg, S.gl, S.edge), circles / polylines, already placed numbers. Candidates per number: around the address text (right, below, above, left; gaps .9 .. 12), along the wire (beside a vertical piece, above / below a horizontal one, beyond the ends; gaps .9 .. 12). First free candidate wins, else the lowest score. text-anchor start / end / middle + central baseline = level at the side, centred above / below.
- Nets without a number (driven by a bare connector) get a number (22 nets).
- Number colours (computed / typed / forced) are settings; second pane: buttons, pinch, double-click, ctrl+wheel.
- Documents: paper-like (tools/release-docs/style.py), rules 32 / 33 in DESIGN.md, protocol sections 7 / 8, tools/check-release-docs.js.

## Measurements (tools/audit-values.js, tools/audit-values-rules.js)
| | v1.20.10 | v1.20.11 |
|---|---|---|
| numbers measured | 2101 | 2128 |
| cover a text | 53 | 0 |
| cover a block | 68 | 0 |
| cover a wire | 128 | 2 |
| cover another number | 10 | 0 |
| misaligned (side / above-below rule) | not enforced | 0 |
| analog nets without a number | 22 of 2207 | 0 of 2207 |

## Tests
See docs/REGRESSION-v1.20.11.txt and docs/TEST-RESULTS-*.json. test-pane2 now 10 / 10 (zoom).

## Open
Same as docs/HANDOVER.md section 4: 4 F(X) ranges, 2 digital gates in ABC-001D, HS / LS example, AO / FIELD final elements, instrument-tag value rule versus the user's earlier answer, COS confirm, manual tests of v1.20.10 and v1.20.11.
