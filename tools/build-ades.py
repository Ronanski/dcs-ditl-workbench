# builds data/ades-unit1.json from the user's IO list and memory lists (.xlsx converted from .xls).
# usage: python3 -I tools/build-ades.py <dir with the converted .xlsx files> [out.json]
import sys,re,json,glob,os
import pandas as pd
d=sys.argv[1];out=sys.argv[2] if len(sys.argv)>2 else 'data/ades-unit1.json'
A={}                      # station -> address -> record
def put(stn,addr,rec):
    A.setdefault(stn,{})
    if addr in A[stn] and A[stn][addr]['k']=='io' and rec['k']!='io': return
    A[stn][addr]=rec
def s(v):
    return None if v is None or (isinstance(v,float) and pd.isna(v)) else str(v).strip()
def f(v):
    try:
        x=float(v);return int(x) if x==int(x) else x
    except: return None
# ---- IO list
io=pd.ExcelFile(glob.glob(os.path.join(d,'*IO_Rev*.xlsx'))[0])
for sn in io.sheet_names:
    m=re.match(r'Station (\d+)',sn)
    if not m: continue
    stn=int(m.group(1))-100
    df=io.parse(sn,header=None)
    hdr=None
    for i in range(min(8,len(df))):
        if str(df.iat[i,5]).strip().upper().startswith('TAG'): hdr=i;break
    if hdr is None: continue
    for i in range(hdr+1,len(df)):
        a=s(df.iat[i,4]);
        if not a: continue
        put(stn,a,{'k':'io','tag':s(df.iat[i,5]),'d':s(df.iat[i,6]),'lo':f(df.iat[i,7]),'hi':f(df.iat[i,8]),'u':s(df.iat[i,9]),'t':s(df.iat[i,10]),'ab':s(df.iat[i,11])})
# ---- memory lists
for fn in sorted(glob.glob(os.path.join(d,'*Memory-10*.xlsx'))):
    stn=int(re.search(r'Memory-10(\d)',fn).group(1))
    x=pd.ExcelFile(fn)
    for sn in x.sheet_names:
        df=x.parse(sn,header=None)
        if df.shape[1]<3: continue
        base=None
        for i in range(1,len(df)):
            v=df.iat[i,1]
            if isinstance(v,str) and re.match(r'^[A-Za-z]{1,3}\.?\d{2,}',v.strip()):
                base=v.strip();addr=base
            elif base is not None and v is not None and not (isinstance(v,float) and pd.isna(v)):
                ch=str(int(v)) if isinstance(v,(int,float)) else str(v).strip().upper()
                addr=base[:-1]+ch
            else: continue
            if re.match(r'^PTN|^FP',addr): desc=s(df.iat[i,3]) if sn.endswith('(PTN)') else s(df.iat[i,2])
            else: desc=s(df.iat[i,2])
            if sn.endswith('(PTN)'): desc=s(df.iat[i,3]); rem=s(df.iat[i,4])
            else: rem=s(df.iat[i,3]) if df.shape[1]>3 else None
            rec={'k':'mem','d':desc}
            if sn.endswith('(TR)'): rec['t']=s(df.iat[i,3]);rec['v']=f(df.iat[i,4]);rec['r']=s(df.iat[i,5]) if df.shape[1]>5 else None
            elif rem: rec['r']=rem
            if rec['d'] or rec.get('r') or rec.get('v') is not None: put(stn,addr,rec)
# compact: drop None / empty; drop meaningless "USED"/"SPARE" only descriptions? keep, they are information
for stn in A:
    for a,r in A[stn].items():
        for k in [k for k,v in r.items() if v is None or v=='']: del r[k]
n=sum(len(v) for v in A.values())
json.dump({str(k):v for k,v in A.items()},open(out,'w'),ensure_ascii=False,separators=(',',':'))
print('stations',sorted(A),'records',n,'bytes',os.path.getsize(out),{k:len(v) for k,v in A.items()})
