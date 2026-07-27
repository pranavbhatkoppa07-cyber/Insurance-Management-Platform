from flask import jsonify
from app.extensions import db
from app.models.premium import Premium
from app.models.policy import Policy
from datetime import datetime


def create_premium(data):
    policy = Policy.query.get(data.get("policy_id"))

    if not policy:
        return jsonify({"message": "Policy not found"}), 404

    premium = Premium(
        amount=data.get("amount"),
        payment_date=datetime.strptime(
            data.get("payment_date"),
            "%Y-%m-%d"
        ).date(),
        payment_method=data.get("payment_method"),
        status=data.get("status", "Paid"),
        policy_id=data.get("policy_id")
    )

    db.session.add(premium)
    db.session.commit()

    return jsonify({
        "message": "Premium payment added successfully",
        "premium": premium.to_dict()
    }), 201


def get_all_premiums():
    premiums = Premium.query.all()

    return jsonify([
        premium.to_dict()
        for premium in premiums
    ]), 200


def get_premium(premium_id):
    premium = Premium.query.get(premium_id)

    if not premium:
        return jsonify({"message": "Premium not found"}), 404

    return jsonify(premium.to_dict()), 200


def update_premium(premium_id, data):
    premium = Premium.query.get(premium_id)

    if not premium:
        return jsonify({"message": "Premium not found"}), 404

    premium.amount = data.get("amount", premium.amount)
    premium.payment_method = data.get(
        "payment_method",
        premium.payment_method
    )
    premium.status = data.get("status", premium.status)

    if data.get("payment_date"):
        premium.payment_date = datetime.strptime(
            data.get("payment_date"),
            "%Y-%m-%d"
        ).date()

    db.session.commit()

    return jsonify({
        "message": "Premium updated successfully",
        "premium": premium.to_dict()
    }), 200


def delete_premium(premium_id):
    premium = Premium.query.get(premium_id)

    if not premium:
        return jsonify({"message": "Premium not found"}), 404

    db.session.delete(premium)
    db.session.commit()

    return jsonify({
        "message": "Premium deleted successfully"
    }), 200