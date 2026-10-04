# PROJECT-NOTES

Update this file on every code change (newest entry on top).

## 2026-10-04 · v10: bug fixes after user review of v9 screenshots (ditl-workbench-v10.html)
User review of v9 (DITL-56, DITL-69): AND lit with unlit inputs, inconsistent input highlight, ZT % on top of text, floating M./I.0000, OR without output and wrong timer value on DITL-69. User asked to fix all in this round ("ayusin mo na"); saved as v10 because the naming rule says never overwrite.
User rules: input = ONE cell per row (its own assignment). FROM/TO, LOCATION and TAG columns are reference only for now (not clicked, not lit). Only input, logic and output. MOV position shown in the panel like the timers (no overlay on the drawing).
Fixes
- Simulate has memory now: starts from the last state and changes one net per step until stable. Before, every evaluation started from 0, so seal-in circuits dropped when the PB was released, and cross interlocks (NOT of the other command) oscillated and showed an AND lit with unlit inputs. Reset when Mode is toggled.
- S/R flip-flop is reset-dominant (R wins when S and R are both 1), as the user stated earlier. v8 held the state in that case.
- OR input bar: the thick bar is drawn as polyline + a plain line beside it; the plain line merged all OR inputs into one net (DITL-56 top OR lost the seal-in input). Same handling as the AND bar (bus pins, bar lines are not wires).
- OFF / FROZEN layers are read from the DXF LAYER table and skipped (only TEXT lives there: DCS 1890, chinese 2783). Rows "with text but no wire": 444 -> 6.
- Input click: only the SERVICE cell of a row that a wire reaches is clickable and lit; simulation reads only that cell. Output: only the right SERVICE cell is lit.
- Timer drawn right-to-left (D bulging left, DITL-69/70/71 TR164/165/166): input on the right, output on the left, value read from inside the D (2 SEC was read as default 5). Timer flat side may be on the symbol layer (TR52: flat line on SYM, the FF box edge was taken before, so the input was missed).
- Wires drawn on the text layer (DITL-69/70/71 OR outputs, also 56, 60, 61A, 64, 65, 72, 76, 77, 87): an orthogonal text-layer line chained to a wire, an OR circle or an arrow = wire.
- ZT % removed from the drawing, shown in the MOV panel as "ZT 45% · OPENING".
Results: 127 sheets, 0 fail, 18 clean still clean, lit outputs of the 18 clean sheets identical to v8 (all inputs clicked one by one). Gates with missing pins 108 -> 74, loose ends 1436 -> 1365. DITL-69/70/71 no missing pins.
Checked behaviour: DITL-56 OPEN = row 4 OPEN PB + row 12 REMOTE + row 7 TURBINE SPEED UNDER 2400 RPM, seal-in holds after PB release, drops at ZSO (fully open); CLOSE = row 14 + row 12. DITL-69 OPEN = row 4 REINSTATE PB, OPEN FF reset at ZSO; CLOSE = row 15 ISOLATE PB with row 8 BYPASS fully open (through latch + TR52 off delay + AND M.0403).
Still open: DITL-56 CLOSE command stays live after fully closed because ZSC I.0216 is an input on DITL-54 only (cross-sheet, linking on hold). DITL-38 no MOV model.
NEXT (each needs "go"): PB / P.B. / PUSH BUTTON as real buttons (94 sheets, 320); TR timers default PULSE (86 sheets, 329); SOLENOID; MOTOR loose ends.

## 2026-10-04 · User rules update (no code change, html still v9)
- Do NOT write the handoff prompt in every reply anymore. Write it only when the user asks for it.
- PROJECT-NOTES.md must still be updated on every change.
- The user only opens the html (ditl-workbench-vN.html) in the browser; that file is the whole app. The .js files are optional test scripts for Claude (headless Chromium), not needed by the user. Deliver them only as attachments for continuing the work.

