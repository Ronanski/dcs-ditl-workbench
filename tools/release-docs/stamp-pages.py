"""Stamps 'Logic Sim <label> - n / N' (soft brown, small) at the bottom centre of every page of a paper-like PDF.  usage: python3 -I stamp-pages.py file.pdf label"""
import sys,io
from pypdf import PdfReader,PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
f,lab=sys.argv[1],sys.argv[2] if len(sys.argv)>2 else ''
r=PdfReader(f);w=PdfWriter();n=len(r.pages)
for i,pg in enumerate(r.pages):
    W=float(pg.mediabox.width);buf=io.BytesIO();c=canvas.Canvas(buf,pagesize=(W,float(pg.mediabox.height)));c.setFillColorRGB(.42,.36,.25);c.setFont('Times-Roman',8);c.drawCentredString(W/2,18,'Logic Sim %s - %d / %d'%(lab,i+1,n));c.save();buf.seek(0)
    pg.merge_page(PdfReader(buf).pages[0]);w.add_page(pg)
w.write(open(f,'wb'))
