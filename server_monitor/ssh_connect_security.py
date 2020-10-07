# coding=utf-8
#本地测试连接到ssh，部署到服务器不需要

import paramiko
from server_monitor.config import DEV
import os
class SSH:
    def __init__(self,server_ip,user,pw):
        if DEV:
            try:
                client = paramiko.SSHClient()
                client.set_missing_host_key_policy(paramiko.AutoAddPolicy)
                self.client = client
                self.client.connect(server_ip,22,username=user,password=pw,timeout=4)
            except Exception as e:
                print(e)
            #print(f'连接远程linux服务器(ip:{server_ip})发生异常!请检查用户名和密码是否正确!')

    def exe_cmd(self, cmd):
        if DEV:
            try:
                stdin, stdout, stderr = self.client.exec_command(cmd)
                content = stdout.read().decode('utf-8')
                err_info = stderr.read().decode('utf-8')
                if content:
                    #print("content %s" % content)
                    return content
                if err_info:
                    #print("err %s" % err_info)
                    return err_info
            except Exception as e:
                print('link_server-->返回命令发生异常,内容:', e)
        else:
            return os.popen(cmd).read()


