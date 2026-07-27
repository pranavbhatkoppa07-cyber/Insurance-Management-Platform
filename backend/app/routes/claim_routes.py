from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.services.claim_service import (
    create_claim,
    get_all_claims,
    get_claim,
    update_claim,
    delete_claim
)

claim_bp = Blueprint(
    "claims",
    __name__,
    url_prefix="/api/claims"
)


@claim_bp.route("", methods=["POST"])
@jwt_required()
def add_claim():
    return create_claim(request.get_json())


@claim_bp.route("", methods=["GET"])
@jwt_required()
def claims():
    return get_all_claims()


@claim_bp.route("/<int:claim_id>", methods=["GET"])
@jwt_required()
def claim(claim_id):
    return get_claim(claim_id)


@claim_bp.route("/<int:claim_id>", methods=["PUT"])
@jwt_required()
def update(claim_id):
    return update_claim(claim_id, request.get_json())


@claim_bp.route("/<int:claim_id>", methods=["DELETE"])
@jwt_required()
def delete(claim_id):
    return delete_claim(claim_id)