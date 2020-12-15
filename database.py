from PoolDB import Pool


class Operation:
    @staticmethod
    def execute_query(sql):
        conn = Pool.connection()
        cur = conn.cursor()
        cur.execute(sql)
        r = cur.fetchall()
        cur.close()
        conn.close()
        print(r)
        return r

    @staticmethod
    def execute_commit(sql):
        conn = Pool.connection()
        cur = conn.cursor()
        try:
            cur.execute(sql)
            conn.commit()
        #20201205 回滚失败事务防止pymysql死锁
        except Exception as e:
            print("pymysql commit has some error:"+e)
            conn.rollback()
        cur.close()
        conn.close()
        return


class Query:
    @staticmethod
    def query_field_order_limit(table_name, qr_field_list, order_list, offset, num):
        order = []
        for i in order_list:
            order.append('%s desc' % i)
        sql = 'select %s from %s order by %s limit %s,%s' \
              % (','.join(qr_field_list), table_name, ','.join(order), offset, num)
        print(sql)
        return Operation.execute_query(sql)

    @staticmethod
    def query_field_primary_key(table_name, primary_key, where, qr_field_list):
        sql = 'select %s from %s where %s=%s' % (','.join(qr_field_list), table_name, primary_key, where)
        print(sql)
        return Operation.execute_query(sql)

    @staticmethod
    def query_comment(table_name, where, offset):
        sql = 'select * from %s where comment_for_post_id=%s order by comment_time desc limit %s,10' % \
              (table_name,
               where,
               offset)
        return Operation.execute_query(sql)

    @staticmethod
    def query_field_by_timerange(table_name, qr_field_list, st, et, where, offset):
        if where == "all":
            sql = 'select %s from %s where article_time>="%s" and article_time<="%s" order by article_time desc limit %s,10' \
                  % (','.join(qr_field_list), table_name, st, et, offset)
        else:
            sql = 'select %s from %s where article_time>="%s" and article_time<="%s" and %s order by article_time desc limit %s,10' \
                  % (','.join(qr_field_list), table_name, st, et, where, offset)
        print(sql)
        return Operation.execute_query(sql)

    @staticmethod
    def query_search(table_name, kw, offset):
        sql = 'select count(*) from %s where match(' \
              'article_tag, article_title, text_for_search) against("+%s" in boolean mode)' % (table_name, kw)
        total = Operation.execute_query(sql)[0]["count(*)"]
        print(total)
        sql = 'select ' \
              'article_read,article_tag,article_time,article_title,post_key,text_for_search ' \
              'from %s where match(article_tag, article_title, text_for_search) ' \
              'against("+%s" in boolean mode) limit %s,10' % (table_name, kw, offset)
        print(sql)
        data = Operation.execute_query(sql)
        return {"data": data, "total": total}

    @staticmethod
    def get_previous(table_name, post_id):
        sql = "select post_key from %s where article_id < %s order by article_id desc limit 1" % (table_name, post_id)
        return Operation.execute_query(sql)

    @staticmethod
    def get_next(table_name, post_id):
        sql = "select post_key from %s where article_id > %s order by article_id limit 1" % (table_name, post_id)
        return Operation.execute_query(sql)

    @staticmethod
    def query_quantity(table_name):
        # 查询表中有多少条数据
        sql = "select count(*) from %s" % table_name
        return Operation.execute_query(sql)[0]["count(*)"]


class Commit:
    # 更新表中的某一条记录,并且可以指定更新的字段
    @staticmethod
    def update_data(table_name, primary_key, where, **kwargs):
        update_content = []
        for field, value in kwargs.items():
            update_content.append(field + '=' + "'" + value + "'")
        sql = "update %s set %s where %s=%s" % (table_name, ",".join(update_content), primary_key, where)
        print(sql)
        Operation.execute_commit(sql)
        return

    @staticmethod
    def save_data(table_name, **kwargs):
        fields = []
        values = []
        for field, value in kwargs.items():
            fields.append(field)
            values.append("'" + value + "'")
        print(fields, values)
        sql = "insert into %s (%s) values (%s)" % (table_name, ",".join(fields), ",".join(values))
        Operation.execute_commit(sql)
        return

    @staticmethod
    def del_where(table_name, primary_key, where):
        sql = "delete from %s where %s='%s'" % (table_name, primary_key, where)
        Operation.execute_commit(sql)
        return

    @staticmethod
    def del_reply_belong(table_name, reply_for):
        sql = "delete from %s where reply_belong=%s" % (table_name, reply_for)
        Operation.execute_commit(sql)
        return


class DataBase:
    operation = {"query":Operation.execute_query,"commit":Operation.execute_commit}

    def query_quantity(self):
        return Query.query_quantity(self.table_name)

    def query_search(self, kw, offset):
        return Query.query_search(self.table_name, kw, offset)

    def query_field_order_limit(self, qr_field_list, order_list, offset, num):
        return Query.query_field_order_limit(self.table_name, qr_field_list, order_list, offset, num)

    def query_comment(self, where, *qr_field):
        return Query.query_comment(self.table_name, where, *qr_field)

    def query_field_primary_key(self, where, qr_field_list):
        return Query.query_field_primary_key(self.table_name, self.primary_key, where, qr_field_list)

    def query_field_by_timerange(self, qr_field_list, st, et, where, offset):
        return Query.query_field_by_timerange(self.table_name, qr_field_list, st, et, where, offset)

    def get_previous(self, post_id):
        return Query.get_previous(self.table_name, post_id)

    def get_next(self, post_id):
        return Query.get_next(self.table_name, post_id)

    def update_data(self, where, **kwargs):
        print(kwargs)
        Commit.update_data(self.table_name, self.primary_key, where, **kwargs)
        return

    def save_data(self, **kwargs):
        Commit.save_data(self.table_name, **kwargs)
        return

    def del_where(self, where):
        Commit.del_where(self.table_name, self.primary_key, where)
        return

    def del_reply_belong(self, reply_for):
        Commit.del_where(self.table_name, "reply_belong", reply_for)
        return

    @staticmethod
    def customize_sql(sql, method):
        print(sql)
        return DataBase.operation[method](sql)




class Table(DataBase):
    def __init__(self, table_name, primary_key):
        self.table_name = table_name
        self.primary_key = primary_key


my_articles = Table("articles", "post_key")
my_comments = Table("comment", "comment_key")
my_timeline = Table("timeline", "timeline_id")
my_admin = Table("admin", "admin_id")
my_blogtags = Table("blogtags", "tag_name")
my_drafts = Table("drafts", "post_key")
