import os
from flask import send_from_directory, redirect, session


class Publish:
    def __init__(self, app):
        self.app = app
        self.__addPublish__()

    def __addPublish__(self):
        @self.app.route('/publish')
        def publish():
            root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../admin')
            if session.get('user_level') == 777:
                return send_from_directory(root, 'publish.html')
            else:
                return redirect('/login')
