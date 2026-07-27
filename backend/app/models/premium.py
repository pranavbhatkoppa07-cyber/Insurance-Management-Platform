from app.extensions import db


class Premium(db.Model):
    __tablename__ = "premiums"

    id = db.Column(db.Integer, primary_key=True)

    amount = db.Column(db.Float, nullable=False)

    payment_date = db.Column(db.Date, nullable=False)

    payment_method = db.Column(db.String(50), nullable=False)

    status = db.Column(
        db.String(20),
        default="Paid"
    )

    policy_id = db.Column(
        db.Integer,
        db.ForeignKey("policies.id"),
        nullable=False
    )

    policy = db.relationship(
        "Policy",
        back_populates="premiums"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "payment_date": str(self.payment_date),
            "payment_method": self.payment_method,
            "status": self.status,
            "policy_id": self.policy_id
        }