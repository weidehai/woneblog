# coding=utf-8
import server_monitor.task_plan as task_plan
from server_monitor.data_interface import DataInterface
from server_monitor.get_info import SeverMonitor


class Monitor:
    def __init__(self, app):
        self.app = app
        self.__AddGetServerinfo__()
        self.__AddGetRequests__()
        self.__AddGetRequests__()
        task_plan.do_plan_task()

    def __AddGetServerinfo__(self):
        @self.app.route('/get_serverinfo')
        def get_serverinfo():
            return DataInterface.get_serverinfo()

    def __AddGetRequests__(self):
        @self.app.route('/get_serverinfo')
        def get_request():
            return DataInterface.get_serverinfo()

    def __AddGetFlows__(self):
        @self.app.route('/get_serverinfo')
        def get_flows():
            return DataInterface.get_serverinfo()




