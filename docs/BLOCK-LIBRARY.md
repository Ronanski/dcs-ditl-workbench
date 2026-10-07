# BLOCK LIBRARY — one page per block type (the single truth for behaviour)

Status: **CONFIRMED** = the user (automation engineer) confirmed it · **PROPOSED** = Claude's answer from the drawings + normal DCS practice, waiting for the user to confirm or correct ·
**IMPLEMENTED** = in the app now (unconfirmed) · **SIMPLIFIED** = in the app but not the real behaviour.
Counts = blocks in the 54 sheets. Machine-readable status: `tools/block-status.json` (progress % in docs/PROGRESS.md).
When the user confirms a block, Claude writes a small test for it (tools/test-block-<KIND>.js) and every sheet that uses it follows.

## Logic
| Block | n | Symbol / pins | Behaviour (proposed) | Status |
|---|---|---|---|---|
| AND / OR / NOT | 174/173/243 | gate bodies, bar gates | boolean; unconnected inputs ignored | IMPLEMENTED |
| FF | 47 | S / R box | S=1,R=0 -> Q=1 · S=0,R=1 -> Q=0 · S=0,R=0 -> hold · S=1,R=1 -> **depends on the DCS function block (set- or reset-dominant)**; the app uses reset-dominant (safe default). In a random test 23 of 47 FFs can see S and R together, so it matters. Ask the user to read the FF block help in EWS (LOGIC.LGO) | IMPLEMENTED, dominance unconfirmed |
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
| SEL | 26 | **CONFIRMED by user (2026-10-07): average; with no bad signal / SIG.AB it is the plain average.** Drawing says "AVERAGE SELECT CIRCUIT"** (ABC-010: "(1) / (3) / AVG"): average of the transmitters that are healthy (SIG.AB flag not bad); 1 healthy = that one; all bad = hold last value. Now: plain average of all inputs | IMPLEMENTED, refine |

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
| DEV | 92 | **CONFIRMED by user for the marked pins (+ minus −).** + input minus − input (error). 12 DEV have no sign marks: order by pin position — confirm | IMPLEMENTED |
| FX F(X) | 111 | piece-wise linear from the LN table of that sheet. **FX with no table or no input is stuck** — where do the tables come from? | IMPLEMENTED |
| LAG f(t) | 14 | first-order lag; time constant not in the drawing (default) — confirm | IMPLEMENTED |
| RATE | 24 | rate limiter, up/down rate inputs | IMPLEMENTED |
| RAMPB "RAMP:x%/sec BUMPLESS 1:BYPASS" | 15 | **CONFIRMED by user: rate = the number written in the text (per sec / per min).** Output ramps to input at x per time; when the BYPASS input = 1 it follows the input at once (bumpless) | IMPLEMENTED |
| CONST "A" | 254 | constant value written next to the box; 18 have no value found (read as 0) | IMPLEMENTED |

