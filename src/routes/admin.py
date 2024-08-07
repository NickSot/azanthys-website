"""File, containing all the routes for the admin panel of the website"""
import uuid
from datetime import datetime, timedelta
from functools import wraps

from flask import request, make_response
from sqlalchemy.exc import IntegrityError

from ..models import db
from ..models.session import Session
from ..models.band_member import BandMember
from ..models.single import Single
from ..models.gig import Gig

from . import Blueprint, render_template

admin = Blueprint('admin', __name__, url_prefix = '/admin')

def validate_session():
    """Decorator for session validation"""
    def _validate_session(f):
        @wraps(f)
        def __validate_session(*args, **kwargs):
            """Check if the admin's session is in the cookie or if the cookie even exists"""
            session_token = request.cookies.get('session_token')

            if not session_token or \
                Session.query.filter_by(session_token = session_token).all() == []:
                return "Unauthorized!", 403

            return f(*args, **kwargs)

        return __validate_session
    return _validate_session

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
@validate_session()
def get_cms():
    """Return the CMS page"""
    return render_template('cms.html')

@admin.route("/cms/bio/<member_name>", methods=["POST"])
@validate_session()
def update_bio(member_name):
    """Update bio when requested by admin"""
    band_member = BandMember.query.filter_by(name = member_name).first()

    if not band_member:
        return "Not Found!", 404

    bio = request.form.get(f'{member_name}-bio')

    if len(request.data) > 1000 or not bio:
        return "Bad Request!", 400

    band_member.bio = bio

    db.session.add(band_member)
    db.session.commit()

    return "Success!", 200

@admin.route('/cms/single_url', methods=["POST"])
@validate_session()
def update_single_link():
    """Updates the single link for the band"""

    if len(request.data) > 1000:
        return "Bad Request!", 400

    name = request.form.get('single-name')
    link = request.form.get('single-link')

    if not link or not name:
        return "Bad Request!", 400

    s = Single(name=name, url=link)

    db.session.add(s)
    db.session.commit()

    return "Success!", 200

@admin.route('/cms/gig_dates', methods=["POST"])
@validate_session()
def update_gig_dates():
    """Update the gig dates for every user generated form"""

    if len([value for _, value in request.form.items()]) == 0:
        return "Bad Request!", 400

    sorted_request_form_data = dict(sorted(request.form.items()))

    request_data = zip(
        [value for key, value in sorted_request_form_data.items()
        if 'eventtitle-' in key.lower()],
        [value for key, value in sorted_request_form_data.items()
        if 'eventlink-' in key.lower()],
        [value for key, value in sorted_request_form_data.items()
        if 'date-' in key.lower()]
    )

    gigs = []

    for item in request_data:
        print(item, flush=True)
        gigs.append(Gig(location=item[0], link=item[1], time=item[2]))

    try:
        db.session.bulk_save_objects(gigs)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return "Bad Request!", 400

    return "Success!", 200
