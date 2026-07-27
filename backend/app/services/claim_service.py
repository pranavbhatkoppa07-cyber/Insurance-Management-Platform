from flask import jsonify
from app.extensions import db
from app.models.claim import Claim
from app.models.policy import Policy
from datetime import datetime


def create_claim(data):
    policy = Policy.query.get(data.get("policy_id"))

    if not policy:
        return jsonify({"message": "Policy not found"}), 404

    existing = Claim.query.filter_by(
        claim_number=data.get("claim_number")
    ).first()

    if existing:
        return jsonify({"message": "Claim number already exists"}), 400

    claim = Claim(
        claim_number=data.get("claim_number"),
        claim_amount=data.get("claim_amount"),
        claim_reason=data.get("claim_reason"),
        claim_date=datetime.strptime(
            data.get("claim_date"),
            "%Y-%m-%d"
        ).date(),
        status=data.get("status", "Pending"),
        policy_id=data.get("policy_id")
    )

    db.session.add(claim)
    db.session.commit()

    return jsonify({
        "message": "Claim created successfully",
        "claim": claim.to_dict()
    }), 201


def get_all_claims():
    claims = Claim.query.all()

    return jsonify([
        claim.to_dict()
        for claim in claims
    ]), 200


def get_claim(claim_id):
    claim = Claim.query.get(claim_id)

    if not claim:
        return jsonify({
            "message": "Claim not found"
        }), 404

    return jsonify(claim.to_dict()), 200


def update_claim(claim_id, data):
    claim = Claim.query.get(claim_id)

    if not claim:
        return jsonify({
            "message": "Claim not found"
        }), 404

    claim.claim_amount = data.get(
        "claim_amount",
        claim.claim_amount
    )

    claim.claim_reason = data.get(
        "claim_reason",
        claim.claim_reason
    )

    claim.status = data.get(
        "status",
        claim.status
    )

    if data.get("claim_date"):
        claim.claim_date = datetime.strptime(
            data.get("claim_date"),
            "%Y-%m-%d"
        ).date()

    db.session.commit()

    return jsonify({
        "message": "Claim updated successfully",
        "claim": claim.to_dict()
    }), 200


def delete_claim(claim_id):
    claim = Claim.query.get(claim_id)

    if not claim:
        return jsonify({
            "message": "Claim not found"
        }), 404

    db.session.delete(claim)
    db.session.commit()

    return jsonify({
        "message": "Claim deleted successfully"
    }), 200