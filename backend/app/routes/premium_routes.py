from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.services.premium_service import (
    create_premium,
    get_all_premiums,
    get_premium,
    update_premium,
    delete_premium
)

premium_bp = Blueprint(
    "premiums",
    __name__,
    url_prefix="/api/premiums"
)


@premium_bp.route("", methods=["POST"])
@jwt_required()
def add_premium():
    return create_premium(request.get_json())


@premium_bp.route("", methods=["GET"])
@jwt_required()
def premiums():
    return get_all_premiums()


@premium_bp.route("/<int:premium_id>", methods=["GET"])
@jwt_required()
def premium(premium_id):
    return get_premium(premium_id)


@premium_bp.route("/<int:premium_id>", methods=["PUT"])
@jwt_required()
def update(premium_id):
    return update_premium(premium_id, request.get_json())


@premium_bp.route("/<int:premium_id>", methods=["DELETE"])
@jwt_required()
def delete(premium_id):
    return delete_premium(premium_id)