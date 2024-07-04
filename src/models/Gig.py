"""The file which contains the class, representing the gigs table"""
from . import db

class Gig(db.Model):
    """The class, representing the gigs table"""
    __tablename__ = "gigs_table"

    id = db.Column(db.Integer(), auto_increment=True, primary_key=True, nullable=False)

    location = db.Column(db.String())
    time = db.Column(db.DateTime())
