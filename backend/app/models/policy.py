from app.extensions import db


class Policy(db.Model):
    __tablename__ = "policies"

    id = db.Column(db.Integer, primary_key=True)

    policy_number = db.Column(db.String(50), unique=True, nullable=False)
    policy_name = db.Column(db.String(100), nullable=False)
    policy_type = db.Column(db.String(50), nullable=False)

    premium_amount = db.Column(db.Float, nullable=False)
    coverage_amount = db.Column(db.Float, nullable=False)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    status = db.Column(db.String(20), default="Active")

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=False
    )

    customer = db.relationship(
        "Customer",
        back_populates="policies"
    )

    premiums = db.relationship(
        "Premium",
        back_populates="policy",
        cascade="all, delete-orphan"
    )

    claims = db.relationship(
        "Claim",
        back_populates="policy",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "policy_number": self.policy_number,
            "policy_name": self.policy_name,
            "policy_type": self.policy_type,
            "premium_amount": self.premium_amount,
            "coverage_amount": self.coverage_amount,
            "start_date": str(self.start_date),
            "end_date": str(self.end_date),
            "status": self.status,
            "customer_id": self.customer_id
        }