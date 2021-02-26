from flask import Blueprint,render_template,redirect,url_for
from model.woneblog import ArticleTags
from model.woneblog import Admin
from form.loginform import LoginForm
from flask_login import login_user, login_required, current_user
from flask import flash
from utils.utils import redirect_back
import logging

blogadmin = Blueprint('blogadmin', __name__)


@blogadmin.route("/adminlogin",methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('blogguest.index'))
    loginform = LoginForm()
    if loginform.validate_on_submit():
        username = loginform.username.data
        password = loginform.password.data
        admin = Admin.query.first()
        if admin:
            if username == admin.admin_name and admin.validate_password(password):
                login_user(admin)
                flash('Welcome back.', 'info')
                return redirect_back()
            flash('Invalid username or password.', 'warning')
        else:
            flash('No account.', 'warning')
    return render_template("admin/login/login.html",loginform=loginform)


@blogadmin.route("/adminmanage")
@login_required
def manage():
    tags = ArticleTags.query.all()
    logging.info(tags)
    return render_template("admin/manage/manage.html",tags=tags)


@blogadmin.route("/adminpublish")
def publish():
    return render_template("admin/publish/publish.html")