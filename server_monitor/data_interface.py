# coding=utf-8
from server_monitor.database import session
from server_monitor.get_info import SeverMonitor

class DataInterface:
    @staticmethod
    def get_serverinfo():
        result = session.query()
        if result:
            return result
        return SeverMonitor.get_serverinfo()