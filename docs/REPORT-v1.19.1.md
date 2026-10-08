# REPORT v1.19.1 - values belong to the address (2026-10-08) - revision 1 - RELEASED

User: "ang address mismo ang naglalaman ng values, hindi ang wire" and "gusto ko na makita ang values ... irelease mo ito".
- Of 2 099 analog value badges on the 51 sheets, 824 sit at an address / tag text and 1 275 on bare wires / block outputs without an address. Now only the 824 (and the tag text of a circle that carries the value from another sheet) are shown; the rest are behind the toggle **Wire values** (off by default).
- Test: tools/test-badges.js (6 sheets in RUN: default = no visible number on a bare wire; toggle on = they come back). Also run on this build: test-fixes, test-own, test-ui-real, test-trend, test-hmi2 (ALL PASS), guard IDENTICAL.
- NOT re-run on this build: the full regression of v1.19.0 (the change is display only: badge visibility). Digital addresses: the same rule is not yet checked.
- AN_PV 17 (unchanged).
