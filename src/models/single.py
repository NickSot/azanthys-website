"""This module contains the class mapped to the database table for storing singles"""

from . import db

class Single(db.Model):
    """Singles table"""
    __tablename__ = "singles_table"

    id = db.Column(db.Integer(), auto_increment=True,primary_key=True, nullable=False)

    name = db.Column(db.String())
    url = db.Column(db.String())
