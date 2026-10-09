# REPORT v1.20.6 - one address table (no more "nearest")
User (2026-10-09): *"mali ang method sa pag assign ng values sa address; hindi dapat kung sino ang malapit; dapat iintindihin ang diagram at ang flow ng logic."* Method and rules: docs/ADDRESS-METHOD.md.

## What changed
- `anAddr(S)` builds ONE table per sheet (address text -> net, how, gap, alternatives). Engine merges and display both read it. Nearest-free-wire (25), nearest-circle (r+50), nearest-block (45/70) fallbacks are gone.
- Distances from the text BOX (with alignment); one-to-one pairing; a text beside a wire is that wire's label; untied texts show NO value (listed in docs/ADDRESS-REVIEW.md).
- Same string at several places no longer takes the net of one of them.

## Defects found in v1.20.5 and fixed
| where | was | now |
|---|---|---|
| ABC-001C SI0219 / SI0221 | SI0219 (BIR circle) tied to the FFD circle: false link net 134 <- net 40 | gone; SI0221 on its own wire |
| ABC-002 SI0012 | wire of a constant | output of the MUL |
| ABC-010 PIBR10012, ABC-012 TIMS10042, ABC-003A TIFA1086 | select-circuit output | input of their own ALM block |
| AO0231, AO0800, AO0211/0323/0339, AO0787 | engine: AO output stub, display: input | both: input (command) |
| ABC-005 SI0144 | an unrelated free wire | the wire of its circle |
| 12 addresses on ABC-003B/C/D, 007, 020, 057 ... | no value / far | tied (counted in docs/ADDRESS-TABLE.md) |

## Numbers
1517 analog address texts tied, 2 not tied (ABC-052 SI0163 / SI0183: wire read as digital). Compared with v1.20.5: 1482 same value, 12 different signal (all looked at), 2 now untied. Engine links changed on 6 sheets only (AO second occurrences + the false ABC-001C link removed).

## Tests (same build, full list in the run log)
audit-addr-table 0 violations; audit-addr-geometry (real rendered text) 598 ties, 0 with a closer wire; audit-addr-values ALL PASS; test-runaway 0 / 51; audit-continuity 0 without source; blocks 526 / 0 fail; legend 0; loops 68; pid-all 68; pidsign 64; rate 43; links-all 0 fail; trace-x 155 / 155; ditl-link, circles, path, hmi, hmi2, own, proc-app, force-all, lock-all, fixes, trend, project, storage, storage2, ui-real, modes, cos, drum: pass. DITL guard IDENTICAL. test-paint (ABC-052 net67) and test-numinput ("no INPUT box") print the same as on v1.20.5. audit-links: 43 problems, same as v1.20.5.
Visual check: all 63 "wire beside the text" ties and the 12 different-signal cases were looked at on the drawing (green = chosen wire).

## NOT done / open
- Circle `tags` of the page-link matcher (audit-links "TAGS DIFFER", e.g. ABC-001C FFD SI0219) are an older proximity rule, unchanged.
- Review list (owner): docs/ADDRESS-REVIEW.md sections A-D. Texts untied: ABC-052 x2.
- exe / apk are built by the GitHub workflow only for branch claude/trusting-goodall-313vmr; this build was pushed to ccr-1eda2797-2x3xm4 and not built into exe / apk.
