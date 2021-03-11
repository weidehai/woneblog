from flask import Blueprint,render_template,send_from_directory,request,current_app,jsonify
from model.woneblog import WoneArticles,Admin
from utils.utils import convert_tuple_to_dict
from extension import db
import logging
import os

blogapi = Blueprint('blogapi', __name__)

@blogapi.route("/api")
def api():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__),os.path.pardir))
    return send_from_directory(root, 'restful-api.json')


@blogapi.route("/api/articles")
def api_articles():
    page,limit=(request.args.get('page', 1, type=int),request.args.get('limit',10,type=int))
    logging.info("page:%s limit:%s" % (page,limit))
    pagination = db.session.query(WoneArticles.article_id,
                                  WoneArticles.article_title,
                                  WoneArticles.article_time,
                                  WoneArticles.article_tag).offset((page-1)*limit).limit(limit).all()
    logging.info(pagination)
    return jsonify(convert_tuple_to_dict(['article_id','article_title','article_time','article_tag'],pagination))




