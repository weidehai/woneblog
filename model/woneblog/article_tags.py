# coding=utf-8
from extension import db

class ArticleTags(db.Model):
    __tablename__ = 'article_tags'
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(20),unique=True,nullable=False)
    quantity = db.Column(db.Integer,unique=True,nullable=False)


    def __repr__(self):
        return "<ArticleTags(id='%s',tag_name='%s',quantity='%s', )>" % (self.id,self.tag_name,self.quantity)
