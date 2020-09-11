# coding=utf-8
import urllib.request
import platform
import server_monitor.config as config
import server_monitor.utils as utils
import re
import time
import os
import threading
from server_monitor.database import session,ServerInfo,Flows,Requests



if config.DEV:
    from server_monitor.ssh_connect import monitor


class SeverMonitor:
    def __init__(self):
        pass

    @staticmethod
    def get_requests():
        try:
            r = urllib.request.urlopen("https://www.haiblog.cn/myblog_status")
        except urllib.error.URLError:
            print("network error")
            return
        now_time = time.localtime()
        will_get_time = time.strftime("%Y-%m-%d ", now_time) + str(time.localtime().tm_hour).zfill(2)
        total_requests = re.findall(r"requests\n\s*?\d+?\s\d+?\s(\d+)", r.read().decode('utf-8'))[0]
        try:
            last = session.query(Requests).order_by(Requests.id.desc()).first()
        except Exception:
            last = False
        if last:
            requests = int(total_requests) - int(last.count)
        else:
            requests = int(total_requests)
        print(requests)
        #multi thread should add lock
        config.LOCK.acquire()
        session.add(Requests(time=will_get_time,requests=requests,count=int(total_requests)))
        #减一是因为脚本去获取的时候会产出一次访问
        session.commit()
        config.LOCK.release()

    @staticmethod
    def get_flows():
        #nginx的日志中有流量信息，需要取读取nginx日志文件，然后把流量信息和时间截取出来即可
        #每一个小时取一次，比如3点钟就取2-3点的数据，然后以日期--流量的形式存入数据库
        #nginx安装后会自动添加一个定时器脚本，每天会把前一天的日志打包为另一个文件并清空日志重新记录 /etc/logotate /etc/crontab
        now_time = time.localtime()
        will_get_time = time.strftime("%Y-%m-%dT",now_time) + str(time.localtime().tm_hour).zfill(2)
        #如果时在下一个小时的00：00处理，会发生跨天，跨年等情况，所以改为当前小时的59分处理
        total_flow: int = 0
        print(will_get_time)
        try:
            if config.DEV:
                nginx_log = re.findall(r'(\d{4}-\d{2}-\d{2}T\d{2}).+?HTTP/.+?\s+?(\d+)',monitor.exe_cmd("cat /var/log/nginx/access.log | grep %s" % will_get_time), re.M)
            else:
                nginx_log = re.findall(r'(\d{4}-\d{2}-\d{2}T\d{2}).+?HTTP/.+?\s+?(\d+)',os.popen("cat /var/log/nginx/access.log | grep %s" % will_get_time).read(), re.M)
            for item in nginx_log:
                total_flow += int(item[1])
            config.LOCK.acquire()
            session.add(Flows(time=will_get_time, flow=total_flow))
            session.commit()
            config.LOCK.release()
        except Exception:
            pass

    @staticmethod
    def get_serverinfo():
        #调用api即可
        #print(platform.processor())#计算机处理器信息
        if config.DEV:
            #获取系统发行版本
            server_v = monitor.exe_cmd('cat /etc/issue').replace('\\n \\l',"").strip()
            #获取nginx服务器版本
            nginx_v = monitor.exe_cmd('nginx -v')
            #获取系统cpu型号
            cpu_info = re.match(r'model\s*?name\s*?:\s*?(.+)', monitor.exe_cmd("cat /proc/cpuinfo | awk 'NR==5 || NR==13 || NR== 23'")).group(1).strip()
            #获取总内存
            mem_info = re.match(r'MemTotal\s*?:\s*?(\d*?\s*?kb)', monitor.exe_cmd("cat /proc/meminfo | awk 'NR==1'"), re.I).group(1).strip()
            #查看当前登陆用户
            who_login = monitor.exe_cmd("who | awk -F ' ' '{print $1}'").replace("\n",",").rstrip(",").split(",")
            print(cpu_info,mem_info,server_v,nginx_v,who_login)
            return
        config.LOCK.acquire()
        session.add(ServerInfo(os=server_v,cpu_info=cpu_info,mem_info=mem_info))
        session.commit()
        config.LOCK.release()
        return  {
            "cpu_info": cpu_info,
            "cpu_info": cpu_info,
            "cpu_info": cpu_info,
            "cpu_info": cpu_info,
            "cpu_info": cpu_info,
        }

    @staticmethod
    def get_web_application_info():
        if config.DEV:
            nginx_mem_cpu = monitor.exe_cmd(
                'ps -aux | grep nginx | grep -v grep | awk -F" " ' + "'{print$3,$4}'").replace("\n", " ")
            print(nginx_mem_cpu.rstrip().split(" "))
            print(utils.calcul_cpu_mem(nginx_mem_cpu.rstrip().split(" ")))

    @staticmethod
    def get_request_origin():
        #统计一个小时内的访问次数前十的来源，存入数据库，然后根据这些数据也可以得到历史最高访问次数来源
        pass


if __name__ == "__main__":
    pass
    #SeverMonitor.get_flows()
    #SeverMonitor.get_requests()
    SeverMonitor.get_serverinfo()

