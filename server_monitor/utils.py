# coding=utf-8


def calcul_cpu_mem(list):
    cpu_info = 0
    mem_info = 0
    for i in range(len(list)):
        if i % 2 == 0:
            cpu_info += float(list[i])
        else:
            mem_info += float(list[i])
    return [cpu_info,mem_info]
