# CLAUDE.md - basahin muna ito (Logic Sim)

Project: Logic Sim, offline simulator ng DCS logic drawings (DITL digital + 54 ABC analog sheets). Isang HTML file, portable EXE, Android APK.

**Sa bagong session, basahin sa ganitong ayos bago gumawa ng kahit ano:**
1. `docs/HANDOVER.md` - NASAAN TAYO NGAYON, ano ang susunod, mga pangako sa user, kung paano mag-continue (may paste-in prompt).
2. `docs/RELEASE-PROTOCOL.md` - ang standard na protocol sa BAWAT release (mga deliverable, Taglish report, manual testing guide, verification).
3. `DESIGN.md` - mga rules na hindi nababago + checklist ng build.
4. Pinakabagong `PROJECT-NOTES-vX.Y.Z.md` (changelog) at `docs/REPORT-vX.Y.Z.md` (technical report).

**Ang user:** automation engineer, HINDI coder. Sumagot sa simpleng Taglish (mga 80 % Tagalog, 20 % English), tapat, malinaw. Sabihin kung ano ang PASS / FAIL / NEEDS REVIEW / NOT TESTED. Huwag manghula ng connections, values o test evidence.
**Ipadala sa chat (SendUserFile) ang PDF report at ang HTML build** pagkatapos ng release. Hindi kailangan ng links sa chat maliban kung hihilingin.
**Hindi pinapagawa ng coding o vague na test instructions ang user.**
**Huwag galawin ang DITL page** (`node tools/guard-ditl.js baseline/ditl-workbench-v1.0.0.html logic-sim-vX.Y.Z.html` = IDENTICAL).
**Walang bagong version o pagbabago ng simulation code** para lang sa documentation, at walang bagong release nang walang "go" ng user.
