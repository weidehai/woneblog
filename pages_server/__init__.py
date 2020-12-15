# coding=utf-8
from flask import Blueprint
#将pages_server/templates  注册为模板
admin = Blueprint('admin', __name__, template_folder="templates")
print("import pages_server")