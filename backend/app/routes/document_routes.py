from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.services.document_service import (
    upload_document,
    get_documents
)

document_bp = Blueprint(
    "documents",
    __name__,
    url_prefix="/api/documents"
)


@document_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload():

    file = request.files.get("file")

    customer_id = request.form.get("customer_id")

    return upload_document(file, int(customer_id))


@document_bp.route("", methods=["GET"])
@jwt_required()
def documents():
    return get_documents()