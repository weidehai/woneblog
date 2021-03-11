from .base import BaseTestCase
from model.woneblog import ArticleTags,WoneArticles,Admin
from extension import db
from flask import Flask

class ModelTestCase(BaseTestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://woneread@127.0.0.1:3306/woneblog'
        self.app_context = self.app.app_context()
        db.init_app(self.app)
        self.app_context.push()


    def tearDown(self):
        db.session.remove()
        self.app_context.pop()

    def test_admin(self):
        admin = Admin.query.first()
        self.assertIsNotNone(admin)

    def test_articles(self):
        article_time, = db.session.query(WoneArticles.article_time).first()
        print(article_time)
        self.assertIsNotNone(article_time)