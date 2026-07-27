from app.extensions import db


class Claim(db.Model):
    __tablename__ = "claims"

    id = db.Column(db.Integer, primary_key=True)

    claim_number = db.Column(db.String(50), unique=True, nullable=False)

    claim_amount = db.Column(db.Float, nullable=False)

    claim_reason = db.Column(db.Text, nullable=False)

    claim_date = db.Column(db.Date, nullable=False)

    status = db.Column(
        db.String(20),
        default="Pending"
    )

    policy_id = db.Column(
        db.Integer,
        db.ForeignKey("policies.id"),
        nullable=False
    )

    policy = db.relationship(
        "Policy",
        back_populates="claims"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "claim_number": self.claim_number,
            "claim_amount": self.claim_amount,
            "claim_reason": self.claim_reason,
            "claim_date": str(self.claim_date),
            "status": self.status,
            "policy_id": self.policy_id
        }