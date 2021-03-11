try:
    from urlparse import urlparse, urljoin
except ImportError:
    from urllib.parse import urlparse, urljoin
from flask import request, redirect, url_for, current_app
from model.woneblog import Admin,ArticleTags,WoneArticles
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


def ismodel(obj):
    return isinstance(obj, WoneArticles) or isinstance(obj, ArticleTags) or isinstance(obj, Admin)

def istuple(obj):
    return isinstance(obj,tuple)

def islist(obj):
    return isinstance(obj,list)



def convert_model_to_dict(model):
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

    if islist(model):
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

def convert_tuple_to_dict(keys,tuple_data):
    def check_keys(obj):
        return isinstance(obj,list) or isinstance(obj,tuple)

    class TypeErrorException(Exception):
        def __init__(self, obj, exception_type):
            self.type = type(obj)
            self.exception_type = exception_type
        def __str__(self):
            return "require %s type,but get %s" % (self.exception_type,self.type)

    if check_keys(keys):
        if islist(tuple_data):
            converted_data = []
            for item in tuple_data:
                converted_data.append(dict(zip(keys,item)))
            return converted_data
        if istuple(tuple_data):
            return dict(zip(keys,tuple_data))
        raise TypeErrorException(tuple_data,'tuple_data with tuple or list')
    raise TypeErrorException(keys,'keys with tuple or list')



