# BLOCK LIBRARY — one page per block type (the single truth for behaviour)

Status: **CONFIRMED** = the user (automation engineer) confirmed it · **PROPOSED** = Claude's answer from the drawings + normal DCS practice, waiting for the user to confirm or correct ·
**IMPLEMENTED** = in the app now (unconfirmed) · **SIMPLIFIED** = in the app but not the real behaviour.
Counts = blocks in the 54 sheets. Machine-readable status: `tools/block-status.json` (progress % in docs/PROGRESS.md).
When the user confirms a block, Claude writes a small test for it (tools/test-block-<KIND>.js) and every sheet that uses it follows.

## Logic
| Block | n | Symbol / pins | Behaviour (proposed) | Status |
|---|---|---|---|---|
| AND / OR / NOT | 174/173/243 | gate bodies, bar gates | boolean; unconnected inputs ignored | IMPLEMENTED |
| FF | 47 | S / R box | set / reset latch; **reset wins** if both (confirm) | IMPLEMENTED |
| TON | 35 | half-disc "TON  xs" | output 1 after input has been 1 for x s; resets at once when input 0 | IMPLEMENTED |
| TOF | 18 | half-disc "TOF xs" | output stays 1 for x s after input falls | IMPLEMENTED |
| TPS | 107 | half-disc "TPS xs" | pulse: output 1 for x s on a RISING edge, then 0 (confirm: re-triggerable or not) | IMPLEMENTED |
| TPV | 1 | "TPh" | variable pulse width — confirm | IMPLEMENTED |

## Selectors / operator
| Block | n | Behaviour | Status |
|---|---|---|---|
| T (SW) | 163 | 2 inputs A/B + control: control 1 -> B (or per the "1:b" / "1:A" label next to the control); selected leg lit | IMPLEMENTED |
| AMT (T with auto/manual) | 225 | same + manual position from COS | IMPLEMENTED |
| COS | 172 | operator change-over: manual lamp, value from slider/number | IMPLEMENTED |
| MAN station | 74 | manual setpoint/output with range; tracks when its track input is on | IMPLEMENTED |
| SEL | 26 | **drawing says "AVERAGE SELECT CIRCUIT"** (ABC-010: "(1) / (3) / AVG"): average of the transmitters that are healthy (SIG.AB flag not bad); 1 healthy = that one; all bad = hold last value. Now: plain average of all inputs | IMPLEMENTED, refine |

## Comparators / limits
| Block | n | Behaviour | Status |
|---|---|---|---|
| HC "H/" , LC "/L" | 118/102 | digital 1 when input > (H/) or < (/L) the threshold written next to it (e.g. "> 80%"); no hysteresis unless the drawing says | IMPLEMENTED |
| HS ">" , LS "<" | 15/4 | 1 when input A > B (or A < B) | IMPLEMENTED |
| CMPK ("< X%", "<1%") | 12 | compare with the constant in the text | IMPLEMENTED |
| PVSV "PV < SV" | 2 | 1 when PV < SV | IMPLEMENTED |
| DCMP "H/L" | 3 | high and low compare in one block, two outputs (which is which: confirm) | SIMPLIFIED |
| HLIM / LLIM ("V") | 4/5 | clamp: out = min(in, limit) / max(in, limit) | IMPLEMENTED |

## Math / signal
| Block | n | Behaviour | Status |
|---|---|---|---|
| ADD, SUB, SUM (+), MUL, DIV, SQRT, ABS | 8/53/60/53/11/13/7 | arithmetic; SUM inputs marked + or − | IMPLEMENTED |
| DEV | 92 | + input minus − input (error). 12 DEV have no sign marks: order by pin position — confirm | IMPLEMENTED |
| FX F(X) | 111 | piece-wise linear from the LN table of that sheet. **FX with no table or no input is stuck** — where do the tables come from? | IMPLEMENTED |
| LAG f(t) | 14 | first-order lag; time constant not in the drawing (default) — confirm | IMPLEMENTED |
| RATE | 24 | rate limiter, up/down rate inputs | IMPLEMENTED |
| RAMPB "RAMP:x%/sec BUMPLESS 1:BYPASS" | 15 | output ramps to input at x per time; when the BYPASS input = 1 it follows the input at once (bumpless) | IMPLEMENTED |
| CONST "A" | 254 | constant value written next to the box; 18 have no value found (read as 0) | IMPLEMENTED |

## Controllers (the big gap)
| Block | n | Evidence in the drawings | Behaviour (proposed) | Status |
|---|---|---|---|---|
| **PID / PIDV** | 68 | ABC-017/050: **the input is the DEVIATION** (a DEV block "SV + / PV −" feeds the PID); tag + module (e.g. PICSB1052 S2-MDL001); "ACT:R / ACT:D" text; output goes to a T (auto/manual) | MV 0..100 % = P + I (+ D) of the deviation; ACT:R reverse / ACT:D direct action; anti-windup at the limits; tracks (bumpless) when its track input is on; **Kp, Ti, Td are NOT in the drawings** (DCS database): editable in the panel, default values, optional table import | SIMPLIFIED (output follows input — wrong: MV must not equal the deviation) |
| ALM | 104 | "ALM tag MDL"; 51 have only the input, 53 also have two outputs (left/right) | alarm module: outputs = HIGH and LOW alarm (digital), limits are DCS parameters (not in the drawing) -> editable, default from range; effect on logic through the outputs | SIMPLIFIED (shows the level only) |
| CTK | 5 | input + "ctl" | tracking: while ctl = 1 the output follows the input, else holds — confirm | SIMPLIFIED |

## Field / drawing
| Block | n | Behaviour | Status |
|---|---|---|---|
| AI | 201 | transmitter: user sets value in range; SIG.AB flag | IMPLEMENTED |
| AO / I/P / ACT / VLV | 90/45/37/44 | output %, I/P air, actuator stroke time, valve position with colours | IMPLEMENTED |
| SIG.AB | 198 | "signal abnormal" flag of an AI: user sets 0/1; effect on SEL / PID (auto -> manual?) — confirm | IMPLEMENTED |
| TP, PO, FIELD ("INVERTER", "MCC PANEL", "ALARM") | 8/2/11 | test point / position output / external device: pass-through — confirm what TP and PO are | SIMPLIFIED |
| TXD, ACH, FOUT | 201/42/6 | text, actuator head, output flag: drawing only | drawing-only |

## Shapes not recognised yet (ask the user)
ABC-004A "4T" and "8T" · ABC-009A diamond "B | COS" · ABC-055 "DROP RATE ( X / MIN )" · ABC-001B "/" · ABC-001C "0" · 82 empty triangles + 15 empty rectangles (probably arrow heads / contact boxes — to confirm).
