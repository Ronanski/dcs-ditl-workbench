# REPORT v1.20.5 BETA - address values only
User: "Non-sense na may wire values pa ... i-beta version nalang. Wag na regression."
Change: the button "Wire values" and the numbers on bare wires are removed (patch-addr.js); the value beside each analog address text stays. Page title: Logic Sim v1.20.5 BETA.
Tested: tools/audit-addr-values.js (1496 of 1501 address texts have one value, 0 in another row, input -> address follows), tools/test-badges.js (updated: no Wire values button, no bare-wire number), DITL guard IDENTICAL.
NOT tested: the full regression (blocks, legend matrix, PID, loops, plant, links, circles, runaway, continuity ...), exe / apk on a device. Known: forced wires still show their forced number; the address-to-net association is still distance-based (see docs/HANDOVER-CHATGPT-ADDRESS-VALUES.md).
