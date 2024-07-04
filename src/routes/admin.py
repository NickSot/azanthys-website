"""File, containing all the routes for the admin panel of the website"""
import uuid
from datetime import datetime, timedelta

from flask import request, make_response

from ..models import db
from ..models.session import Session
from ..models.band_member import BandMember

from . import Blueprint, render_template

# TODO: wrap cms functions in a security middleware

admin = Blueprint('admin', __name__, url_prefix = '/admin')

def validate_session():
    """Check if the admin's session is in the cookie or if the cookie even exists"""
    session_token = request.cookies.get('session_token')

    if not session_token or Session.query.filter_by(session_token = session_token).all() == []:
        return False

    return True

@admin.route("/", methods=["GET"])
def index():
    """Return the admin index page"""
    return render_template('admin.html')

@admin.route("/", methods=["POST"])
def login():
    """Login for admins to update website content"""
    if len(request.data) > 100:
        return "Bad Request!", 400

    form_data = request.form
    password = form_data.get('password')

    print(form_data)

    if not password or password != 'azanthys_rulez!':
        return "Unauthorized!", 403

    Session.query.delete()

    session = Session(session_token = str(uuid.uuid4()),
                      expiration_time = datetime.now() + timedelta(hours=1))

    db.session.add(session)
    db.session.commit()

    response = make_response("", 200)
    response.set_cookie("session_token", value=session.session_token,
                        httponly=True, expires=session.expiration_time)

    return response

@admin.route("/cms", methods=["GET"])
def get_cms():
    """Return the CMS page"""
    if not validate_session():
        return "Unauthorized!", 403

    return render_template('cms.html')

@admin.route("/cms/bio/<member_name>", methods=["POST"])
def update_bio(member_name):
    """Update bio when requested by admin"""
    if not validate_session():
        return "Unauthorized!", 403

    band_member = BandMember.query.filter_by(name = member_name).first()

    if not band_member:
        return "Not Found!", 404

    if len(request.data) > 1000:
        return "Bad Request!", 400

    bio = request.form.get(f'{member_name}-bio')

    if not bio:
        return "Bad Request!", 400

    band_member.bio = bio

    db.session.add(band_member)
    db.session.commit()

    return "Success!", 200
