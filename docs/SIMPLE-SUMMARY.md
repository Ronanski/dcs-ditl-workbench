# SIMPLE SUMMARY - after the user's second round of tests (2026-10-08, WIP, NOT released)

## What the tests of the user found, in plain words
| What you saw | What it really was | Now |
|---|---|---|
| The panel got wider by itself | a rule of mine added 2 px at every refresh | fixed width 380 px, text wraps |
| HMI could not simulate | a see-through layer on every HMI widget caught the mouse (my tests clicked "around" it) | buttons and sliders work, tested with real clicks |
| Trend and panel not in step when you move the SV | **in 30 of the 68 controllers the SV and the PV were swapped** in the Trend / HMI, and the old plant model pushed the SV (the direct-acting controllers have the PV on the other pin) | the PV is the pin that the drawing marks "PV"; all 68 checked |
| Up / down arrows did not update | the arrows changed only the number on screen | they apply the value now |
| PV looks forced and its slider moves with no effect | the model pushed the PV in the middle of the logic | the plant writes the transmitter / input; the slider is greyed with the reason |
| Trend for everything | I made every block show one | only PID, PIDV, MAN, SUMA / integrator, FX |

## What is built (WIP)
1. **Plant layer**: the plant answers at the transmitter (AI) of the measurement, so the selection, average and deviation alarm of the sheet really work. Two controllers on one measurement share one model. A signal that comes from another sheet is written where it starts.
2. **FORCE / SIM**: in the HMI every value has an **F** box: press it and the value is held (analog or digital, in RUN too). The plant, the SV and the manual command do not change a held value. Release: it goes back to the plant value.
3. **HMI controls**: while the HMI is open the panel and the diagram only show; close the HMI to use them again.
4. Gain / time constant / dead time are **estimated from your tuning** (not measured): docs/PLANT-MODEL.md lists every controller.

## Numbers (WIP build)
| What | Result |
|---|---|
| Controllers with a plant model that reach their SV (node) | 54 / 54 |
| Same in the app (links live), sample of 14 | 14 / 14 |
| Forced PV held and released | 54 / 54 loops |
| Forced transmitter not overwritten | 40 / 40 |
| Digital force held | 45 / 45 sheets |
| Plant points disabled in the panel | 66 / 66 (76 free transmitters stay editable) |
| Auto page of the HMI | 741 points on 51 sheets |

## NOT done / not proven
- Motor and valve feedbacks (running, open, closed) in the ABC sheets are still switches you flip; CCS scenario tests are not done.
- Four flow / level loops write the PV wire instead of the transmitter (SQRT scaling question, docs/FINDINGS.md H-30).
- The gain / time constant are estimates by a rule, not plant measurements.
- exe / apk not tested by me. No release yet.


## Which build?
**Logic Sim v1.18.0** (released 2026-10-08). Before it: v1.17.0 (faceplate values, COS, process model, Trend v2).

## What is new in v1.18.0 (HMI v2), in plain words
1. **Auto page** of the open sheet: all controllers (faceplates) and EVERY manual input (analog slider, digital button) that you can operate directly. Inputs that come from other sheets are shown but read only, with the sheet name; PVs simulated by the process model too (set the SV).
2. **Find…** and **Pick on diagram**: search any tag with its description, or click a wire on the diagram and the HMI widget takes its address.
3. **Zoom** (wheel), **pan** (drag the page), smooth move of widgets, **Lock**. All saved with the project.
4. A / M / CAS modes are not HMI buttons: they come from the switching logic; its inputs (.MAN / .LOC / .REM) are among the buttons.
5. Gain / time constant / dead time of the process are NOT in the Excel (plant data); defaults by loop type, editable.
Not done: new drawing tools (only the existing widgets), exe / apk not tested by me.

## What was new in v1.17.0, in plain words
1. **Your real DCS values** (the filled Excel): PID Kp / Ti / Td, output limits, ranges and units; MAN ranges; SUMA values. They come from the FILE, not guessed. DH and CUT were swapped in the PID sheet: corrected (they do nothing in the sim).
2. **COS manual control**: all 173 are recognised (before: 25 were not). Slider or number with the range and unit of the diagram; greyed out when the switching logic does not energize it. The SV of a PID is always usable.
3. **Process model (simulation only)**: PV follows the controller output like a real process (gain, time constant, dead time, disturbance). You control the **SV**; MV and PV move by themselves. The PV sliders are disabled while it is ON. 61 of 62 loops reach their SV.
4. **Trend v2**: Process pane (SV, PV) and Controller pane (MV, P, I, D, error), descriptions, units, axes, sampling, values on hover; the zoom is a floating window with a **control strip** to change Kp, Ti, Td, limits, SV.
5. **DITL signals** list: only the open sheet ("All sheets" to see all). **Right panel** grows to fit its content.
6. Ramp rates of the 8 boxes: diagram text first, otherwise defaults (the screw coolers corrected to 0.05 rpm/s because their range is 0-5 rpm).

## Numbers
| What | Result |
|---|---|
| Block tests | 526 / 526 |
| PID direction and range | 68 / 68 |
| PID closed loop (simple process) | 68 / 68 |
| PID with the process model reach SV | 61 / 62 (1 slow level loop) |
| COS recognised | 173 / 173 |
| Legend matrix | 2 973 / 2 973 |
| Wires that go nowhere | 0 |

## What is NOT proven
- The process model numbers (gain, T, dead time) are guesses by loop type, not your plant. Edit them in the panel.
- dMVH (MV rate limit), TF (filter), MAN TF / FSC, GAP, BND are stored but not simulated yet. ALM limits and SEL defaults are still ASSUMED.
- DXF import test was not run in this release (needs two DXF files; that part was not changed).
- exe and apk: not tested by me. No scenario test of a whole plant sequence yet.

## Next
**HMI v2**: address picker, drawing tools, a complete Auto page with all manual inputs, lock, control from the HMI. Then the CCS scenario test.
