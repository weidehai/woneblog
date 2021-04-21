# coding=utf-8
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
import logging
logging.info("import flask_sqlalchemy")
logging.info("import flask_login")
db = SQLAlchemy()
login_manager = LoginManager()
@login_manager.user_loader
def load_user(user_id):
    from model import Admin
    user = Admin.query.get(int(user_id))
    return user
login_manager.login_view='blogadmin.login'
csrf = CSRFProtect()


