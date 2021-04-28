# coding=utf-8
from flask_extension.extension import db
from flask_login import UserMixin
from werkzeug.security import check_password_hash

class Admin(db.Model, UserMixin):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    admin_name = db.Column(db.String(15), unique=True,nullable=False)
    admin_password = db.Column(db.String(128),nullable=False)
    article_total = db.Column(db.Integer,nullable=False)
    draft_total = db.Column(db.Integer,nullable=False)
    visited_total = db.Column(db.Integer,nullable=False)
    mood = db.Column(db.String(50))

    def validate_password(self, password):
        if self.admin_password is None:
            return False
        return check_password_hash(self.admin_password, password)

    def get_id(self):
        try:
            return self.admin_id
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')

    def __repr__(self):
        return "<ArticleTags(admin_id='%s'," \
               "admin_name='%s'," \
               "admin_password='%s'," \
               "article_total='%s'," \
               "draft_total='%s'," \
               "visited_total='%s'," \
               "mood='%s' )>" % (self.admin_id,self.admin_name,self.admin_password,self.article_total,self.draft_total,self.visited_total,self.mood)


class wAdmin(db.Model, UserMixin):
    __tablename__ = 'wadmin'
    __bind_key__ = 'woneroot'
    admin_id = db.Column(db.Integer, primary_key=True)
    admin_name = db.Column(db.String(15), unique=True,nullable=False)
    admin_password = db.Column(db.String(128),nullable=False)
    article_total = db.Column(db.Integer,nullable=False)
    draft_total = db.Column(db.Integer,nullable=False)
    visited_total = db.Column(db.Integer,nullable=False)
    mood = db.Column(db.String(50))

    def validate_password(self, password):
        if self.admin_password is None:
            return False
        return check_password_hash(self.admin_password, password)

    def get_id(self):
        try:
            return self.admin_id
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')

    def __repr__(self):
        return "<ArticleTags(admin_id='%s'," \
               "admin_name='%s'," \
               "admin_password='%s'," \
               "article_total='%s'," \
               "draft_total='%s'," \
               "visited_total='%s'," \
               "mood='%s' )>" % (self.admin_id,self.admin_name,self.admin_password,self.article_total,self.draft_total,self.visited_total,self.mood)
