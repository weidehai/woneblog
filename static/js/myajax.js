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
	XHRSave: function(data,type,exists=false,cb) {
		var xhr = Interactive.creatXHR()
		xhr.open('post',`/save?type=${type}&exists=${exists}`,true);
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
				if (r==='delete success' || r==="file not found") {
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
	},
	XHRCommon: function(url,data,header,method,success,fail){
		var xhr = Interactive.creatXHR()
		xhr.open(method,url,true);
		xhr.send(data)
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if(xhr.status===200){
					var str = xhr.responseText
					success?success(str):void 0
				}else{
					fail?fail():void 0
				}
			}
		}
	},
	XHRPost:function(data,post_key){
		//回调太多，用promise来解决地狱回调
		//20201210 先存入数据库在复制文件
		//将文件先放在temp中，真正提交的时候在复制过去，避免unload方法不生效或者网络不好时文件没删除干净
		new Promise((resolve,reject)=>{
			//删除多余的文件
			Editor.file.diff_file(data.article_content,(result)=>{resolve(result)})
		}).then(()=>{
			//判断文章是否存在
			if(Editor.tabletransfer){
				let p = new Promise((resolve,reject)=>{
					let XHRJudgeArticleExistOrNot = `/existornot?post_key=${post_key}&table=${data.table}`
					Interactive.XHRCommon(XHRJudgeArticleExistOrNot,null,null,"get",(result)=>{
						if(result !== "0000"){
							if(!window.confirm("文章已存在，确定覆盖吗？")) return reject()
							resolve(true)
						}else{
							resolve(false)
						}
					})
				})
				return p
			}else{
				return Promise.resolve()
			}
		}).then(()=>{
			for (let file of Editor.file.filelist){
				if(data.table=="articles"){
					data.article_content = data.article_content.replace(file,file.replace("draft","upload"))
					data.article_content = data.article_content.replace(file,file.replace('temporary',"upload"))
				}else{
					data.article_content = data.article_content.replace(file,file.replace("upload","draft"))
					data.article_content = data.article_content.replace(file,file.replace("temporary","draft"))
				}	
			}
			if(Editor.tabletransfer){
				//存入数据库
				let p = new Promise((resolve,reject)=>{
					Interactive.XHRSave(data,'post',exists,function(result){
						console.log(result)
						resolve(result)
					})
				})
				return p
			}else{
				if(data.table=="articles"){
					delete data.article_time
					delete data.article_read
					let p = new Promise((resolve,reject)=>{
						Interactive.XHRUpdate(data,function(result){
							resolve()
						})
					})
					return p
				}else{
					let p = new Promise((resolve,reject)=>{
						Interactive.XHRUpdate(data,function(result){
							resolve()
						})
					})
					return p
				}
			}
		}).then(()=>{
			//文件复制
			let dir = post_key
			let copy_to = data.table=="articles"?"upload":"draft"
			let copy_from = data.table=="articles"?"draft":"upload"
			let p = new Promise((resolve,reject)=>{
				if(Editor.file.filelist.length !== 0){
					Editor.file.copy_file_to(()=>{
						if(Editor.draft){
							Editor.file.copy_file_to(()=>{
								resolve()
							},dir,copy_from,copy_to)
						}else{
							resolve()	
						}
					},dir,"temporary",copy_to)
				}else{
					resolve()
				}
			})
			return p
		}).then(()=>{
			if(Editor.tabletransfer){
				//文件删除
				let p = new Promise((resolve,reject)=>{
					if(Editor.file.filelist.length !== 0){
						Interactive.XHRDelFile(JSON.stringify({filelist:`static\\temporary\\${data.post_key}`}),"dir",()=>{
							if(data.table=="articles"){
								Interactive.XHRDelFile(JSON.stringify({filelist:`static\\draft\\${data.post_key}`}),"dir",()=>{
									Interactive.XHRDel("drafts",post_key,()=>{
										window.location.href = `/articledetails?id=${post_key}`
									})
								})	
							}else{
								Interactive.XHRDel("drafts",post_key,()=>{
									window.location.href = `/articledetails?id=${post_key}`
								})
							}
						})	
					}
				})
			}else{
				window.location.href = `/articledetails?id=${post_key}`
			}
		}).catch(()=>{
			alert("Ops!Something Error😅\nPlease try again")
		})	
	}
}

