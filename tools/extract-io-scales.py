"""Extracts the AI / AO scales (Base Scale, Full Scale, Unit) per station from the user's IO list into tools/data/io-scales.json.
usage:  soffice --headless --convert-to xlsx --outdir <empty-dir> "LMYP-1 #1_IO_Rev.1.xls"
        python3 -I tools/extract-io-scales.py <empty-dir>/"LMYP-1 #1_IO_Rev.1.xlsx" tools/data/io-scales.json
(needs openpyxl; run it only on files you trust, in a directory of its own)"""
import sys,re,json,openpyxl
wb=openpyxl.load_workbook(sys.argv[1],read_only=True,data_only=True)
out={}
for ws in wb:
    if not ws.title.startswith('Station'):continue
    stn=re.findall(r'\d+',ws.title)[0][-1]
    for r in ws.iter_rows(min_row=4,values_only=True):
        if not r or len(r)<10:continue
        a=r[4]
        if isinstance(a,str) and a[:2] in('AI','AO'):
            out.setdefault(stn,{})[a]={'tag':r[5],'d':r[6],'lo':r[7],'hi':r[8],'u':r[9]}
json.dump(out,open(sys.argv[2],'w'))
print({k:len(v) for k,v in out.items()})
