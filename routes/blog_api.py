from flask import Blueprint, send_from_directory,request, jsonify,current_app
from model import WoneArticles,Admin
from utils.utils import convert_tuple_to_dict
from flask_extension.extension import db
import logging
import os

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

@blogapi.route("/api/upload",methods=['PUT'])
def upload():
    file = request.files['file']
    filename = file.filename
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    return jsonify({'result':200,'url':'/static/upload/'+filename})