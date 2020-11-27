from flask import render_template, session


class About:
    def __init__(self, app):
        self.app = app
        self.__addAbout__()
        self.__addTimeline__()

    def __addAbout__(self):
        @self.app.route('/about')
        def about():
            return render_template('about.html')

    def __addTimeline__(self):
        @self.app.route('/timelines')
        def time_lines():
            if session.get('user_level') != 777:
                return render_template('timeline.html', admin="false")
            return render_template("timeline.html", admin="true")