## 2026-10-04 · v9: MOV model + NOT box fix + thick AND bar + MOV box outline (ditl-workbench-v9.html)
User decisions (MOV family): LEFT = input (clicked), RIGHT = output = CRT indication (DITL-00: lamp = INDICATING DISPLAY OR LAMP, (ANN) = alarm). No manual click on right rows, everything goes through logic. OPEN command -> close/open limit switch follows (assumed): OPEN -> ZSO, CLOSE -> ZSC. MIL = local/remote indication, MIT = trip indication, both from the input with the same address. ZT = animation 0-100 %, travel 10 s default. ZSO/ZSC also drive the left input with the same address (feedback into logic). MIL with no input on the sheet (DITL-69/70/71 row 53) = LOCAL/REMOTE button in the panel. MIT/TS with no source anywhere = unlit. Trip (MIT) is NOT the same as closed (agreed).
Parser fixes (needed for MOV, found while testing):
- Small box with an X inside (block 0NOT, 3.6 x 3.6) = NOT gate per legend DITL-00. v8 treated it as a jumper/contact and passed it through, which merged OPEN and CLOSE command nets. 347 new NOT gates over the 127 sheets. Vertical-flow NOT (wire enters top/bottom, e.g. DITL-99 x=235.8) supported: default top->bottom, direction fixed by driven nets.
- MOV function-block rectangle (closed polyline around OPEN/CLOSE COMM. text) is skipped as wire on any layer. On DITL-51..55 it is on the wire layer and its edge joined both command outputs.
- Thick AND input bar (2-3 parallel verticals at the AND left edge, longer than the box) = input bus: bar lines are no longer wires, AND inputs = all wire ends on the bus. This is the "extra lines" experiment of the previous entry, now done with bus pins so inputs are not lost.
- Loose-end check knows AND bus, vertical NOT pins and MOV block pins.
MOV model (netlist field nl.mv, nl.v = 6): block = OPEN/CLOSE text with COMM. below; tag MOR-/MOS-xxxx, command address O.xxxx; command net = wire ending at the OPEN/CLOSE text. Feedback rows by tag ZSO, ZSC, MIL, MIT, TS/TSC/TSO, ZT, matched to the block by tag suffix; mir = left row with the same address.
Runtime: valve pos 0..100 %, starts CLOSED. OPEN live -> runs to 100, CLOSE live -> runs to 0 (sealed in, so a pulse is enough), both = stop, MIT input ON = stop, MIL OFF (LOCAL) = commands ignored. Speed follows the timer speed select. Forced left rows (ZSO/ZSC mirror) show a dashed outline and cannot be clicked. Panel (bottom right): MOV tag, travel time (saved per sheet in s.mvt), status, LOCAL/REMOTE button when MIL has no input.
Tests: 127 logic sheets import, 0 failures, 18 clean sheets still clean, simulation of the 18 clean sheets identical to v8 (smoke.js). Loose ends 1803 -> 1436, gates with missing pins 111 -> 108. All 33 MOV blocks found; OPEN and CLOSE nets separate on every MOV sheet. DITL-56 full cycle checked (row 12 REMOTE + row 4 OPEN PB -> 100 %, ZSO + left row 8 ON; row 14 CLOSE PB -> 0 %, ZSC ON). DITL-38 (old template) has no OPEN/CLOSE COMM. text, no model yet.
Open points seen while testing (not changed): DITL-69/70/71 still have an OR without output and timers without pins; on DITL-69 the CLOSE command is live as soon as ZSO is ON (both commands live = valve stops at 100 %), to check against the PDF. DITL-109: REMOTE alone (row 12) makes CLOSE live, to check. DITL-36/37 light 0 output cells in the smoke test (same in v8).
NEXT (each needs "go"): v10 skip text on OFF layers (DCS placeholders, chinese); v11 PB / P.B. / PUSH BUTTON as real buttons (94 sheets, 320 texts); v12 TR timers, default PULSE (86 sheets, 329 TR); then SOLENOID; MOTOR loose ends.
Test scripts: simtest.js (finds inputs that fire OPEN/CLOSE), uitest.js (open/close cycle with screenshots), smoke.js (clicks all inputs on clean + MOV sheets, compares lit outputs).

## 2026-10-04 · SIMULATION focus, logic families only: bulk analysis, NO code change (html still v8, no v9)
User instruction: fix Simulate, work family by family, focus only on sheets that contain logic (skip COVER/INDEX 0A-0D, LEGEND 00, field-wiring-only 16/17, pass-through 119). Test set: 127 sheets (CSV families). Headless harness written (see TEST TOOLS below).
Baseline v8 on the 127 logic sheets: 18 clean (same list as before), 0 import failures. Totals: 394-444 input rows with text but no wire, ~1800 loose ends, 111 gates with missing pins.
ROOT CAUSE FOUND for the bad simulation of the MOV and SOLENOID families (new template 51-110 mostly):
- Measured: outputs (right side rows) that are driven by any gate output or input net: MOTOR 177/283, SEQUENCE 105/115, LOGIC(other) 121/144, ANNUNCIATOR 42/42, INTERFACE 20/20, SOLENOID VALVE 71/123, **MOV 50/251** (7 MOV sheets with 0 driven outputs: DITL-38, 51, 54, 56, 60, 70, 71; also 45, 72, 120).
- Reason (checked on DITL-56 by screenshot): between the AND outputs and the right-side cells there is a dashed orange function block (MOV: `MOV OPEN COMM.` / `MOV CLOSE COMM.`, tags like MOR-AV1391 / MOS-AV1391). The commands enter the block; the right-side items (MIL, MIT, TS, ZSC, ZSO, ZT with I.xxxx addresses) leave the block as field feedback toward the DCS. The reader has no model for that block, so the logic never reaches the output cells. SV blocks (SVO/SVC) look the same. This is a DESIGN DECISION for the user, not a parser bug (see QUESTIONS).
- Many "text without wire" rows are NOT missing inputs: stray template placeholders (`M.`, `I.0000`, `I.1085`, `I.0744`, `IRP / I.005F`, `(S1) I.0091`) sit in rows where the drawing has no wire or the wire is an internal gate-output net. Example DITL-56 row 6 `(S1) I.0091`: the horizontal wire in that row is the OR output feeding the AND, not an input. 220 of 388 such rows have no horizontal wire at all in their row band. Real addresses are probably ATTRIB values of the INSERT blocks (not read yet), the TEXT that is read is the ATTDEF placeholder.
Experiments tried and REVERTED (not shipped, so no v9):
1. Implicit input (use the horizontal wire inside the row band as the source when no wire reaches the left edge): fired 50 times, mostly on placeholder rows (I.1085, I.0744, M.), so it would create false inputs. Dropped.
2. Thick AND bar is drawn with two extra plain lines at x-0.4 / x+0.4 (DITL-56: x=228.7 and 229.5 around bar 229.1) that merge all AND input nets into one. Removing them separated the nets (DITL-56 AND now has 4 distinct input nets) but 5 sheets lit FEWER outputs (61A, 64, 76, 77, 83) and 0 improved, and the extra nets are not validated against the PDFs. Not shipped. Idea to keep: re-test after the MOV block is modelled, then compare with the PDFs.
QUESTIONS for the user (needed before the next code change)
1. MOV / SV block: how should it behave in Simulate? Options: (a) pass-through: any live net entering the block drives all right-side feedback rows of that block; (b) command only: OPEN command lights MIL / ZSO, CLOSE command lights ZSC (needs a symbol table per tag type); (c) leave outputs unlit and only show the command nets lit. User said earlier "field wiring = plain input -> output"; confirm if the same applies to the MOV block.
2. Rows whose text is a placeholder (`M.`, `I.0000`...) with no wire: keep them non-clickable (current) or mark them grey?
NEXT WORK (when user says go)
1. Implement the MOV/SV block per the user's answer, regression on the 18 clean sheets + DITL-56 (expect rows 58-64 to follow AND outputs).
2. Read ATTRIB values of INSERTs (real I.xxxx / O.xxxx / MOT- tags) so placeholder text stops polluting inputs.
3. Then the remaining loose ends / missing pins per family (MOTOR first: 61A, 76, 77, 117, 118).
TEST TOOLS (outside the repo, rebuilt in minutes, optional): playwright script that opens the html, evaluates `parse()/build()` on each DXF and prints `diag()`; a second script measuring outputs driven by logic per family. Chromium path used: /opt/pw-browsers/chromium-1194/chrome-linux/chrome. Delivered as ditl-test-harness.js and ditl-driven-outputs.js.

