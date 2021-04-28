from flask import Blueprint, send_from_directory,request, jsonify,current_app,json
from model import WoneArticles,Admin,wWoneArticles
from utils.utils import convert_tuple_to_dict
from flask_extension.extension import db
import logging
import os
from flask_login import login_required,current_user

blogapi = Blueprint('blogapi', __name__)

@blogapi.route("/api",methods=['GET'])
def api():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__),os.path.pardir))
    return send_from_directory(root, 'restful-api.json')


@blogapi.route("/api/articles",methods=['GET'])
def api_articles():
    offset,limit=(request.args.get('offset', 0, type=int),request.args.get('limit',10,type=int))
    logging.info("page:%s limit:%s" % (offset,limit))
    article_total = db.session.query(Admin.article_total).first()[0]
    print(article_total)
    pagination = db.session.query(WoneArticles.article_id,
                                  WoneArticles.article_title,
                                  WoneArticles.article_time,
                                  WoneArticles.article_tag).order_by(WoneArticles.article_time.desc()).offset(offset).limit(limit).all()
    logging.info(pagination)
    return jsonify({'data':convert_tuple_to_dict(['article_id','article_title','article_time','article_tag'],pagination),'total':article_total,'result':bool(pagination)})


@blogapi.route("/api/articles/<int:year>",methods=['GET'])
def api_get_articles_by_year(year):
    offset = request.args.get('offset')
    fetched_count = request.args.get('fetched_count')
    start_time = "%s-%s-%s" % (year,'01','01')
    end_time = "%s-%s-%s" % (year, '12', '31')
    count = WoneArticles.query.count()
    end = False
    if int(count) <= int(fetched_count):
        end = True
    articles = WoneArticles.query.with_entities(WoneArticles.article_id,WoneArticles.article_time,WoneArticles.article_title).filter(WoneArticles.article_time < end_time,WoneArticles.article_time > start_time).order_by(WoneArticles.article_time.desc()).offset(offset).limit(10).all()
    return jsonify({'result':bool(articles),'data':convert_tuple_to_dict(['article_id','article_time','article_title'],articles),'year':year,'end':end})

@blogapi.route("/api/articles/<string:tag>/<int:year>",methods=['GET'])
def api_get_articles_by_year_and_tag(tag,year):
    print(tag)
    offset = request.args.get('offset')
    fetched_count = request.args.get('fetched_count')
    start_time = "%s-%s-%s" % (year,'01','01')
    end_time = "%s-%s-%s" % (year, '12', '31')
    count = WoneArticles.query.filter(WoneArticles.article_tag==tag).count()
    end = False
    if int(count) <= int(fetched_count):
        end = True
    articles = WoneArticles.query.with_entities(WoneArticles.article_id,
                                                WoneArticles.article_time,
                                                WoneArticles.article_title).\
                                  filter(WoneArticles.article_time < end_time,
                                         WoneArticles.article_time > start_time,
                                         WoneArticles.article_tag==tag).\
                                  order_by(WoneArticles.article_time.desc()).offset(offset).limit(10).all()
    return jsonify({'result':bool(articles),'data':convert_tuple_to_dict(['article_id','article_time','article_title'],articles),'year':year,'end':end})

@blogapi.route("/api/saveArticles",methods=['POST'])
@login_required
def saveArticles():
    request_data = json.loads(request.get_data())
    print(request_data)
    new_article = wWoneArticles(author=current_user.admin_name,
                                post_key=request_data['post_key'],
                                article_title=request_data['article_title'],
                                article_time=request_data['article_time'],
                                update_time=request_data['update_time'],
                                article_read='0',
                                article_tag=request_data['article_tag'],
                                article_content=request_data['article_content'],
                                text_for_search=request_data['text_for_search'])
    db.session.add(new_article)
    db.session.flush()
    db.session.commit()
    return jsonify({'result':200})


@blogapi.route("/api/upload",methods=['POST'])
@login_required
def upload():
    file = request.files['file']
    filename = file.filename
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    return jsonify({'result':200,'url':'/static/upload/'+filename})