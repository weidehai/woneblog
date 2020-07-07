import os
import shutil
from flask import send_from_directory, redirect, session, request, json
from database import my_blogtags, my_admin


class Publish:
    def __init__(self, app):
        self.app = app
        self.__addPublish__()
        self.__addupdateArticlesNum__()
        self.__copyFile__()

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

    def __copyFile__(self):
        @self.app.route('/copyfile', methods=["post"])
        def copy_draft_file():
            copy_dir = json.loads(request.get_data())["dir"]
            from_dir = json.loads(request.get_data())["from_dir"]
            to_dir = json.loads(request.get_data())["to_dir"]
            base_path = os.path.dirname(os.path.dirname(__file__))
            src = os.path.join(base_path, "static", from_dir, copy_dir)
            tar = os.path.join(base_path, "static", to_dir, copy_dir)
            if os.path.exists(tar):
                shutil.rmtree(tar)
            shutil.copytree(src, tar)
            # for file in file_list:
            #     draft_file = os.path.join(base_path, file)
            #     upload_file = os.path.join(base_path, file.replace("draft", "upload"))
            #     shutil.copyfile(draft_file, upload_file)
            #     print(draft_file, upload_file)
            return "copy success"
