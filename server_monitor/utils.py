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


def to_dict(this):
    dict = this.__dict__
    if "_sa_instance_state" in dict:
        del dict["_sa_instance_state"]
    return dict

def get_min_in_list(list):
    min = None
    min_index = 0
    for index,value in enumerate(list):
        #print(index,value)
        if min is None:
            min = value
        else:
            if min > value:
                min = value
                min_index = index
    return min_index,min

def get_request_origin_top10(origin_hashmap,tag):
    list_top10 = []
    position = 0
    min_value = None
    min_position = None
    value_list = []
    if len(origin_hashmap) <= 10:
        for key, value in origin_hashmap.items():
            list_top10.append({tag: key, 'count': origin_hashmap[key]})
        return list_top10
    for key, value in origin_hashmap.items():
        if min_value is not None:
            if min_value > value and len(list_top10) < 4:
                min_value = value
                min_position = position
            else:
                if min_value < value and len(list_top10) == 4:
                    list_top10.pop(min_position)
                    value_list.pop(min_position)
                    min_position, min_value = get_min_in_list(value_list)
        else:
            min_value = value
            min_position = position
        if len(list_top10) < 4:
            list_top10.append({tag: key, 'count': origin_hashmap[key]})
            value_list.append(value)
            position = position + 1
    print(min_value)
    print(min_position)
    print(list_top10)
    return list_top10