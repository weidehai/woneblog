from flask import jsonify, send_from_directory, redirect, session
from database import Articles
import os


class Manager:
    def __init__(self, app):
        self.app = app

    def __addGetAdminOfManage__(self):
        @self.app.route('/adminofmanage')
        def get_admin_of_manage():
            data = my_articles.query_field_primarykey('', ['article_title', 'article_time', 'postkey'])
            data.reverse()
            return jsonify(data)

    def __addManage__(self):
        @self.app.route('/manage')
        def manage():
            root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')
            if session.get('user_level') == 777:
                return send_from_directory(root, 'manage.html')
            else:
                return redirect('/login')


my_articles = Articles("articles")
