from flask import jsonify
from sqlalchemy import func

from app.extensions import db

from app.models.customer import Customer
from app.models.policy import Policy
from app.models.premium import Premium
from app.models.claim import Claim


def dashboard():

    total_customers = Customer.query.count()

    total_policies = Policy.query.count()

    total_claims = Claim.query.count()

    total_premiums = db.session.query(
        func.sum(Premium.amount)
    ).scalar() or 0

    approved_claims = Claim.query.filter_by(
        status="Approved"
    ).count()

    pending_claims = Claim.query.filter_by(
        status="Pending"
    ).count()

    active_policies = Policy.query.filter_by(
        status="Active"
    ).count()

    expired_policies = Policy.query.filter_by(
        status="Expired"
    ).count()

    return jsonify({
        "total_customers": total_customers,
        "total_policies": total_policies,
        "total_premiums": float(total_premiums),
        "total_claims": total_claims,
        "approved_claims": approved_claims,
        "pending_claims": pending_claims,
        "active_policies": active_policies,
        "expired_policies": expired_policies
    })