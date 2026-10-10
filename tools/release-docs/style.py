"""Shared look of every release PDF (rule of the user, 2026-10-10): PAPER-LIKE, never bright white (eye strain).
Warm cream paper, dark soft-brown text, muted status colours.  Used by make-report-*.py and make-guide-*.py (v1.20.11 and later).
Changing the colours here changes every report / guide generator that imports it."""
import html
PAPER='#efe6cf';INK='#2e2619';HEAD='#4b3a1c';RULE='#a8966a';TH='#e0d3b0';BOX='#e8dcbe'
CSS="""
@page{size:A4;margin:0}
html,body{background:%(paper)s;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:11.5px/1.5 Georgia,'Segoe UI',Arial,serif;color:%(ink)s;margin:0;padding:0}
#wrap{padding:14mm 12mm;box-decoration-break:clone;-webkit-box-decoration-break:clone}
h1{font-size:22px;margin:0 0 4px;color:%(head)s}h2{font-size:15px;margin:18px 0 6px;border-bottom:2px solid %(rule)s;padding-bottom:2px;color:%(head)s}h3{font-size:12.5px;margin:12px 0 4px;color:%(head)s}
table{border-collapse:collapse;width:100%%;margin:6px 0 10px;background:transparent}th,td{border:1px solid %(rule)s;padding:3px 5px;vertical-align:top;text-align:left}th{background:%(th)s;color:%(head)s}
.PASS{background:#cddcb8}.FAIL{background:#e6bfb2}.NR{background:#ebd89a}.NT{background:#d9cfb3}
.box{border:1px solid %(rule)s;background:%(box)s;padding:6px 9px;margin:6px 0}small{color:#5c4f36}code{background:#e3d7b6;padding:0 3px}
.pb{page-break-before:always}a{color:#5a3d12}tr{page-break-inside:avoid}img{filter:none}
"""%dict(paper=PAPER,ink=INK,head=HEAD,rule=RULE,th=TH,box=BOX)
def page(title,body):return '<!doctype html><html><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body><div id="wrap">%s</div></body></html>'%(html.escape(title),CSS,body)