## 2026-10-04 · User clarifications (no code change, html still v8)
- Station detection (when linking resumes): only `STATION ###` / `STN ###` counts. The rest of that text (e.g. `FM0001 P102`, "from page X to X" style text) is IGNORED for logic but the text itself stays in the drawing. This also removes the `104016` / `104015` misread on DITL-113 / 114.
- DITL-119: what matters is the output address `O.xxxx` in the body. If the right cell is empty, leave it empty. Do not invent a cell.
- Two-station page lists (102+103 and 103+105) confirmed by user.
- Work order confirmed: one item at a time, wait for "go" before every edit, update PROJECT-NOTES.md after every change.
- FILE NAMING RULE: every changed html is saved as a new number: next one is `ditl-workbench-v9.html`, then v10, etc. Never overwrite the previous version. Handoff prompt is always written FIRST in the reply.
- Files needed to continue in a new account: ditl-workbench (latest vN).html, PROJECT-NOTES.md, logic-dxf.zip. Optional: DITL-sheet-report.csv (sheet types, can be rebuilt). Nothing else.

## 2026-10-04 · DECISION: focus on SIMULATION first. Page linking / address linking = ON HOLD (inspection only, no code change)
Status: html still v8, no code changed in this entry. Inspection of all 135 DXF done (report: DITL-sheet-report.md / .csv).
User decision: ABORT page linking and cross-diagram address linking for now. Work only on simulation functionality (single-sheet correctness first). Wait for the user's signal ("go linking") before touching any item under "ON HOLD". If any of it already exists in code, leave as is, do not extend or remove.

ON HOLD (note for continuation, discuss when user gives the signal)
1. Page links From/To. Format is only `##-##` (sheet-row). Ignore any other label near it (IRP, LOCAL, CRT, SER, ABC...): numbers only. Several tokens in one cell possible (`01-15,02-23`). Left rows 1-28 = inputs, right rows 51-78 = outputs. A TO token on a right row points to a left row of another sheet; FROM token on a left row comes from a right row elsewhere. Findings: 1551 raw tokens in the DXFs but the app keeps only 29 in `s.tx` (it drops them); 812 TO tokens, 686 have a matching FROM; 743 tokens point to their own sheet (e.g. `111-2`, `(111-58)`). User: do not worry about unmatched cases, just parse the `##-##` format.
2. Station + address key. Slash address `I.0001/321/641/961` = four addresses, one per burner A/B/C/D (same logic, same equipment, own address each; rule: replace the last N chars of the base with the part after each slash; `O.0084/404` = O.0084, O.0404; `M.012A/22A/162A/172A`). Station inheritance: the mother sheet gives the station to its family (03 -> 03A..03H, 12 -> 12/12A/12B/12C, same base number). Ambiguous list in Health. Station is written as `STATION 104 FM0001 P102`, `< STN103 >` or `(S1)` prefix on the sheet. Open: how to pick the station of an address on pages that mention two stations (see list below).
3. Shared state across pages (key = station + address, plus the links above). 121 (station,address) keys are outputs on one sheet and inputs on another (e.g. 104 M.012F: output on 18, input on 01, 12, 14).
4. Output kinds as endpoints: CRT cell, `0NO` numbered circle, pentagon ELECTRIC TROUBLE, SV, lamp. Pass-through sheets 08, 16, 17, 119. To be discussed when the user says so.

