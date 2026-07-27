import os
from flask import send_file
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from app.models.customer import Customer
from app.models.policy import Policy
from app.models.premium import Premium
from app.models.claim import Claim


def generate_report():

    reports_folder = os.path.join(
        os.getcwd(),
        "reports"
    )

    os.makedirs(reports_folder, exist_ok=True)

    pdf_path = os.path.join(
        reports_folder,
        "Insurance_Report.pdf"
    )

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(
            "<b>Insurance Management Platform Report</b>",
            styles["Title"]
        )
    )

    story.append(
        Paragraph(
            f"Total Customers : {Customer.query.count()}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"Total Policies : {Policy.query.count()}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"Total Premium Records : {Premium.query.count()}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"Total Claims : {Claim.query.count()}",
            styles["Normal"]
        )
    )

    doc.build(story)

    return send_file(
        pdf_path,
        as_attachment=True
    )