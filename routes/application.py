# coding=utf-8
from config import redis_config
from flask import Flask
from flask_caching import Cache

app = Flask(__name__)
app.secret_key = b'd#\xa1\x80\xea]*~\xd6"\xe1\x98\xb47\xfa\x90'
cache = Cache(config=redis_config)
cache.init_app(app)

