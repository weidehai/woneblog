class Observer:
    def add(self, observer):
        self.observerlist.append(observer)

    def delete(self, observer):
        self.observerliset.pop(observer)


class UpdateObserver(Observer):
    def __init__(self, observerlist=[]):
        self.observerlist = observerlist


updateob = UpdateObserver()
