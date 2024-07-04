"""The file that contains the route definitions for the website"""
from datetime import datetime

from . import render_template, Blueprint, jsonify

from ..models import db
from ..models.single import Single
from ..models.gig import Gig
from ..models.band_member import BandMember

web = Blueprint('web', __name__, url_prefix = '/')

@web.route('/', methods=["GET"])
def index():
    """Return the home page"""
    return render_template('index.html')

@web.route('/about', methods=["GET"])
def about():
    """Return the about page"""
    return render_template('about.html')

@web.route('/shop', methods=["GET"])
def shop():
    """Return the shop page"""
    return render_template('shop.html')

@web.route('/gig_dates', methods=["GET"])
def get_gig_dates():
    """Get all upcoming gig dates"""
    if Gig.query.all() == []:
        return "", 200

    response_text = "<ul>" + "\n".join(
        [
            f"<li> {g.location} {g.time} </li>" for g in db.session.query(Gig)
                .filter(Gig.time > datetime.now()).all()
        ]
    ) + "</ul>"

    return response_text, 200

@web.route('/single_url', methods=["GET"])
def get_single_url():
    """Get the latest single url"""

    if Single.query.all() == []:
        return "", 200

    single = Single.query.order_by(Single.id.desc()).first()

    return jsonify({ "url": single.url, "name": single.name})

@web.route('/member_bio/<member_name>')
def get_member_bio(member_name):
    """Get band member bio"""
    if not member_name:
        return "", 400

    member = BandMember.query.filter_by(name = member_name).first()

    if member is None:
        return "", 200

    return member.bio
