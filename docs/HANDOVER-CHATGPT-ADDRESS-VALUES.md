# HANDOVER PROMPT FOR CHATGPT - analog address values (copy everything below the line)

---

You are taking over one problem of an offline educational simulator called **Logic Sim** (single HTML file `logic-sim-v1.20.4.html`, repo `ronanski/dcs-ditl-workbench`, branch `claude/trusting-goodall-313vmr`, same on `main`). It simulates the analog control logic sheets (ABC-001A ... ABC-056, 51 sheets) of a CFB power plant DCS. It is NOT connected to a real plant. The owner is an automation engineer, not a coder: answer in simple Taglish, with tables, and always say what you TESTED and what you did NOT test.

## The problem (the owner's words, summarised)
"Ang bawat value na dinadala ng wires / net ay may kaakibat na address. Non-sense na may wire values pa. Ang dapat makita lang ay ang value ng ADDRESS (analog). Kapag pinaghiwalay ang wire at address, nagkakaroon ng duplicate display ng value sa iisang tag, at nagkakaroon ng tamang wire value pero MALI ang value sa tag / address. Apektado nito lahat ng input at output ng lahat ng blocks."

So the rule is:
1. One analog signal = one net = one ADDRESS (tag text such as SI0061, AI0273, AO0231, FICFA1043B.MV, instrument tags like AT-FG1122, valve tags like PCV-MS1020 ...). The value belongs to the address.
2. Show **exactly one live value per analog address text**, placed beside that text, equal to the value of the net the address names. **No separate "wire value" display at all** (remove the "Wire values" button and the bare-wire badges).
3. Digital addresses get no live number (only wire colour). Only analog has a live value.
4. The same address written at several places of one sheet is the same signal (same value everywhere). A link circle carries the value to the other sheet.
5. Every analog address must RECEIVE a value (driver / link / manual input / from another sheet) and GIVE it (block input / circle to another sheet / field).

## What exists now (v1.20.4) - and why it is still fragile
The reader builds nets from the drawing and ties address texts to nets by DISTANCE heuristics (nearest wire, nearest circle, nearest block, IO-list tag, AO / AI blocks ...). The display and the engine use these heuristics in two different places, so wire and address can disagree. Code (all patches are applied in order by `tools/patch-1.20.4.js` to `archive/html/logic-sim-v1.14.3.html`; each patch file uses exact-once `rep(a,b)` anchors):
- `tools/patch-own.js`: old value badges (`L.bd`, with a `wire` flag, "Wire values" toggle `bWv`, circle badges).
- `tools/patch-addr.js`: the newest layer: (a) engine part: same SI/AI/AO address at several wires of one sheet = one signal (`S.link`), circle tags, (b) UI part: one badge per address text (resolution order: controller/station tag -> `S.lab`/`S.tagN` -> AO block -> IO-list tag -> AI triangle -> nearest unnamed analog net), old badges adopted only in the same row, others hidden as "wire values", (c) reader fixes: link circles up to radius 12, select-circuit boxes up to 64 wide, (d) DITL reference links.
- Known evidence that distance heuristics are dangerous: in v1.20.3 a radius change tied SI0061 to the SI0380 connector on ABC-003A and created a positive-feedback loop (values 1e21); 196 values were drawn in another row. Fixed in v1.20.4, but the root cause remains: **the address-to-net association is guessed, not defined.**

## What I want you to do
1. Read `docs/ADDRESS-VALUES.md`, `docs/CONTINUITY.md`, `docs/AUDIT-ABC002-2026-10-09.md`, `docs/FINDINGS.md` (H-31 ... H-41), `DESIGN.md` (rules 17, 19, 20), `tools/patch-addr.js`, `tools/patch-own.js` (badge parts).
2. Design ONE model: a table `address text -> (sheet, net, how it was tied, confidence)` built once per sheet by the reader, used by BOTH the engine (value of an address = value of its net, same-address nets merged) and the display (one badge per address text from that table). Remove the bare-wire value display and the "Wire values" button. Where the tie is only a distance guess, list it (do not silently guess) and give the owner the list to confirm against the drawing.
3. Keep these tests green and add the missing one: `tools/audit-addr-values.js` (one value per analog address text, none in another row, input -> address follows), `tools/audit-continuity.js` (0 without source, 0 unexplained, no algebraic feedback loop made by synthetic links), `tools/test-runaway.js` (every input non-zero, 120 steps, no wire > 1e9, 51 sheets), `tools/test-ditl-link.js`, `tools/test-circles.js`, plus the legend matrix and block tests (`tools/test-blocks.js`, `tools/legend-matrix.js`). New test needed: for each analog address text, set its field-side input (AI / input / circle source) and check that the value shown at THAT text, at every other text of the same address, and at the receiving block input all agree (DESIGN rule 17: test from the field side through the drawn wires).
4. Standing rules of the project: the DITL (digital) page is never modified (`node tools/guard-ditl.js <old html> <new html>` must say IDENTICAL); ABC-052 AND #112 are ignored in some audits; ABC-000 legend / `docs/FUNCTIONALITY.md` is the law; record every finding and change in the docs (FINDINGS, a report `docs/REPORT-vX.Y.Z.md`, RELEASES); NO release (push to `claude/trusting-goodall-313vmr` + merge to `main`; the GitHub Action builds exe + apk) without the owner's explicit "go".
5. Test with the real app in Chromium (Playwright; the existing tools show how: load the html, click "Analog · ABC", `AN.go(...)`, `AN.stepSet(...)`, `AN.dbgL.addrRep`). Run the whole regression on the SAME build you hand over.

## Facts you need
- Plant layer (v1.19+): a first-order process model writes transmitter AIs so that loops respond; FORCE / SIM; pop-out Plant window (system 1 = reheater). Not part of this problem, but do not break `tools/test-proc.js`, `tools/test-force-all.js`, `tools/test-lock-all.js`.
- PID direction was corrected in v1.20.0 (ACT:N = direct): `tools/test-pidsign.js` 64 / 64.
- Open from the owner: live DITL <-> ABC signal exchange (not wanted yet), P&ID direction audit of the 68 loops (P&ID files K1AU3-A1-0-001 rev A / B are with the owner), next plant systems (PAF / SAF + coal + air, drum level + feedwater).
- 62 analog wires with a free end and no text (`docs/WIRING-SUSPECTS.md` B) were sampled, not all checked against the drawing; a visual check of every address against the DXF drawing was NOT done.
- Weekly budget of the owner is almost used up: be efficient, one change at a time, report honestly.

## Deliverable
A short plan first (what the single address-to-net table is and how the engine / display use it), then the change, the test results (numbers, what passed / failed / was not tested) and the updated docs, as a branch the owner can review before saying "go".
