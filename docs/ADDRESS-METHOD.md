# ADDRESS METHOD (v1.20.6) - how an address text gets its value

**Why this document exists.** Until v1.20.5 the simulator decided "which wire does this address belong to" with a chain of *nearest* rules: nearest free wire (25 units), nearest circle (r + 50), nearest block (45 / 70 units). The engine and the display each had their own copy of these rules, so the same address could name one wire in the logic and another wire on the screen. The owner's verdict (2026-10-09): *"mali ang method; hindi dapat kung sino ang malapit; dapat iintindihin ang diagram at ang flow ng logic."* This is the replacement.

## 1. One table, one place
`anAddr(S)` (source: `tools/addr-table-src.js`, inserted into the analog script by `tools/patch-addr.js`) is run **once per sheet** inside the reader (`anWire`). It writes

* `S.addr`   - one row per analog address text: `{t, x, y, n (net shown), eng (net the engine merges), how, gap, alt[], ai}`
* `S.addrUn` - the texts that could **not** be tied without guessing, each with the reason.

The engine (same address on several wires of a sheet = one signal) and the display (one value beside each text) both read `S.addr`. Nothing else decides which net an address names. `AN.addrTable('ABC-010')` returns the rows in the running app; every badge carries `data-how` with the rule that tied it.

## 2. The rules (in this order; the first that applies wins)
| # | how (column "how" of the table) | what the drawing says | net that carries the value |
|---|---|---|---|
| 1 | controller tag | the tag written **inside** a PID / PIDV / MAN / SUMA / SUMP box (`FICFA1043B`, `.PV`, `.SV`, `.MV`) | the pin of THAT block (PV pin, SV pin, output) |
| 2 | AO block input | `AO####` written beside an AO triangle | the **input** (command) wire of that triangle - not its output stub |
| 3 | AI block output | `AI####` written beside an AI triangle | the **output** wire of that triangle (for a feedback AI: its only wire) |
| 4 | circle tag | an address written right beside a link circle (gap to the disc <= 12) and **no other wire is clearly closer** than the wires of that circle | the wire of that circle that is beside the text (all wires of one circle number are one signal) |
| 5 | label on wire (reader) | the reader found the text lying along a wire (gap <= 6.5 from the text start) | that wire (the audit re-measures it with the rendered text: no other wire is closer) |
| 6 | transmitter tag -> AI block / valve / actuator tag -> command pin / instrument tag -> AI block | the equipment tag under a positioner / valve (`ZT-FA1053-1`, `FCV-FA1055-A1`) | the AI block (transmitter) or the command input of the I/P / AO / actuator (valve) it is paired with |
| 7 | tag of a block | the text is one of the texts inside a block box | the output (or input of ALM / TXD) of that block |
| 8 | constant box output | an `SI` / `AI` written right beside the box of a constant `A` | the wire that leaves that box |
| 9 | wire beside the text (unique) | none of the above, but exactly one wire lies right beside the text box (gap <= 10) and the next wire is at least 3 units farther | that wire |

Everything else is **NOT tied**: it is listed in `docs/ADDRESS-REVIEW.md` with the reason and **no value is shown**. *Walang value ay mas mabuti kaysa maling value.*

## 3. What changed compared with "nearest"
1. **Distances are measured from the box of the text** (start, width = characters x height x 0.62, DXF alignment), not from its start point. A long address left of a vertical wire was "16 units away" by its start point and got tied to the wrong, nearer-by-point wire.
2. **Pairing is one to one.** A text belongs to one symbol and a symbol owns one text; pairs are taken smallest gap first. Before, each text took "the nearest" independently, so two texts could take the same wire / circle.
3. **A text beside a wire is the label of that wire**, even when a circle or block is also near. The old circle rule (nearest circle within r + 50) gave `SI0219` of the BIR circle to the FFD circle on ABC-001C; the engine then linked two different signals (`net 134 <- net 40`). Gone.
4. **An address written several times along one wire is one address; two different addresses that cannot be told apart are both refused** (they are listed), not given to the first.
5. **Display and engine use the same row.** An AO address used to be tied to the AO output stub by the engine and to the input by the display.
6. The string alone never identifies a position: the same address written at 12 places of ABC-057 (`S3 SI0171`) no longer takes the net of one of them for all.

## 4. How it is checked (all in `tools/`, all counted)
| tool | what it proves |
|---|---|
| `audit-addr-table.js` | the rules R1-R7 over **all** texts (counts, gaps, no text tied twice, no digital net, aliases and same-address-different-signal listed); `--write` regenerates `docs/ADDRESS-TABLE.md` and `docs/ADDRESS-REVIEW.md` |
| `audit-addr-geometry.js` | **independent re-measure** with the real rendered text (`getBBox`) and the real wire segments: for every tie by position, no other analog wire is closer by more than 2 units |
| `audit-addr-values.js` | one visible value per tied text, none in another row, an input change follows the address |
| `test-runaway.js`, `audit-continuity.js` | no positive-feedback loop made by a synthetic link; no tied address without a source |
| visual check | every difference between v1.20.5 and v1.20.6 was LOOKED at on the drawing (`tools/shot-batch.js`); see FINDINGS H-42 |

## 5. What this does NOT prove
* The tie of a text to a wire is still read from drawing **geometry** (text beside wire / symbol). A check against the **meaning** of the drawing (what the engineer intends) is the review list `docs/ADDRESS-REVIEW.md`: sections A (not tied), B (a wire with two different addresses), C (same address on nets that are not one signal), D (ties by pairing, with the other candidates and their gaps). Only the owner can close them.
* The circle `tags` used by the page-link matcher (`audit-links.js` "TAGS DIFFER": ABC-001C FFD / SI0219) are a **different, older proximity rule** in the reader and were not changed here (they only choose between circles of the same number on the other sheet; the audit lists them).
* ABC-052: two circles (`SI0163`, `SI0183`) hang on wires that the reader classes as digital; they stay untied (see review list).
