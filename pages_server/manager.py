from flask import redirect, session, Blueprint, render_template
from database import my_admin, my_blogtags, my_drafts

admin = Blueprint('admin', __name__, template_folder="templates")


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


# class Manager:
#     def __init__(self, app):
#         self.app = app
#         self.__addManage__()
#
#     def __addManage__(self):
#         @self.app.route('/manage')
#         def manage11():
#             root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../admin')
#             if session.get('user_level') == 777:
#                 return send_from_directory(root, 'manage.html')
#             else:
#                 return redirect('/login')
