#!/usr/bin/env python3
"""Verify the LINEAR tables embedded in the app against the supplied reference file LMYP-1 #1-LINEAR.xls (needs: pip install xlrd).
usage: python3 tools/test-verify-linear-xls.py <logic-sim.html> <LINEAR.xls> [out-prefix] [docs/TEST-RESULTS-FX.json]
For every sheet 'S<stn>-LN<n>' of the xls: X / Y points (cols X-INPUT / Y-OUTPUT), ranges, LX / LY (normalised = (v-lo)/(hi-lo)) against the embedded table (same key); then, for every FX block of docs/TEST-RESULTS-FX.json, that the table used is the table whose drawing number (DWG No. of the xls) is the sheet of the block.
Status: PASS / FAIL / NEEDS REVIEW (not in the xls, or drawing number differs) / NOT TESTED."""
import sys,json,re,xlrd
html,xls=sys.argv[1],sys.argv[2];pre=sys.argv[3] if len(sys.argv)>3 else 'docs/TEST-RESULTS-LINEAR';fxj=sys.argv[4] if len(sys.argv)>4 else None
h=open(html,encoding='utf8').read();i=h.index('id="aln">')+9;aln=json.loads(h[i:h.index('</script>',i)]);emb={t['key']:t for t in aln}
wb=xlrd.open_workbook(xls);rec=[];seen=set();dwgOf={}
for s in wb.sheets():
    m=re.match(r'^S(\d)-LN(\d+)$',s.name)
    if not m: continue
    key='S%s-LN%s'%(m.group(1),int(m.group(2)));seen.add(key)
    pts=[];xr=yr=None;dwg=None;ptn=None
    for r in range(s.nrows):
        row=s.row_values(r)
        if len(row)>9 and isinstance(row[1],float) and isinstance(row[4],float) and re.match(r'^\d\d$',str(row[7])):
            pts.append((row[1],row[4],row[8],row[9]));xr=(row[2],row[3]);yr=(row[5],row[6])
        if len(row)>9 and 'DWG No' in str(row[8]): dwg=str(row[9]).strip()
    dwgOf[key]=dwg
    b=dict(sheet=dwg or '?',block='table '+key,source='LINEAR.xls sheet '+s.name+' (DWG No. '+dwg+')')
    t=emb.get(key)
    if not t or not pts:
        rec.append(dict(b,input='-',expected='table in the app',actual='missing' if not t else 'no points in the file',status='FAIL' if not t else 'NOT TESTED',evidence=''));continue
    DOC={'S1-LN15','S1-LN21'}  # documented data fix H-33 (user 2026-10-08): file Y = 80 ~ 120 (percent), drawing + file column LY = ratio 0.8 ~ 1.2 -> Y / 100, Y range 0 ~ 1
    ep=[];[ep.append((p[0],p[1])) for p in (t.get('o0') or t['pts']) if not ep or ep[-1]!=(p[0],p[1])]
    fp=[];[fp.append((x,y)) for x,y,_,_ in pts if not fp or fp[-1]!=(x,y)]
    if key in DOC: fp=[(x,round(y/100,10)) for x,y in fp]; yr=(yr[0]/100,yr[1]/100); pts=[(x,y/100,lx,ly) for x,y,lx,ly in pts]
    ok=len(ep)==len(fp) and all(abs(a[0]-c[0])<1e-9 and abs(a[1]-c[1])<1e-9 for a,c in zip(ep,fp))
    rec.append(dict(b,input='X/Y points (%d)'%len(fp),expected=str(fp[:3])+' ...',actual=str(ep[:3])+' ...',status='PASS' if ok else 'FAIL',evidence='all points compared'+(' (Y/100: documented fix H-33, LY column of the file = 0.8 ~ 1.2)' if key in DOC else '')))
    okr=t.get('xr') and abs(t['xr'][0]-xr[0])<1e-9 and abs(t['xr'][1]-xr[1])<1e-9 and abs(t['yr'][0]-yr[0])<1e-9 and abs(t['yr'][1]-yr[1])<1e-9
    rec.append(dict(b,input='X / Y range',expected='X %s Y %s'%(xr,yr),actual='X %s Y %s'%(t.get('xr'),t.get('yr')),status='PASS' if okr else 'FAIL',evidence=''))
    # LX / LY of the file = normalised X / Y
    bad=[(x,y,lx,ly) for x,y,lx,ly in pts if xr[1]>xr[0] and yr[1]>yr[0] and (abs((x-xr[0])/(xr[1]-xr[0])-lx)>1e-6 or abs((y-yr[0])/(yr[1]-yr[0])-ly)>1e-6)]
    rec.append(dict(b,input='LX / LY of the file = (X-lo)/(hi-lo), (Y-lo)/(hi-lo)',expected='all rows consistent',actual='%d of %d rows differ'%(len(bad),len(pts)),status='PASS' if not bad else 'NEEDS REVIEW',evidence=str(bad[:2])))
for key in emb:
    if key not in seen:
        rec.append(dict(sheet=emb[key].get('dwg'),block='table '+key,input='-',expected='table in LINEAR.xls',actual='not in the file',source=emb[key].get('src') or '-',status='NEEDS REVIEW',evidence='embedded from another reference file ('+str(emb[key].get('src'))+')'))
if fxj:
    for r in json.load(open(fxj)):
        if r.get('input','').startswith('low') and r.get('table'):
            k=r['table'];d=dwgOf.get(k)
            fam=lambda x:(re.match(r'^ABC-(\d+)',x or '') or [None,None])[1]
            rg=re.match(r'^ABC-(\d+)-(\d+)$',d or '');n=fam(r['sheet']);same=d==r['sheet'] or bool(d and fam(d)==n) or bool(rg and n and int(rg.group(1))<=int(n)<=int(rg.group(2)))
            rec.append(dict(sheet=r['sheet'],block=r['block']+' '+r['ln'],input='table used = '+k,expected='table whose drawing number is this sheet (xls DWG No. '+str(d)+')',actual=k,source='LINEAR.xls',status='PASS' if same else 'NEEDS REVIEW',evidence='drawing number of the xls table vs sheet of the FX block'))
cnt={}
for r in rec: cnt[r['status']]=cnt.get(r['status'],0)+1
json.dump(rec,open(pre+'.json','w'),indent=1,ensure_ascii=False)
md=['# LINEAR.xls reference verification','','Counts: '+json.dumps(cnt),'','| sheet | block | input | expected | actual | status | evidence |','|---|---|---|---|---|---|---|']
for r in rec:
    if r['status']!='PASS': md.append('| %s | %s | %s | %s | %s | %s | %s |'%(r['sheet'],r['block'],r['input'],r['expected'],r['actual'],r['status'],r.get('evidence','')))
md.append('\nPASS records: %d (json).'%cnt.get('PASS',0));open(pre+'.md','w').write('\n'.join(md))
print(cnt)
