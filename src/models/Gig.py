"""The file which contains the class, representing the gigs table"""
from . import db

class Gig(db.Model):
    """The class, representing the gigs table"""
    __tablename__ = "gigs_table"

    id = db.Column(db.Integer(), autoincrement=True, primary_key=True, nullable=False)

    link = db.Column(db.String(), unique=True)
    location = db.Column(db.String(), unique=True)
    time = db.Column(db.DateTime())
