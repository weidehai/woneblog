from MyUtils import tools
from PoolDB import Pool


class dataBase():
    def query_sreach(self,kw,offset):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = 'select count(*) from %s where match(article_tag, article_title, textforsearch) against("+%s" in boolean mode)' % (
        self.tablename, kw)
        cur.execute(sql)
        total = cur.fetchall()[0]["count(*)"]
        print (total)
        if(total > 10):
            sql = 'select article_read,article_tag,article_time,article_title,postkey,textforsearch from %s where match(article_tag, article_title, textforsearch) against("+%s" in boolean mode) limit %s,10' % (self.tablename, kw,offset)
        else:
            sql = 'select article_read,article_tag,article_time,article_title,postkey,textforsearch from %s where match(article_tag, article_title, textforsearch) against("+%s" in boolean mode)' % (
        self.tablename, kw)
        print (sql)
        cur.execute(sql)
        data = cur.fetchall()
        for index in range(len(data)):
            data[index]["textforsearch"] = tools.contenthandle(data[index]['textforsearch'],kw)
        cur.close()
        conn.close()
        return {"data":data,"total":total}
    def query_limit(self,limit,qrfield_list,order_list):
        conn = Pool.connection()
        cur = conn.cursor()
        order = []
        for i in order_list:
            order.append('%s desc' % i)
        sql = 'select %s from %s order by %s limit %s' % (','.join(qrfield_list), self.tablename, ','.join(order), limit)
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data
    def query_comment(self,where,*qrfield):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = 'select %s from %s where comment_postid=%s' % (','.join(qrfield), self.tablename, where)
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data
    def query_field_primarykey(self,where,qrfield_list):
        conn = Pool.connection()
        cur = conn.cursor()
        if(where):
            sql = 'select %s from %s where %s=%s' % (','.join(qrfield_list),self.tablename,self.primarykey,where)
        else:
            sql = 'select %s from %s where %s' % (','.join(qrfield_list), self.tablename, '1=1')
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data
    def query_field_by_time(self,qrfield_list,st,et,tag):
        conn = Pool.connection()
        cur = conn.cursor()
        if(tag):
            sql = 'select %s from %s where article_time>="%s" and article_time<="%s" and article_tag="%s"' % (','.join(qrfield_list), self.tablename, st, et,tag)
        else:
            sql = 'select %s from %s where article_time>="%s" and article_time<="%s"' % (','.join(qrfield_list),self.tablename,st,et)
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data
    #更新表中的某一条记录,并且可以指定更新的字段
    def update_data(self,where,**kwargs):
        conn = Pool.connection()
        cur = conn.cursor()
        update_content=[]
        for field,value in kwargs.items():
            update_content.append(field+'='+"'"+value+"'")
        sql = "update %s set %s where %s=%s" % (self.tablename,",".join(update_content),self.primarykey,where)
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return
    def getprevious(self,id):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "select postkey from articles where article_id < %s order by article_id desc limit 1" % (id)
        cur.execute(sql)
        previouspostkey = cur.fetchone()
        cur.close()
        conn.close()
        return previouspostkey
    def getnext(self,id):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "select postkey from articles where article_id > %s order by article_id limit 1" % (id)
        cur.execute(sql)
        nextpostkey = cur.fetchone()
        cur.close()
        conn.close()
        return nextpostkey
    def save_data(self,**kwargs):
        conn = Pool.connection()
        cur = conn.cursor()
        fields=[]
        values=[]
        for field,value in kwargs.items():
            fields.append(field)
            values.append("'"+value+"'")
        sql = "insert into %s (%s) values (%s)" % (self.tablename,",".join(fields),",".join(values))
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return
    def del_where(self,where):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "delete from %s where %s=%s" % (self.tablename,self.primarykey,where)
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return
    def del_replybelong(self,replyfor):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "delete from comment where replybelong=%s" % (replyfor)
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return
    def query_quantity(self):
        conn = Pool.connection()
        cur = conn.cursor()
        #查询表中有多少条数据
        sql = "select count(*) from %s" % (self.tablename)
        cur.execute(sql)
        data = cur.fetchone()
        cur.close()
        conn.close()
        return data["count(*)"]
class articles(dataBase):
    def __init__(self,tablename):
        self.tablename = tablename
        self.primarykey = 'postkey'
class comment(dataBase):
    def __init__(self, tablename):
        self.tablename = tablename
        self.primarykey='commentkey'
class admin(dataBase):
    def __init__(self, tablename):
        self.tablename = tablename
        self.primarykey = 'admin_id'