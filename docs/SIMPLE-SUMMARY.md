# SIMPLE SUMMARY — latest build (for a non-coder), 2026-10-08

## Which build?
**Logic Sim v1.15.1** (released 2026-10-07, GitHub Actions run #11: success, exe + apk + html in the Release). After it there is a WIP (not released, no "go" yet) with the persistent DXF import.

## What v1.15.1 is, in plain words
1. **Every block of every sheet was tested against the legend (ABC-000).** 2 973 blocks on 51 sheets: AND, OR, NOT, timers, flip-flops, comparators, math, switches, MAN, PID, ramps, selectors, valves, integrators. Result: **all 2 973 do what their symbol says.**
2. **Two reading mistakes found by that test and fixed:** one AND gate on ABC-001D drawn mirrored (it had no pins), and three small valve-positioner boxes on ABC-008 and ABC-014 read as a calculation block (they are field devices).
3. **The links between sheets** (circles and "FROM / TO" texts): 182 of 182 carry the signal; the 45 lines where the two ends show different tags were all looked at: all are correct pairs.
4. **Nothing changed on the DITL page** (the guard says IDENTICAL).

## What was added after it (WIP, not released)
- ABC-004A: two circles "A" are now linked (the signal arrives).
- The last digital output that the automatic scan could not reach (timer TR256 on ABC-003E) works as the legend says; shown by a step-by-step test.
- All 68 PID / PIDV were run in a closed loop with a simple process: they settle, do not oscillate more and more, and stay inside their output range (the process is simple, not your real plant).
- **Imported DXF stays after you close the app**, with a report of what is different from the built-in drawing (button "Imports").
- A printable form for the DCS values (docs/DCS-DATA-FORM.pdf).

## Numbers
| What | Result |
|---|---|
| Blocks that follow the legend | 2 973 / 2 973 |
| Links between sheets that carry the value | 182 / 182 |
| Wires that go nowhere without a reason | 0 |
| Digital outputs the test can drive to 0 and 1 | 2 194 / 2 194 (the last one by the sequence test) |
| Timers equal to the memory list | 150 / 153 (the 3 others: ABC-052 ignored, ABC-001C TR0228 simulated as drawn, 1 not in the list) |
| AI ranges equal to the IO list | 157 / 157 |
| Progress (html only) | 84.0 % |

## What is NOT proven
- The numbers that only the DCS has (PID gains, alarm limits, ramp rates, pulse timing, select default) are still **ASSUMED** by the simulator: the logic is right, the values are estimates. They are all listed in "Assumed values" and in docs/PUNCHLIST.md part 2.
- The tests prove that blocks follow the **legend and the drawings**, not that they behave like your DCS in every detail.
- The block kinds are not yet confirmed on your own screen (that is why block behaviour is capped at 60 %).
- exe and apk: not tested by me.

## Open task of the assistant
Trace into other sheets (follow an output into the sheets that receive it).