Pages that mention two stations (from the inspection, for the station question)
- 102 + 103: DITL-51 to 56, 60, 62 to 75, 79, 80, 81, 83, 88, 89, 94 to 110, 116, 121.
- 103 + 105: DITL-86, 87, 92, 93.
- DITL-113 / 114 showed `104016` / `104015` because the regex read the number after STATION; fix only when linking resumes.

User answers to the open questions
- CRT marker in a right cell = alarm display in the control operator room / HMI. It is an output (operator display), 940 times in 118 sheets.
- Slash address = burner A/B/C/D, four separate signals with the same logic (see item 2).
- 12-12C, 03B-03H inherit the station of the mother sheet (03/03A, 12).
- DITL-119: the `O.xxxx` addresses (O.0286..O.028B) are OUTPUT signals even without a right cell. Cause: they sit in the middle of the sheet (x about 252), not in the right column, so the app reports outs=0. For the simulation they must be treated as outputs.
- NOT YET DECIDED (discuss separately, no behaviour given): `ICD130` block (2 arcs, in 61A/76/77), `RELAY` block (DITL-18), `0ARROW2` / `0ARROW3` / `0ARROW4`, whether the same `0NO` number on one sheet is one net, and where the tag above a numbered circle (MOT-xxxx, O.xxxx) comes from.

Sheet types found (inspection, 134 sheets; full table in the report files)
- COVER / INDEX: 0A, 0B, 0C, 0D (CONTENTS 1-4: sheet no., DWG NO., title, revision dates). Not logic. Useful later for title banner and sheet picker.
- LEGEND: DITL-00 (SYMBOL LIST: OR, AND, NOT truth tables, ANN, SV, lamp). Not logic; import "no row numbers" is expected.
- PASS-THROUGH (no gates): 08, 16, 17, 119. 16/17 are field wiring (DC 24V / N, SV coil, ZSE/ZSC/ZSO/ZSR limit switches, LEADER, lamp). 08: 2 in / 2 out. 119: 9 inputs, outputs in the body.
- Field wiring + logic: 18 (also has RELAY block, 5 gates, 2 timers).
- Sequence / trip: 01, 05, 06, 07, 09, 10-15, 12A-C.
- Motor start/stop: 19, 21A-E, 22-31, 43, 45, 61A/B, 76, 77, 111-114, 117, 118, 120 (pentagon ELECTRIC TROUBLE on 18 sheets, MOT- tag on 8).
- Solenoid valve (SV + ZS feedback), MOV / shut-off valve (ZS), annunciator 40-42, interface / function block 50 and 115, logic other 02, 03A-H, 36, 37, 39.
- New template (block 0LOGIC, I-WIRE / I-INST / I-TEXT): DITL-51 to 121 mostly. Numbered circle = block `0NO` with ATTRIB (the number) in 52, 53, 55, 61A, 75, 99-110, 116; the app does not read ATTRIB yet.

NEXT WORK (simulation only, in this order)
1. Re-run the 18 clean sheets as regression after every change (01, 03A-E, 11, 12, 12B, 12C, 14, 27B, 28B, 36, 37, 40, 42, 115).
2. Rows with text and no wire (~480, e.g. DITL-56 rows 1,2,6,9; DITL-70 14 rows), loose wire ends (~1900), gates with missing pins (~110), 37 timers not detected, OR in DITL-76 with missing output.
3. Sheets without gates = pass-through (08, 16, 17, 119) simulate as input row -> output; 119 outputs are the body O.xxxx.
4. Visual comparison with the PDFs.
Rules unchanged: inspect/assess = no edits; field wiring = plain input -> output; vertical-flow OR = ordinary OR; limited credits, few tool calls.

## 2026-10-04 · v8 bulk-test fixes (tested on all 135 DXFs, headless)
Rules from user: sheet with no gates = input row goes straight to output row. Field wiring pages = simulate as plain input -> output (no new model). Vertical-flow OR = ordinary OR with connected line, no special case.
Baseline v7 on 134 imported sheets: only 15 clean (01,03A-D,11,12,12B,12C,14,36,37,40,42,115). DITL-00 legend is not a logic page.
Changes
- Health: "text outside any cell" counted the row-number column on every sheet (134/134 false). Row-number texts now ignored.
- Wires starting a little left of S1 (new template: x=120.9, S1=124.0) were dropped (`h.x1>S1-1`). Now `S1-4.5`. Rows with text but no wire: 1028 -> 480.
- Small unclaimed boxes (<=5.2 x 5.2, with X inside = contact/jumper, e.g. DITL-56 x=212..216) are now pass-through wires (their edges are no longer removed as gate edges). Loose ends 2836 -> 1904.
- Timers on new template: D arc is on layer SYM (not CON) and the label is BELOW the D. Detection now accepts CON arcs (label above, old rule) or SYM arcs (label below, within 10 units); arc is used once. D left edge fallback x0=ax for SYM arcs. Undetected timers: 90 -> 37.
- Simulate: if a sheet has 0 gates, every active input row lights the output cells of the same row (render only, `outOn`). Not testable on DITL-08 (no row has both sides filled).
Result after fixes: 18 clean sheets (added 03E, 27B, 28B), none of the original 15 broke. Still open (bulk run): ~480 rows with text and no wire, ~1900 loose ends, ~110 gates with missing pins, 37 timers not detected, sheets 0A-0D / 16 / 17 / 119 with no gates (need a look at what they are).
Not done: visual comparison with the PDFs, numbered output circles / pentagon flags as outputs, shared state across pages.

