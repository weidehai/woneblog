import os
import shutil
from flask import render_template, redirect, session, request, json
from database import my_blogtags, my_admin
from pages_server import admin

class Publish:
    def __init__(self, app):
        self.app = app
        self.__addPublish__()
        self.__addupdateArticlesNum__()
        self.__copyFile__()
    def __addPublish__(self):
        @admin.route('/publish')
        def publish():
            tags_info = my_blogtags.customize_sql("select tag_name from blogtags", "query")
            if session.get('user_level') == 777:
                return render_template('publish.html',tags=tags_info)
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
        def copy_file():
            copy_dir = json.loads(request.get_data())["dir"]
            from_dir = json.loads(request.get_data())["from_dir"]
            to_dir = json.loads(request.get_data())["to_dir"]
            base_path = os.path.dirname(os.path.dirname(__file__))
            src = os.path.join(base_path, "static", from_dir, copy_dir)
            tar = os.path.join(base_path, "static", to_dir, copy_dir)
            if not os.path.exists(src):
                return "src not found"
            if not os.path.exists(tar):
                print("copytree")
                print(src)
                print(tar)
                if from_dir=="temporary" or from_dir=="draft":
                    shutil.move(src,tar)
                else:
                    shutil.copytree(src, tar)
            else:
                print("ddddddddddddddd")
                print(from_dir)
                print(os.path.join(base_path, from_dir, copy_dir))
                for dirpath, dirnames, filenames in os.walk(os.path.join(base_path, "static", from_dir,  copy_dir)):
                    print(dirpath)
                    print(dirnames)
                    print(filenames)
                    if not filenames:
                        return "empty src"
                    if from_dir == "temporary" or from_dir == "draft":
                        for file in filenames:
                            shutil.move(os.path.join(src, file),tar)
                        try:
                            if not os.listdir(src):
                                os.rmdir(src)
                        except FileNotFoundError:
                            pass
                    else:
                        print("copy")
                        for file in filenames:
                            shutil.copy(os.path.join(src, file),tar)
            # for file in file_list:
            #     draft_file = os.path.join(base_path, file)
            #     upload_file = os.path.join(base_path, file.replace("draft", "upload"))
            #     shutil.copyfile(draft_file, upload_file)
            #     print(draft_file, upload_file)
            return "copy success"