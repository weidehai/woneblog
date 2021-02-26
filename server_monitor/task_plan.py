# coding=utf-8
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor, ProcessPoolExecutor
from server_monitor.get_info import SeverMonitor as task
scheduler = BackgroundScheduler()

'''
计划任务放到数据库中（每个任务有唯一的id），若服务器中断，重启的时候需要判断，若任务存在，则不再加入任务
'''


jobstores = {
    'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite')
}
executors = {
    'default': ThreadPoolExecutor(20),
    'processpool': ProcessPoolExecutor(4)
}
job_defaults = {
    'coalesce': False,
    'max_instances': 3
}

jobs = [{"task":task.get_requests,"id":'job_get_requests'},{"task":task.get_flows,"id":"job_get_flows"}]
def do_plan_task():
    scheduler = BackgroundScheduler(jobstores=jobstores, executors=executors, job_defaults=job_defaults)
    scheduler.start()
    for job in jobs:
        try:
            #scheduler.add_job(job["task"],id=job['id'],trigger="cron", replace_existing=True, minute=59, second=0 ,misfire_grace_time=58)
            scheduler.add_job(job["task"], id=job['id'], trigger="cron", replace_existing=True, second="*/59",
                              misfire_grace_time=58)
            #https://apscheduler.readthedocs.io/en/latest/modules/triggers/cron.html#module-apscheduler.triggers.cron
            #触发条件，分钟59秒钟00，也就是每个小时结束前一分钟
            #misfire_grace_time设置任务错过执行后，下次有机会执行时的超时时间
            #比如，在整点也就是每小时的0分0秒执行，但是若在此时刻因某种原因没有被执行，那么在60s内如果有机会执行就会执行，超过了60s则就算有机会执行也不执行
        except Exception:
            print("error to add")
            continue
    print(jobstores['default'].get_all_jobs())
    print("plan task start.....")



