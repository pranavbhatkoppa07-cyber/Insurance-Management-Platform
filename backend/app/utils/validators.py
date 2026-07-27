from flask import jsonify


def validate_required_fields(data, fields):
    missing_fields = []

    for field in fields:
        if not data.get(field):
            missing_fields.append(field)

    if missing_fields:
        return jsonify({
            "message": "Missing required fields",
            "missing_fields": missing_fields
        }), 400

    return None