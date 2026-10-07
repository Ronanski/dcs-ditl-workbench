# FUNCTIONALITY — what every symbol of the ABC drawings MUST do (reference for building AND checking)

**Source of truth:** the SYMBOL LIST sheet `ABC-000` (`docs/Logic-Sim-Manual` does not replace it) and the legend summary below, given by the user on 2026-10-07 ("always remember this, put it on documentation, always remember this when checking, so whoever builds or does this project always has it in mind").

**How to use this file**
1. Every time a block kind is read, simulated or verified, compare it with its entry here FIRST. If the simulator does less than the entry says, that is a defect, even if all tests pass.
2. "Status" is what the simulator does today (honest). **GAP** = the simulator does NOT yet do what the legend says: it must be built or the user must decide.
3. Exception that the user keeps for himself: the **dashed line (digital)** and the **continuous line (analog)** styling / colours (user sets them). Everything else is followed strictly.
4. A check is only finished when it was done by LOOKING at the drawing (arrows!) and, where a parameter is written on the drawing, comparing the number with the sim (`tools/audit-params.js`, `audit-signs.js`, `test-legend.js`, `test-rate.js` ...). A test that only re-reads the reader's own output proves nothing.

## 1. Input, control, signal and process symbols

| Symbol | Legend (user's words) | Simulator today | Status |
|---|---|---|---|
| **PID** (analog output) | Analog PID controller. Uses continuous process / control values and produces an analog control output. The simulation must preserve the PID block as an analog control function, not a simple ON/OFF gate. | Real PID (P, I, D with typical default tuning, ACT:R / ACT:N, range from the text, anti-windup, tracking). Real gains / alarm limits are in the DCS database. | implemented, tuning = default |
| **PIDV** (pulse output) | PID controller whose output is represented as pulse control. The simulator must preserve the pulse-output behaviour rather than converting it to an ordinary analog output. | Runs as the PID (velocity form); the PO after it shows the raise / lower pulses | implemented as raise / lower pulses; pulse cycle / stroke / shortest pulse = **ASSUMED 2 s / 60 s / 0.2 s** (not on the drawing, docs/ASSUMED-VALUES.md section 3) |
| **ALM** (indicating alarm) | Alarm indication with four level settings: HIGH HIGH, HIGH, LOW LOW, LOW. The alarm state is determined by the configured level threshold. | 104 blocks: the 4 states (HIGH-HIGH, HIGH, LOW, LOW-LOW) are computed and shown on the drawing / in the panel from the limits typed in the panel (empty = not used) | implemented; the limits are not on the drawing: **ASSUMED defaults for all 104 alarms** (150 MW CFB with reheat, docs/ASSUMED-VALUES.md section 4), shown in the panel as "ASSUMED DEFAULT"; replace with the DCS values |
| **MAN** (manual control station) | Operator / manual control point. Represents a manually commanded value or state and can be used as a source for control logic. | Value (slider) + range, tracking | implemented |
| **SUMA** (analog integrator) | Integrates an analog input over time. The result depends on the incoming analog value and elapsed time; it is not a digital state element. | v1.15 WIP: total = integral of the input (input per HOUR: T/H → T), keeps its total, Reset total button in the panel; no output on the drawing (read it in the panel) | implemented (`tools/test-blocks.js`) |
| **SUMP** (pulse integrator) | Integrates / counts pulse input behaviour. Pulse events are treated as discrete input events, not a continuous analog value. | v1.15 WIP: counts the rising edges of the pulse input | implemented |
| **Auto / manual switch** (T with COS) | Selects the applicable automatic or manual control path for the PID controller / manual station. The simulation must follow the selected mode and not pass both modes simultaneously. | Selected leg only; COS lamp; tested 382 of 384 | implemented |
| **Interlock tracking** (T) | Tracking / interlock function associated with the PID controller and manual station. It coordinates the control path when an interlock / tracking condition is active. | PID tracks the selected path (bumpless) | implemented |
| **Switch** (T, SW 1:b) | Discrete switch input / output function: SW = 1 → Y = b, SW = 0 → Y = a. The simulator should preserve the defined switch state and propagate the resulting digital signal. | as legend | implemented |
| **AI** (analog signal input) | Entry point for a continuous analog signal into the logic. | user input (slider / number) | implemented |
| **AO** (analog signal output) | Output point for a continuous analog signal from the logic. | shows / passes the value, drives the I/P and valve | implemented |
| **CONSTANT** | Fixed value source. The value does not change unless the engineering configuration changes it. | value from the number / ratio / percent beside the box | implemented |
| **RATE LIMITER** (V⟩) | Limits the rate at which an analog value may change. The output follows the input but cannot change faster than the configured rate. | Rate from the text (per second / minute / hour), bypass input = follow; rate from an input when the drawing wires it. 43 of 43 pass `tools/test-rate.js` | implemented; 8 ramp boxes show NO rate on the drawing: **ASSUMED** (1 T/H per s for the coal feeders 004A / B / C = the "(1T / Sec)" of their sister boxes; 1 % per s for the bottom ash screw coolers 009A / B; 2 % per s for the flue gas damper ABC-020), docs/ASSUMED-VALUES.md section 2 |
| **PULSE OUTPUT** (PO) | Produces a pulse / discrete output signal. Treat the pulse as a defined event / state with its configured timing rather than a continuous analog value. | v1.15 WIP: pulses of a cycle (assumed 2 s) from the difference demand − position (full stroke assumed 60 s, shortest pulse 0.2 s): PO1 raise / PO2 lower, stops when the position reaches the demand | implemented (timing ASSUMED) |

## 2. Comparison, math, selection and process functions

| Symbol | Legend | Simulator today | Status |
|---|---|---|---|
| **H/** comparison larger than | Compares input values and becomes TRUE / ON when A > B. | set point from the text (">= 83.3%", "> X%", reference tag) | implemented (240 of 240 outputs switch) |
| **/L** comparison smaller than | TRUE / ON when A < B. | same | implemented |
| **ABS** | Magnitude of the input: −5 becomes 5. | as legend | implemented |
| **+** addition | Adds the input values: 10 + 5 = 15. | as legend | implemented |
| **−** subtraction | Subtracts one input from another according to the block's input order ("+" / "−" written beside the pins). | signs from the texts; 486 pins checked | implemented |
| **X** multiplication | Multiplies the input values: 4 × 5 = 20. A number written above an X box with ONE input is the gain. | as legend (gain fixed in v1.15.0 WIP) | implemented |
| **÷** division | Divides one input by another according to the block's input order. **Divide by zero must be handled as an invalid / engineering condition, not as a normal result.** | order from the formula text; v1.15 WIP: divide by zero = INVALID flag in the panel, holds the last good value | implemented |
| **√** square root | Square root of the input. **Invalid negative-domain conditions must be handled explicitly.** | v1.15 WIP: negative input = INVALID flag in the panel, output 0 | implemented |
| **>** high selector | Higher of the available inputs: A = 40, B = 70 → 70. | as legend | implemented |
| **<** low selector | Lower: A = 40, B = 70 → 40. | as legend | implemented |
| **High / low limit** (⊣< >⊢) | Checks an input against configured high / low limits and produces the corresponding limit state. | clamp between the low and high inputs (HLLIM); one-sided HLIM / LLIM | implemented (to confirm with the user: clamp or limit state) |
| **Σ summation** (and Δ alternate) | Combines multiple inputs into a summed result; the legend shows a summation symbol and an alternate symbol. | sum of the inputs with their signs; grey bars of ABC-026 / 027 | implemented |
| **F(X)** linearize curve | Applies a configured linearization / function curve to convert the input into the output value. | strict station + LN table (89 of 89 equal to LINEAR.xls), editable LX / LY | implemented |
| **f(t)** lag function | Applies lag / dynamic response so the output follows the input with the defined lag behaviour. | first order lag; the time is written beside the box ("30Sec") | implemented (time read left of the box fixed in v1.15.0 WIP) |
| **Δ deviation** | Calculates deviation / error between the relevant input / reference values. | DEV = SV − PV (user confirmed), signs from the texts | implemented |
| **TP** temperature / pressure compensation | Applies temperature / pressure compensation to the relevant process value so the signal reflects the compensated condition. | v1.15 WIP: DP' = DP / Kt, Kt = (T + 273.15) / (T operating + 273.15) (top pin = DP, other pin = T); T operating from the Compensation file (302 / 35 / 91 / 287 °C), editable in the panel | implemented; the operating temperature of each flow comes from the user's Compensation file (8 TP blocks, real data, docs/DATA-FILES.md) |

## 3. Logic gates, timers and set / reset

| Symbol | Legend | Simulator today | Status |
|---|---|---|---|
| **OR** | ON when at least one input is ON: 00→0, 10→1, 01→1, 11→1. | as legend | implemented |
| **AND** | ON only when all required inputs are ON: 00→0, 10→0, 01→0, 11→1. | as legend (4-input truth table tested) | implemented |
| **NOT** (⊠) | Inverts: 0 → 1, 1 → 0. | as legend | implemented |
| **ON delay timer** (TON) | When the input becomes ON the timer runs X seconds before the output becomes ON. If the input is removed before completion, follow the configured reset behaviour. | tested against the diagram (35 of 35) | implemented |
| **OFF delay timer** (TOF) | When the input becomes OFF the output remains active X seconds before turning OFF. | tested (18 of 18) | implemented |
| **Pulse timer** (TPS) | Generates a timed pulse according to the configured X seconds. The pulse must be simulated as an actual timed state, not only animated. | tested (107 of 107) | implemented |
| **SET / RESET** (FF) | SET drives the stored output ON; RESET drives it OFF. The legend defines NC as "not change": keep the previous state: S R → Q: 1 0 → 1, 0 1 → 0, **1 1 → 0 (reset wins)**, 0 0 → NC. | as legend (282 of 282 cases) | implemented |
| **AVERAGE SELECT CIRCUIT** | Y = (A + B + C) / 3 | SEL: average of the inputs whose transmitter is healthy (SIG.AB = 0); v1.15 WIP: Select mode in the panel for the drawings that say PRI / SEC / AVG (primary = left input, secondary = right input) and (1) / (3) / AVG | implemented |
| **PRI / SEC / AVG SELECT CIRCUIT** | Primary / secondary / average select | PRI / SEC / AVG selectable (default AVG; a bad primary / secondary falls back to the average of the healthy ones) | implemented; the real default mode is a DCS parameter |

## 4. Lines
Continuous line = analog signal, dashed line = digital signal. The user sets how they are drawn; the logic follows the signal type of the wire.

## 5. Instructions written on the drawings
"IF M.xxxx = 1 / SET SV = n" (17 on the sheets), "SET X%", "IF M.xxxx = 1 / SET SIxxxx => TAG.SV" (7: ABC-007 ×2, 013, 051, 052 ×3: the source signal is written into the SV of the controller while the condition holds) and "IF HIC-ULD.MAN = 1 / SET SI0200 => AB0117" (ABC-001A: written into the operator value of the COS AB0117) are READ and EXECUTED (v1.15 WIP). Any other instruction text must be added here when found.

## 6. Data that is not on the drawings (status, 2026-10-07)
1. TP operating temperatures: **solved** — Compensation file (docs/DATA-FILES.md).
2. ALM limits: **ASSUMED** for all 104 alarms (docs/ASSUMED-VALUES.md section 4); the DCS analog database values are still wanted.
3. PID gains: default tuning (unchanged). PIDV / PO pulse timing: **ASSUMED** (2 s cycle, 60 s stroke, 0.2 s shortest pulse).
4. 8 ramp boxes with no rate on the drawing (ABC-004A / B / C, 009A ×3, 009B, 020): **ASSUMED** rates (docs/ASSUMED-VALUES.md section 2).
5. PRI / SEC / AVG select: the real default mode is still a DCS parameter (default AVG).
6. S1-LN38 / S1-LN39 (ABC-010 drum level compensation) are not in LINEAR.xls: taken from the Drum Level Calculation file (units deduced, to confirm).
Every assumed number is in `tools/assumed-data.js` → `docs/ASSUMED-VALUES.md` → the app (button **Assumed values**, block panels).
