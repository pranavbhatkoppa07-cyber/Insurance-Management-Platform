import os
from flask import jsonify, current_app
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.document import Document
from app.models.customer import Customer

ALLOWED_EXTENSIONS = {
    "pdf", "png", "jpg", "jpeg", "doc", "docx"
}


def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_document(file, customer_id):

    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "Invalid file type"}), 400

    filename = secure_filename(file.filename)

    upload_folder = os.path.join(
        current_app.root_path,
        "..",
        "uploads"
    )

    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    document = Document(
        file_name=filename,
        file_path=filepath,
        customer_id=customer_id
    )

    db.session.add(document)
    db.session.commit()

    return jsonify({
        "message": "Document uploaded successfully",
        "document": document.to_dict()
    }), 201


def get_documents():

    docs = Document.query.all()

    return jsonify([
        doc.to_dict()
        for doc in docs
    ])