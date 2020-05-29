from flask import send_from_directory, redirect, session
import os


class Manager:
    def __init__(self, app):
        self.app = app
        self.__addManage__()

    def __addManage__(self):
        @self.app.route('/manage')
        def manage():
            root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../admin')
            if session.get('user_level') == 777:
                return send_from_directory(root, 'manage.html')
            else:
                return redirect('/login')

