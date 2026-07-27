from flask import jsonify
from app.extensions import db
from app.models.policy import Policy
from app.models.customer import Customer
from datetime import datetime


def create_policy(data):
    customer = Customer.query.get(data.get("customer_id"))

    if not customer:
        return jsonify({"message": "Customer not found"}), 404

    existing = Policy.query.filter_by(
        policy_number=data.get("policy_number")
    ).first()

    if existing:
        return jsonify({"message": "Policy number already exists"}), 400

    policy = Policy(
        policy_number=data.get("policy_number"),
        policy_name=data.get("policy_name"),
        policy_type=data.get("policy_type"),
        premium_amount=data.get("premium_amount"),
        coverage_amount=data.get("coverage_amount"),
        start_date=datetime.strptime(
            data.get("start_date"),
            "%Y-%m-%d"
        ).date(),
        end_date=datetime.strptime(
            data.get("end_date"),
            "%Y-%m-%d"
        ).date(),
        status=data.get("status", "Active"),
        customer_id=data.get("customer_id")
    )

    db.session.add(policy)
    db.session.commit()

    return jsonify({
        "message": "Policy created successfully",
        "policy": policy.to_dict()
    }), 201


def get_all_policies():
    policies = Policy.query.all()

    return jsonify([
        policy.to_dict()
        for policy in policies
    ]), 200


def get_policy(policy_id):
    policy = Policy.query.get(policy_id)

    if not policy:
        return jsonify({
            "message": "Policy not found"
        }), 404

    return jsonify(policy.to_dict()), 200


def update_policy(policy_id, data):
    policy = Policy.query.get(policy_id)

    if not policy:
        return jsonify({
            "message": "Policy not found"
        }), 404

    policy.policy_name = data.get(
        "policy_name",
        policy.policy_name
    )

    policy.policy_type = data.get(
        "policy_type",
        policy.policy_type
    )

    policy.premium_amount = data.get(
        "premium_amount",
        policy.premium_amount
    )

    policy.coverage_amount = data.get(
        "coverage_amount",
        policy.coverage_amount
    )

    policy.status = data.get(
        "status",
        policy.status
    )

    if data.get("start_date"):
        policy.start_date = datetime.strptime(
            data.get("start_date"),
            "%Y-%m-%d"
        ).date()

    if data.get("end_date"):
        policy.end_date = datetime.strptime(
            data.get("end_date"),
            "%Y-%m-%d"
        ).date()

    db.session.commit()

    return jsonify({
        "message": "Policy updated successfully",
        "policy": policy.to_dict()
    }), 200


def delete_policy(policy_id):
    policy = Policy.query.get(policy_id)

    if not policy:
        return jsonify({
            "message": "Policy not found"
        }), 404

    db.session.delete(policy)
    db.session.commit()

    return jsonify({
        "message": "Policy deleted successfully"
    }), 200