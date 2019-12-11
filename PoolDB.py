import DBConfig,pymysql
from DBUtils.PooledDB import PooledDB
Pool = PooledDB(creator=pymysql,host=DBConfig.DB_HOST,port=DBConfig.DB_PORT,user=DBConfig.DB_USERNAME,
                passwd=DBConfig.DB_PASSWORD,db=DBConfig.DB_DBNAME,mincached=DBConfig.DB_MINCACHED,maxcached=DBConfig.DB_MAXCACHED,
                maxconnections=DBConfig.DB_MAXCONNECTIONS,blocking=DBConfig.DB_BLOCKING,cursorclass = pymysql.cursors.DictCursor)