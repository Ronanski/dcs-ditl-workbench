# FINDINGS — what the logic verification found wrong (and how to check it yourself)

Method: every finding was found by an automatic scan, then **looked at on the drawing** (with the arrows) before it was called wrong. Coordinates are drawing units (x, y); picture of a place: `node tools/shot-region.js <html> ABC-xxx x y 60 out.png`, several at once: `node tools/shot-multi.js <html> out.png "ABC-xxx,x,y,60" ...`.
Status: **R-xx** = already released (v1.14.2 / v1.14.3). **F-xx** = fixed in the WIP v1.14.4 (not released until the user says "go"). **O-xx** = open / low risk.
"Before" = what the simulator did with the old reading. Forcing a wire in the app: click the wire / tag, type the value, press the check button (RUN or PAUSE).

## A. Fixed in WIP v1.14.4 (not released)

| ID | Sheet · block · place | What the DRAWING shows | What the simulator did BEFORE | How to check (after the build) |
|---|---|---|---|---|
| F-01 | ABC-002 · MUL #60 (385, 462) and MUL #55 (408, 417); ABC-001C · MUL #32 (795, 132) | An "X" box with ONE input and a number written above it: **0.8**, **1.2**, **1** = multiply by that constant | The number was ignored: output = input × 1 | Force **SI0315 = 50** → **SI0018** must be **40** (was 50). Force **SI0316 = 50** → **SI0019** must be **60** (was 50). ABC-001C: HIC-BM.MV → SI0213 stays equal (× 1) |
| F-02 | ABC-001C · SUB #2 (577, 330); ABC-005 · SUB #15 (353, 500) | "+" on the wire from BELOW, "−" on the wire from the RIGHT (the sign text is 9 – 13 units from its pin) | The sign text was not attached: the box subtracted the wrong way (ABC-005 even −a −b) | ABC-001C: force **SI0201 = 30**, **SI0213 = 50** → **SI0224 = 20** (SI0213 − SI0201; was −20). ABC-005: output = (wire from below) − **SI0337** |
| F-03 | LAG "f(t)" boxes: ABC-002 LAG #24 (124, 313) "30Sec" and LAG #36 (620, 534) "180Sec"; ABC-010 LAG #57 (319, 579) "30Sec"; ABC-020 LAG #43 (521, 655) "100Sec"; ABC-053 LAG #20 (196, 526) "2Sec" | The time constant is written to the LEFT of the box | Text not found: default **15 s** for all five | Step the LAG input 0 → 100 and run: output reaches ≈ 63 after **30 s / 180 s / 30 s / 100 s / 2 s** (was 15 s). Wires: ABC-002 SI0023 → (74); SI0318 → SI0052; ABC-010 SI0263 → SI0261; ABC-020 (20) → S2 SI0120; ABC-053 AI0534 → SI0261 |
| F-04 | ABC-013 · TPS TR74 (706, 413) "TPS **300s**" | Pulse timer 300 s (the hold loop of M.025B) | Time text further than the search radius: default **5 s** | After a rising edge on its input (wire 17) the output (29) stays 1 for **300 s** (was 5 s). Together with R-xx: M.025B holds 300 s |
| F-05 | ABC-001C · (405, 240) "18% / Hr (0.005% / sec)"; ABC-001D · (390, 202) "2.7T / HR = 2.25% / HR" and (587, 202) "1.8T / HR = 1.5% / HR" (box "V⟩", FM403) | The **RATE LIMITER** symbol of the legend (ABC-000: "V⟩"): input, "1 : Bypass / 0 : Rate" input, rate in % / hour | Read as a HIGH LIMIT = minimum of its inputs, i.e. min(signal, bypass 0/1): **the signal was destroyed** | ABC-001C: step **SI0245** 10 → 60 with bypass 0: **SI0235** rises 0.005 per second (18 % / h); with bypass = 1 it follows at once. ABC-001D: M.2038 / M.2039 are the bypass inputs; SI0217 + SI0218 → SI0219 |
| F-06 | Grey blocks that were not recognised at all (their outputs were never driven): ABC-001A (746, 359) limiter with texts HIGH LIMIT / LOW LIMIT; ABC-001A (393, 368) and (140, 368) boxes with "+" / "−" at the pins; ABC-001B (686, 442) "RATE LIMIT" FM0403; ABC-001D (454, 201) box with a drawn "+"; ABC-026 / 027 (477, 579) tall bar with 4 + 4 inputs | ABC-001A: clamp of HIC-ULD.MV between SI0206 and SI0204. The two small boxes: D (SI0200) "+" and the wire from below "−" (see the picture). ABC-001B: rate limiter with its rate from above and 1:BYPASS from below. ABC-001D: adds the two rate limiters (SI0217 + SI0218 = SI0219). ABC-026 / 027: summation = "QUANTITY OF NORMAL TRANSMITTERS" | No block: the output nets stayed undriven (0) | ABC-001A: force **HIC-ULD.MV = 500**, **SI0204 = 80**, **SI0206 = 20** → output **80** (input −5 → 20, input 50 → 50). ABC-001D: output SI0219 = SI0217 + SI0218. ABC-026 / 027: the bar output = sum of its 9 – 10 inputs |

## B. Already released (v1.14.2 and v1.14.3)

