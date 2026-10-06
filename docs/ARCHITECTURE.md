# Direction (agreed with the user)

Goal: an OFFLINE plant simulator + controller simulator, with this workbench as the ENGINEERING STATION.
No server, no OPC / eDNA / VPN (plant rules). Portable Windows app, NO admin rights.

```
 Engineering station (UI)  <->  tag database / project file  <->  Controller sim (scan engine: DITL + ABC)
                                                                         ^   |
                                                                         |   v  AO/DO  -> AI/DI
                                                                   Plant simulator (process models)
```

Steps
1. v1.10.0  project file (Save / Save as / Open, Ctrl+S) + Electron portable shell (app/) built by GitHub Actions.   <- done
2. Split the code into modules (reader, engine, UI, DITL) with automated per-sheet tests; keep results identical.
3. Tag database + IO list import; ONE scan engine for DITL + ABC (DITL page must stay identical: prove by tests); real PID.
4. Plant model of ABC-050 (HP bypass pressure) closed loop + trends.
5. Operation table / start-up scenarios (initial-condition snapshots).
6. More areas.

Open questions for the user: DITL engine replacement allowed if results stay identical; first loop = ABC-050?; IO list format; what the "operation table" contains.
