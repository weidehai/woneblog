from flask import Flask,render_template
from routes import blogguest
from routes import blogadmin
from config import flask_config
import extension
import logging,logging.config
import yaml
import os

class Wone:
    @staticmethod
    def init():
        Wone.create_server()
        Wone.server_init()
        Wone.register_route()
        Wone.register_extension()
        Wone.register_errors()
        return Wone.server

    @staticmethod
    def create_server():
        Wone.server = Flask(__name__)

    @staticmethod
    def server_init():
        logging.info(flask_config)
        Wone.server.config.from_mapping(flask_config)

    @staticmethod
    def register_route():
        Wone.server.register_blueprint(blogguest)
        Wone.server.register_blueprint(blogadmin)

    @staticmethod
    def register_extension():
        extension.db.init_app(Wone.server)
        extension.login_manager.init_app(Wone.server)
        extension.csrf.init_app(Wone.server)

    @staticmethod
    def register_errors():
        @Wone.server.errorhandler(404)
        def page_not_found(e):
            logging.info(e)
            return render_template('error/404/404error.html'), 404


def before_create():
    def init_log(default_path='./config/logconfig.yaml', default_level=logging.INFO):
        if os.path.exists(default_path):
            with open(default_path,'r',encoding='utf-8') as f:
                logging.config.dictConfig(yaml.load(f,Loader=yaml.SafeLoader))
        else:
            logging.basicConfig(level=default_level)
    init_log()




def create_app():
    '''
    development:
    linux:export FLASK_APP='wone.py'
          export FLASK_ENV='development'
          flask run
    windows:set FLASK_APP=wone.py && set FLASK_ENV=development && flask run
    '''
    before_create()
    return Wone.init()