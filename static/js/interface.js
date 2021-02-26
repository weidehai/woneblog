var Interface = {
    /*
    params={
        query_params:{
            table:string,
            fields:string,
            where:string,
        }
        request_params:{
			url:string
            method:string,
            async:boolean,
            header:{key:value}
			send_data:data:auto,
			monitor_progress:boolean
        }
        callback:{
            success:function,
            fail:function
        }
    }
    */
    index_recently: function(params) {
		var url = `/index/recently`
        MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
	},
    get_apart: function(params) {
		var url = `/getapart?table=${params.query_params.table}&fields=${params.query_params.fields}&order=${params.query_params.order}&offset=${params.query_params.offset}&num=${params.query_params.num}`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
	},
	//data: object(key:value)---required:table,post_key
	data_update: function(params) {
		var url = `/update`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
		//xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
	},
	//data: object(key:value)
	data_save: function(params) {
		var url = `/save?type=${params.query_params.type}&exists=${params.query_params.exists}`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
		//xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
	},
	file_upload: function(params) {
		var url = `/upload?type=${params.query_params.type}&dir=${params.query_params.dir}`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
	},
	file_del:function(params){
		var url = `/deletefile?type=${params.query_params.type}`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
		//xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
	},
	data_del: function(params) {
		var url = `/delbyid?table=${params.query_params.table}&id=${params.query_params.id}`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
	},
	user_verify: function(params){
		var url = `verify`
		MyAjax.do_ajax(url,params.request_params.method,params.request_params.async,params.send_data,params.callback)
	},
}

	
// 	XHRPost:function(data,post_key){
// 		//回调太多，用promise来解决地狱回调
// 		//20201210 先存入数据库在复制文件
// 		//将文件先放在temp中，真正提交的时候在复制过去，避免unload方法不生效或者网络不好时文件没删除干净
// 		new Promise((resolve,reject)=>{
// 			//删除多余的文件
// 			Publish.diff_file(data.article_content,(result)=>{resolve(result)})
// 		}).then(()=>{
// 			//判断文章是否存在
// 			if(Publish.tableinfo.svae_to != Publish.tableinfo.current_table){
// 				let p = new Promise((resolve,reject)=>{
// 					let XHRJudgeArticleExistOrNot = `/existornot?post_key=${post_key}&table=${data.table}`
// 					Interactive.XHRCommon(XHRJudgeArticleExistOrNot,null,null,"get",(result)=>{
// 						if(result !== "0000"){
// 							if(!window.confirm("文章已存在，确定覆盖吗？")) return reject()
// 							resolve(true)
// 						}else{
// 							resolve(false)
// 						}
// 					})
// 				})
// 			}
// 			return p
// 		}).then(()=>{
// 			for (let file of Editor.file.filelist){
// 				if(data.table=="articles"){
// 					data.article_content = data.article_content.replace(file,file.replace("draft","upload"))
// 					data.article_content = data.article_content.replace(file,file.replace('temporary',"upload"))
// 				}else{
// 					data.article_content = data.article_content.replace(file,file.replace("upload","draft"))
// 					data.article_content = data.article_content.replace(file,file.replace("temporary","draft"))
// 				}	
// 			}
// 			if(Editor.tabletransfer){
// 				//存入数据库
// 				let p = new Promise((resolve,reject)=>{
// 					Interactive.XHRSave(data,'post',exists,function(result){
// 						console.log(result)
// 						resolve(result)
// 					})
// 				})
// 				return p
// 			}else{
// 				if(data.table=="articles"){
// 					delete data.article_time
// 					delete data.article_read
// 					let p = new Promise((resolve,reject)=>{
// 						Interactive.XHRUpdate(data,function(result){
// 							resolve()
// 						})
// 					})
// 					return p
// 				}else{
// 					let p = new Promise((resolve,reject)=>{
// 						Interactive.XHRUpdate(data,function(result){
// 							resolve()
// 						})
// 					})
// 					return p
// 				}
// 			}
// 		}).then(()=>{
// 			//文件复制
// 			let dir = post_key
// 			let copy_to = data.table=="articles"?"upload":"draft"
// 			let copy_from = data.table=="articles"?"draft":"upload"
// 			let p = new Promise((resolve,reject)=>{
// 				if(Editor.file.filelist.length !== 0){
// 					Editor.file.copy_file_to(()=>{
// 						if(Editor.draft){
// 							Editor.file.copy_file_to(()=>{
// 								resolve()
// 							},dir,copy_from,copy_to)
// 						}else{
// 							resolve()	
// 						}
// 					},dir,"temporary",copy_to)
// 				}else{
// 					resolve()
// 				}
// 			})
// 			return p
// 		}).then(()=>{
// 			if(Editor.tabletransfer){
// 				//文件删除
// 				let p = new Promise((resolve,reject)=>{
// 					if(Editor.file.filelist.length !== 0){
// 						Interactive.XHRDelFile(JSON.stringify({filelist:`static\\temporary\\${data.post_key}`}),"dir",()=>{
// 							if(data.table=="articles"){
// 								Interactive.XHRDelFile(JSON.stringify({filelist:`static\\draft\\${data.post_key}`}),"dir",()=>{
// 									Interactive.XHRDel("drafts",post_key,()=>{
// 										window.location.href = `/articledetails?id=${post_key}`
// 									})
// 								})	
// 							}else{
// 								Interactive.XHRDel("drafts",post_key,()=>{
// 									window.location.href = `/articledetails?id=${post_key}`
// 								})
// 							}
// 						})	
// 					}
// 				})
// 			}else{
// 				window.location.href = `/articledetails?id=${post_key}`
// 			}
// 		}).catch(()=>{
// 			alert("Ops!Something Error😅\nPlease try again")
// 		})	
// 	}
// }
