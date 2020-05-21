from flask import session, send_from_directory, redirect, request, json
import os
from datetime import timedelta


class Login:
    def __init__(self, app):
        self.app = app
        self.__addLogin__()

    def __addLogin__(self):
        @self.app.route('/login')
        def login():
            if session.get('user_level') != 777:
                root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')
                return send_from_directory(root, 'login.html'), [("Cache-Control", "no-cache")]
            return redirect('/manage')

    def __addVerify__(self):
        @self.app.route('/verify', methods=["post", "get"])
        def verify():
            if request.method == 'GET':
                if session.get("userlevel") == 777:
                    return 'logined'
                else:
                    return 'unlogin'
            else:
                user_data = json.loads(request.get_data())
                if user_data["username"] == 'xxxxxxxx':
                    if user_data["password"] == 'xxxxxxx':
                        session['user_level'] = 777
                        self.app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
                        session.permanent = True
                        return 'login success'
                return 'login failed'
