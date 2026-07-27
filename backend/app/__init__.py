from flask import Flask
from flask_cors import CORS

from config import Config
from app.extensions import db, migrate, jwt, bcrypt
from app.utils.error_handler import register_error_handlers

from app.models import User, Customer, Policy, Premium, Claim

from app.routes.auth_routes import auth_bp
from app.routes.customer_routes import customer_bp
from app.routes.policy_routes import policy_bp
from app.routes.premium_routes import premium_bp
from app.routes.claim_routes import claim_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.document_routes import document_bp
from app.routes.report_routes import report_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(policy_bp)
    app.register_blueprint(premium_bp)
    app.register_blueprint(claim_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(document_bp)
    app.register_blueprint(report_bp)

    register_error_handlers(app)

    @app.route("/")
    def home():
        return {
            "message": "Insurance Management Platform API Running Successfully"
        }

    return app