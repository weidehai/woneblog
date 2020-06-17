from flask import request, render_template, jsonify
from database import my_articles, my_blogtags
import time
import copy

tables = {
    "articles": my_articles,
}


class Archives:
    def __init__(self, app):
        self.app = app
        self.__addArchives__()
        self.__addGetDataByYear__()

    def __addArchives__(self):
        @self.app.route('/archives')
        def archives():
            # tag_name = request.args.get('tag')
            # if tag_name is None:
            #     tag_name = 'Archives'
            #     # Archives页面需要的数据有article_id,article_time,article_title,article_tag
            #     data = Archives.get_data_by_year(my_articles, ['article_time', 'article_title', 'post_key'], '')
            # else:
            #     data = Archives.get_data_by_year(my_articles,
            #                                      ['article_time', ' article_title', 'article_tag', 'post_key'],
            #                                      tag_name)
            article_tags = my_blogtags.customize_sql("select %s from %s" % ("tag_name", my_blogtags.table_name), "query")
            return render_template('archives.html', tags=article_tags)

    def __addGetDataByYear__(self):
        @self.app.route('/getdatabyyear')
        def get_data_by_year():
            year = request.args.get('year')
            query_list = request.args.get("fields").split(',')
            table = request.args.get("table")
            where = request.args.get("where")
            offset = request.args.get("offset")
            st = str(year) + '-01-01'
            et = str(year) + '-12-31'
            print()
            data = tables[table].query_field_by_timerange(query_list, st, et, where, offset)
            return jsonify(data)



