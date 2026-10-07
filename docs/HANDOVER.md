# HANDOVER — continue in a new chat session

## Prompt to paste into the new session (attach nothing unless the user has new files)
```
Ituloy natin ang proyekto sa repo ronanski/dcs-ditl-workbench, branch claude/trusting-goodall-313vmr.
Una, basahin mo (sa ganitong ayos): README.md, DESIGN.md (mga rules na hindi nababago), ang pinakabagong PROJECT-NOTES-v*.md, at docs/HANDOVER.md (kasalukuyang estado at bukas na items).
Huwag mo galawin ang DITL page; sundin ang checklist ng build sa DESIGN.md §3 (guard IDENTICAL, tests, notes, commit/push sa branch, ipadala ang html sa akin).
Ako ay automation engineer (hindi coder): Taglish, simple at tapat, sabihin kung ano ang na-test at ano ang hindi.
Pagkabasa, ibuod mo sa 5 linya kung nasaan tayo at ano ang susunod, at hintayin ang utos ko.
```

## State (v1.12.1)
- Current build: `logic-sim-v1.12.1.html` (analog page, project file Save/Open, portable app shell in `app/`, Windows build by GitHub Actions).
- All 54 ABC sheets read; digital + analog links; SET SV presets on 8 sheets; T legs per leg; timers/comparators fixed on 057/008/014/019.

## Read also: docs/PROGRESS.md (percent), docs/BACKLOG.md (what the user asked to note), docs/BLOCK-LIBRARY.md (block behaviours waiting for his confirmation)

## Open items (ask the user which first)
0. Sheet triage (docs/SHEET-TRIAGE.md, tools/triage.js): fix group A reader defects (18 constants 'value not found', 6 blocks without input), re-run the triage, then review group B sheets worst first.
1. Laptop problem (manual numeric input in Run mode): FIXED in v1.10.2 (dirty-state bug, reproduced and tested). Ask the user to confirm on the laptop. The Diagnostics report (Legend & style > Saving) stays available.
2. "Works only in Pause, not in Run" for T switching: not reproduced. Need screenshot + sheet name + switch states.
3. v1.8.1 "error on refresh": not reproduced (54 sheets x refresh = 0 errors). Need the console message.
4. Address highlight when selected (yellow / sky) with description — waits for the user's IO list.
5. Direction: plant simulator + controller simulator + engineering station (docs/ARCHITECTURE.md). Needed from the user: DITL new-engine permission (rule 1), first loop (ABC-050?), IO list format, what the "operation table" contains.
6. Engine gaps: PID tuning data (real Kp/Ti/Td), SEL healthy-average, CTK write semantics, alarm logic (docs/BLOCK-COVERAGE.md).
7. Unlinked circles: 004A #6 #8 #9, 020 #9; ABC-054 HRP -> 052 has no peer circle.
8. Windows exe + Android apk: built by Actions and published in Releases from v1.12.0 (names logic-sim-vX.Y.Z); neither was run by Claude on a real device. Ask the user how they behave (SmartScreen, Save dialog; apk install, Save = share sheet, Open = file chooser).
