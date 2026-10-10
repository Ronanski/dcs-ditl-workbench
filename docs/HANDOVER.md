# HANDOVER — continue in a new chat session

## Prompt to paste into the new session (attach nothing unless the user has new files)
```
Ituloy natin ang proyekto: Logic Sim (simulator ng DCS logic drawings) sa repo ronanski/dcs-ditl-workbench, branch claude/trusting-goodall-313vmr.

BASAHIN MUNA, sa ganitong ayos, bago gumawa ng kahit ano:
1. README.md
2. DESIGN.md  (mga rules na HINDI nababago + checklist ng bawat build, §3)
2b. docs/FUNCTIONALITY.md (ANO ang dapat gawin ng bawat symbol - ito ang batas), docs/LINKING.md (page links), docs/FINDINGS.md (mga nahanap na mali + paano i-check), docs/DATA-FILES.md (mga file na binigay ng user at saan ginagamit - wag nang hingin ulit), docs/ASSUMED-VALUES.md (LAHAT ng numerong wala sa drawing: galing sa file o assumed), docs/REPORT-v1.15.0.md (buong report: findings, ginawa, as-left)
3. PROJECT-NOTES-v1.20.8.md  (ang pinakabagong entry sa taas; ito rin ang changelog)
4. docs/HANDOVER.md  (estado + bukas na items + mga pangako sa user)
5. docs/BACKLOG.md  (ang "Logic scan" sections sa dulo = ang kasalukuyang trabaho)

RULES NG USER (huwag kalimutan):
- Ako ay automation engineer (hindi coder): Taglish, simple, tapat, engineer-style. Sabihin kung ano ang na-TEST at ano ang HINDI.
- WALANG build / release / push ng bagong version hangga't wala akong "go". Mag-commit/push ng WIP sa branch ay ok (walang PR). Ang build = patch script -> logic-sim-vX.Y.Z.html sa root (isa lang ang html sa root), guard IDENTICAL, tests, notes + manual + PDF, archive ng lumang html, push (GitHub Actions ang gumagawa ng exe + apk + Release), SendUserFile ang html. Exe/apk: ako na ang magte-test; html lang ang ipadala.
- DITL page: HUWAG galawin. Guard: node tools/guard-ditl.js baseline/ditl-workbench-v1.0.0.html <html>  -> dapat IDENTICAL.
- Kapag may drawing na pinag-uusapan: TINGNAN mo ang drawing (node tools/shot-region.js <html> ABC-xxx cx cy width out.png, tapos Read ang png) at itunton ang wiring; huwag manghula. Ang user ay nagbabasa ng diagram at hindi gusto ng mga tanong na masasagot mo sa pagbasa.
- Ang comparators (HC/LC) ay may range at gumagana (test-comparators 238/238): huwag isiping sira ang "stuck" na galing lang sa random na test.
- ABC-052 AND #112: huwag pansinin. ABC-002 #32 ratio = SCALE CONVERT (a / b as written).

KASALUKUYANG ESTADO (v1.14.3, released): modes VIEW (default, grey, click = auto trace) / RUN / PAUSE (Back + Next 1-60 s); thin solid wires; descriptions ng IO/memory lists (hover + selected); 54 ABC sheets read; switching (T, A/M, COS, Y/N) verified 382/384; 100 % (2100/2100) ng digital outputs ay naaabot sa simulation (tools/justify.js; 14 sa sequence lang).

SUSUNOD NA GAWIN (ayon sa pagkakasunod):
A. TAPOS na sa v1.14.2 (33 na hindi naaabot -> 0; mga ⊠ NOT at AND gate na maling basa ang inayos).
B. (nagsimula na sa v1.14.3: legend test, circles, MAN) Sheet-por-sheet na pag-verify ng LAHAT ng block kinds (multiplier, rate limit, divide, PID, T, COS, SUB, SUM, ramp, FX, hindi lang gates) sa 51 sheets,  laban sa drawing: simulan sa mga sheet na may pinakamaraming "stuck" (node tools/triage.js, tools/stuck-roots.js). Tingnan ang drawing, ayusin ang reader, i-test.
C. Mga tanong na dapat kumpirmahin ng user (isang beses lang itanong, may rekomendasyon): "/" na kahon sa ABC-001B = "T = B / A * 100 / 60" (tinawag niyang "rate"); DROP RATE (ABC-055) sign at window (30 s default); .MAN tags digital; DCMP sign (PV-SV vs DEV = SV-PV); siyam na FF dominance cases; TP formula; totoong PID gains / alarm limits (DCS database).
D. Pagkatapos: manual (docs/MANUAL.md + PDF: node tools/build-manual-pdf.js) ay i-update sa bawat release; susunod na malaking hakbang = plant simulator / controller simulator (docs/ARCHITECTURE.md, docs/PLAN.md) — itanong muna ang pagkakasunod.

Pagkabasa, ibuod mo sa 5 linya kung nasaan tayo at ano ang uunahin mo, at simulan agad ang A (walang hihintaying tanong maliban kung kailangan talaga).
```

## State (v1.14.3)
- Current build: `logic-sim-v1.14.3.html` (root). Patch script: `tools/patch-1.14.3.js` (reads archive/html/logic-sim-v1.14.2.html, writes root). Old patches: tools/history/.
- Notes / changelog: PROJECT-NOTES-v1.20.8.md. Manual: docs/MANUAL.md + docs/Logic-Sim-Manual.pdf (attached to each Release). Percent: docs/PROGRESS.md (Phase 1 ≈ 65.3 %).
- Releases: GitHub Actions (.github/workflows/release.yml) builds exe + apk and publishes vX.Y.Z when a root logic-sim-v*.html is pushed. User tests exe/apk himself.

## Tools you will use (all in tools/, run with node)
- lib.js (load the engine + sheets without a browser), guard-ditl.js, patch-<ver>.js (the build), version.js
- Tests (browser, Chromium via /opt/node-tools/node_modules/playwright): test-modes, test-project, test-storage, test-storage2, test-numinput, test-pid, test-ln, test-anim, test-circles, test-ades, test-addr-ui, test-back-manual; engine tests (node only): test-comparators, test-switch
- Scan: triage.js, stuck-roots.js, zero-analog.js, multi-out.js, audit-switch.js, justify.js, why-stuck.js <html> <sheet> <block id>, ades-coverage.js, ext-type.js, undriven.js
- Pictures: shot-region.js <html> <sheet> <cx> <cy> <width> <out.png> (then Read the png)
- Notes: bump AN_PV in the patch whenever reader numbering of nets / blocks changes (now 14); never reference a const before its definition; no phone testing.

## Read also: docs/PROGRESS.md, docs/BACKLOG.md, docs/BLOCK-LIBRARY.md, docs/PLAN.md, docs/ARCHITECTURE.md

## Open items
1. (done in v1.14.2: all outputs reachable.) 2. Sheet-by-sheet verification (B). 3. User confirmations (C). 4. Shapes still unrecognised: none known after v1.14.1 except the duplicated DCMP outputs. 5. Real PID tuning / alarm limits need the DCS data. 6. Direction: plant simulator + controller simulator + engineering station (offline).
