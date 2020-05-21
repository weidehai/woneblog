from MyUtils import Tools
from PoolDB import Pool


class DataBase:
    def query_search(self, kw, offset):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = 'select count(*) from %s where match(article_tag, article_title, textforsearch) against("+%s" in boolean mode)' % (self.table_name, kw)
        cur.execute(sql)
        total = cur.fetchall()[0]["count(*)"]
        print(total)
        if total > 10:
            sql = 'select article_read,article_tag,article_time,article_title,postkey,textforsearch from %s where match(article_tag, article_title, textforsearch) against("+%s" in boolean mode) limit %s,10' % (self.table_name, kw, offset)
        else:
            sql = 'select article_read,article_tag,article_time,article_title,postkey,textforsearch from %s where match(article_tag, article_title, textforsearch) against("+%s" in boolean mode)' % (self.table_name, kw)
        print(sql)
        cur.execute(sql)
        data = cur.fetchall()
        for index in range(len(data)):
            data[index]["text_for_search"] = Tools.contenthandle(data[index]['text_for_search'], kw)
        cur.close()
        conn.close()
        return {"data": data, "total": total}

    def query_limit(self, limit, qr_field_list, order_list):
        conn = Pool.connection()
        cur = conn.cursor()
        order = []
        if order_list:
            for i in order_list:
                order.append('%s desc' % i)
            sql = 'select %s from %s order by %s limit %s' % (','.join(qr_field_list), self.table_name, ','.join(order), limit)
        else:
            sql = 'select %s from %s limit %s' % (','.join(qr_field_list), self.table_name, limit)
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    def query_comment(self, where, *qr_field):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = 'select %s from %s where comment_for_post_id=%s' % (','.join(qr_field), self.table_name, where)
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    def query_field_primary_key(self, where, qr_field_list):
        conn = Pool.connection()
        cur = conn.cursor()
        if where:
            sql = 'select %s from %s where %s=%s' % (','.join(qr_field_list), self.table_name, self.primary_key, where)
        else:
            sql = 'select %s from %s where %s' % (','.join(qr_field_list), self.table_name, '1=1')
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    def query_field_by_time(self, qr_field_list, st, et, tag):
        conn = Pool.connection()
        cur = conn.cursor()
        if tag:
            sql = 'select %s from %s where article_time>="%s" and article_time<="%s" and article_tag="%s"' % (','.join(qr_field_list), self.table_name, st, et, tag)
        else:
            sql = 'select %s from %s where article_time>="%s" and article_time<="%s"' % (','.join(qr_field_list), self.table_name, st, et)
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        conn.close()
        return data

    # 更新表中的某一条记录,并且可以指定更新的字段
    def update_data(self, where, **kwargs):
        conn = Pool.connection()
        cur = conn.cursor()
        update_content = []
        for field, value in kwargs.items():
            update_content.append(field+'='+"'"+value+"'")
        sql = "update %s set %s where %s=%s" % (self.table_name, ",".join(update_content), self.primary_key, where)
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return

    def get_previous(self, post_id):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "select post_key from articles where article_id < %s order by article_id desc limit 1" % post_id
        cur.execute(sql)
        previous_post_key = cur.fetchone()
        cur.close()
        conn.close()
        return previous_post_key

    def get_next(self, post_id):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "select post_key from articles where article_id > %s order by article_id limit 1" % post_id
        cur.execute(sql)
        next_post_key = cur.fetchone()
        cur.close()
        conn.close()
        return next_post_key

    def save_data(self, **kwargs):
        conn = Pool.connection()
        cur = conn.cursor()
        fields = []
        values = []
        for field, value in kwargs.items():
            fields.append(field)
            values.append("'"+value+"'")
        sql = "insert into %s (%s) values (%s)" % (self.table_name, ",".join(fields), ",".join(values))
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return

    def del_where(self, where):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "delete from %s where %s=%s" % (self.table_name, self.primary_key, where)
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return

    def del_reply_belong(self, reply_for):
        conn = Pool.connection()
        cur = conn.cursor()
        sql = "delete from comment where reply_belong=%s" % reply_for
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return

    def query_quantity(self):
        conn = Pool.connection()
        cur = conn.cursor()
        # 查询表中有多少条数据
        sql = "select count(*) from %s" % self.table_name
        cur.execute(sql)
        data = cur.fetchone()
        cur.close()
        conn.close()
        return data["count(*)"]


class Articles(DataBase):
    def __init__(self, table_name):
        self.table_name = table_name
        self.primary_key = 'post_key'


class Comment(DataBase):
    def __init__(self, table_name):
        self.table_name = table_name
        self.primary_key = 'comment_key'


class Admin(DataBase):
    def __init__(self, table_name):
        self.table_name = table_name
        self.primary_key = 'admin_id'


class TimeLine(DataBase):
    def __init__(self, table_name):
        self.table_name = table_name
        self.primary_key = 'timeline_id'
