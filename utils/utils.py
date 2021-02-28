try:
    from urlparse import urlparse, urljoin
except ImportError:
    from urllib.parse import urlparse, urljoin
from flask import request, redirect, url_for, current_app
from model.woneblog import Admin,ArticleTags,Articles
import logging

def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc

def redirect_back(default='blog.index', **kwargs):
    logging.error(request.args.get('next'))
    for target in request.args.get('next'), request.referrer:
        logging.error(target)
        if not target:
            continue
        if is_safe_url(target):
            return redirect(target)
    return redirect(url_for(default, **kwargs))

def convert_model_to_dict(model):
    def ismodel(obj):
        return isinstance(obj,Articles) or isinstance(obj,ArticleTags) or isinstance(obj,Admin)

    class NotModelException(Exception):
        def __init__(self, obj):
            self.type = type(obj)
        def __str__(self):
            return "require a model instance,but get %s" % self.type

    def doconvert(obj):
        temp_dict = obj.__dict__
        if '_sa_instance_state' in temp_dict:
            del temp_dict['_sa_instance_state']
        return temp_dict

    if isinstance(model,list):
        result=[]
        for item in model:
            if ismodel(item):
                converted_item = doconvert(item)
                result.append(converted_item)
            else:
                raise NotModelException(item)
        return result
    if ismodel(model):
        converted_item = doconvert(model)
        return converted_item
    raise NotModelException(model)

