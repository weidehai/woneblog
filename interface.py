from flask import request, jsonify, session, json
from database import Articles, Comment, TimeLine
from MyUtils import Tools
import time
import pymysql

my_articles = Articles("articles")
my_comments = Comment("comment")
my_timeline = TimeLine("timeline")
tables = {
    "articles": my_articles,
    "Comment": my_comments
}


class Interface:
    def __init__(self, app):
        self.app = app
        self.__addDelById__()
        self.__addUpload__()
        self.__addSave__()
        self.__addUpdate__()
        self.__addGetApart__()

    def __addDelById__(self):
        @self.app.route('/delbyid')
        def del_by_id():
            table = tables.get(request.args.get('table'))
            if table:
                table.del_where(request.args.get('id'))
                return "delete success"
            else:
                return "table not exist or other error"

    def __addGetApart__(self):
        @self.app.route('/getapart')
        def get_apart():
            start = request.args.get('start')
            data = my_timeline.query_limit("%s,10" % start, ['id', 'time', 'content'], '')
            print(data)
            return jsonify(data)

    def __addSave__(self):
        @self.app.route('/save', methods=["POST"])
        def save():
            data = json.loads(request.get_data())
            # 为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
            # user = pymysql.escape_string(data["comment_user"])
            # mail = pymysql.escape_string(data["mail"])
            # link = pymysql.escape_string(data['link'])
            # text = pymysql.escape_string(data['comment_text'])
            # postkey = myarticles.query_field_primarykey(data["postid"], ['postkey'])[0]["postkey"]
            # mycomments.save_data(comment_user=user, comment_mail=mail, comment_link=link, comment_text=text,
            #                      comment_time=data["comment_time"],
            #                      comment_avatar=data["comment_avatar"], comment_system=data["comment_system"],
            #                      comment_browser=data["comment_browser"],
            #                      comment_postid=postkey, replyfor=data["replyfor"], commentkey=data["commentkey"],
            #                      replybelong=data["replybelong"], aternick=data['aternick'])
            # return '200ok'

    def __addUpdate__(self):
        @self.app.route('/updatepost', methods=["POST"])
        def update_post():
            if session.get('user_level') != 777:
                return "illegal access!!!!!!!!!!"
            data = json.loads(request.get_data())
            # 为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
            title = pymysql.escape_string(data['title'])
            tag = pymysql.escape_string(data['tag'].capitalize())
            content = pymysql.escape_string(data['content'])
            use_for_dos = Tools.clean_space(pymysql.escape_string(data['sdata']))
            post_key = data["post_key"]
            my_articles.update_data(post_key, article_title=title, article_content=content, textforsearch=use_for_dos, article_tag=tag)
            return "200ok"

    def __addUpload__(self):
        @self.app.route('/upload', methods=["POST"])
        def upload():
            if session.get('user_level') == 777:
                file = request.files["file"]
                file_type = file.filename.split('.').pop().lower()
                file_name = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
                path = './static/upload/' + file_name + '.' + file_type
                file.save(path)
                return '.' + path
            else:
                return 'illegal upload'



# @app.route('/savetimelineitem',methods=["POST"])
# def savetimelineitem():
#     data = json.loads(request.get_data())
#     print(data)
#     time = data['time']
#     content = pymysql.escape_string(data['content'])
#     mytimeline.save_data(time=time, content=content)
#     return '200ok'


# @app.route('/savepost',methods=["POST"])
# def savepost():
#     if (session.get('userlevel') != 777): return "illegal access!!!!!!!!!!"
#     data = json.loads(request.get_data())
#     print(data)
#     #为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
#     title = pymysql.escape_string(data['title'])
#     tag = pymysql.escape_string(data['tag'].capitalize())
#     content = pymysql.escape_string(data['content'])
#     time = data["publishtime"]
#     postkey = data["postkey"]
#     readnum = 0
#     usefordos = tools.cleanspace(pymysql.escape_string(data['sdata']))
#     myarticles.save_data(article_title=title, article_content=content, article_time=time,article_tag=tag, article_read=str(readnum),postkey=postkey,textforsearch=usefordos)
#     return "200ok"
#
# @app.route('/savecomment',methods=["POST"])
# def savecomment():
#     data = json.loads(request.get_data())
#     #为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
#     user = pymysql.escape_string(data["comment_user"])
#     mail = pymysql.escape_string(data["mail"])
#     link = pymysql.escape_string(data['link'])
#     text = pymysql.escape_string(data['comment_text'])
#     postkey = myarticles.query_field_primarykey(data["postid"],['postkey'])[0]["postkey"]
#     mycomments.save_data(comment_user=user,comment_mail=mail,comment_link=link,comment_text=text,comment_time=data["comment_time"],
#                          comment_avatar=data["comment_avatar"],comment_system=data["comment_system"],comment_browser=data["comment_browser"],
#                          comment_postid=postkey,replyfor=data["replyfor"],commentkey=data["commentkey"],replybelong=data["replybelong"],aternick=data['aternick'])
#     return '200ok'





