# coding=utf-8
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine = sqlalchemy.create_engine("mysql+pymysql://xxxxxx:xxx@localhost/server_monitor")
Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()
class ServerInfo(Base):
    __tablename__ = 'server_info'
    id = Column(Integer, primary_key=True)
    os = Column(String(50))
    mem_info = Column(Integer)
    cpu_info = Column(Integer)
    #server_version = Column(String(50))

    def to_dict(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        return dict

class Flows(Base):
    __tablename__ = 'flows'
    id = Column(Integer, primary_key=True)
    time = Column(String(15))
    flow = Column(Integer)

class Requests(Base):
    __tablename__ = 'requests'
    id = Column(Integer, primary_key=True)
    time = Column(String(15))
    requests = Column(Integer)
    count = Column(Integer)

if __name__ == '__main__':
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

