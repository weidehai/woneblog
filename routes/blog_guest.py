from flask import Blueprint,render_template,send_from_directory,jsonify,request
from model import WoneArticles,ArticleTags,Admin
from utils.utils import trip_nonsense_time,convert_model_to_dict
import logging
import os
blogguest = Blueprint('blogguest', __name__)

@blogguest.route("/")
def index():
    articles = WoneArticles.query.order_by(WoneArticles.article_time.desc()).limit(10).all()
    admin_info = Admin.query.filter_by(admin_name='wone').one()
    for item in articles:
        item.article_time = trip_nonsense_time(item.article_time)
    return render_template("index/index.html",articles=articles,visited_total=admin_info.visited_total,mood=admin_info.mood)

@blogguest.route("/article_detail/<int:article_id>")
def show_article_detail(article_id):
    article_detail = WoneArticles.query.get_or_404(article_id)
    previous_article = WoneArticles.query.filter(WoneArticles.article_id < article_id).order_by(WoneArticles.article_id.desc()).first()
    next_article = WoneArticles.query.filter(WoneArticles.article_id > article_id).first()
    return render_template("article_detail/article_detail.html",
                           article_detail=article_detail,
                           previous=previous_article and previous_article.article_id,
                           next=next_article and next_article.article_id,
                           title=article_detail.article_title)

@blogguest.route("/archives")
def archives():
    tags = ArticleTags.query.all()
    logging.info(tags)
    return render_template("archives/archives.html",tags=tags)

@blogguest.route("/search")
def search():
    return render_template("search/search.html")

@blogguest.route("/about")
def about():
    return render_template("about/about.html")

@blogguest.route("/rebots.txt")
def rebots():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__),os.path.pardir))
    return send_from_directory(root, 'robots.txt')

