import os
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT

def create_pdf_from_text(problem, solution):
    temp_dir = tempfile.gettempdir()
    pdf_path = os.path.join(temp_dir, f"solution_{os.urandom(8).hex()}.pdf")
    
    doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    
    # Create a custom normal style based on the original Normal
    custom_normal = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        alignment=TA_LEFT,
        spaceAfter=12,
        fontSize=11
    )
    styles.add(custom_normal)
    
    title_style = styles['Heading1']
    normal_style = styles['CustomNormal']
    
    Story = []
    
    Story.append(Paragraph("AI Math Solver - Solution Report", title_style))
    Story.append(Spacer(1, 12))
    
    Story.append(Paragraph("<b>Problem:</b>", styles['Heading3']))
    if problem:
        Story.append(Paragraph(problem.replace('\n', '<br/>'), normal_style))
    else:
        Story.append(Paragraph("<i>[Image problem]</i>", normal_style))
    Story.append(Spacer(1, 12))
    
    Story.append(Paragraph("<b>Solution:</b>", styles['Heading3']))
    
    # Process markdown-like basic formatting for ReportLab
    # ReportLab supports basic HTML tags like <b>, <i>, <br/>
    processed_solution = solution.replace('\n', '<br/>')
    processed_solution = processed_solution.replace('**', '<b>').replace('**', '</b>') # Very basic, doesn't handle toggle well
    
    # Simple formatting: just put everything in paragraphs split by newlines
    for paragraph in solution.split('\n\n'):
        if paragraph.strip():
            # handle minor formatting
            p_text = paragraph.replace('\n', '<br/>')
            Story.append(Paragraph(p_text, normal_style))
            Story.append(Spacer(1, 6))
            
    doc.build(Story)
    return pdf_path
