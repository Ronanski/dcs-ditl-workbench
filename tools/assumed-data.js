/* SOURCE OF TRUTH for every number the simulator uses that is NOT written on the ABC drawings.
   - TP   : from the user's file "LMYP-1 #1-Compensation Calculation of Flow.xls" (real plant data, not assumed).
   - ALM  : ASSUMED limits (HH / H / L / LL) for a 150 MW CFB boiler with reheat, set by the assistant on the user's instruction (2026-10-07). NOT the DCS database values.
   - RATE : ASSUMED ramp rates of the 8 rate boxes whose number is not on the drawing (units of the signal per SECOND, "the number as written").
   - PO   : ASSUMED pulse parameters of the pulse output (PIDV / PO).
   tools/patch-defaults.js embeds this as AN_DEF in the html; tools/list-assumed.js writes docs/ASSUMED-VALUES.md from it.
   Change a number HERE (and re-run the patch + list-assumed.js), never only in the html. */

/* ---- TP: temperature compensation, DP' = DP / Kt, Kt = (T + 273.15) / (Top + 273.15). Pressure is NOT compensated in this file (columns PRESS = 0). ---- */
const TP=[
 /* key = text "<flow tag>.KP2" next to the TP box on the drawing */
 {sheet:'ABC-003A',kp:'FIFA1043A',ft:'FT-FA1043-A',desc:'Burner-A hot sec. air flow',tt:'TT-FA1086 / TT-FA1087',tfs:600,tbs:0,top:302,at:1.04320612014257,bt:0.474919586194906},
 {sheet:'ABC-003B',kp:'FIFA1043B',ft:'FT-FA1043-B',desc:'Burner-B hot sec. air flow',tt:'TT-FA1086 / TT-FA1087',tfs:600,tbs:0,top:302,at:1.04320612014257,bt:0.474919586194906},
 {sheet:'ABC-003C',kp:'FIFA1043C',ft:'FT-FA1043-C',desc:'Burner-C hot sec. air flow',tt:'TT-FA1086 / TT-FA1087',tfs:600,tbs:0,top:302,at:1.04320612014257,bt:0.474919586194906},
 {sheet:'ABC-003D',kp:'FIFA1043D',ft:'FT-FA1043-D',desc:'Burner-D hot sec. air flow',tt:'TT-FA1086 / TT-FA1087',tfs:600,tbs:0,top:302,at:1.04320612014257,bt:0.474919586194906},
 {sheet:'ABC-006',kp:'FIFA1081',ft:'FT-FA1081',desc:'SAF inlet air flow',tt:'TT-FA1082',tfs:100,tbs:0,top:35,at:0.324517280545189,bt:0.886418951809184},
 {sheet:'ABC-006',kp:'FIFA1071',ft:'FT-FA1071',desc:'PAF inlet air flow',tt:'TT-FA1072',tfs:100,tbs:0,top:35,at:0.324517280545189,bt:0.886418951809184},
 {sheet:'ABC-006',kp:'FIFA1055',ft:'FT-FA1055',desc:'FA-blower outlet common air flow',tt:'TT-FA1055-A / TT-FA1055-B',tfs:200,tbs:0,top:91,at:0.549224220788137,bt:0.750102979541398},
 {sheet:'ABC-006',kp:'FIFA1079',ft:'FT-FA1079',desc:'Air preheater outlet to furnace primary air flow',tt:'TT-FA1076 / TT-FA1077',tfs:600,tbs:0,top:287,at:1.07114165848433,bt:0.487637240024993}
];

