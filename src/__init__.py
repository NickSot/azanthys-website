import os

from flask import Flask

from .routes import web
from .routes import admin

from .models import db

from .models.gig import Gig
from .models.single import Single
from .models.band_member import BandMember
from .models.session import Session

# TODO: find a way to not cache the pages, but actually update them in dev

SQL_USER = os.environ.get('DB_USER')
SQL_PASSWORD = os.environ.get('DB_PASSWORD')
SQL_PORT = os.environ.get('DB_PORT')
SQL_NAME = os.environ.get('DB_NAME')
SQL_HOST = os.environ.get('DB_HOST')

SQL_CONNECTION_STRING = f"postgresql://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}:{SQL_PORT}/{SQL_NAME}"

def create_app():
    """Create the application with its database and middleware parameters"""

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = SQL_CONNECTION_STRING
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    db.init_app(app)

    app.register_blueprint(web.web)
    app.register_blueprint(admin.admin)

    with app.app_context():
        db.create_all()
        create_db_entries(db)

    return app

def create_db_entries(database):
    """Create db entities"""

    database.session.query(BandMember).delete()
    database.session.commit()

    band_members = []

    band_members.append(BandMember(name="band", bio="band bio"))
    band_members.append(BandMember(name="nedi", bio="nedi bio"))
    band_members.append(BandMember(name="mitko", bio="mitko bio"))
    band_members.append(BandMember(name="ivo", bio="ivo bio"))
    band_members.append(BandMember(name="yasen", bio="yasen bio"))
    band_members.append(BandMember(name="pesho", bio="pesho bio"))

    database.session.bulk_save_objects(band_members)
    database.session.commit()
