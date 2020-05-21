from database import Articles, Admin
from flask import session, render_template, jsonify
from datetime import timedelta


class Index:
    def __init__(self, app):
        self.app = app
        self.__addIndex__()
        self.__addRecently__()

    def __addIndex__(self):
        @self.app.route('/')
        def index():
            # 首页需要的数据有article_id,article_time,article_title
            # 首页只展示9篇文章标题
            data = my_articles.query_limit(9, ['article_time', 'article_title', 'post_key'], ['article_id'])
            visited_num = my_admin.query_field_primary_key(1, ['visited'])[0]["visited"]
            if not session.get('user_level'):
                my_admin.update_data(1, visited=str(visited_num+1))
                session["user_level"] = 444
                self.app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60)
                session.permanent = True
                return render_template('index.html', articles=data, visited=visited_num+1)
            else:
                return render_template('index.html', articles=data, visited=visited_num)

    def __addRecently__(self):
        @self.app.route('/getrecently')
        def recently():
            data = my_articles.query_limit(9, ['article_time', 'article_title', 'post_key'], ['update_time', 'article_id'])
            print(data)
            return jsonify(data)


my_articles = Articles("articles")
my_admin = Admin("admin")