/* ---- ALM: [tag, HH, H, L, LL, unit, description, basis] ; null = not used. Values are in the unit of the transmitter range on the drawing. ---- */
const A=(tag,hh,h,l,ll,u,desc,basis)=>({tag,hh,h,l,ll,u,desc,basis});
const ALM=[
 /* secondary / primary / fan-blower air (150 MW CFB: SAF 0-432, PAF 0-648 T/H) */
 A('FIFA1043A',58,50,20,12,'T/H','Start-up burner A secondary air flow (0-65 T/H)','Burner hot SA flow: normal 25-40, trip band same as the drawn "<18.7%" comparator'),
 A('FIFA1043B',58,50,20,12,'T/H','Start-up burner B secondary air flow','same as burner A'),
 A('FIFA1043C',58,50,20,12,'T/H','Start-up burner C secondary air flow','same as burner A'),
 A('FIFA1043D',58,50,20,12,'T/H','Start-up burner D secondary air flow','same as burner A'),
 A('FIFA1081',410,380,80,40,'T/H','SA fan inlet air flow (0-432 T/H)','normal 200-330 T/H at 100 % MCR; H = 88 %, HH = 95 % of range'),
 A('FIFA1071',610,560,120,60,'T/H','PA fan inlet air flow (0-648 T/H)','normal 300-480 T/H; H = 86 %, HH = 94 % of range'),
 A('FIFA1055',33,30,25,20,'T/H','FA blower outlet common air flow (0-35 T/H)','LL = 20 T/H is the "FA BLOWER FLOW < LOW LOW" comparator written on ABC-006'),
 A('FIFA1079',480,440,150,100,'T/H','Air preheater outlet to furnace primary air flow (0-510 T/H)','normal 250-380 T/H'),
 A('TAF',900,800,250,150,'T/H','Total air flow (sum of the air flows, ABC-006)','total air about 450-650 T/H for 150 MW CFB; sum can exceed the single-flow ranges'),
 A('TIFA1082',55,45,5,0,'°C','SA fan inlet air temperature','ambient: operating 35 °C (Compensation file); H = 45, HH = 55'),
 A('TIFA1072',55,45,5,0,'°C','PA fan inlet air temperature','ambient: operating 35 °C'),
 A('TIFA1055A',130,110,40,20,'°C','FA blower A outlet air temperature','operating 91 °C (Compensation file)'),
 A('TIFA1055B',130,110,40,20,'°C','FA blower B outlet air temperature','operating 91 °C'),
 A('TIFA1076',340,320,150,100,'°C','Air preheater outlet to primary air temperature (A)','operating 287 °C (Compensation file)'),
 A('TIFA1077',340,320,150,100,'°C','Air preheater outlet to primary air temperature (B)','operating 287 °C'),
 A('TIFA1086',350,330,150,100,'°C','Secondary air (hot) temperature A','operating 302 °C (Compensation file)'),
 A('TIFA1087',350,330,150,100,'°C','Secondary air (hot) temperature B','operating 302 °C'),
 A('PIFA1085',2700,2400,800,500,'mmH2O','SAF outlet to air preheater air pressure (0-3000)','normal 1500-2000 mmH2O'),
 A('PIFA1088',2700,2400,1000,900,'mmH2O','Air preheater to furnace secondary air pressure (0-3000)','LL = 900 is the "< 900 mmH2O" comparator on ABC-003A'),
 /* furnace / flue gas */
 A('PIFG1085',300,100,-250,-400,'mmH2O','Furnace pressure A (-600..600)','balanced draft: normal -50..-100 mmH2O; MFT-type limits +300 / -400'),
 A('PIFG1086',300,100,-250,-400,'mmH2O','Furnace pressure B','same'),
 A('PIFG10871',300,100,-250,-400,'mmH2O','Furnace pressure C-1','same'),
 A('DPIFG1081',2200,1900,1150,900,'mmH2O','Furnace plenum / upper layer differential pressure A (0-2500)','bed dP normal 1400-1700; L = 1150 is the "< 1150 mmH2O" comparator on ABC-009A'),
 A('DPIFG1082',2200,1900,1150,900,'mmH2O','Furnace plenum / upper layer differential pressure B','same'),
 A('TIFG1091A',1020,960,800,700,'°C','Furnace lower layer ABOVE temperature A (0-1200)','CFB bed 850-900 °C: H 960, HH 1020 (ash fusion risk), L 800, LL 700'),
 A('TIFG1091B',1020,960,800,700,'°C','ABOVE temperature B','same'),
 A('TIFG1091C',1020,960,800,700,'°C','ABOVE temperature C','same'),
 A('TIFG1091D',1020,960,800,700,'°C','ABOVE temperature D','same'),
 A('TIFG1091E',1020,960,800,700,'°C','ABOVE temperature E','same'),
 A('TIFG1091F',1020,960,800,700,'°C','ABOVE temperature F','same'),
 A('TIFG1091G',1020,960,800,700,'°C','ABOVE temperature G','same'),
 A('TIFG1091H',1020,960,800,700,'°C','ABOVE temperature H','same'),
 A('TIFG1091I',1020,960,800,700,'°C','ABOVE temperature I','same'),
 A('TIFG1091',1020,960,800,700,'°C','Furnace total average temperature','same'),
 A('TIFG1090A',1000,950,750,650,'°C','Furnace lower layer UNDER temperature A (0-1200)','under-bed temperature a little lower than above'),
 A('TIFG1090B',1000,950,750,650,'°C','UNDER temperature B','same'),
 A('TIFG1090C',1000,950,750,650,'°C','UNDER temperature C','same'),
 A('TIFG1090D',1000,950,750,650,'°C','UNDER temperature D','same'),
 A('TIFG1090E',1000,950,750,650,'°C','UNDER temperature E','same'),
 A('TIFG1090F',1000,950,750,650,'°C','UNDER temperature F','same'),
 A('TIFG1090G',1000,950,750,650,'°C','UNDER temperature G','same'),
 A('TIFG1090H',1000,950,750,650,'°C','UNDER temperature H','same'),
 A('TIFG1090I',1000,950,750,650,'°C','UNDER temperature I','same'),
 A('TIFG1090L',1000,950,750,650,'°C','Furnace lower layer under temperature average','same'),
 A('AIFG1122',8,6,2,1,'%','Flue gas O2 A (0-25 %)','CFB economiser O2 normal 3-4 %'),
 A('AIFG1123',8,6,2,1,'%','Flue gas O2 B','same'),
 A('SILO1756',1160,1100,200,100,'rpm','IDF hydraulic coupling speed (0-1200 rpm)','ID fan speed normal 700-1050 rpm; the drawing has "< 14 %" comparator'),
 /* limestone feeder (ABC-005) */
 A('SIM1311',98,90,5,1,'%','Limestone rotary feeder speed (0-100 %)','speed in percent'),
 /* drum / water / steam */
 A('LIBR10011',150,75,-75,-150,'mm','Drum level (1) (-422..820 mm)','zero = normal water level; H/L +-75, HH/LL +-150 (trip band)'),
 A('LIBR10012',150,75,-75,-150,'mm','Drum level (2)','same'),
 A('LIBR10013',150,75,-75,-150,'mm','Drum level (3)','same'),
 A('PIBR10011',168,158,110,90,'kg/cm2','Drum pressure (1) (0-250)','drum about 145 kg/cm2g at full load; safety valve about 175'),
 A('PIBR10012',168,158,110,90,'kg/cm2','Drum pressure (2)','same'),
 A('TIFW1160',285,270,150,120,'°C','Economiser No.1 inlet water temperature (0-300)','feed water 240-255 °C at full load'),
 A('TIBR11401',550,530,430,400,'°C','Superheater No.2 outlet steam temperature (1)','normal 480-510 °C'),
 A('TIBR11402',550,530,430,400,'°C','Superheater No.2 outlet steam temperature (2)','same'),
 A('TIBR11301',490,470,350,320,'°C','Superheater No.2 inlet steam temperature (1)','normal 400-440 °C after the spray'),
 A('TIBR11302',490,470,350,320,'°C','Superheater No.2 inlet steam temperature (2)','same'),
 A('TIBR11501',540,520,440,420,'°C','Finishing superheater inlet steam temperature (1)','normal 460-500 °C'),
 A('TIBR11502',540,520,440,420,'°C','Finishing superheater inlet steam temperature (2)','same'),
 A('TIMS10041',560,550,520,500,'°C','Main steam temperature (1), finishing S/H outlet','rated 540 °C'),
 A('TIMS10042',560,550,520,500,'°C','Main steam temperature (2)','rated 540 °C'),
 A('PIMS10061',147,143,110,90,'kg/cm2','Turbine main steam pressure (1) (0-150)','rated 137 kg/cm2g (13.7 MPa)'),
 A('PIMS10062',147,143,110,90,'kg/cm2','Turbine main steam pressure (2)','same'),
 A('PIST10011',120,110,5,1,'kg/cm2','HP turbine first stage pressure A (0-150)','about 95-105 kg/cm2 at full load; low alarm only meaningful when loaded'),
 A('PIST10012',120,110,5,1,'kg/cm2','HP turbine first stage pressure B','same'),
 A('PIST10013',120,110,5,1,'kg/cm2','HP turbine first stage pressure C','same'),
 /* reheat */
 A('TIHR10021',560,550,515,500,'°C','Reheater outlet header temperature (1)','rated 540 °C'),
 A('TIHR10022',560,550,515,500,'°C','Reheater outlet header temperature (2)','rated 540 °C'),
 A('TICR10051',400,380,280,250,'°C','Desuperheater temperature (1), reheater inlet','cold reheat about 330-350 °C'),
 A('TICR10052',400,380,280,250,'°C','Desuperheater temperature (2), reheater inlet','same'),
 A('PICR1006',36,33,5,2,'kg/cm2','Reheater inlet header pressure (0-50)','cold reheat about 25-29 kg/cm2g at full load'),
 A('PICR1003',36,33,5,2,'kg/cm2','Cold reheat steam pressure','same'),
 A('TICR1004',400,380,250,200,'°C','Cold reheat steam temperature','about 330-350 °C'),
 A('PIHR10031',34,31,5,2,'kg/cm2','Hot reheat steam pressure (1)','about 24-27 kg/cm2g at full load'),
 A('PIHR10032',34,31,5,2,'kg/cm2','Hot reheat steam pressure (2)','same'),
 A('TIHR1004',560,550,515,500,'°C','Hot reheat steam temperature','rated 540 °C'),
 A('TIMS10221',400,380,250,200,'°C','HP turbine bypass outlet temperature (1)','joins cold reheat'),
 A('TIMS10222',400,380,250,200,'°C','HP turbine bypass outlet temperature (2)','same'),
 A('PIMS1021',36,33,5,2,'kg/cm2','HP turbine bypass outlet pressure','joins cold reheat'),
 A('TIHR10121',250,220,100,70,'°C','LP turbine bypass outlet temperature (1) (0-300)','after the spray to the condenser'),
 A('TIHR10122',250,220,100,70,'°C','LP turbine bypass outlet temperature (2)','same'),
 A('ZIHR1391',50,10,null,null,'%','Blow-off M.V. position, hot reheat steam (0-100 %)','normally closed: only high alarms'),
 A('PIAS1004',13.5,12,6,4,'kg/cm2','Auxiliary steam supply pressure, main steam pipe (0-15)','aux steam header about 10 kg/cm2g'),
 A('PIAS1005',13.5,12,6,4,'kg/cm2','Auxiliary steam supply pressure, cold reheat','same'),
 /* feed water heaters, deaerator, turbine auxiliaries */
 A('LICD11041',700,400,-400,-800,'mm','Deaerator storage tank level (1) (-2335..1095)','zero near normal level'),
 A('LICD11042',700,400,-400,-800,'mm','Deaerator storage tank level (2)','same'),
 A('LICD11043',700,400,-400,-800,'mm','Deaerator storage tank level (3)','same'),
 A('LIHD11051',200,100,-100,-200,'mm','No.1 HP heater level (1) (-300..310)','HH = extraction closes'),
 A('LIHD11052',200,100,-100,-200,'mm','No.1 HP heater level (2)','same'),
 A('LIHD11061',200,100,-100,-200,'mm','No.2 HP heater level (1)','same'),
 A('LIHD11062',200,100,-100,-200,'mm','No.2 HP heater level (2)','same'),
 A('LIHD11011',200,100,-100,-200,'mm','No.1 LP heater level (1)','same'),
 A('LIHD11012',200,100,-100,-200,'mm','No.1 LP heater level (2)','same'),
 A('LIHD11021',200,100,-100,-200,'mm','No.2 LP heater level (1)','same'),
 A('LIHD11022',200,100,-100,-200,'mm','No.2 LP heater level (2)','same'),
 A('LIHD11031',200,100,-100,-200,'mm','No.3 LP heater level (1)','same'),
 A('LIHD11032',200,100,-100,-200,'mm','No.3 LP heater level (2)','same'),
 A('TILO10021',55,48,30,25,'°C','Turbine oil cooler outlet oil temperature A','normal 40-45 °C'),
 A('TILO10022',55,48,30,25,'°C','Turbine oil cooler outlet oil temperature B','same'),
 A('TCSAI1004',3300,3060,2950,2800,'rpm','Turbine rated speed (0-4000 rpm)','rated 3000 rpm: HH = 110 % overspeed'),
 /* unit load (ABC-001C) */
 A('GCPAI1001',170,160,45,30,'MW','Unit MW actual C (0-240)','150 MW unit: H 160, HH 170'),
 A('GCPAI1002',170,160,45,30,'MW','Unit MW actual D (0-240)','same'),
 A('TCSAI1001',170,160,45,30,'MW','Target MW set point from TCS (0-200)','same')
];

