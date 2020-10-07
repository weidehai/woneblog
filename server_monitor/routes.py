# coding=utf-8
import server_monitor.task_plan as task_plan
from server_monitor.data_interface import DataInterface
from flask import json, request

class Monitor:
    def __init__(self, app):
        self.app = app
        self.__AddGetServerinfo__()
        self.__AddGetRequests__()
        self.__AddGetFlows__()
        task_plan.do_plan_task()

    def __AddGetServerinfo__(self):
        @self.app.route('/getserverinfo')
        def get_serverinfo():
            return DataInterface.get_serverinfo()

    def __AddGetRequests__(self):
        @self.app.route('/get_requests')
        def get_requests():
            get_time = request.args.get("get_time")
            return json.jsonify(DataInterface.get_requests(get_time))

    def __AddGetFlows__(self):
        @self.app.route('/get_flows')
        def get_flows():
            return DataInterface.get_serverinfo()