## 2026-10-04 · Bulk-import robustness + Health panel (for 100+ sheets)
Why: other diagrams had wire gaps and non-clickable inputs because the reader used fixed numbers (row-number x range, column offsets) calibrated on 2 sheets.
Changes
- Row numbers: found by clustering numeric texts by x (>=5 texts, pitch ~9), leftmost = left rows, far-right cluster = right rows. Old fixed ranges only as fallback.
- Column boundaries snap to real tall vertical frame lines (within 2.5 units) instead of trusting fixed offsets.
- Texts just outside a cell edge / row band are now matched by their alignment point (x,y) too, not only insertion point.
- Wire layer fallback: if layer CON has <5 H/V lines, the layer with most H/V lines is treated as CON (`sheet.lyr`).
- Auto-heal: wire end with nothing on it and another net within 1.2 units is joined automatically (`nl.healed`). `nl` version is now 5.
- Simulate: a left row with a wire but NO input text is clickable at its T cell (`fbk()`).
- Multi-file import: one pass, progress toast, failures collected in `FAILS` (one bad file does not stop the rest).
- NEW `Health` button / panel: per sheet checks (labels without gate, missing pins, loose ends, timers, rows with text but no wire, wired rows with no text, orphan texts, no gates/inputs/outputs). Click a row = open that sheet. Textarea with a compact summary to paste to Claude.
- Autosave now warns when localStorage is full (100+ sheets will exceed ~5 MB: IndexedDB is now the next step).
NOT tested on real DXFs (only syntax-checked); DITL-02 / 03A / 55 must be re-imported and compared.

## 2026-10-04 · Roadmap #2 started: BLOCK/INSERT reader (+ root cause of "new style" pages)
Root cause found (DITL-55, 61B, 72 failed to import before)
- On these sheets the table frame, row numbers and headers are NOT top-level entities: they live inside the nested block `0LOGIC` (inserted on layer HID). The gates are INSERTs of blocks `0AND`, `0OR`, `0NOT`, `0FLIP1`, wires end in INSERTs `ARROW` / `DOT`. The old reader ignored every INSERT except LAMP1, so it found no row numbers and returned null.
- Layers are different there: wires `I-WIRE`, symbols `I-INST`, text `I-TEXT` (older sheets use CON / TXT1).
What changed
- `parse()` now reads the BLOCKS section and calls `explode()`: every INSERT (nested up to 6 levels, with position, scale, rotation, base point) is flattened into normal LINE / LWPOLYLINE / CIRCLE / ARC / SOLID / TEXT entities with the transform applied. Layer `0` inherits the INSERT layer. Layers ending in `I-WIRE` / `I-INST` become `CON`, `I-TEXT` becomes `TXT1`. Skipped blocks: 00_FORM, WMF6, test, GENAXEH, ACAD*. Layer VPORTS and ATTRIB / ATTDEF are skipped.
- Symbol blocks (table `SYM`: LAMP1 / 0LAMP1 = lamp, SOLENOID, LSWITCH = limit switch, SIGHI / SIGLO = H / L limit, 0ADJ, LEADER) are drawn with their REAL shape on layer `SYM` (render only, not part of the netlist), so lamps are no longer bow-ties. Each one is also recorded in `sheet.syms` ({k kind, n block, x, y}) for the later behaviours.
- Gate blocks (0AND / 0OR / 0NOT / 0FLIP1) are NOT in SYM: they become CON geometry and go through the existing gate detection. The old `raw.lamp` bow-tie is gone (kept only for old saved sheets).
Tested (headless Playwright, all 15 uploaded DXFs)
- DITL-02, 03A and the 11 other older sheets: gates / nets / inputs / outputs IDENTICAL to the previous version.
- DITL-55 / 61B / 72 now import (before: failed). Result is only partial, see below.
Not done yet
- DITL-55: 41 loose wire ends, 5 input rows only. 61B: 0 input rows, 1 OR. 72: 1 gate. The new template uses different column offsets, so some DCS texts (I.xxxx) stay outside the cells and the cell mapping needs calibration for this template.
- #1 still open: vertical-flow OR (bus at the bottom, arrows up), numbered output circles / pentagon markers, field wiring pages, arrow-based direction for AND / OR / R-S / timers.
- `_5_DITL-00.dxf` (legend) is now a good R2004 file with text and blocks, but it has no numbered rows so it is rejected as a sheet (it is a symbol list, not a logic page). Not used yet.
- Simulation was not re-checked on the new-style pages; lamp / solenoid shapes were visually checked only on DITL-55.

