"""This module contains the class mapped to the database table for storing admin sessions"""

from . import db

class Session(db.Model):
    """Singles table"""
    __tablename__ = "sessions_table"

    id = db.Column(db.Integer(), autoincrement=True, primary_key=True, nullable=False)

    session_token = db.Column(db.String())
    expiration_time = db.Column(db.DateTime())
