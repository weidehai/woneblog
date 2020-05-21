from flask import request, render_template, json, jsonify
from database import Articles


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
            res = my_articles.query_sreach(data["kw"], data["offset"])
            return jsonify(res)


my_articles = Articles("articles")