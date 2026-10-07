"""Extracts the drum level pressure compensation curves (LN39 = column K, LN38 = column N, x = drum pressure column E, rows 12-30) from the user's "Drum Level Calculation.xls" into tools/data/drum-level-ln.json.
usage:  soffice --headless --convert-to xlsx --outdir <empty-dir> "LMYP-1 #1-Drum Level Calculation.xls"
        python3 -I tools/extract-drum-ln.py <empty-dir>/"LMYP-1 #1-Drum Level Calculation.xlsx" tools/data/drum-level-ln.json"""
import sys,json,openpyxl
ws=openpyxl.load_workbook(sys.argv[1],data_only=True).active
p39=[];p38=[]
for r in range(12,31):
    e=ws.cell(r,5).value;k=ws.cell(r,11).value;n=ws.cell(r,14).value
    if e is None:continue
    p39.append([float(e),float(k)]);p38.append([float(e),float(n)])
json.dump({'source':'LMYP-1 #1-Drum Level Calculation.xls, sheet DRUM LEVEL, rows 12-30: E = drum pressure kg/cm2, K = LN39 Y-axis, N = LN38 Y-axis (ratio 0..1)','LN39':p39,'LN38':p38},open(sys.argv[2],'w'),indent=1)
print(len(p39),'points')
