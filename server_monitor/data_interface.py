# coding=utf-8
from server_monitor.database import *
from server_monitor.get_info import SeverMonitor
from server_monitor.config import LOCK
from server_monitor.ssh_connect import monitor
import server_monitor.utils as utils
import copy

class DataInterface:
    @staticmethod
    def get_serverinfo():
        print("want get lock")
        LOCK.acquire()
        with session_scope() as session:
            result = session.query(ServerInfo)
            try:
                data = utils.to_dict(result.one())
                LOCK.release()
                print("released lock")
            except Exception:
                LOCK.release()
                print("released lock")
                data = SeverMonitor.get_serverinfo()
            try:
                who_login = monitor.exe_cmd("who | awk -F ' ' '{print $1}'").replace("\n",",").rstrip(",")
            except Exception:
                who_login = "当前无用户登陆"
            data['user_login'] = who_login
            return copy.deepcopy(data)
    @staticmethod
    def get_requests(get_time):
        print(get_time)
        print("want get lock")
        r_queue = []
        LOCK.acquire()
        with session_scope() as session:
            try:
                # 清除查询缓存
                session.expire(Requests)
            except Exception as e:
                print("error:%s" % e)
            try:
                result = session.query(Requests).filter(Requests.time_day==get_time).all()
                for item in result:
                    print(item)
                    r_queue.append(utils.to_dict(item))
                print(r_queue)
            except Exception as e:
                print("error:%s" % e)

            LOCK.release()
            print("released lock")
            #print(r_queue)
            return copy.deepcopy(r_queue)
    @staticmethod
    def get_flows(get_time):
        print(get_time)
        print("want get lock")
        r_queue = []
        LOCK.acquire()
        with session_scope() as session:
            try:
                session.expire(Flows)
            except Exception as e:
                print("error:%s" % e)
            try:
                result = session.query(Flows).filter(Flows.time_day == get_time).all()
                for item in result:
                    print(item)
                    r_queue.append(utils.to_dict(item))
                print(r_queue)
                # 清除查询缓存

            except Exception as e:
                print("error:%s" % e)

            LOCK.release()
            print("released lock")
            return copy.deepcopy(r_queue)
    @staticmethod
    def get_request_origin():
        result = SeverMonitor.get_request_origin()
        if result:
            return result
        return "no data"


if __name__ == "__main__":
    DataInterface.get_serverinfo()