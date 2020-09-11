from flask import request, jsonify, session, json
from database import my_articles,my_comments,my_timeline,my_admin,my_blogtags,my_drafts
from observer import updateob
import time
import pymysql
import os
import shutil
import re

tables = {
    "articles": my_articles,
    "comment": my_comments,
    "timeline": my_timeline,
    "admin": my_admin,
    "blogtags": my_blogtags,
    "drafts": my_drafts
}


class Interface:
    def __init__(self, app):
        self.app = app
        self.__addDelById__()
        self.__addUpload__()
        self.__addSave__()
        self.__addUpdate__()
        self.__addGetApart__()
        self.__addGetOne__()
        self.__deleteFile__()

    def __addDelById__(self):
        @self.app.route('/delbyid')
        def del_by_id():
            if session.get('user_level') != 777:
                return "illegal access!!!!!!!!!!"
            table = tables.get(request.args.get('table'))
            if table:
                table.del_where(request.args.get('id'))
                return "delete success"
            else:
                return "table not exist or other error"

    def __addGetApart__(self):
        @self.app.route('/getapart')
        def get_apart():
            offset = request.args.get('offset')
            num = request.args.get('num')
            table = tables.get(request.args.get('table'))
            data = table.query_field_order_limit(request.args.get('fields').split(','),
                                                 request.args.get('order').split(','),
                                                 offset,
                                                 num)
            print(data)
            return jsonify(data)

    def __addGetOne__(self):
        @self.app.route('/getone')
        def get_one():
            table = tables.get(request.args.get('table'))
            where = request.args.get('where')
            data = table.query_field_primary_key(where, request.args.get('fields').split(','))
            return jsonify(data)

    def __addSave__(self):
        @self.app.route('/save', methods=["POST"])
        def save():
            judge = request.args.get("judge")   #控制是否需要判断提交的内容是否已存在
            save_type = request.args.get("type")  #控制提交是否是要权限，评论的提交不需要权限
            if session.get('user_level') != 777 and save_type == "post":
                return "illegal access!!!!!!!!!!"
            data = json.loads(request.get_data())
            for key, value in data.items():
                try:
                    data[key] = pymysql.escape_string(value)
                except AttributeError:
                    pass
            table = data['table']
            del data['table']
            print(judge)
            if judge == 'true':
                exists = my_articles.customize_sql("select 1 from %s where post_key=%s limit 1" % (table, data["post_key"]), "query")
                print(exists)
                if exists:
                    try:
                        del data['article_time']
                        del data["article_read"]
                    finally:
                        tables[table].update_data(data["post_key"], **data)
                        return 'update success'
                else:
                    tables[table].save_data(**data)
            else:
                tables[table].save_data(**data)
            return 'post success'

    def __addUpdate__(self):
        @self.app.route('/update', methods=["POST"])
        def update_post():
            if session.get('user_level') != 777:
                return "illegal access!!!!!!!!!!"
            data = json.loads(request.get_data())
            for key, value in data.items():
                try:
                    data[key] = pymysql.escape_string(value)
                except AttributeError:
                    pass
            table = data['table']
            where = data["post_key"]
            del data['table']
            del data["post_key"]
            print(data)
            tables[table].update_data(where, **data)
            #触发观察者
            for item in updateob.observerlist:
                try:
                    item(where)
                except:
                    pass
            return 'post success'

    def __addUpload__(self):
        @self.app.route('/upload', methods=["POST"])
        def upload():
            if session.get('user_level') == 777:
                file_save_to = request.args.get("type")
                file_dir = request.args.get('dir')
                file = request.files["file"]
                file_type = file.filename.split('.').pop().lower()
                file_name = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
                base_path = os.path.dirname(__file__)
                upload_path = os.path.join('static', file_save_to)
                file_path = file_name + "." + file_type
                path = os.path.join(base_path, upload_path, file_dir, file_path)
                print(path)
                if not os.path.exists(os.path.join(base_path, upload_path, file_dir)):
                    os.mkdir(os.path.join(base_path, upload_path, file_dir))
                print(path)
                file.save(path)
                return '.\\' + os.path.join(upload_path, file_dir, file_path)
            else:
                return 'illegal upload'

    def __deleteFile__(self):
        @self.app.route('/deletefile', methods=["POST"])
        def delete_file():
            if session.get('user_level') == 777:
                print(json.loads(request.get_data()))
                file_type = request.args.get("type")  #控制是删除文件还是dir
                print(file_type)
                file_list = json.loads(request.get_data())["filelist"]
                base_path = os.path.dirname(__file__)
                if file_type == 'dir':
                    path = os.path.join(base_path, file_list)
                    try:
                        shutil.rmtree(path)
                    except FileNotFoundError:
                        pass
                else:
                    for file in file_list:
                        path = os.path.join(base_path, file)
                        try:
                            os.remove(path)
                        except FileNotFoundError:
                            pass
                return "delete success"
            else:
                return 'illegal operation'
