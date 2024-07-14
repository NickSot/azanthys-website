from pathlib import Path
from datetime import datetime, timedelta

import pytest
from .. import create_app, db, Session, Single, Gig, BandMember

# get the resources folder in the tests folder
resources = Path(__file__).parent / "resources"

def create_test_data():
    """Create a session with a token"""
    db.session.add(Session(session_token = '1111',
                           expiration_time=datetime.now() + timedelta(hours = 1)))
    db.session.add(Single(name="Can't Say No",
                          url="https://www.youtube.com/embed/wthBFpSHcSQ?si=8ezWGNLYg43Dc6dk"))
    db.session.add(Gig(link="https://www.youtube.com/watch?v=D5yQCJg886k",
                       location="Youtube Stream", time=datetime.now() + timedelta(hour = 1)))
    db.session.add(BandMember(name="Nedi", bio="Hi, I'm Nedi."))

    db.session.commit()

def delete_all_db():
    """Delete all data from the test database"""
    Session.query.delete()
    Single.query.delete()
    Gig.query.delete()
    BandMember.query.delete()

    db.session.commit()

@pytest.fixture()
def app():
    """Initialize the app and configure it as the test environment"""
    web_app = create_app()
    web_app.config.update({
        "TESTING": True,
    })

    delete_all_db()
    create_test_data()

    yield web_app

@pytest.fixture()
def client(app):
    """Initialize the test client"""
    return app.test_client()

@pytest.fixture()
def runner(app):
    """initialize the CLI runner"""
    return app.test_cli_runner()
