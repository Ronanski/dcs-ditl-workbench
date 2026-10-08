# SIMPLE SUMMARY — latest build (for a non-coder), 2026-10-08

## Which build?
**Logic Sim v1.17.0** (released 2026-10-08). Before it: v1.16.0 (HMI view, Path / exits / Map, DITL signals, Trend).

## What is new in v1.17.0, in plain words
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