| ID | Sheet · place | Drawing | Old reading | Check |
|---|---|---|---|---|
| R-01 | ABC-004A / B / C · ⊠ on the 1:BYPASS wire | NOT (⊠): signal comes from the M.0146 loop below, goes up to the ramp's bypass | Pins swapped: the ⊠ became a second driver of M.0146 ("wired-OR") | `node tools/multi-driver.js <html>` → 0 nets with 2+ drivers (was 43) |
| R-02 | ABC-055 · NOT #29 (391, 401) M.0315 → TR232; ABC-055 NOT #33 M.0319 → AND; ABC-003E (693, 512) M.008F → TR256; ABC-007 M.0188 (202, 430); ABC-020 M.017C (646, 429) | NOTs on wires with an elbow: flow right-to-left or into the arrow of the next block | IN / OUT swapped: M.0315 was **1 with every input of its AND at 0** (the screenshot of the user), FF #8 of ABC-055 could not be reset | ABC-055: all inputs 0 → M.0315 = 0 and TR232 input = 1; `node tools/test-legend.js <html>` → FF 282 cases, 0 mismatch (v1.14.2: 4) |
| R-03 | AND gates with a tall body, a body drawn as ONE rectangle or a bracket: ABC-003A / 003E / 017 / 052 / 001C (12 gates; ABC-003E (469, 582) 4 inputs M.3412 / 3413 / 3418 / 3419 → M.0090 "ALL BURNER IN SERVICE") | AND symbol of the legend (bar + box) | Not recognised: no gate, M.0090 had no driver | ABC-003E: output M.0090 = 1 only when the four inputs are 1 (truth table tested) |
| R-04 | ABC-001D · DCMP #19 (four outputs with elbow wires) | 4 tests: ">= 2 MW", "< 0.3 MW", "<= −2 MW", "> −0.3 MW" | Only 2 of the 4 were read (text sits over the far end of the wire) | 4 of 4 read; justify: all outputs reach 0 and 1 |
| R-05 | ABC-009A (702, 166) M.0308 and ABC-009B (455, 182) M.0328 | ONE OR with 3 inputs (bar drawn in two overlapping pieces) | Two OR gates on one circle = two drivers of one net | One OR with 3 inputs |
| R-06 | ABC-015 / 016 · the MAN boxes HICFA10xx | One MAN box each; the PV wire passes under the box | 16 boxes were drawn twice = 16 duplicate MAN blocks; a stub at the box edge made the MAN a second driver of the transmitter (PV) net | `node tools/dup-blocks.js <html>` → 0. AI = 37, MAN = 55 → PV 37, MV 55 |
| R-07 | ABC-001B "C – UNIT LOAD DEMAND (SI0226) ( TO ABC-001A ) ( TO ABC-001C )", also G, X, MWD, BIR (001A / B / C / D), circle 6 (009A → 009B), "( TO ABC-004B/C )" (004A circle D → 004B **and** 004C) | Signal continues on the other sheets | Circles of radius 8.0 – 8.2 were skipped; sinks whose wire stops short of the circle were not attached; "004B/C" only read as 004B | Circles with a FROM / TO text: 60 of 60 linked; two-text circles (name / sheet): 303 of 304 (the 304th, ABC-054 HRP, is linked by its tag SI0180) |
| R-08 | ABC-001A SI0226 / SI0212 | They come from ABC-001B | Linked **by tag** to the wrong sheets (ABC-050, ABC-037) | The link now comes from ABC-001B |

## C. Open / low risk (not fixed, listed so you can judge)

| ID | Where | What | Effect |
|---|---|---|---|
| O-01 | ABC-008 SUB #21 (681, 138); ABC-014 SUB #8 (330, 228), #19 (696, 228) | The small two-cell blue box above the I/P (valve positioner, field side) is read as a SUB with one input and no output | None on the logic (no output) |
| O-02 | 35 PID and 22 MAN (e.g. ABC-003A PID #13) | Tick marks at the left / right edge of the box are read as extra output pins on a stub net | None (nobody reads that net), only extra "outputs goes nowhere" in the scan |
| O-03 | ABC-003E · CMPK #8, #13, #18, #23 | Input "A" of the "< X%" comparators comes from a circle of another sheet (A / 003A … 003D): check on the real run that the link is live | To confirm in the app |
| O-04 | 14 digital outputs | Reached only by a SEQUENCE of input changes (latches, pulses, edges): ABC-013, 050 LC #58 / AND #101, 052 (user: ignore), 055 | Not a defect: proves the simulation can reach them, not that the plant does |

## D. Scans (all in tools/, run with node)

`audit-sheets.js` (pin role vs the arrow of the drawing, pins per block kind, floating inputs) · `audit-signs.js` (+ / − of SUM / SUB / ADD / DEV against the texts: 486 input pins, 352 with a sign text, 0 disagreements left) · `audit-params.js` (comparator set points, timer times, LAG times against the texts again) · `audit-shapes.js` (boxes that did not become a block: 0 left) · `multi-driver.js` · `dup-blocks.js` · `test-legend.js` (FF table and timer diagrams of ABC-000) · `justify.js` (every digital output can reach 0 and 1).

## E. NOT checked yet (honest list)

Block-by-block comparison of the **function blocks against the PDF drawings, sheet by sheet** is not finished: PID details (real gains, alarm limits, REM/LOC), the FX tables are identical to LINEAR.xls (89 of 89) but their use on each sheet was not compared one by one, SEL / CTK / TP behaviour is as agreed with the user but not compared per sheet, DIV order (a / b) was read from the formula text only. The automatic scans above find reading mistakes; they cannot find a wrong formula that is read consistently.
