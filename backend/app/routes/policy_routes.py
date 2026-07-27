from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.services.policy_service import (
    create_policy,
    get_all_policies,
    get_policy,
    update_policy,
    delete_policy
)

policy_bp = Blueprint(
    "policies",
    __name__,
    url_prefix="/api/policies"
)


@policy_bp.route("", methods=["POST"])
@jwt_required()
def add_policy():
    return create_policy(request.get_json())


@policy_bp.route("", methods=["GET"])
@jwt_required()
def policies():
    return get_all_policies()


@policy_bp.route("/<int:policy_id>", methods=["GET"])
@jwt_required()
def policy(policy_id):
    return get_policy(policy_id)


@policy_bp.route("/<int:policy_id>", methods=["PUT"])
@jwt_required()
def update(policy_id):
    return update_policy(policy_id, request.get_json())


@policy_bp.route("/<int:policy_id>", methods=["DELETE"])
@jwt_required()
def delete(policy_id):
    return delete_policy(policy_id)