/* ---- RATE: the 8 ramp boxes (between the T switches of an AUTO-MV transfer) that have NO rate on the drawing. Units of the signal per SECOND. ----
   Evidence: the same box on the same sheets that DOES carry a number: ABC-004A/B/C "(1T / Sec)" on the coal feeder (0-40 T/H) and ABC-050 "5% / sec" on the turbine bypass valve. */
const RATE=[
 {sheet:'ABC-004A',loop:'FICCL1061A coal feeder A flow control (0-40 T/H), AUTO-MV transfer',rate:1,u:'T/H per s',basis:'the drawing gives "(1T / Sec)" for the sister box of the same loop (SI0112); same number used'},
 {sheet:'ABC-004B',loop:'FICCL1061B coal feeder B flow control (0-40 T/H)',rate:1,u:'T/H per s',basis:'same as 004A ("(1T / Sec)" on the sister box)'},
 {sheet:'ABC-004C',loop:'FICCL1061C coal feeder C flow control (0-40 T/H)',rate:1,u:'T/H per s',basis:'same as 004A'},
 {sheet:'ABC-009A',loop:'SICL1060A bottom ash screw cooler A speed control (manual mode ramp)',rate:1,u:'% per s',basis:'screw cooler VFD: 0 to 100 % in 100 s, slow mechanical drive'},
 {sheet:'ABC-009A',loop:'SICL1060B bottom ash screw cooler B speed control',rate:1,u:'% per s',basis:'same'},
 {sheet:'ABC-009A',loop:'SICL1060C bottom ash screw cooler C speed control',rate:1,u:'% per s',basis:'same'},
 {sheet:'ABC-009B',loop:'SICL1060D bottom ash screw cooler D speed control',rate:1,u:'% per s',basis:'same'},
 {sheet:'ABC-020',loop:'HICHR1002B superheater pass flue gas damper position (manual mode ramp)',rate:2,u:'% per s',basis:'damper actuator full stroke in about 50 s; a valve ramp on the drawing (ABC-050) is 5 % / sec'}
];

/* ---- PO / PIDV: pulse output. The drawings give no pulse timing. ---- */
const PO={cyc:2,stroke:60,minp:0.2,
 basis:'typical electric actuator on pulse (raise / lower) control: pulse cycle 2 s, full stroke 60 s, shortest pulse 0.2 s. PIDV itself runs as the velocity-form PID; the PO shows the raise (PO1) / lower (PO2) pulses and the pulse position.'};

/* ---- FACE: PID / MAN / SUMA faceplate values written by the user from the DCS (2026-10-08, file DCS-FORM-PID-MAN-SUMA_FILLED.xlsx, extract tools/data/dcs-form2-filled.json). FILE data, not assumed. ---- */
const FACE=require('./data/dcs-form2-filled.json');

module.exports={TP,ALM,RATE,PO,FACE};
