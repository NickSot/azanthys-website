from . import db

class Gig(db.Model):
    __tablename__ = "gigs_table"

    id = db.Column(db.Integer(), primary_key=True, nullable=False)

    location = db.Column(db.String(50))
    time = db.column(db.DateTime(50))
