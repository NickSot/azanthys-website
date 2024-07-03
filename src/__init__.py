import os

from flask import Flask

from .routes import web
from .routes import admin

from .models import db
from .models.Gig import Gig

# TODO: import all models for the website
# TODO: find a way to not cache the pages, but actually update them in dev

SQL_USER = os.environ.get('DB_USER')
SQL_PASSWORD = os.environ.get('DB_PASSWORD')
SQL_PORT = os.environ.get('DB_PORT')
SQL_NAME = os.environ.get('DB_NAME')
SQL_HOST = os.environ.get('DB_HOST')

SQL_CONNECTION_STRING = f"postgresql://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}:{SQL_PORT}/{SQL_NAME}"

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = SQL_CONNECTION_STRING

    db.init_app(app)

    app.register_blueprint(web.web)
    app.register_blueprint(admin.admin)

    with app.app_context():
        db.create_all()

    return app
