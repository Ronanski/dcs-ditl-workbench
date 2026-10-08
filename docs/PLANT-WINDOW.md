# PLANT WINDOW (v1.20.0 WIP) - system 1: REHEATER

User request (2026-10-08): "plant graphics na mismo, tapos pop out nalang na new window ... sariling app, pero ico-call mo lng"; first system = REHEATER (HP bypass, LP bypass); "gusto ko makita ang values na nilalaman ng mga addresses".
This is an **offline educational simulator**. It is not connected to the plant.

## What it is
- Button **Plant** in the toolbar of the analog (ABC) view. It opens a **second window** (pop-out). Where the browser or the apk blocks pop-ups the same picture opens as a floating window inside the app.
- Same engine: nothing is copied. Every number is read from the ABC sheets (the sheets that carry the address keep running while the window is open).
- The drawing follows the DCS snapshot `5.png` ("005 REHEATER STEAM SYSTEM"): main steam, HP bypass (PCV-MS1020 + spray TCV-FW1060), cold reheat, reheater, reheater inlet spray (TCV-FW1150), hot reheat, LP bypass (PCV-HR1010 + spray TCV-CD1115), hot R/H steam pressure control (silencer valve MV-HR1391), S/H panel #2 inlet (MV-BR1391).
- **Values**: tag (white) and value (cyan) like the DCS screen. A transmitter is found by its **IO tag** (PT-MS1006-1 ...) - the address owns the value, not a wire.
- **Control boxes** (right side): HP-BYPASS (PCV) PICMS1006, HP-BYPASS (TCV) TICMS1022, LP-BYPASS (PCV) PICHR1003, LP-BYPASS (TCV) TICHR1012, HOT R/H STM PRESS CTL PICHR1391, S/H PANEL #2 INLET HICBR1391: PV, SV, MV of the PID of the sheet.
- **Valves**: red = closed (<= 2 %), green = open; the number is the MV (output) of the controller of that valve. The pipe after a control valve dims while the valve is closed.
- **F box** (same as the HMI had): `F` grey = free, `P` blue = driven by the plant model (read only), orange `SIM` = field point held by you, orange `FRC` = logic point held by you. Click the value to set it (only for inputs and held values). A computed value (for example the SV that the sheet builds with ramp / AMT) must be held with F first.
- **Ownership**: while the plant window is open the sheets and the panel only show (greyed controls, banner); close the window and they work again (same rule as the old HMI).
- `--` = the address is not an AI block on any ABC sheet (nothing simulates it): TT-MS1007, FT-FW1059, FT-FW1149, PT-HR1001, TT-HR1010, PT-HR1011, FT-CD1115, and the position feedback of the motor valves (ZT-MS1391 ...). `n/a` under a valve = no logic for it on the ABC sheets (block valves XV-FW1061 / XV-FW1151 / XV-CD1114, TCV-FW1150, MV-MS1391).

## Operating point (snapshot values)
The DCS snapshot is a running plant at one moment. At the first opening, the transmitters that nobody set and that no plant model drives start at the snapshot values (FIQMS1031 482.2 T/H, PIMS1021 35.7, PICR1003 35.3, TICR1004 370, ...); the plant model of the four bypass loops and of TICHR1002 gets an offset so that its PV sits at the snapshot value (121.1, 360, 34.4, 136, 540) at mid output. The values are ASSUMED = the screenshot, not an IO-list value.

## Tested (tools/test-plant.js, Playwright) / NOT tested
| Tested | Result |
|---|---|
| Plant button present, HMI button not visible | pass |
| Plant graphic opens as a separate window, 213 texts drawn | pass |
| field -> wires -> output: SIM of PT-MS1006-1 (14 above the SV) through the F box -> the HP bypass valve (MV of PICMS1006, direct) opens more through the drawn wiring (29.9 -> 50.3 %) | pass |
| every PID from its PV / SV pins: output follows ACT:N / ACT:R (tools/test-pidsign.js) | 65 of 65 (v1.19.1: 36 of 65) |
| the value forced on the transmitter is the value on the sheet (same address) | pass |
| window open = panel read only; closing the window releases the sheets | pass |
| no page errors | pass |

NOT tested: the apk / exe pop-out behaviour (floating fallback is coded, not tried on a phone); other screen sizes; digital feedbacks (ZSO / ZSC); the full behaviour of the PICHR1391 / HICBR1391 (PIDV) boxes (they show 0.0 until the sheets feed them).

## Known limits
- No coupling between loops: each loop has its own first-order plant (physics are not important, user). Closing the HP bypass does not raise the main steam pressure.
- The SV of a loop is what the sheet logic gives (often 0 at start). Press F on the SV and type a value.
- **PID direction fixed (FINDINGS H-37).** Found while mapping this screen: the 29 ACT:N loops acted reverse; now ACT:N = direct (the bypass valve opens when the pressure is ABOVE the SV, the DCS snapshot shows MV 0.0 below it). Please confirm with the DCS.

## Regression of the WIP build (all on the same build, 2026-10-08)
blocks 526/526 · math 998/998 · legend 0 mismatch · PID 68/68 · loops 68/68 · pidsign 65/65 · legend-matrix 2973/2973 · links (1 known FAIL ABC-004A>ABC-005 TCF1, same on v1.19.1) · COS (same as v1.19.1) · proc 55/55 · force-all 55 / 41 / 45 · lock-all (68 plant points disabled, 74 free) · fixes · own · ui-real · trend · hmi · hmi2 (linked inputs skipped: read only by design) · path · circles 82/82 · trace-x 148/148 · reach 0/0 · plant · badges · DITL guard IDENTICAL. Not re-run: test-numinput (prints 'no INPUT box' info on v1.19.1 too).

## P&ID check (user's flow diagrams K1AU3-A1-0-001 rev A (65 sheets) and rev B (24 sheets), FHI / SMC Limay; read 2026-10-08)
- PD-011 MAIN STEAM: the **HP turbine bypass valve PCV-MS1020** takes steam from the main steam header (before MSV) and discharges to the cold reheat line (HP exhaust); its spray water TCV-FW1060 comes from the feedwater system (PD-017). So it RELIEVES main steam pressure: it must open when the pressure is ABOVE the SV = direct. This agrees with the snapshot and with the H-37 fix.
- PD-012 COLD / HOT REHEAT: **LP turbine bypass valve PCV-HR1010** takes hot reheat steam to the condenser (PD-016 condensate spray TCV-CD1115): same logic, opens on high pressure = direct. Hot R/H pressure control MV-HR1391 + silencers Z-1004 / 1005 / 1006 (blow-off to atmosphere) = also relief = direct. Reheater inlet spray from feedwater (PD-017), S/H panel #2 inlet BR-1-005 to the reheater inlet header.
- PD-013 / 014: extraction steam and auxiliary steam (cold reheat -> AS-1-004 -> aux. steam PCV-AS1005, silencer Z-1007) - for later systems.
- The P&IDs do not show the FAIL position of the valves nor the controller action; the direction used is the process common sense (a relief valve opens on high pressure; a spray valve opens on high temperature; a feed valve opens on low level) checked with the DCS snapshot values.
- Rev A has the air / flue gas (PD-051 .. 054), coal (PD-061), limestone, sand and ash systems: the source for the next systems (PAF / SAF, coal, air).
