# coding=utf-8
from server_monitor.database import *
from server_monitor.get_info import SeverMonitor
from server_monitor.config import LOCK
from server_monitor.ssh_connect import monitor
import server_monitor.utils as utils

class DataInterface:
    @staticmethod
    def get_serverinfo():
        print("want get lock")
        LOCK.acquire()
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
        return data
    @staticmethod
    def get_requests(get_time):
        print(get_time)
        print("want get lock")
        r_queue = []
        LOCK.acquire()
        try:
            result = session.query(Requests).filter(Requests.time_day==get_time).all()
            for item in result:
                r_queue.append(utils.to_dict(item)  )
            print(r_queue)
        except Exception:
            pass
        LOCK.release()
        print("released lock")
        return r_queue


if __name__ == "__main__":
    DataInterface.get_serverinfo()