# coding=utf-8
from flask_extension.extension import db


class WoneArticles(db.Model):
    __tablename__ = 'admin_wone_articles'
    article_id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(15),nullable=False)
    post_key = db.Column(db.String(50),unique=True,nullable=False)
    article_title = db.Column(db.String(100),nullable=False)
    article_time = db.Column(db.DateTime,nullable=False)
    update_time = db.Column(db.DateTime,nullable=False)
    article_read = db.Column(db.Integer,nullable=False)
    article_tag = db.Column(db.String(20),nullable=False)
    article_content = db.Column(db.Text)
    text_for_search = db.Column(db.Text)

    def __repr__(self):
        return "<WoneArticles(article_id='%s', \
                          author='%s', \
                          post_key='%s', \
                          article_title='%s', \
                          article_time='%s', \
                          update_time='%s', \
                          article_read='%s', \
                          article_tag='%s', \
                          article_content='%s', \
                          text_for_search='%s')>" % (self.article_id,
                                                     self.author,
                                                     self.post_key,
                                                     self.article_title,
                                                     self.article_time,
                                                     self.update_time,
                                                     self.article_read,
                                                     self.article_tag,
                                                     self.article_content,
                                                     self.text_for_search)
