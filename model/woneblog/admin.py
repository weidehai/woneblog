# coding=utf-8
from extension import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash,check_password_hash

class Admin(db.Model, UserMixin):
    __tablename__ = 'admin'
    admin_id = db.Column(db.Integer, primary_key=True)
    admin_name = db.Column(db.String(15))
    admin_password = db.Column(db.String(15))
    article_total = db.Column(db.Integer)
    visited_total = db.Column(db.Integer)
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
        return "<ArticleTags(id='%s'," \
               "admin_name='%s'," \
               "admin_password='%s'," \
               "article_total='%s'," \
               "visited_total='%s'," \
               "mood='%s' )>" % (self.id,self.admin_name,self.admin_password,self.article_total,self.visited_total,self.mood)
