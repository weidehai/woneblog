//ajax接口
var MyAjax = {
    __creat_xhr: function() {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXobject) {
            try {
                xhr = new ActiveXobject("Microsoft.XMLHTTP");
            } catch {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            }
        } else {
            alert("您的浏览器不支持ajax！！！请更换浏览器")
        }
        return xhr
    },
    /*
	request_info:{
        url:string
        method:string,
        async:boolean,
        header:{key:value}
    	send_data:data:auto,
    	monitor_progress:boolean
    }*/
    do_ajax: function(request_info, cb) {
        var xhr = MyAjax.__creat_xhr()
        xhr.open(request_info.method, request_info.url, request_info.async);
        if (Object.prototype.toString.call(request_info.header) == "[object Object]") {
            for (let header_name in request_info.header) {
                xhr.setRequestHeader(header_name, request_info.header[header_name])
            }
        }
        if (request_info.send_data && typeof request_info.send_data != "string") {
            xhr.send(JSON.stringify(request_info.send_data))
        } else {
            xhr.send(request_info.send_data)
        }
        xhr.onload = function() {
            if (this.status == 200) {
                var result = this.responseText
                if (cb && typeof cb.success == "function") {
                    cb.success(result)
                }
                return
            }
            if (cb && typeof cb.fail == "function") {
                cb.fail(this.status)
            }
        }
        xhr.onerror = function() {
            if (cb && typeof cb.fail == "function") {
                cb.fail("network error")
            }
        }
        if (request_info.monitor_progress) {
            xhr.upload.onprogress = function(e) {
                if (cb && typeof cb.onprogress == "function") {
                    cb.onprogress(e)
                }
                //console.log(e.loaded,e.total)
            }
        }
    }
}