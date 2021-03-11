from flask import Blueprint,render_template,redirect,url_for
from model.woneblog import ArticleTags,Admin,WoneArticles
from form.loginform import LoginForm
from flask_login import login_user, login_required, current_user
from flask import flash,request
from utils.utils import redirect_back
from extension import db
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
    article_total, = db.session.query(Admin.article_total).first()
    return render_template("admin/manage/manage.html",tags=tags,article_total=article_total)


@blogadmin.route("/adminpublish/<string:behavior>")
def publish(behavior):
    tags = ArticleTags.query.all()
    if behavior=='new':
        return render_template("admin/publish/publish.html",tags=tags)
    if behavior=='modify':
        article_detail = WoneArticles.query.get_or_404(request.args.get('article_id'))
        return render_template("admin/publish/publish.html",tags=tags,article_detail=article_detail)