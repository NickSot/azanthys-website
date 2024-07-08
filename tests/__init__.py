from pathlib import Path

import pytest
from src import create_app

# get the resources folder in the tests folder
resources = Path(__file__).parent / "resources"

@pytest.fixture()
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })

    # TODO: perform database deletion & populate with prefilled data

    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()
