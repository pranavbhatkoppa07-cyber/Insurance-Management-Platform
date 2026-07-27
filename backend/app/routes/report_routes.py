from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.services.report_service import generate_report

report_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/api/reports"
)


@report_bp.route("/pdf", methods=["GET"])
@jwt_required()
def pdf_report():
    return generate_report()