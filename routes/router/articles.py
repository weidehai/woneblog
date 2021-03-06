from flask import request, render_template, Response, jsonify
from database import my_articles, my_comments
from observer import updateob


class ArticlesDetail:
    def __init__(self, app, cache):
        self.app = app
        self.cache = cache
        self.__addArticleDetails__()
        self.__addGetMain__()
        self.__addGetComment__()
        self.__addDelComment__()
        updateob.add(self.articleUpdateObserver)

    def __addArticleDetails__(self):
        @self.app.route('/articledetails')
        def article_details():
            article_id = request.args.get('id')
            try:
                has_cache_data = self.cache.get(article_id)
            except Exception:
                has_cache_data = False
            # 如果缓存中取不到id这个记录,就到数据库中取
            # 这里的缓存是共享的
            if not (has_cache_data and request.cookies.get(article_id)):
                print("get from model.....")
                # detail页面需要的数据有article_id,article_time,article_title,article_tag,article_read,并且只取当前id的那一条数据
                # 设置的缓存时间是5分钟，也就是五分钟内打开同一篇文章只增加一次阅读量
                data = my_articles.query_field_primary_key(article_id,
                                                           ['article_id',
                                                            'article_time',
                                                            'article_title',
                                                            'article_content',
                                                            'article_tag',
                                                            'article_read',
                                                            'post_key',
                                                            'update_time'])[0]
                print(data)
                previous_article = my_articles.get_previous(data['article_id'])
                print(previous_article)
                next_article = my_articles.get_next(data['article_id'])
                my_articles.update_data(article_id, article_read=str(data['article_read'] + 1))
                data['article_read'] = data['article_read']+1
                cache_data = {
                    'data': data,
                    'previous': previous_article,
                    'next': next_article
                }
                try:
                    self.cache.set(article_id, cache_data)
                except Exception:
                    print("cache has some error")
                resp = Response(render_template('article_detail.html',
                                                article=data,
                                                previous=previous_article and previous_article[0]['post_key'] or 0,
                                                next=next_article and next_article[0]['post_key'] or 0))
                resp.set_cookie(article_id, '1', 300)
                # 将取到的数据放入缓存，下次就从缓存中取
                return resp
            else:
                print("get from cache.....")
                return render_template('article_detail.html',
                                       article=has_cache_data['data'],
                                       previous=has_cache_data['previous'] and has_cache_data['previous'][0]['post_key'] or 0,
                                       next=has_cache_data['next'] and has_cache_data['next'][0]['post_key'] or 0)

    def __addDelComment__(self):
        @self.app.route('/commentdel')
        def comment_del():
            my_comments.del_where(request.args.get('del_key'))
            my_comments.del_reply_belong(request.args.get('del_key'))
            return "200ok"

    def __addGetMain__(self):
        @self.app.route('/getmain')
        def get_main():
            query = request.args.get('id').split("?")
            where = query[0]
            query.pop(0)
            data = my_articles.query_field_primary_key(where, query)
            return jsonify(data)

    def __addGetComment__(self):
        @self.app.route('/getcomment')
        def getcomment():
            # 获取url查询参数，也就是url？号后面的查询参数
            post_key = request.args.get('id')
            offset = request.args.get('offset')
            return jsonify(my_comments.query_comment(post_key, offset))

    def articleUpdateObserver(self, article_id):
        print("update cache")
        self.cache.delete(article_id)







