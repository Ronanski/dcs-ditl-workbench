# SIMPLE SUMMARY — latest build (for a non-coder), 2026-10-08

## Which build?
**Logic Sim v1.16.0** (released 2026-10-08). Before it: v1.15.2 (Trace across sheets, DXF import that stays, ABC-004A link) and v1.15.1 (legend matrix).

## What is new in v1.16.0, in plain words
1. **HMI view** (button "HMI"): a graphics page with buttons, lamps, numbers, sliders, valves, tanks, trends and PID / MAN faceplates, all **connected to addresses** (tags, or "DITL 13-69"). Three ways to show it, as you approved: **Tab** (own view), **Float** (a window you can move and resize over the diagram, the diagram keeps running behind it) and **Split** (beside the diagram, draggable divider). A button on an input switches it (one click); a button on a wire that the logic computes FORCEs it and says so. "Auto: this sheet" builds a page from the sheet you are looking at. The page is saved with your project.
2. **Following a signal through many sheets**, also in RUN mode: a **Path** (click any sheet to go back, "Back to start"), the list of **every exit** of the signal, and a **Map** of all the sheets it goes to (each sheet once, no endless loop).
3. **Fixed links:** a circle with several destinations ("TO ABC-001D, TO ABC-020") now links to all of them (4 links were missing).
4. **DITL signals** (button): the 129 signals that come from the DITL are one-click inputs; the 86 that go to the DITL show their live value.
5. **Trend:** a live graph with zoom for any block or wire (PID: SV, PV, MV; linearizers, MAN, integrators, ramps ...).

## Numbers
| What | Result |
|---|---|
| Blocks that follow the legend | 2 973 / 2 973 |
| Links between sheets that carry the value | 182 / 182 (388 → 392 links after H-18) |
| Wires that go nowhere without a reason | 0 |
| Digital outputs the test can drive to 0 and 1 | 2 194 / 2 194 |
| Progress (html only) | 85.9 % |

## What is NOT proven
- DCS-only numbers (PID gains, alarm limits, ramp rates, pulse timing, select defaults) are still ASSUMED (docs/PUNCHLIST.md part 2).
- The tests prove the blocks follow the legend and the drawings; no scenario test of a whole plant sequence yet.
- HMI: tested in the browser here (modes, bindings, FORCE, faceplate, save / restore); not tried on your PC with real use. Symbols change colour / level only (no flow animation); a faceplate has no AUTO / MAN switch of its own (use "open ▸").
- exe and apk: not tested by me.

## Open task of the assistant
**CCS scenario test** (internal): scenarios on the coordinated control sheets using the DITL signals as inputs (docs/BACKLOG.md).
