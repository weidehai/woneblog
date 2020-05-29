from flask import request, render_template, json, jsonify
from database import my_articles


class Search:
    def __init__(self, app):
        self.app = app
        self.__addSearch__()

    def __addSearch__(self):
        @self.app.route('/search', methods=["GET", "POST"])
        def search():
            if request.method == "GET":
                return render_template('search.html')
            data = json.loads(request.get_data())
            print(data["kw"], data['offset'])
            res = my_articles.query_search(data["kw"], data["offset"])
            for index in range(len(res['data'])):
                res['data'][index]["text_for_search"] = Search.content_handle(res['data'][index]['text_for_search'],
                                                                              data["kw"])
            return jsonify(res)

    @staticmethod
    def content_handle(string, kw):
        index = string.find(kw)
        if index != -1:
            c = string[index:index + 200]
        else:
            c = string[:200]
        return c

