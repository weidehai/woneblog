from config import DBConfig
import pymysql
from DBUtils.PooledDB import PooledDB
Pool = PooledDB(creator=pymysql,
                host=DBConfig.DB_HOST,
                port=DBConfig.DB_PORT,
                user=DBConfig.DB_USERNAME,
                passwd=DBConfig.DB_PASSWORD,
                db=DBConfig.DB_DBNAME,
                mincached=DBConfig.DB_MIN_CACHED,
                maxcached=DBConfig.DB_MAX_CACHED,
                maxconnections=DBConfig.DB_MAX_CONNECTIONS,
                blocking=DBConfig.DB_BLOCKING,
                cursorclass=pymysql.cursors.DictCursor)
