# coding=utf-8
'''
测试sqlachemy框架一个连接的会话在多个线程下query和commit同时使用的情况
sqlachemy底层以来于pymysql，pymysql的线程安全等级为1，就是不能在多个线程共享一个connection
https://www.python.org/dev/peps/pep-0249/#connection-methods
'''

import sqlalchemy
import threading
import time
from server_monitor.config import LOCK
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, desc
from sqlalchemy.orm import sessionmaker
Base = declarative_base()


engine = sqlalchemy.create_engine("mysql+pymysql://root:weidehai123@localhost/server-monitor")
Session = sessionmaker(bind=engine)
session = Session()

class Test(Base):
    __tablename__ = 'test'
    id = Column(Integer, primary_key=True)
    value = Column(String(2))

class Multitask:
    @staticmethod
    def task1():
        LOCK.acquire()
        session.add(Test(value="12"))
        session.commit()
        LOCK.release()
        time.sleep(3)
        print("end")
    @staticmethod
    def task2():
        LOCK.acquire()
        test = session.query(Test).order_by(desc(Test.id)).first()
        LOCK.release()
        print(test.value)


if __name__ == '__main__':
    Base.metadata.create_all(engine)
    task1 = threading.Thread(target=Multitask.task1)
    task2 = threading.Thread(target=Multitask.task2)
    task1.start()
    task2.start()


