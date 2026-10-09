# CONTINUITY OF THE ANALOG SIGNALS (v1.20.3)

User (2026-10-09): "Icheck mo lahat ang ABC sheets kung may analog signals tag / address na di nakakatanggap ng value (receiving, giving, manual inputing). Dapat sure ang continuity ... wires connection to symbols / page link / addresses / tags; may arrows, wires at junction points."

## Method (tools/audit-continuity.js, run on the built html in RUN mode)
For EVERY analog address text of the 51 sheets (1410: SI / AI / AO numbers, instrument and valve tags, controller tags with .PV / .SV / .MV):
1. **Receives** = the wire of the address has a real driver (a block output), or a circle / address link that ends at a driver, or it is a manual input (input of the sheet, COS manual value), or it comes from another sheet (link circle), or it is the field input of an AI triangle.
2. **Gives** = the wire feeds a block pin, a circle that leaves the sheet, or the field (AO / TCS).
The audit lists what fails both and how each one is explained. It is part of the regression (exit code 1 when something is unexplained).

## Result
| | v1.20.2 | v1.20.3 |
|---|---|---|
| analog addresses | 1437 | 1410 (non-address texts are no longer counted) |
| receive no value (no source) | 50 | **0** |
| give nothing (no sink) unexplained | 97 | **0** (18 explained, below) |

## What was wrong and is fixed (reader / resolution)
1. **Link circles with a long name were not circles** (ABC-008 "PAF-MV / 007" and "SAF-MV / 007", radius > 8.3): the signal from ABC-007 never reached the X block of the flow demand. Circles up to radius 12 with two texts (name over a sheet number) are now taken.
2. **"PRI / SEC / AVG SELECT CIRCUIT" boxes wider than 46 units were skipped** (ABC-001C, ABC-008, ABC-031): the select block did not exist, its output wire had no source (the MUL block behind it read 0). Select boxes up to 64 wide are now blocks.
3. **The tag of a circle named its stub wire**, not the signal wire (ABC-004A CFD / TCF, 004B / 004C SI0311, ABC-005 TCF1, ABC-007 PAD / PAF / SAD / SAF, ABC-014 FAF ...): the address showed 0. Now the signal wire.
4. **The address of an AO block (AO0231 on ABC-004A) and the same SI / AI / AO written at several places of a sheet is ONE signal**: the free end with the arrow ("AO0231" read-back that feeds the DEV and the T tracking input) now follows the AO command instead of staying at 0.
5. **AI triangles with the valve positioner (ZT-MS1020, ZT-HR1010 ... AI0384 / AI0385 / AI0387)**: the wire enters the triangle from the field; the address shows the transmitter value (the AI), it is a field input, not a missing wire.
6. **Instrument tags** (AT-FG1122 = AI0273 by the IO list; PID / MAN tags: the real output, not a stub of the box border).
7. test-links-all: the last FAIL (ABC-004A > ABC-005 TCF1) was a test artefact (the test forced a wire that the plant model holds); the test now releases the plant hold like the real force does. 182 of 182 links carry the signal.

## Explained "give nothing" (18, not errors)
- 12 totalizer displays (SUMA outputs FIQDO1043A..D, FIQCD1120 / 1121, FIQMS1031): the drawing shows the total, no block uses it.
- 2 "SET value => TAG.SV" instructions (ABC-052 SI0196, SI0254): the wire ends at the SET contact.
- 1 output to the field (ABC-001C AO0359 "TO TCS").
- 1 second copy of an address (ABC-002 SI0061): follows the driven wire.

## Not a signal (not counted)
LN tables, sheet names, timers TR..., function-block pin names PS / PM (ABC-003E), digital addresses, motor tags (MOF- / SC-L / INV-M), MW1, DP1, AB0117.

## Still open (told honestly)
- 61 analog wires with a free end and no text (docs/WIRING-SUSPECTS.md B): most are COS manual inputs (SV / value, they have a widget), RATE ramp inputs (ABC-003E) and DEV SV inputs; a few (ABC-001B net 9, ABC-001D net 59, ABC-007 net 25 / 49 ...) were looked at, none was proven wrong; not every one was checked on the drawing by eye.
- A value of 3333333 beside SI0210 / SI0226 (ABC-001B): a division by a very small number in the logic (not checked against the DCS).
- Digital addresses were not part of this audit (user: only analog has a live value).
