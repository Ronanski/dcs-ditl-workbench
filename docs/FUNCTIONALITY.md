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
| **PIDV** (pulse output) | PID controller whose output is represented as pulse control. The simulator must preserve the pulse-output behaviour rather than converting it to an ordinary analog output. | 2 blocks, run as the analog PID | **GAP** (pulse-width output not modelled) |
| **ALM** (indicating alarm) | Alarm indication with four level settings: HIGH HIGH, HIGH, LOW LOW, LOW. The alarm state is determined by the configured level threshold. | 104 blocks: show / pass the value; **no alarm states** | **GAP** (limits are in the DCS database; needs them or the user's values) |
| **MAN** (manual control station) | Operator / manual control point. Represents a manually commanded value or state and can be used as a source for control logic. | Value (slider) + range, tracking | implemented |
| **SUMA** (analog integrator) | Integrates an analog input over time. The result depends on the incoming analog value and elapsed time; it is not a digital state element. | 10 blocks: **pass-through, no integration** | **GAP — fix next** |
| **SUMP** (pulse integrator) | Integrates / counts pulse input behaviour. Pulse events are treated as discrete input events, not a continuous analog value. | pass-through | **GAP** |
| **Auto / manual switch** (T with COS) | Selects the applicable automatic or manual control path for the PID controller / manual station. The simulation must follow the selected mode and not pass both modes simultaneously. | Selected leg only; COS lamp; tested 382 of 384 | implemented |
| **Interlock tracking** (T) | Tracking / interlock function associated with the PID controller and manual station. It coordinates the control path when an interlock / tracking condition is active. | PID tracks the selected path (bumpless) | implemented |
| **Switch** (T, SW 1:b) | Discrete switch input / output function: SW = 1 → Y = b, SW = 0 → Y = a. The simulator should preserve the defined switch state and propagate the resulting digital signal. | as legend | implemented |
| **AI** (analog signal input) | Entry point for a continuous analog signal into the logic. | user input (slider / number) | implemented |
| **AO** (analog signal output) | Output point for a continuous analog signal from the logic. | shows / passes the value, drives the I/P and valve | implemented |
| **CONSTANT** | Fixed value source. The value does not change unless the engineering configuration changes it. | value from the number / ratio / percent beside the box | implemented |
| **RATE LIMITER** (V⟩) | Limits the rate at which an analog value may change. The output follows the input but cannot change faster than the configured rate. | Rate from the text (per second / minute / hour), bypass input = follow; rate from an input when the drawing wires it. 43 of 43 pass `tools/test-rate.js` | implemented; 9 ramp boxes show NO rate on the drawing (DCS parameter) |
| **PULSE OUTPUT** (PO) | Produces a pulse / discrete output signal. Treat the pulse as a defined event / state with its configured timing rather than a continuous analog value. | 2 blocks: pass-through | **GAP** |

## 2. Comparison, math, selection and process functions

| Symbol | Legend | Simulator today | Status |
|---|---|---|---|
| **H/** comparison larger than | Compares input values and becomes TRUE / ON when A > B. | set point from the text (">= 83.3%", "> X%", reference tag) | implemented (240 of 240 outputs switch) |
| **/L** comparison smaller than | TRUE / ON when A < B. | same | implemented |
| **ABS** | Magnitude of the input: −5 becomes 5. | as legend | implemented |
| **+** addition | Adds the input values: 10 + 5 = 15. | as legend | implemented |
| **−** subtraction | Subtracts one input from another according to the block's input order ("+" / "−" written beside the pins). | signs from the texts; 486 pins checked | implemented |
| **X** multiplication | Multiplies the input values: 4 × 5 = 20. A number written above an X box with ONE input is the gain. | as legend (gain fixed in v1.14.4 WIP) | implemented |
| **÷** division | Divides one input by another according to the block's input order. **Divide by zero must be handled as an invalid / engineering condition, not as a normal result.** | order from the formula text; divide by zero gives 0 silently | **GAP** (invalid flag) |
| **√** square root | Square root of the input. **Invalid negative-domain conditions must be handled explicitly.** | negative → 0 silently | **GAP** (invalid flag) |
| **>** high selector | Higher of the available inputs: A = 40, B = 70 → 70. | as legend | implemented |
| **<** low selector | Lower: A = 40, B = 70 → 40. | as legend | implemented |
| **High / low limit** (⊣< >⊢) | Checks an input against configured high / low limits and produces the corresponding limit state. | clamp between the low and high inputs (HLLIM); one-sided HLIM / LLIM | implemented (to confirm with the user: clamp or limit state) |
| **Σ summation** (and Δ alternate) | Combines multiple inputs into a summed result; the legend shows a summation symbol and an alternate symbol. | sum of the inputs with their signs; grey bars of ABC-026 / 027 | implemented |
| **F(X)** linearize curve | Applies a configured linearization / function curve to convert the input into the output value. | strict station + LN table (89 of 89 equal to LINEAR.xls), editable LX / LY | implemented |
| **f(t)** lag function | Applies lag / dynamic response so the output follows the input with the defined lag behaviour. | first order lag; the time is written beside the box ("30Sec") | implemented (time read left of the box fixed in v1.14.4 WIP) |
| **Δ deviation** | Calculates deviation / error between the relevant input / reference values. | DEV = SV − PV (user confirmed), signs from the texts | implemented |
| **TP** temperature / pressure compensation | Applies temperature / pressure compensation to the relevant process value so the signal reflects the compensated condition. | 8 blocks: pass-through (formula known: DP' = DP · Kp / Kt, tables in the user's Compensation file) | **GAP** |

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
| **AVERAGE SELECT CIRCUIT** | Y = (A + B + C) / 3 | SEL: average of the inputs whose transmitter is healthy (SIG.AB = 0) | implemented |
| **PRI / SEC / AVG SELECT CIRCUIT** | Primary / secondary / average select | SEL (average of the healthy ones) | to confirm |

## 4. Lines
Continuous line = analog signal, dashed line = digital signal. The user sets how they are drawn; the logic follows the signal type of the wire.

## 5. Open GAPs (in this order of effect on the loops)
1. SUMA / SUMP integrators (11 blocks) — build.
2. TP compensation (8) — build with the compensation file.
3. ALM four-level alarm (104) — needs the limits.
4. DIV by zero / SQRT of a negative — invalid flag.
5. PIDV and PO pulse output (4) — build the pulse behaviour.
6. 9 ramp boxes with no rate on the drawing — needs the DCS values.
