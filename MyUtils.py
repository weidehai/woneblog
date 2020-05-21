import time
import copy


class Tools:
    # 对标签字段进行整理，剔除重复部分后展示在前端
    def resort_tag(tag):
        new_tag = []
        original_tag = []
        for i in tag:
            original_tag.append(i['article_tag'])
        new_tag = list(set(original_tag))
        return new_tag

    def get_data_by_year(database,query_list,tag):
        start_year = 2019
        now_year = time.localtime()[0]
        data_for_year = {}
        data = []
        while start_year <= now_year:
            st = str(start_year)+'-1-1'
            et = str(start_year)+'-12-31'
            data_for_year['year'] = start_year
            articles_for_year = database.query_field_by_time(query_list, st, et, tag)
            if articles_for_year==():
                start_year += 1
                continue
            articles_for_year.reverse()
            data_for_year['articles']=articles_for_year
            start_year += 1
            data.append(copy.deepcopy(data_for_year))
        data.reverse()
        return data

    def clean_space(data):
        data = data.split("\\\\n")
        for i in range(len(data)):
            data[i] = data[i].replace('\\n', "")
        data = "\\\\n".join(data)
        return "".join(data.split())

    def content_handle(string, kw):
        index = string.find(kw)
        if index != -1:
            c = str[index:index+200]
        else:
            c = str[:200]
        return c
