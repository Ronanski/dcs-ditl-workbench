# Builds the Excel version of DCS form 2 from the JSON written by make-dcs-form2.js. usage: python3 -I build-form2-xlsx.py form.json out.xlsx
import json,sys
from openpyxl import Workbook
from openpyxl.styles import Font,PatternFill,Alignment,Border,Side
from openpyxl.utils import get_column_letter as L
d=json.load(open(sys.argv[1]));by,PAR=d['by'],d['PAR']
thin=Side(style='thin',color='555555');BD=Border(left=thin,right=thin,top=thin,bottom=thin)
GH=PatternFill('solid',fgColor='DDDDDD');GU=PatternFill('solid',fgColor='EEEEEE');ST=PatternFill('solid',fgColor='CFD8E3');ID=PatternFill('solid',fgColor='F6F6F6')
wb=Workbook();ws0=wb.active;ws0.title='How to use'
ws0['A1']='DCS FORM 2 — PID, MAN, SUMA faceplate parameters';ws0['A1'].font=Font(bold=True,size=14)
for i,t in enumerate(['Open the faceplate of each tag in the DCS. MNO = module number (MNO 14 = S1-MDL014); station 101 = S1.','Write the value exactly as the faceplate shows it, in the unit of the row 2 header. "=" means the same as the column before. Put an x in OK when the row is done.','The rows are sorted by station and MNO (the filter buttons let you sort in another way). Sheets: PID (incl. PIDV), MAN, SUMA, Sim now (reference: what the simulator uses at the moment).','The meaning of each column is the assistant\'s reading of the faceplate names: tell me if one is wrong.'],start=3):ws0.cell(i,1,t)
r=8
for c,h in enumerate(['Type','Column','Faceplate name — meaning','Unit','Used by the simulator now?'],1):
    x=ws0.cell(r,c,h);x.font=Font(bold=True);x.fill=GH;x.border=BD
for k in PAR:
    for p in PAR[k]:
        r+=1
        for c,v in enumerate([k,p[0],p[1],p[2],'yes' if p[3]=='yes' else 'not yet (recorded to be used)'],1):ws0.cell(r,c,v).border=BD
for c,w in zip('ABCDE',[8,10,48,12,34]):ws0.column_dimensions[c].width=w
def sheet(k):
    ws=wb.create_sheet(k);P=PAR[k];A=by[k]
    idh=['#','Station','Sheet','Tag','MNO','Description','PV address / IO tag','PV unit']
    ws.append([f'{k} — sorted by station and MNO. Write the faceplate values in the white columns.']);ws['A1'].font=Font(bold=True,size=12)
    ws.append(idh+[p[0] for p in P]+['OK','Notes']);ws.append(['']*len(idh)+[('unit' if p[2]=='PV unit' else p[2]) for p in P]+['',''])
    for c in range(1,len(idh)+len(P)+3):
        for rr in (2,3):
            x=ws.cell(rr,c);x.fill=GH if rr==2 else GU;x.font=Font(bold=(rr==2),size=9 if rr==3 else 10);x.border=BD;x.alignment=Alignment(horizontal='center',vertical='center',wrap_text=True)
    for i,x in enumerate(A,1):
        ws.append([i,x['stn'],', '.join(x['sheets']),x['tag'],x['mno'],x['desc'],x['pv'],x['unit']]+['']*len(P)+['',''])
        rr=ws.max_row
        for c in range(1,len(idh)+len(P)+3):
            y=ws.cell(rr,c);y.border=BD;y.alignment=Alignment(vertical='center',wrap_text=c in (3,6,7))
            if c<=len(idh):y.fill=ID
        ws.cell(rr,4).font=Font(bold=True);ws.cell(rr,5).font=Font(bold=True);ws.row_dimensions[rr].height=30
    for c,w in zip(range(1,9),[5,8,12,18,7,40,28,8]):ws.column_dimensions[L(c)].width=w
    for c in range(9,9+len(P)):ws.column_dimensions[L(c)].width=9
    ws.column_dimensions[L(9+len(P))].width=5;ws.column_dimensions[L(10+len(P))].width=20
    ws.freeze_panes=ws.cell(4,6);ws.auto_filter.ref=f'A3:{L(len(idh)+len(P)+2)}{ws.max_row}'
    ws.page_setup.orientation='landscape';ws.page_setup.paperSize=9;ws.page_setup.fitToWidth=1;ws.page_setup.fitToHeight=0;ws.sheet_properties.pageSetUpPr.fitToPage=True;ws.print_title_rows='1:3'
for k in ('PID','MAN','SUMA'):sheet(k)
ws=wb.create_sheet('Sim now (reference)');ws.append(['What the simulator uses at the moment (NOT from the DCS): to compare with the values you write.']);ws['A1'].font=Font(bold=True)
ws.append(['Type','Station','MNO','Tag','Sheet','PH','PL','MH','ML','P (= 100 / Kp)','I (s)','D (s)'])
for c in range(1,13):ws.cell(2,c).font=Font(bold=True);ws.cell(2,c).fill=GH
for k in ('PID','MAN'):
    for x in by[k]:
        s=x.get('sim',{});ws.append([k,x['stn'],x['mno'],x['tag'],', '.join(x['sheets']),s.get('PH'),s.get('PL'),s.get('MH'),s.get('ML'),s.get('P'),s.get('I'),s.get('D')])
for c,w in zip(range(1,13),[7,8,6,18,14,8,8,8,8,12,8,8]):ws.column_dimensions[L(c)].width=w
wb.save(sys.argv[2])
