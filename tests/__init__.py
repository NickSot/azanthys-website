from pathlib import Path

import pytest
from src import create_app

# get the resources folder in the tests folder
resources = Path(__file__).parent / "resources"

@pytest.fixture()
def app():
    """Initialize the app and configure it as the test environment"""
    web_app = create_app()
    web_app.config.update({
        "TESTING": True,
    })

    # TODO: perform database deletion & populate with prefilled data

    yield web_app

@pytest.fixture()
def client(app):
    """Initialize the test client"""
    return app.test_client()

@pytest.fixture()
def runner(app):
    """initialize the CLI runner"""
    return app.test_cli_runner()
