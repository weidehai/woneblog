from flask import redirect, session, Blueprint, render_template
from database import my_admin, my_blogtags, my_drafts
from pages_server import admin

class Manager:
    def __init__(self):
        self.__addmanager__()

    def __addmanager__(self):
        print("register manage")
        @admin.route('/admin/manage')
        def manage():
            if session.get('user_level') == 777:
                article_num = my_admin.query_field_primary_key(1, ["article_total"])[0]["article_total"]
                draft_num = my_drafts.query_quantity()
                tags_info = my_blogtags.customize_sql("select tag_name,quantity from blogtags", "query")
                print(tags_info)
                return render_template('manage.html', article_num=article_num, draft_num=draft_num, tags=tags_info)
            else:
                return redirect('/login')