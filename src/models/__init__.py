from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# TODO: declare the rest of the models

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
