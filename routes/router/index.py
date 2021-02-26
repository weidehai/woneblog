from flask import session, render_template, jsonify, json
from datetime import timedelta
from backend import app
from database.woneblog import Articles

@app.route('/')
def index():
    # def recently():
    #     data = my_articles.query_field_order_limit(['article_time', 'article_title', 'post_key'],
    #                                                ['update_time'],
    #                                                0,
    #                                                10)
    #     print(data)
    #     return jsonify(data)
    # 首页需要的数据有article_id,article_time,article_title
    # 首页只展示9篇文章标题
    data = my_articles.query_field_order_limit(['article_time', 'article_title', 'post_key'],
                                               ['article_id'],
                                               0,
                                               10)
    print(data)
    projects = Index.getProjects()
    print(projects)
    admin_info = my_admin.query_field_primary_key(1, ['visited_total', 'mood', 'mood_tail'])[0]
    visited_num = admin_info['visited_total']
    mood = admin_info['mood']
    mood_tail = admin_info['mood_tail']
    if not session.get('user_level'):
        my_admin.update_data(1, visited_total=str(visited_num+1))
        session["user_level"] = 444
        app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60)
        session.permanent = True
        return render_template('index.html', articles=data, visited=visited_num+1, projects=projects, mood=mood, tail=mood_tail)
    else:
        return render_template('index.html', articles=data, visited=visited_num, projects=projects, mood=mood, tail=mood_tail)


def __get_projects():
    try:
        url = "https://project.haiblog.cn/apigetitem?content=1&fields=project_url,project_time,project_title&sort=0&start=0&num=3"
        res = json.loads(requests.get(url).text)
        #去除数组中多余的内容
        res.pop()
    except Exception:
        res = []
    return res