## Controllers (the big gap)
| Block | n | Evidence in the drawings | Behaviour (proposed) | Status |
|---|---|---|---|---|
| **PID / PIDV** | 68 | ABC-017/050: **the input is the DEVIATION** (a DEV block "SV + / PV −" feeds the PID); tag + module (e.g. PICSB1052 S2-MDL001); "ACT:R / ACT:D" text; output goes to a T (auto/manual) | MV 0..100 % = P + I (+ D) of the deviation; ACT:R reverse / ACT:D direct action; anti-windup at the limits; tracks (bumpless) when its track input is on; **Kp, Ti, Td are NOT in the drawings** (DCS database): editable in the panel, default values, optional table import | SIMPLIFIED (output follows input — wrong: MV must not equal the deviation) |
| ALM | 104 | "ALM tag MDL"; 51 have only the input, 53 also have two outputs (left/right) | alarm module: outputs = HIGH and LOW alarm (digital), limits are DCS parameters (not in the drawing) -> editable, default from range; effect on logic through the outputs | SIMPLIFIED (shows the level only) |
| CTK | 5 | input + "ctl" | **User agreed with this analysis (2026-10-07).** Found by analysis (ABC-007 #79: input SI0169, ctl M.018D, output goes nowhere on the sheet; drawing note "SET SI0169 => FICFA1071.SV  IF M.018D = 1")**: CTK = conditional write of a value into the SV of ANOTHER controller. While ctl = 1 it sends the input; when ctl = 0 it does NOT write (no value 0). Now: outputs 0 when ctl = 0 (wrong) — to fix | SIMPLIFIED |

## Field / drawing
| Block | n | Behaviour | Status |
|---|---|---|---|
| AI | 201 | transmitter: user sets value in range; SIG.AB flag | IMPLEMENTED |
| AO / I/P / ACT / VLV | 90/45/37/44 | output %, I/P air, actuator stroke time, valve position with colours | IMPLEMENTED |
| SIG.AB | 198 | "signal abnormal" flag of an AI: user sets 0/1. **Found by analysis**: of 198 flags, 66 reach a block through logic gates: 54 end at the CONTROL input of a T/AMT (bad signal -> switch, i.e. auto -> manual / alternate path), 10 at a T data input, 2 at a SEL, 1 at a comparator. So no special rule is needed: it already acts through the T logic; only SEL must average the healthy inputs | IMPLEMENTED |
| TP | 8 | **Found by analysis**: always two analog inputs (e.g. AI + AI) and its output goes into a SQRT (ABC-003B/C/D, ABC-006): looks like the temperature/pressure COMPENSATION of a differential-pressure flow before the square root. The user has a "compensation" list. To confirm; formula from that list | SIMPLIFIED |
| PO | 2 | AMT/EXT -> PO -> FIELD ("MCC PANEL") (ABC-054/055): output to a field device (position/process output): pass-through is fine — confirm | SIMPLIFIED |
| FIELD ("INVERTER", "MCC PANEL", "ALARM") | 11 | external device, pass-through | SIMPLIFIED |
| TXD, ACH, FOUT | 201/42/6 | text, actuator head, output flag: drawing only | drawing-only |

## Shapes not recognised yet (ask the user)
ABC-004A "4T" and "8T" · ABC-009A diamond "B | COS" · ABC-055 "DROP RATE ( X / MIN )" · ABC-001B "/" · ABC-001C "0" · 82 empty triangles + 15 empty rectangles (probably arrow heads / contact boxes — to confirm).

## Evidence from the DCS engineering station (user's screenshots, 2026-10-07, loop FICFW2007 "Boiler feed water flow control", PID)
Three windows of the Loop Design tool (project D:\LMYP2, station 101 FCS2000EI). Interpretations below are HYPOTHESES until the user confirms.
- **Module Define 1:** `Scale 1` BS 0.0 .. FS 550.0, unit T/H (PV range) · `Scale 2` BS 0.0 .. FS 550.0 T/H (SV/MV scale) · `Ref TAGNO 1/2/3` = LICBR2001, LICBR2001A (related loops: drum level, 3-element control) · `Link NO` 0 · `Valve Sts` N · `MV Sts` N · `Limit` Y · `Div Code` 256 · "Optional elimination of the Mode": Remote / Auto / Manual (unchecked = mode available).
- **Module Wiring:** `Act R` (N = normal, R = reverse: this is the "ACT:R" in the drawings) · PID block pins: **PV** (from SI0269, "Root Y/N"), **SV** (from DATA SI0259, **L/R** local/remote select, REM/LOC) — this is the "SET SIxxxx => TAG.SV" note in the drawing · **OMV, DOMV, DMV** (output / delta output / delta MV) · **EX-MV, EX-CMD** (external MV and command) · **AUT / MAN** (mode) · `RB-MV` = LICBR2001A.MV (read-back MV, tracking) · `BU-CMD` = M.0222 (backup command) · `FAULT` · `Alarm Lock` PHA PLA DVHA DVLA.
- **Module Define 2 (alarms):** per PV: SH SL PH PL DPH DPL DVH DVL; per MV: MH ML (DMH ...). Each has an alarm LEVEL selector (N/0/1/2/3/4 = none or priority), a format number, a sound (WAV NO.) and a "no alarm" check box. **No limit VALUES in these windows** (probably PH/PL ... are set on the tuning / operator side).
- Guess for the names: SH/SL = sensor (range) high/low · PH/PL = process high/low · DVH/DVL = deviation (PV−SV) high/low · DPH/DPL = rate of change of PV · MH/ML = MV high/low · DMH = MV rate. TO CONFIRM.

What this gives the app: loop name + range + unit + action (reverse/direct) per tag; the real pin set of the PID module (PV / SV local-remote / MV / external MV / read-back / backup / auto-man); alarm priorities. STILL MISSING: the gains P / I / D (and PID type), the alarm limit values — ask the user for the tuning display of the same loop in the operator station.

## FF dominance — analysis of the drawings (2026-10-07)
In a random test 23 of 47 FFs can see S and R together (random inputs are independent, so real cases are fewer). Where the Q output goes:
- 14 FFs feed the control of a T / AMT (auto / manual selector, tags SI0111, SI0121, SI0131, SI0305-8, SI0321, SI0341, SI0351, SI0371 ...) and R is a "go to MANUAL / bad / MAN request" (e.g. R <- FICCL1061A.MAN, SICL1060A.MAN, HICHR1002B.MAN, or NOT(...)): the safe side = **reset-dominant** (fail to manual). The app already does this.
- 9 FFs are not auto/manual latches and need the user's look: ABC-003B/C/D #37 (OR / OR), 003A #52 (OR / OR), 003E #25 (S <- TPS, R <- M.0097), 052 #65 (S M.070D, R M.071D), 055 #10, 057 #10, 001C #5.
- The DCS function-block help (EWS, LOGIC.LGO) would settle it for all.
