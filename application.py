#coding=utf-8
from flask import Flask,request,jsonify,json,session,redirect,render_template,send_from_directory
from datetime import timedelta
from database import articles,comment,admin
from MyUtils import tools
import os,pymysql,time


app = Flask(__name__)
app.config['SECRET_KEY'] = b'\xb2t\x9e\xb0\xab\x17g\xc1\x82\xe7\xaep\xe8\xbe+0\xf2\x0e\xaa\xc6\x8e9\xeds'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)


@app.route('/')
def index():
    #首页需要的数据有article_id,article_time,article_title
    #首页只展示9篇文章标题
    data = myarticles.query_limit(9,['article_time','article_title','postkey'])
    visitednum = myadmin.query_field_primarykey(1,['visited'])[0]["visited"]
    myadmin.update_data(1,visited = str(visitednum+1))
    return render_template('index.html',articles = data,visited = visitednum+1)
@app.route('/archives')
def archives():
    tag_name = request.args.get('tag')
    if tag_name is None:
        tag_name = 'Archives'
        #Archives页面需要的数据有article_id,article_time,article_title,article_tag
        data = myarticles.query_field_primarykey('',['article_time','article_title','article_tag','postkey'])
        data.reverse()
    else:
        new_data = []
        data = myarticles.query_field_primarykey('', ['article_time','article_title','article_tag','postkey'])
        #如果查询参数tag_name存在,就进行过滤，取出tag_name标签下的内容
        for i in data:
            if (i['article_tag'] == tag_name):
                new_data.append(i)
        data = new_data
        data.reverse()
    articletag = myarticles.query_field_primarykey('',['article_tag'])
    tags = tools.resortTag(articletag)
    return render_template('archives.html', articles=data,tags = tags,title = tag_name)
@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/articledetails')
def articledetails():
    id = request.args.get('id')
    # detail页面需要的数据有article_id,article_time,article_title,article_tag,article_read,并且只取当前id的那一条数据
    data = myarticles.query_field_primarykey(id, ['article_id','article_time', 'article_title', 'article_tag', 'article_read'])[0]
    previous = myarticles.getprevious(data['article_id'])['postkey'] if myarticles.getprevious(data['article_id']) else 0
    next = myarticles.getnext(data['article_id'])['postkey'] if myarticles.getnext(data['article_id']) else 0
    myarticles.update_data(id,article_read=str(data['article_read']+1))
    return render_template('articledetails.html',article = data,previous=previous,next=next)

@app.route('/commentdel')
def commentdel():
    mycomments.del_where(request.args.get('delkey'))
    mycomments.del_replybelong(request.args.get('delkey'))
    return "200ok"
@app.route('/postdel')
def postdel():
    myarticles.del_where(request.args.get('delid'))
    return '200ok'
@app.route('/getmain')
def getmian():
    quer = request.args.get('getid')
    quer = quer.split("?")
    where = quer[0]
    quer.pop(0)
    data = myarticles.query_field_primarykey(where,quer)
    return jsonify(data)
@app.route('/getcomment')
def getcomment():
    #获取url查询参数，也就是url？号后面的查询参数
    postid = request.args.get('postid')
    postkey = myarticles.query_field_primarykey(postid, ['postkey'])[0]["postkey"]
    return (jsonify(mycomments.query_comment(postkey,'*')))
@app.route('/savepost',methods=["POST"])
def savepost():
    data = json.loads(request.get_data())
    #为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
    title = pymysql.escape_string(data['title'])
    tag = pymysql.escape_string(data['tag'].capitalize())
    content = pymysql.escape_string(data['content'])
    time = data["publishtime"]
    postkey = data["postkey"]
    readnum = 0
    myarticles.save_data(article_title=title, article_content=content, article_time=time,article_tag=tag, article_read=str(readnum),postkey=postkey)
    return "200ok"
@app.route('/updatepost',methods=["POST"])
def updatepost():
    data = json.loads(request.get_data())
    #为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
    title = pymysql.escape_string(data['title'])
    tag = pymysql.escape_string(data['tag'].capitalize())
    content = pymysql.escape_string(data['content'])
    time = data["publishtime"]
    postkey = data["postkey"]
    myarticles.update_data(postkey,article_title=title, article_content=content, article_time=time,article_tag=tag)
    return "200ok"
@app.route('/savecomment',methods=["POST"])
def savecomment():
    data = json.loads(request.get_data())
    #为了防止从前端传来的数据在存入mysql时发生语法错误，使用pymysql.escape_string()处理转义一下字符串
    user = pymysql.escape_string(data["comment_user"])
    mail = pymysql.escape_string(data["mail"])
    link = pymysql.escape_string(data['link'])
    text = pymysql.escape_string(data['comment_text'])
    postkey = myarticles.query_field_primarykey(data["postid"],['postkey'])[0]["postkey"]
    mycomments.save_data(comment_user=user,comment_mail=mail,comment_link=link,comment_text=text,comment_time=data["comment_time"],
                         comment_avatar=data["comment_avatar"],comment_system=data["comment_system"],comment_browser=data["comment_browser"],
                         comment_postid=postkey,replyfor=data["replyfor"],commentkey=data["commentkey"],replybelong=data["replybelong"],aternick=data['aternick'])
    return '200ok'
@app.route('/adminofmanage')
def getadminofmanage():
    data = myarticles.query_field_primarykey('',['article_title','article_time','postkey'])
    data.reverse()
    return jsonify(data)
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404error.html')
@app.route('/publish')
def publish():
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')
    if(session.get('username')):
        return send_from_directory(root, 'publish.html')
    else:
        return redirect('/login')
@app.route('/upload',methods=["POST"])
def upload():
    if(session.get('username')):
        file = request.files["file"]
        type = file.filename.split('.').pop().  lower()
        timename = time.strftime('%Y%m%d%H%M%S', time.localtime(time.time()))
        path = './static/upload/' + timename + '.' + type
        file.save(path)
        return '.' + path
    else:
        return 'illegal upload'
@app.route('/manage')
def manage():
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')
    if(session.get('username')):
        return send_from_directory(root,'manage.html')
    else:
        return redirect('/login')
@app.route('/robots.txt')
def robots():
    root = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(root, 'robots.txt')
@app.route('/login')
def login():
    if(not session.get('username')):
        root = os.path.join(os.path.dirname(os.path.abspath(__file__)),'admin')
        return send_from_directory(root,'login.html'),[("Cache-Control","no-cache")]
    return redirect('/manage')
@app.route('/verify',methods=["post","get"])
def verify():
    if(request.method=='GET'):
        if(session.get("username")):
            return 'logined'
        else:
            return 'unlogin'
    else:
        userdata = json.loads(request.get_data())
        if (userdata["username"]=='weidehai'):
            if (userdata["password"]=='adminpassword'):
                session['username'] = 'admin'
                session.permanent = True
                return 'login success'
        return 'login failed'

if __name__ == '__main__':
    myarticles = articles("articles")
    myadmin = admin("admin")
    mycomments = comment("comment")
    app.run()

