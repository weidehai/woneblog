from flask import Blueprint,render_template
from model.woneblog import Articles
from model.woneblog import ArticleTags
import logging
blogguest = Blueprint('blogguest', __name__)

@blogguest.route("/")
def index():
    articles = Articles.query.limit(10).all()
    return render_template("index/index.html",articles=articles)

@blogguest.route("/article_detail/<int:article_id>")
def show_article_detail(article_id):
    article_detail = Articles.query.get_or_404(article_id)
    previous_article = Articles.query.filter(Articles.article_id < article_id).order_by(Articles.article_id.desc()).first()
    next_article = Articles.query.filter(Articles.article_id > article_id).first()
    return render_template("article_detail/article_detail.html",
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