## 2026-10-04 · Title banner, save dialog removed, new page types noted
- Save dialog / Paste project REMOVED (user: not worth it for now). Save project and Save fixes are back to the plain download.
- New title banner under the toolbar: big sheet content (title), DRAWING NO. and SHEET NO. Click any of the three to edit (Enter = save, Esc = cancel, undoable, saved in the project as `sheet.meta`). L / C / R buttons align it left / center / right, Small / Medium / Large size (kept in this browser, `ditl.meta`). Drawing no. and sheet no. come from the file name (`_5_DITL-00` -> sheet 5, DITL-00; `DITL-03A` -> drawing only). Sheet content starts empty: auto-detect from the DXF title block is not done yet (needs a real sheet with its title block text).
- Typing inside the banner no longer triggers Del / Ctrl+Z of the drawing. Tested headless (edit, align, size, empty state).
- Addresses (user): unique inside one station only. Stations (controllers) 101, 102, 103, 104, 105 can reuse the same address. Shared state / IO list key must therefore be station + address, not address alone.
- Legend DXF re-sent is the same exploded R12 file (no blocks/text): not usable. Lamp renders correctly in some sheets and as a bow-tie ("ribbon") in others: the bow-tie is the generic placeholder for INSERT `LAMP1`, so the fix is drawing real BLOCK definitions (roadmap step 2).
- Page types seen in screenshots that the reader does NOT handle yet (need their DXF to fix at the root):
  1. Vertical-flow gates: OR with a horizontal bus under it and arrows pointing UP into the bus (flow bottom to top). Current reader only knows left-in / right-out.
  2. Gate outputs into numbered circles (2, 3) with a tag above (MOT-F1056-1, O.0771) and a pentagon "ELECTRIC TROUBLE" flag; these are output / alarm / off-page markers, not gates.
  3. Field wiring pages ("LOGIC (INTERLOCK)", DC 24V and N rails): DCS output row -> contact (two small circles) -> solenoid coil (SVC / SVO / SV circle); limit switches (ZSR / ZSE / ZSC / ZSO) feed input rows on the right (I.xxxx). This is continuity logic (contact closed -> coil energised), not gates. Needs its own model; behaviour in simulation still to be decided with the user.
- Current direction handling: only NOT follows arrows (arrow at the edge, else driven side). AND / OR / R-S / timers are still left-in right-out. This is the first thing to generalise when the DXFs arrive.

## 2026-10-04 · Save fix + agreed ROADMAP
Save fix
- Save project / Save fixes used a blob download link; embedded viewers block it and the page errored. Now both open a dialog with the full text: `Download file`, `Copy` (paste into a .json file), `Close`. New `Paste project` button loads a project from pasted text (works where file pick or download is blocked). Normal browser download tested OK; dialog + paste-load tested headless.
- Open project / Load fixes (file pickers) unchanged.

Legend file `_5_DITL-00.dxf` (checked again)
- Still R12 (AC1009), 2062 POLYLINE/VERTEX only, no TEXT, no BLOCK, no INSERT, single layer. Cannot be used as a symbol library or imported. Need a normal save-as ASCII DXF (2004/2007, like DITL-03A) so text, layers and blocks survive.

Agreed ROADMAP (order)
1. Make the reader work on ANY page: user sends many different real DXF sheets; fix each failure at the root. Rule: flow = trace each line to its arrowhead (left or right). Not only NOT: AND / OR / R-S / timers must follow it too.
2. Symbols: read BLOCK definitions + INSERTs from the DXF and draw the real shapes (fixes LAMP1 drawn as valve/bow-tie). Then a symbol table (block name -> lamp / solenoid SV / limit switch / L,H limit / ANN / push button) for behaviour. Needs real sheets with blocks intact.
3. Title block per sheet: sheet content, sheet no., drawing number. Fallback: file name (e.g. `(5)DITL-00`).
4. From/To page links. Token `15-18` = DITL-15, cell/row 18; several tokens in one cell are possible -> picker to choose the target page. Click = jump to page and row.
5. Shared state by address across all pages (global simulation over all sheets).
6. Actual push buttons (source of the address state).
7. IO / memory list page (tag, description, DCS address) with search, CRUD, links to diagrams. Master for tag/address identity; diagram text is the label; mismatches shown in a report, not silently overwritten.
Postponed by user: IndexedDB storage (do before importing many pages; localStorage ~5 MB will fill), grid on/off + grid types (disabled in simulate, must not hide the drawing), logic builder / editor with lock-unlock.
Dropped: truth table generation, Logic Definition Table, auto layout (user likes current behaviour).

## 2026-10-04 · NOT direction v2 (no arrow at the gate)
- Bug from screenshot: a NOT whose input comes from the right but has no arrowhead touching its edge was read left-to-right, so NOT(0)=1 drove the net of the OR output and lit it with no live input.
- Direction order now: (1) arrow tip touching the NOT edge (left-pointing on right edge = reversed, right-pointing on left edge = normal, as in the legend DITL-00); (2) if no arrow: the side whose net is already driven by another gate output or a left-edge source is the input (repeated up to 8 passes so chains of NOTs resolve); (3) otherwise left-to-right.
- Legend `_5_DITL-00.dxf` is an old R12 export with everything exploded to POLYLINE/VERTEX (no TEXT, no layers) so it cannot be imported, but it confirms: every gate input has an arrowhead touching the gate; outputs have the arrow at the far end.
- Tested headless on synthetic sheet only.

