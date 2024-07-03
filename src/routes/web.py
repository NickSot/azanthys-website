from . import render_template, Blueprint

web = Blueprint('web', __name__, url_prefix = '/')

@web.route('/', methods=["GET"])
def index():
    return render_template('index.html')

@web.route('/about', methods=["GET"])
def about():
    return render_template('about.html')

@web.route('/shop', methods=["GET"])
def shop():
    return render_template('shop.html')

@web.route('/static/gig_dates', methods=["GET"])
def get_gig_dates():
    return "Gig dates!"

@web.route('/static/single_url', methods=["GET"])
def get_single_url():
    return "single url!"
