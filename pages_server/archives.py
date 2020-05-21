from flask import request, render_template
from database import Articles
from MyUtils import Tools


class Archives:
    def __init__(self, app):
        self.app = app
        self.__addArchives__()

    def __addArchives__(self):
        @self.app.route('/archives')
        def archives():
            tag_name = request.args.get('tag')
            if tag_name is None:
                tag_name = 'Archives'
                # Archives页面需要的数据有article_id,article_time,article_title,article_tag
                data = Tools.get_data_by_year(my_articles, ['article_time', 'article_title', 'post_key'], '')
            else:
                data = Tools.get_data_by_year(my_articles, ['article_time', ' article_title', 'article_tag', 'post_key'], tag_name)
            article_tag = my_articles.query_field_primary_key('', ['article_tag'])
            tags = Tools.resort_tag(article_tag)
            return render_template('archives.html', articles=data, tags=tags, title=tag_name)


my_articles = Articles("articles")
