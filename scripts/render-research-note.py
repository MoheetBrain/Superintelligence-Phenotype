"""Render the public working note. Requires reportlab; source stays searchable."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

root = Path(__file__).resolve().parents[1]
directory = root / 'public/research'
text = (directory / 'state-space-framework-v0.1.md').read_text()
ink = colors.HexColor('#172529')
teal = colors.HexColor('#05695f')
styles = {
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=13.5, textColor=ink, spaceAfter=7, alignment=TA_LEFT),
    'title': ParagraphStyle('title', fontName='Times-Roman', fontSize=25, leading=28, textColor=ink, spaceAfter=16),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=teal, spaceBefore=10, spaceAfter=8, keepWithNext=True),
    'reference': ParagraphStyle('reference', fontName='Helvetica', fontSize=8.5, leading=12, textColor=ink, spaceAfter=7),
}
story = []
for block in text.strip().split('\n\n'):
    if block == '---':
        story.append(PageBreak())
        continue
    kind = 'title' if block.startswith('# ') else 'heading' if block.startswith('## ') else 'reference' if block.startswith('[') else 'body'
    block = block.removeprefix('## ').removeprefix('# ')
    for paragraph in block.split('\n'):
        content = escape(paragraph)
        if paragraph.startswith('- '):
            content = '&#8226; ' + escape(paragraph[2:])
        story.append(Paragraph(content, styles[kind]))

def decorate(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#c5d2d6'))
    canvas.line(46, 43, A4[0]-46, 43)
    canvas.setFillColor(colors.HexColor('#53666d'))
    canvas.setFont('Helvetica', 8)
    canvas.drawString(46, 30, 'SUPERINTEL / Working note v0.1 / 14 September 2026')
    canvas.drawRightString(A4[0]-46, 30, f'{doc.page}')
    canvas.restoreState()

doc = SimpleDocTemplate(str(directory/'state-space-framework-v0.1.pdf'), pagesize=A4, topMargin=44, bottomMargin=58, leftMargin=46, rightMargin=46, title='A State-Space Framework for Loss-of-Control Risk in Advanced AI Systems', author='Moheet Khawaja', subject='Working research note v0.1; proposed framework, no empirical results')
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
print(directory/'state-space-framework-v0.1.pdf')
