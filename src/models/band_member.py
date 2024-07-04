"""This module contains the class mapped to the database table for storing band member intel"""

from . import db

class BandMember(db.Model):
    """Band members table class relation"""
    __tablename__ = "band_members_table"

    id = db.Column(db.Integer(), auto_increment=True, primary_key=True, nullable=False)

    name = db.Column(db.String())
    bio = db.Column(db.String())