## 2026-10-04 · NOT direction from arrows + Timers (ON DELAY / OFF DELAY / PULSE)
NOT gate
- `netlist()` now reads the CON arrowheads (SOLID triangles) in both directions (`tri`, d=+1 right, d=-1 left). A NOT whose arrow tip points LEFT into its right edge is reversed (`g.rev`): input = right side, output = left side. Default (no arrow found, or arrow on the left edge) stays left-to-right as before. Manual pin fix (`pinKind`) respects `rev`.
- Only NOT is direction-aware. AND / OR / R-S are still left-in, right-out.
Timers
- New gate type `TMR`. Found from the label text (ON DELAY / OFF DELAY / PULSE) -> nearest CON ARC (the D shape) -> D left edge (short vertical line) -> pins: input = horizontal wire end at the D left edge (same y as arc centre), output = wire end at the arc apex. D outline lines are removed from the wire list (no fake loose ends).
- Preset is read from the texts inside the D (number + unit, e.g. `5` / `MIN.`, or one text `5 MIN.`). Units: ms, sec, min, hr. Tag (TR252) is the DCS text under the symbol.
- Timers panel (bottom right, Edit and Simulate): change the number / unit there; it rewrites the text drawn in the D, so it is saved in the project and undoable (Ctrl+Z).
- Simulate: clock runs every 100 ms. Speed selector 1x / 10x / 60x / 300x, per-timer Skip button, live elapsed / preset / OUT display. Switching mode resets all timers.
- Behaviour: ON DELAY = output 1 after input is 1 for the preset, drops when input drops. OFF DELAY = output 1 at once, stays on for the preset after input drops. PULSE = rising edge gives output 1 for the preset (not retriggerable).
- `nl` version is now 4 (recomputed on load). Import toast now reports how many timer labels had no detectable symbol.
- Tested headless on a synthetic sheet only (reversed NOT with left arrow, ON DELAY 5 MIN, preset edit). NOT tested on real DITL-02 / DITL-03A. Arc/pin assumptions come from the screenshot; if a timer shows 'missing pins' in Wire fix, send the DXF.

## 2026-10-04 · Connectivity fixes + Wire fix v2
Root causes found from the user's screenshot (long vertical wire not connected to the wires touching it)
- Wires longer than 130 units were dropped entirely (long vertical buses). Now only vertical lines that sit on a table column boundary AND are > 130 long are dropped (frame lines).
- Only LINE entities were wires. Now every CON-layer LWPOLYLINE is exploded into H/V segments too (L-shaped / multi-vertex wires, thin 2-vertex wires). Thick (width > 0) vertical 2-vertex polylines are still AND/OR bars; short closed 2-vertex polylines are still junction dots. Polyline width is now parsed (raw.pl[3]; old saved sheets without it keep the old bar behaviour).
- Arrowheads (CON SOLID triangles) now also define input pins: a right-pointing arrow tip on a gate's left edge attaches the wire it sits on (in addition to the old 3.4-unit end rule).
- Junction dots are now drawn (white/CON dots; they were invisible before) and counted in the import toast.
- `netlist()` v3 also exports `dots`, `plnet`, per-gate `pp` (pin points).
Wire fix v2
- Net colors: every net has its own color, so a break in continuity shows as a color change. Pin points on gates are drawn as colored dots. Panel (top right) lists nets / dots / missing-pin gates / loose ends and all manual fixes.
- Delete a fix: ✕ in the panel, or click its cyan × marker; hover a panel row to highlight it. Ctrl+Z still works. Clear all removes every fix of the sheet.
- Save: fixes auto-persist in localStorage (`ditl.fixes`, keyed by sheet name) and are re-applied on importing a DXF with the same name; `Save fixes` downloads ditl-wire-fixes.json, `Load fixes` merges it back. Pins are matched to gates by type + position (not index), so they survive parser changes.
- Status bar no longer changes height on first mouse move (it shifted the drawing and made the first click miss).
- Tested headless on a synthetic sheet (long vertical, polyline wires, arrow pin, dot vs plain crossing, join, delete from panel and marker, persistence). NOT tested on real DITL-02 / DITL-03A: please re-check DITL-03A still simulates the same.

