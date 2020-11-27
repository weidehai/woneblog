//ajax接口
var Interactive = {
	creatXHR: function() {
		var xhr = null;
		try {
			xhr = new XMLHttpRequest();
		}catch(e) {
			xhr = new ActiveXobject("Microsoft.XMLHTTP");
		};
		return xhr
	},
	XHRQuery: function(table,fields,where,cb) {
		var xhr = Interactive.creatXHR()
		var myurl = `/getone?where=${where}&fields=${fields}&table=${table}`
		xhr.open('get',myurl,true);
		xhr.send(null)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var str = xhr.responseText
				var obj = eval('(' + str + ')')
				cb(obj)
			}
		}
	},
	XHRApart: function(table,fields,order,offset,num,cb) {
		var xhr = Interactive.creatXHR()
		var myurl = `/getapart?table=${table}&fields=${fields}&order=${order}&offset=${offset}&num=${num}`
		xhr.open('get',myurl,true)
		xhr.send(null)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var str = xhr.responseText
				//console.log(str)
				var obj = eval('(' + str + ')')
				cb(obj)
			}
		}
	},
	//data: object(key:value)---required:table,post_key
	XHRUpdate: function(data,cb) {
		console.log(data)
		var xhr = Interactive.creatXHR()
		var data = JSON.stringify(data)
		xhr.open('post','/update',true);
		xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
		xhr.send(data)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var r = xhr.responseText
				if (r=='post success') {
					cb(r)
				}else{
					alert("操作失败！！！")
				}	
			}
		}
	},
	//data: object(key:value)
	XHRSave: function(data,type,judge=false,cb) {
		var xhr = Interactive.creatXHR()
		xhr.open('post',`/save?type=${type}&judge=${judge}`,true);
		xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
		var data = JSON.stringify(data)
		xhr.send(data)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var r = xhr.responseText
				if (r=='post success' || r=="update success") {
					cb(r)
				}else{
					alert("操作失败！！！")
				}
			}
		}
	},
	XHRUpload: function(file,type,dir,cb,progress=false,upload_success=false) {
		var xhr = Interactive.creatXHR()
		xhr.open('post',`/upload?type=${type}&dir=${dir}`,true);
		console.log("do upload...........")
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				result = xhr.responseText
				cb(result)
			}
		}
		if (progress) {
			xhr.upload.onprogress = function(e){
				progress(e)
				console.log(e.loaded,e.total)
			}
		}
		if (upload_success) {
			xhr.upload.onload = function(e){
				upload_success(e)
			}
		}
		xhr.send(file)
	},
	XHRDelFile:function(file,type="file",cb){
		var xhr = Interactive.creatXHR()
		xhr.open('post',`/deletefile?type=${type}`,true);
		xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
		xhr.send(file)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var r = xhr.responseText
				if (r==='delete success') {
					cb(r)
				}else{
					alert("操作失败！！！")
				}
			}
		}
	},
	XHRDel: function(table,id,cb) {
		var xhr = Interactive.creatXHR()
		xhr.open('get',`/delbyid?table=${table}&id=${id}`,true);
		xhr.send(null)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var r = xhr.responseText
				if (r==='delete success') {
					cb(r)
				}else{
					alert("操作失败！！！")
				}
			}
		}
	},
	XHRVerify: function(cb){
		var xhr = Interactive.creatXHR()
		xhr.open('get','/verify',true)
		xhr.send()
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4) {
				r = xhr.responseText
				cb(r)
			}
		}.bind(this)
	}
}

