# coding=utf-8
import urllib.request
import server_monitor.config as config
import server_monitor.utils as utils
import re
import time
import math
from server_monitor.database import ServerInfo,Flows,Requests,session_scope
from server_monitor.ssh_connect import monitor
import globalv

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
        time_day = time.strftime("%Y-%m-%d", now_time)
        time_hour = time.localtime().tm_hour
        time_hour_range = "%s~%s" % (str(time_hour).zfill(2), str(time_hour+1).zfill(2))
        total_requests = int(re.findall(r"requests\n\s*?\d+?\s\d+?\s(\d+)", r.read().decode('utf-8'))[0])
        config.LOCK.acquire()
        # multi thread should add lock
        print("get_requests get lock.............................................................")
        with session_scope() as session:
            try:
                if globalv.LAST_REQUESTS_COUNT == -1:
                    globalv.LAST_REQUESTS_COUNT= int(session.query(Requests).order_by(Requests.id.desc()).first().count)
                previous_count = int(session.query(Requests).order_by(Requests.id.desc()).first().count)
            except Exception:
                globalv.LAST_REQUESTS_COUNT = 0
                previous_count = 0
            total_requests = total_requests + globalv.LAST_REQUESTS_COUNT
            requests = total_requests - previous_count
            print(requests)
            try:
                session.add(Requests(time_day=time_day,time_hour=time_hour_range,requests=requests,count=total_requests))
                #减一是因为脚本去获取的时候会产出一次访问
                session.commit()
                print("requests write success:"+time_hour_range)
            except Exception:
                #session.rollback()
                print("transaction error")
            config.LOCK.release()
            print("get_requests release lock")

    @staticmethod
    def get_flows():
        #nginx的日志中有流量信息，需要取读取nginx日志文件，然后把流量信息和时间截取出来即可
        #每一个小时取一次，比如3点钟就取2-3点的数据，然后以日期--流量的形式存入数据库
        #nginx安装后会自动添加一个定时器脚本，每天会把前一天的日志打包为另一个文件并清空日志重新记录 /etc/logotate /etc/crontab
        now_time = time.localtime()
        time_day = time.strftime("%Y-%m-%d", now_time)
        time_hour = time.localtime().tm_hour
        time_hour_range = "%s~%s" % (str(time_hour).zfill(2), str(time_hour + 1).zfill(2))
        will_get_time = "%sT%s" % (time_day,str(time_hour).zfill(2))
        #如果时在下一个小时的00：00处理，会发生跨天，跨年等情况，所以改为当前小时的59分处理
        total_flow: int = 0
        print(will_get_time)
        try:
            nginx_log = re.findall(r'(\d{4}-\d{2}-\d{2}T\d{2}).+?HTTP/.+?\s+?(\d+)',monitor.exe_cmd("cat /var/log/nginx/access.log | grep %s" % will_get_time), re.M)
            print(nginx_log)
            for item in nginx_log:
                total_flow += int(item[1])
            print(total_flow)
            config.LOCK.acquire()
            print("get_flows get lock")
            with session_scope() as session:
                try:
                    session.add(Flows(time_day=time_day,time_hour=time_hour_range, flow=total_flow))
                    session.commit()
                    print("flows write success:"+will_get_time)
                except Exception:
                    '''
                    The flush process of the Session, described at Flushing, will roll back the model transaction if an error is encountered, in order to maintain internal consistency. However, once this occurs, 
                    the session’s transaction is now “inactive” and must be explicitly rolled back by the calling application, 
                    in the same way that it would otherwise need to be explicitly committed if a failure had not occurred.
                    '''
                    #session.rollback()
                    print("transaction error")
        except Exception as e:
            print("something wrong")
            pass
        finally:
            config.LOCK.release()
            print("get_flows release lock")

    @staticmethod
    def get_serverinfo():
        #调用api即可
        #print(platform.processor())#计算机处理器信息
        #获取系统发行版本
        server_v = monitor.exe_cmd('cat /etc/issue').replace('\\n \\l',"").strip()
        #获取nginx服务器版本
        nginx_v = "1.18.0"
        #获取系统cpu型号
        try:
            cpuinfo_list = re.findall(r'vendor_id\s*:\s*(.+)\ncpu\s*MHz\s*:\s*(.+)\ncpu\s*cores\s*:\s*(.+)\nclflush\s*size\s*:\s*(.+)',
                           monitor.exe_cmd("cat /proc/cpuinfo | awk 'NR==2 || NR==8 || NR==13 || NR== 23'"))[0]

            #Intel_cpu(64)_cores(1)@2.50GHz
            cpu_info = "%s_cpu(%s)_cores(%s)@%sGHz" % (cpuinfo_list[0],cpuinfo_list[3],cpuinfo_list[2],math.ceil(float(cpuinfo_list[1]))/1000)
        except Exception:
            cpu_info = "找不到cpu信息"
        #获取总内存
        try:
            mem_info = round(int(re.match(r'MemTotal\s*:\s*(\d*)\s*kb', monitor.exe_cmd("cat /proc/meminfo | awk 'NR==1'"), re.I).group(1).strip())/math.pow(1024,2),2)
        except Exception:
            mem_info = "找不到内存信息"
        #查看当前登陆用户
        print(cpu_info,mem_info,nginx_v,server_v)
        config.LOCK.acquire()
        with session_scope() as session:
            try:
                session.add(ServerInfo(os=server_v,cpu_info=cpu_info,mem_info=mem_info,nginx_info=nginx_v))
                session.commit()
            except Exception:
                #session.rollback()
                print("transaction error")
            config.LOCK.release()
        return {"server_v": server_v,"nginx_v": nginx_v,"cpu_info": cpu_info,"mem_info": mem_info}

    @staticmethod
    def get_web_application_info():
        nginx_mem_cpu = monitor.exe_cmd(
            'ps -aux | grep nginx | grep -v grep | awk -F" " ' + "'{print$3,$4}'").replace("\n", " ")
        print(nginx_mem_cpu.rstrip().split(" "))
        print(utils.calcul_cpu_mem(nginx_mem_cpu.rstrip().split(" ")))

    @staticmethod
    def get_request_origin():
        #统计一个小时内的访问次数前十的来源，存入数据库，然后根据这些数据也可以得到历史最高访问次数来源
        now_time = time.localtime()
        will_get_time = time.strftime("%Y-%m-%dT", now_time) + str(time.localtime().tm_hour).zfill(2)
        #will_get_time = '2020-10-12T15'
        print(will_get_time)
        #?:---不获取匹配，这样就少一个分组
        #?=---- lookahead assertion (?!)
        #?<=----positive lookbehind assertion  (?<!)
        try:
            request_origins = re.findall(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*?HTTP/.*?((?:http|https)://.+)', monitor.exe_cmd("cat /var/log/nginx/access.log | grep %s" % will_get_time))
        except Exception:
            print("no data")
            return False
        print(request_origins)
        if len(request_origins) <= 0:
            print("no data")
            return False
        hash_ip={}
        hash_url={}
        for i,j in request_origins:
            #print(hash_ip.get(i))
            if not hash_ip.get(i):
                hash_ip[i] = 1
            else:
                hash_ip[i] = hash_ip[i]+1
            if not hash_url.get(j):
                hash_url[j] = 1
            else:
                hash_url[j] = hash_url[j] + 1
        print(hash_ip)
        print(hash_url)
        #hash_ip = {'8.210.238.20': 4,'8.210.238.21': 7,'8.210.238.22': 6,'8.210.238.23': 30,'8.210.238.222': 2,'8.210.238.24': 20,'8.210.238.25': 19,'8.210.238.241': 6,'8.210.238.251': 5,'8.210.238.242': 1,'8.210.238.252': 90}
        listtop10_ip = utils.get_request_origin_top10(hash_ip,"ip")
        listtop10_url = utils.get_request_origin_top10(hash_url,"url")
        print(listtop10_ip)
        print(listtop10_url)
        return {"listtop10_ip":listtop10_ip,"listtop10_url":listtop10_url}
        #print(hash_url)


if __name__ == "__main__":
    pass
    #SeverMonitor.get_flows()
    #SeverMonitor.get_requests()
    #SeverMonitor.get_request_origin()
    print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx222222222")
    SeverMonitor.get_request_origin()