## 2026-10-04 · Live color + Wire fix tool
- Live signal color is now selectable (toolbar dropdown: Red default, Yellow, Blue, Magenta, Green). Applies to lit wires, OR bus, and lit input/output cells (CSS var `--live`). Choice is saved in localStorage (`ditl.live`), not in the project file.
- New `Wire fix` toggle (Edit mode only). Shows: gates with missing pins (orange dashed box + which pin is missing), loose wire ends (yellow ring = another wire within 3 units, dashed line shows the gap; red ring = nothing nearby). Hover a wire = whole net highlighted.
- Fixes (stored per sheet as `links` / `pins`, applied inside `netlist()`, so they survive re-simulation, Save/Open and Undo): click a yellow ring = join the gap; click wire then wire = join; click gate then wire = attach as that gate's pin (in/out, S/R for flip-flop, chosen from which side of the gate the wire end is). `Clear wire fixes` removes all manual fixes of the sheet. Esc cancels a pending pick.
- `netlist()` now also exports `segs`, `dang`, and per gate `box` / `miss`; nl is versioned (`v:2`) and no longer written to project/undo JSON (recomputed on load).
- Tested headless on a synthetic sheet (gap detect, gap click, gate+wire pin, undo, clear, color change). NOT yet tested on real DITL-02 / DITL-03A after this change.
- Junction dots are still recognised only as short closed 2-vertex CON LWPOLYLINEs. If a sheet draws them another way (small circle / solid / block) its T-junctions will show up as loose ends; send that DXF so the parser can be fixed at the root.

## 2026-10-04 · Phase 2+3 (first cut) · Netlist + simulation
- `netlist(sh)` runs at import. Wires = CON-layer H/V LINEs (inside the logic window; see newer entries for length/polyline rules). Two wires are one net when an endpoint touches the other wire, or when a junction dot (short closed 2-vertex LWPOLYLINE, length < 1.5) sits on both. Plain crossings are NOT connected.
- Gate detection: rectangles are built from H/V lines (a vertical thick bar counts as the left edge, e.g. AND). Labels AND / NOT / S / R are matched to the nearest rectangle. OR = CIRCLE containing the label plus the vertical bar tangent to it (the bus). S + R stacked rectangles = one R-S flip-flop.
- Pins: horizontal wire ends. Inputs may stop up to 3.4 units before the gate (arrowhead length); outputs start at the right edge.
- Sources: wire ends at the left logic edge, mapped to the row. Active left cell (F/L/T/S) = that row is 1. Outputs: wire ends at the right logic edge, mapped to the row; all populated right cells in that row light up.
- `simulate(nl, activeRows)`: fixed-point iteration. R-S: S=1,R=0 sets; S=0,R=1 resets; both 0 or both 1 holds (legend "NC").
- Simulate mode: click an input cell = 1, click again = 0, multiple cells allowed. Wires and the OR bus light up. Switching mode clears all states.
- Edit: native prompt() was blocked in the embedded viewer, so the editor is now an inline textarea (Enter saves, Esc cancels). Double-click is detected manually (350 ms). Clicking outside any cell, or Esc, deselects.
- Import toast reports gates / nets / inputs / outputs and warns about gates with missing pins and timer labels.

Known gaps
- ON DELAY / OFF DELAY / PULSE timers are not simulated yet (DITL-02 has them). Some gates in DITL-02 report missing pins (e.g. NOT with no output); the wiring there needs a look.
- Truth table generation, wire re-trace/edit and the Logic Definition Table are not built yet.
- Tested only on DITL-03A end to end (headless browser). DITL-02 imports but its simulation is incomplete.

## 2026-10-04 · Phase 1 fixes
- Signals are now per cell (row × column, key `row:col`), not per row. Each populated cell has its own state.
- Added Mode switch: Edit (click = select) / Simulate (click = toggle that cell's signal). Simulation logic itself is not built yet; it needs the Phase 2 netlist.
- Fixed cell editing: pointer capture made `dblclick` target the SVG, so hit-testing now uses geometry (`hit()`), not DOM targets. Double-click works on any cell, including empty ones. Single click is delayed 230 ms so it does not fire twice on double-click.
- Del clears only the selected cell.

## 2026-10-04 · Phase 1 · Template + DXF import
File: `ditl-workbench.html` (standalone, no build step).

Done
- ASCII DXF import (multi-sheet, one tab per file). Layer `chinese` and any CJK text are skipped.
- Template is drawn from the DXF itself (layers CON, HID, CEN) so it matches the original PDF.
- Row/column cells are parsed from TEXT positions. Row geometry comes from the row-number texts.
  Left cells: FROM (F), LOCATION (L), TAG/DCS (T), SERVICE (S). Right cells: SERVICE (RS), LOCATION (RL), TO (RT).
- Populated rows are clickable (input = left side, output = right side) and toggle a signal state. Selected cell has a cyan dashed outline.
- Double-click a cell to edit text, Del clears the selected side, Undo/Redo (Ctrl+Z / Ctrl+Y), Save/Open project (JSON), autosave in localStorage.

Assumptions (calibrated on DITL-02 and DITL-03A)
- Row pitch 9 units. Row band = number Y − 3.3 .. + 5.7.
- Column boundaries are fixed offsets from the row-number X of each side (see `build()`).
- Gates, wires and symbols in the logic area are currently drawn as raw geometry (not yet a netlist).
- Lamp INSERT `LAMP1` is drawn as a generic bow-tie symbol. Other blocks (title block) are ignored.

Not done yet
- Netlist extraction (gates / wires / junction dots) and the Logic Definition Table.
- Auto layout generator, simulation mode (timers, R-S), generated truth table.
- Wire re-trace / edit in the logic area. DWG is not supported (use DXF).

Untested: not yet opened in a browser. Report any rendering mismatch against the PDFs.
