# REPORT v1.20.1 - a value beside every address

User: "Ayusin mo yung mga values na walang value na dapat meron ... address at wires, hindi wires lang ... analog man o digital".
- Audit (tools/audit-addr-values.js) on v1.20.0: 2316 address texts, 876 with a value, **1440 without** (277 analog, 1163 digital).
- Fix (tools/patch-addr.js): a badge (1 / 0 or number) after EVERY address text. Result 2316 of 2316. Input -> address test: switching ABC-003B B.072A changes the badge 0 -> 1.
- Rules and method: docs/ADDRESS-VALUES.md, FINDINGS H-38, DESIGN rule 19.
- exe / apk: the GitHub workflow built v1.20.0 (run 18, success; release v1.20.0 has the files). v1.20.1 is built by the same workflow on push.
Tests: see the regression list in docs/PLANT-WINDOW.md (same set re-run on this build) and docs/ADDRESS-VALUES.md.
NOT tested: readability on every sheet; exe / apk on a device.
