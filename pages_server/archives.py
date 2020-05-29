from flask import request, render_template
from database import my_articles, my_blog
import time
import copy


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
                data = Archives.get_data_by_year(my_articles, ['article_time', 'article_title', 'post_key'], '')
            else:
                data = Archives.get_data_by_year(my_articles,
                                                 ['article_time', ' article_title', 'article_tag', 'post_key'],
                                                 tag_name)
            article_tags = my_blog.query_field_primary_key(1, ['article_tags'])[0]['article_tags'].split(",")
            return render_template('archives.html', articles=data, tags=article_tags, title=tag_name)

    @staticmethod
    def get_data_by_year(database, query_list, tag):
        start_year = 2019
        now_year = time.localtime()[0]
        data_for_year = {}
        data = []
        while start_year <= now_year:
            print(start_year)
            st = str(start_year) + '-01-01'
            et = str(start_year) + '-12-31'
            data_for_year['year'] = start_year
            articles_for_year = database.query_field_by_time(query_list, st, et, tag)
            if articles_for_year == ():
                start_year += 1
                continue
            articles_for_year.reverse()
            data_for_year['articles'] = articles_for_year
            start_year += 1
            data.append(copy.deepcopy(data_for_year))
        data.reverse()
        return data



