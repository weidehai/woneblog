import os
from flask import send_from_directory, redirect, session, request
from database import my_blogtags, my_admin

class Publish:
    def __init__(self, app):
        self.app = app
        self.__addPublish__()
        self.__addupdateArticlesNum__()

    def __addPublish__(self):
        @self.app.route('/publish')
        def publish():
            root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../admin')
            if session.get('user_level') == 777:
                return send_from_directory(root, 'publish.html')
            else:
                return redirect('/login')

    def __addupdateArticlesNum__(self):
        @self.app.route('/updatearticlenum')
        def updatearticlesnum():
            tag = request.args.get('tag_name')
            operation = request.args.get('operation')
            if operation == "add":
                my_blogtags.customize_sql('update blogtags set quantity=quantity+1 where tag_name="%s"' % tag, "commit")
                my_admin.customize_sql("update admin set article_total=article_total+1 where admin_id=1", "commit")
            if operation == 'sub':
                my_blogtags.customize_sql('update blogtags set quantity=quantity-1 where tag_name="%s"' % tag, "commit")
                my_admin.customize_sql("update admin set article_total=article_total-1 where admin_id=1", "commit")
            return "success"
