import time,copy
class tools():
    #对标签字段进行整理，剔除重复部分后展示在前端
    def resortTag(tag):
         new_tag = []
         originaltag = []
         for i in tag:
            originaltag.append(i['article_tag'])
         new_tag = list(set(originaltag))
         return new_tag
    def get_data_by_year(database,query_list,tag):
        STARYEAR = 2019
        NOWYEAR = time.localtime()[0]
        data_for_year={}
        data=[]
        while STARYEAR<=NOWYEAR:
            st = str(STARYEAR)+'-1-1'
            et = str(STARYEAR)+'-12-31'
            data_for_year['year']=STARYEAR
            articles_for_year = database.query_field_by_time(query_list,st,et,tag)
            if(articles_for_year==()):
                STARYEAR += 1
                continue
            articles_for_year.reverse()
            data_for_year['articles']=articles_for_year
            STARYEAR+=1
            data.append(copy.deepcopy(data_for_year))
        data.reverse()
        return data
    def cleanspace(data):
        data = data.split("\\\\n")
        for i in range(len(data)):
            data[i] = data[i].replace('\\n',"")
        data = "\\\\n".join(data)
        return ("".join(data.split()))
    def contenthandle(str,kw):
        index = str.find(kw)
        if (index != -1):
            c = str[index:index+200]
        else:
            c = str[:200]
        return c
