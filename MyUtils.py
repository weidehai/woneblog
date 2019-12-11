class tools():
    #对标签字段进行整理，剔除重复部分后展示在前端
    def resortTag(tag):
         new_tag = []
         originaltag = []
         for i in tag:
            originaltag.append(i['article_tag'])
         new_tag = list(set(originaltag))
         return new_tag
