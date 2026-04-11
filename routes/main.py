from flask import Blueprint, render_template
from flask_login import login_required, current_user
from models import ProblemHistory

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    return render_template('index.html', title='Home')

@main_bp.route('/dashboard')
@login_required
def dashboard():
    # Fetch user history ordered by descending created_at
    history = ProblemHistory.query.filter_by(user_id=current_user.id).order_by(ProblemHistory.created_at.desc()).all()
    return render_template('dashboard.html', title='Dashboard', history=history)

from flask import redirect, url_for # Need this for redirect above
