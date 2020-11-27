# coding=utf-8
from config import redisconfig
import os
from flask import Flask, render_template, send_from_directory
from flask_caching import Cache
from pages_server.index import Index
from pages_server.search import Search
from pages_server.articles import ArticlesDetail
from pages_server.archives import Archives
from pages_server.about import About
from pages_server.manager import admin
from pages_server.publish import Publish
from pages_server.login import Login
from interface import Interface
from server_monitor.routes import Monitor

app = Flask(__name__)
app.config['SECRET_KEY'] = b'\xb2t\x9e\xb0\xab\x17g\xc1\x82\xe7\xaep\xe8\xbe+0\xf2\x0e\xaa\xc6\x8e9\xeds'
cache = Cache(config=redisconfig.config)
cache.init_app(app)
app.register_blueprint(admin)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404error.html')


@app.route('/robots.txt')
def robots():
    root = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(root, 'robots.txt')


if __name__ == '__main__':
    index = Index(app)
    search = Search(app)
    articles_detail = ArticlesDetail(app, cache)
    archives = Archives(app)
    about = About(app)
    publish = Publish(app)
    login = Login(app)
    interface = Interface(app)
    #monitor = Monitor(app)
    print("weidehai")
    app.run()
