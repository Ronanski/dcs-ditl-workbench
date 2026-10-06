# ABC-050 (HP TURBINE BYPASS STEAM PRESSURE CONTROL) - signal origin list (read from v1.1.0)

Rule: ORIGIN = nothing in the drawing drives it, the user sets it. Computed = output of a block, the logic decides.
28 origin inputs found. Please check each against the PDF and tell me which class is wrong.

## A. Analog origins (value you set) - 12, all "FROM T/G MODBUS" (turbine governor over Modbus)
| Tag | Source text | Description | Goes to |
|---|---|---|---|
| SI1812 | T/G MODBUS 30113 | CONTROL VALVE(A) POSITION(A) | SEL |
| SI1813 | 30114 | CONTROL VALVE(A) POSITION(B) | SEL |
| SI1814 | 30115 | CONTROL VALVE(A) POSITION(C) | SEL |
| SI1815 | 30116 | CONTROL VALVE(B) POSITION(A) | SEL |
| SI1816 | 30117 | CONTROL VALVE(B) POSITION(B) | SEL |
| SI1817 | 30118 | CONTROL VALVE(B) POSITION(C) | SEL |
| SI1821 | 30122 | INTERCEPT VALVE(A) POSITION(A) | H/ comparator |
| SI1822 | 30123 | INTERCEPT VALVE(A) POSITION(B) | H/ |
| SI1823 | 30124 | INTERCEPT VALVE(A) POSITION(C) | H/ |
| SI1827 | 30128 | INTERCEPT VALVE(B) POSITION(A) | H/ |
| SI1828 | 30129 | INTERCEPT VALVE(B) POSITION(B) | H/ |
| SI1829 | 30130 | INTERCEPT VALVE(B) POSITION(C) | H/ |

## B. Digital origins from the field (DI of the DCS) - 9
| Tag | Source text | Description | Goes to |
|---|---|---|---|
| I.0400 | (none written) | TURBINE TRIP | OR |
| I.0932 | (none written) | 52G1 OPEN | OR |
| I.0931 | FROM GMCB | 52G1 CLOSE | AND |
| I.0937 | FROM RCP | 52L1 OPEN FOR HOUSE OPERATION | T switch |
| I.0413 | (none written) | TURBINE START-UP WARM MODE | T switch |
| I.0414 | FROM TCS | TURBINE START-UP HOT MODE | T switch |
| I.0418 | FROM TCS | ICV TO CV TRANSFER COMPLETE | OR |
| I.041E | FROM TCS | MSV(A) TEST | OR |
| I.041F | FROM TCS | MSV(B) TEST | OR |

## C. Digital origins that come from the DITL page (memory flags) - 4
| Tag | Source text | Description | Goes to |
|---|---|---|---|
| M.3343 | FROM DITL 23A-55 | BFWP A RUNNING | NOT |
| M.3344 | FROM DITL 23A-55 | BFWP B RUNNING | NOT |
| M.3103 | FROM DITL 03H-63 | CYCLONE OUTLET GAS TEMP. > 535 C | AND |
| (I.000F) MFT | FROM DITL 03A-63 | MFT - the app shows the tag in the panel but the wire itself has no tag found | AND |

## D. Operator / HMI - 1
| Tag | Description | Goes to |
|---|---|---|
| PICMS1006.LOC | Station local/remote flag (1:BYPASS of the BUMPLESS ramp) | RAMPB |

## E. Need your check (the app sees them as inputs, probably NOT signals) - 2
| Where (x,y) | What I see | Question |
|---|---|---|
| 550,123 | analog wire at the I/P box top, drawn from the half-dome symbol | air supply of the I/P converter? Should not be an input at all. |
| 813,457 | analog "a" input of a T switch, text STN101015 written beside it | real analog origin? What is STN101015 (the app does not read this tag format)? |

## F. Computed / outputs (the logic decides, never set by hand)
- Output flags to the field: O.0842, O.0844, O.0845, O.0843 (HP bypass pressure / spray water solenoid valves).
- AO + I/P converter: the HP bypass control valve.
- Links to other sheets through numbered circles: ABC-051 (circles 1,2,3,4,5,9,10), ABC-052 (2,4,8), ABC-030 (2), ABC-033 (2), ABC-056 (2), ABC-013 (2).
- "TO DITL 52-03": goes back to the DITL page (not simulated here).
- Nothing on this sheet is linked IN from another sheet by tag (xlk = 0).
