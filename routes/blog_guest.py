from flask import Blueprint,render_template,send_from_directory
from model.woneblog import Articles
from model.woneblog import ArticleTags
import logging
import os
blogguest = Blueprint('blogguest', __name__)

@blogguest.route("/")
def index():
    articles = Articles.query.limit(10).all()
    return render_template("index/index.html",articles=articles)

@blogguest.route("/article-detail/<int:article_id>")
def show_article_detail(article_id):
    article_detail = Articles.query.get_or_404(article_id)
    previous_article = Articles.query.filter(Articles.article_id < article_id).order_by(Articles.article_id.desc()).first()
    next_article = Articles.query.filter(Articles.article_id > article_id).first()
    return render_template("article-detail/article-detail.html",
                           article_detail=article_detail,
                           previous=previous_article and previous_article.article_id,
                           next=next_article and next_article.article_id)

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

