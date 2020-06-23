class A:
    def __init__(self,obj):
        self.obj = obj

    def log(self):
        print(self.obj)

myobj = [1,2,3]
a = A(myobj)
myobj.append(4)
a.log()