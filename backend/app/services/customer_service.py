from flask import jsonify
from app.extensions import db
from app.models.customer import Customer
from datetime import datetime


def create_customer(data):
    try:
        email = data.get("email")

        existing_customer = Customer.query.filter_by(email=email).first()

        if existing_customer:
            return jsonify({
                "message": "Customer already exists"
            }), 400

        dob = None
        if data.get("date_of_birth"):
            dob = datetime.strptime(
                data.get("date_of_birth"),
                "%Y-%m-%d"
            ).date()

        customer = Customer(
            full_name=data.get("full_name"),
            email=email,
            phone=data.get("phone"),
            address=data.get("address"),
            date_of_birth=dob,
            gender=data.get("gender")
        )

        db.session.add(customer)
        db.session.commit()

        return jsonify({
            "message": "Customer created successfully",
            "customer": customer.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500


def get_all_customers():
    customers = Customer.query.all()

    return jsonify([
        customer.to_dict()
        for customer in customers
    ]), 200


def get_customer(customer_id):
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    return jsonify(customer.to_dict()), 200


def update_customer(customer_id, data):
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    customer.full_name = data.get(
        "full_name",
        customer.full_name
    )

    customer.email = data.get(
        "email",
        customer.email
    )

    customer.phone = data.get(
        "phone",
        customer.phone
    )

    customer.address = data.get(
        "address",
        customer.address
    )

    customer.gender = data.get(
        "gender",
        customer.gender
    )

    if data.get("date_of_birth"):
        customer.date_of_birth = datetime.strptime(
            data.get("date_of_birth"),
            "%Y-%m-%d"
        ).date()

    db.session.commit()

    return jsonify({
        "message": "Customer updated successfully",
        "customer": customer.to_dict()
    }), 200


def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({
            "message": "Customer not found"
        }), 404

    db.session.delete(customer)
    db.session.commit()

    return jsonify({
        "message": "Customer deleted successfully"
    }), 200