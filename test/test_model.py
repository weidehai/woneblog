from .base import BaseTestCase
from model.woneblog import ArticleTags
from model.woneblog import Admin
from extension import db
from flask import Flask

class ModelTestCase(BaseTestCase):
    def setUp(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://woneread@127.0.0.1:3306/woneblog'
        db.init_app(app)
        app.app_context().push()

    def tearDown(self):
        db.session.remove()

    def test_admin(self):
        admin = Admin.query.first()
        self.assertIsNotNone(admin)