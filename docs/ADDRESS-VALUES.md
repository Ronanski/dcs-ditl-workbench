# ADDRESS VALUES - the value belongs to the address (v1.20.1, corrected in v1.20.2)

User rule (2026-10-08): "Ang address mismo ang naglalaman ng value, analog man o digital" and "dapat address AT wires, hindi wires lang".

## The rule on a logic sheet
1. **Every text that names a wire (address or tag: M.0126, B.072A, SI0150, AI0290, FICFA1043B.PV, SIG.AB ...) shows its value right after the text**: a number for an analog wire, **1 / 0 for a digital wire**. Same value as the wire, same clock.
2. A wire with several texts (for example FIQDO1043B.PV and SIG.AB on one net) shows the value beside EACH text.
3. Circles that carry a signal from / to another sheet: value beside the tag text of the circle (v1.19.0) - and the value of the other sheet is carried (links).
4. Bare wires and block outputs with no text keep the option **Wire values** (button, default off). The address badges are NOT hidden by that button.
5. Values are read from the same net the wire is drawn on; forced / simulated values show too.

## How it works (patch-addr.js, in the drawing builder)
After the old badges are placed: for every `S.lab[n]` and every `S.tagN` entry, if no badge of the same wire is already within 45 units of the END of that text, a badge is created there. `paint()` writes `0 / 1` for a digital net and the formatted number for an analog net. The badge is flagged `wire:false` (address value).

## What was wrong in v1.20.0 (found by tools/audit-addr-values.js)
2316 address / tag texts on the 51 sheets: **876 had a value, 1440 had none** (277 analog: a net with several texts got ONE badge; 1163 digital: digital wires were only coloured orange / grey, no 1 / 0). The earlier test (test-badges) only checked that bare-wire numbers were hidden, not that every address had one (DESIGN rule 19).

## Test
`node tools/audit-addr-values.js <html>`: 2316 of 2316 address texts have a value; input -> address: ABC-003B digital input B.072A set 0 -> 1, the badge beside the address follows 0 -> 1.
NOT tested: overlap / readability of the numbers on every sheet (many small numbers: use Fit / zoom); the exe / apk screens.

## Correction v1.20.2 (user, same day): "Analog lang may LIVE value. Ung digital kahit wala na."
- Only **analog** address texts get the live value (1144 of 1144, tools/audit-addr-values.js). **Digital** addresses (1172 texts) are shown by the colour of the wire only - the 1 / 0 badges of v1.20.1 are removed again (patch-addr.js skips digital nets). The Digital values stay visible in the right panel and in the Trace list.
- Test: input -> address: a labelled analog input set 2 -> 7.5, the number beside the address follows; no digital badge.

# LINK TO THE DITL PAGE (v1.20.2)
User: "ung link sa DITL, di gumagana". The ABC sheets say "( FROM DITL 13-69 )" / "( TO DITL 02-63 )". Until v1.20.1 nothing happened when you clicked them (the DITL signals list only showed the reference as text).
- Click the **circle** that carries a "FROM / TO DITL pp-nn" text, or the **DITL reference** in the "DITL signals" list: the app switches to Digital - DITL and opens the DITL sheet pp (name ends with DITL-pp; a code with an extra letter that has no sheet, like 80S, opens DITL-80). The DITL page is not changed. To come back press Analog - ABC.
- Tested (tools/test-ditl-link.js): all 124 DITL references of the 51 sheets open a DITL sheet; the circle click on ABC-003B "( FROM DITL13-69 )" opens the DITL page.
- NOT done (earlier decision of the user): the DITL page is not simulated together with the ABC set; a FROM DITL signal stays a one-click input of the ABC sheet. The item number nn is shown in the message, the DITL cell is not highlighted. Live exchange (a DITL motor state driving the ABC input) = ask the user.
