from flask import Blueprint,render_template,send_from_directory,request,current_app,jsonify
from model.woneblog import Articles
from model.woneblog import ArticleTags
from utils.utils import convert_model_to_dict
import logging
import os

blogapi = Blueprint('blogapi', __name__)

@blogapi.route("/api")
def api():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__),os.path.pardir))
    return send_from_directory(root, 'restful-api.json')


@blogapi.route("/api/articles")
def api_articles():
    page,pre_page=(request.args.get('page', 1, type=int),current_app.config['BLUELOG_MANAGE_POST_PER_PAGE'])
    pagination = Articles.query.paginate(page,pre_page)
    return jsonify(convert_model_to_dict(pagination.items))




