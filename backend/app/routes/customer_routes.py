from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.services.customer_service import (
    create_customer,
    get_all_customers,
    get_customer,
    update_customer,
    delete_customer
)

from app.utils.validators import validate_required_fields

customer_bp = Blueprint(
    "customers",
    __name__,
    url_prefix="/api/customers"
)


@customer_bp.route("", methods=["POST"])
@jwt_required()
def add_customer():

    data = request.get_json()

    validation = validate_required_fields(
        data,
        [
            "full_name",
            "email",
            "phone",
            "address",
            "date_of_birth",
            "gender"
        ]
    )

    if validation:
        return validation

    return create_customer(data)


@customer_bp.route("", methods=["GET"])
@jwt_required()
def customers():
    return get_all_customers()


@customer_bp.route("/<int:customer_id>", methods=["GET"])
@jwt_required()
def customer(customer_id):
    return get_customer(customer_id)


@customer_bp.route("/<int:customer_id>", methods=["PUT"])
@jwt_required()
def update(customer_id):
    return update_customer(
        customer_id,
        request.get_json()
    )


@customer_bp.route("/<int:customer_id>", methods=["DELETE"])
@jwt_required()
def delete(customer_id):
    return delete_customer(customer_id)