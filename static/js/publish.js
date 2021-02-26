get_filelist:function(content){
		let find_file = /(\.?(\\|\/)?static(\\|\/)(upload|draft)(\\|\/)\S+?)(?=">)/g
		Editor.file.filelist = content.match(find_file) || []
		console.log(Editor.file.filelist)
	},
	copy_file_to:function(cb,dir,from_dir,to_dir){
		let xhr = Interactive.creatXHR()
		xhr.open("post","/copyfile",true)
		xhr.onreadystatechange = function(){
			if (xhr.readyState===4 && xhr.status===200) {
				if (xhr.responseText==="copy success" || xhr.responseText==="src not found" || xhr.responseText==="empty src") {
					if(cb) cb(xhr.responseText)
				}
			}
		}
		xhr.send(JSON.stringify({dir,from_dir,to_dir}))
	},
	diff_file:function(content,cb){
		if (Editor.file.filelist===null || Editor.file.filelist.length === 0) return cb?cb("do nothing"):void 0
		for(let index in Editor.file.filelist){
			console.log(content.indexOf(Editor.file.filelist[index]))
			if (content.indexOf(Editor.file.filelist[index]) === -1) {
				Editor.file.deleted_filelist.push(Editor.file.filelist[index])
				Editor.file.filelist.splice(index,1)
			}
		}
		if (Editor.file.deleted_filelist.length !== 0 && Editor.submited) {
			Interactive.XHRDelFile(JSON.stringify({filelist:Editor.file.deleted_filelist}),'file',cb)
		}else{
			return cb?cb("do nothing"):void 0
		}
	}


register_submit:function(where=false){
		submitbt.addEventListener('click',function(){
			let data = Editor.get_content()
			let post_key = data["post_key"]
			Editor.submited = true
			Editor.tabletransfer = Editor.draft || Editor.newone ? true : false
			Interactive.XHRPost(data,post_key)
		})
		draft.addEventListener('click',function(){
			let data = Editor.get_content()
			let post_key = data["post_key"]
			delete data.text_for_search
			delete data.article_read
			delete data.update_time
			data.table = "drafts"
			Editor.submited = true
			tabletransfer = !Editor.draft ? true : false
			Interactive.XHRPost(data,post_key)
			if (Editor.draft) {
				new Promise((resolve,reject)=>{
					//删除多余的文件
					Editor.file.diff_file(data.article_content,(result)=>{resolve(result)})
				}).then(()=>{
					let p = new Promise((resolve,reject)=>{
						if(!Editor.newone){
							let XHRJudgeArticleExistOrNot = `/existornot?post_key=${post_key}&table=${data.table}`
							Interactive.XHRCommon(XHRJudgeArticleExistOrNot,null,null,"get",(result)=>{
								if(result !== "0000"){
									if(!window.confirm("草稿已存在，确定覆盖吗？")) return reject()
									resolve(true)
								}else{
									resolve(false)	
								}
							})
						}else{
							resolve(false)
						}
					})
					return p
				}).then(()=>{
					//将文件从upload替换到draft
					for (let file of Editor.file.filelist){
						data.article_content = data.article_content.replace(file,file.replace("upload","draft"))
						data.article_content = data.article_content.replace(file,file.replace("temporary","draft"))
					}
					let p = new Promise((resolve,reject)=>{
						Interactive.XHRUpdate(data,function(result){
							alert("草稿保存成功!!")
							resolve()
						})	
					})
					return p
				}).then(()=>{
					let dir = post_key
					if (Editor.file.new_filelist.length !== 0) {
						Editor.file.copy_file_to(null,dir,"temporary","draft")
					}
				}).catch(()=>{
					alert("Ops!Something Error😅")
				})
			}
			if (!Editor.draft) {
				new Promise((resolve,reject)=>{
					//删除多余的文件
					Editor.file.diff_file(data.article_content,(result)=>{resolve(result)})
				}).then((result)=>{
					for (let file of Editor.file.filelist){
						data.article_content = data.article_content.replace(file,file.replace("upload","draft"))
						data.article_content = data.article_content.replace(file,file.replace("temporary","draft"))
					}
					//判断文章是否存在
					let p = new Promise((resolve,reject)=>{
						if(!Editor.newone){
							let XHRJudgeArticleExistOrNot = `/existornot?post_key=${post_key}&table=${data.table}`
							Interactive.XHRCommon(XHRJudgeArticleExistOrNot,null,null,"get",(result)=>{
								if(result !== "0000"){
									if(!window.confirm("草稿已存在，确定覆盖吗？")) return reject()
									resolve(true)
								}else{
									resolve(false)	
								}
							})
						}else{
							resolve(false)
						}
						
					})
					return p
				}).then((exists)=>{
					let p = new Promise((resolve,reject)=>{
						Interactive.XHRSave(data,'post',exists,function(result){
							alert("草稿保存成功!!")
							resolve()
						})
					})
					return p
				}).then(()=>{
					if (Editor.file.filelist.length !== 0) {
						let dir = post_key
						Editor.file.copy_file_to(null,dir,"upload","draft")
						Editor.file.copy_file_to(null,dir,"temporary","draft")	
					}
				}).catch(()=>{
					alert("Ops!Something Error😅")
				})
			}
		})
	},
  
  
  
  get_content: function() {
		var title = document.getElementById('title')
		var data = {
			"article_title":title.value,
			"article_content":Editor.editor.innerHTML,
			"article_tag":Editor.article_tag,
			"article_time":dateFormat('YYYY-MM-DD'),	
			"update_time":dateFormat('YYYY-MM-DD'),
			"post_key": Editor.post_key,
			"text_for_search": Editor.editor.innerText,
			"article_read":'0',
			"table":'articles'
		}
		return data;
	},
  
  
  
  
  lock:function(){
		Editor.title.disabled = "disabled"
		Editor.tags.disabled = "disabled"
		Editor.editor.setAttribute("contenteditable","false")
	},
	unlock:function(){
		Editor.title.disabled = ""
		Editor.tags.disabled = ""
		Editor.editor.setAttribute("contenteditable","true")
	},
	generate_post_key:function(){
		//生成post_key
		//取0-1之间的随机小数的2，3，4个字符加上当前时间戳
		return Math.random().toString().substring(2,5)+Date.now()
	}
  
  
  
  Editor.loadingUI = {
	suspension:document.getElementsByClassName('suspension')[0],
	loading:document.getElementsByClassName('myloading_1')[0],
	display:function(){
		this.suspension.style.display = 'block'
		this.loading.style.display = 'block'
	},
	hide:function(){
		this.suspension.style.display = 'none'
		this.loading.style.display = 'none'
	}
}


var Editor = {
	
	title:document.getElementById('title'),
	tags:document.getElementById('tags'),
	submited:false,
}



tags.addEventListener("change",function(){
			Editor.article_tag = this.options[this.options.selectedIndex].value
			console.log(Editor.article_tag)
		})


if (Editor.newone) {
			Editor.register_submit()
		}else if (Editor.draft) {
			var draft_where = window.location.search.replace('?draftid=','')
			Editor.register_submit(draft_where)
		}else{
			var post_where = window.location.search.replace('?getid=','')
			Editor.register_submit(post_where)
		}







Publish.tableinfo = {
	current_table:null,
	save_to:null,
	post_key:null,
	article_tag:"Javascript",
	article_title:null,
	init_table_info:function(){
		//判断新建，修改
		if (window.location.search.indexOf("?draftid=") !== -1) {
			Editor.tableinfo.current_table = "drafts"
			Editor.tableinfo.post_key =  window.location.search.replace("?draftid=","")
		}else if (window.location.search.indexOf("?getid=") !== -1) {
			Editor.tableinfo.current_table = "articles"
			Editor.tableinfo.post_key = window.location.search.replace("?getid=","")
		}
		if(Editor.tableinfo.current_table && Editor.tableinfo.post_key){
			get_table_content()
		}else{
			Editor.tableinfo.post_key = Editor.generate_post_key()
		}
	},
	get_table_content:function(){
		Editor.loadingUI.display()
		Interactive.XHRQuery(Editor.tableinfo.current_table,'article_title,article_tag,article_content',Editor.tableinfo.post_key,(result)=>{
			console.log(result)
			if(result.length==0 || !result) {
				Editor.loadingUI.hide()
				Editor.unlock()
				window.location.href = "/publish"
				return
			}
			Editor.editor.innerHTML = result[0]['article_content']
			Editor.file.get_filelist(result[0]['article_content'])
			Editor.title.setAttribute('value',result[0]['article_title'])
			Editor.tableinfo.article_tag = result[0]['article_tag']
			for (let i=Editor.tags.options.length-1;i>0;i--){
				if (Editor.tags.options[i].value===Editor.tableinfo.article_tag) {
					Editor.tags.options[i].selected = true
				}
			}
			Editor.loadingUI.hide()
			Editor.unlock()
		})
	}
}








window.onload = function() {
	Editor.ui.init()
  Editor.event.init()
  Editor.menus.init()
}
//--------------------------------页面卸载拦截--------------------------
window.onbeforeunload = function() {
	if (!Editor.submited) {
		return "离开此页面，这样您的内容将不会被保存"
	}
}

window.onpagehide = function(){
	if (Editor.newone) {
		if (!Editor.submited && Editor.file.filelist.length!==0) {
			//20201210未提交的文件保存在temp
			var dir = `static/temporary/${Editor.post_key}`
			navigator.sendBeacon("/deletefile?type=dir",JSON.stringify({filelist:dir}))
		}	
	}else{
		//如果不是新的文章，且没有提交，那么就删除新增的文件
		if (!Editor.submited && Editor.file.new_filelist.length!==0) {
			navigator.sendBeacon("/deletefile",JSON.stringify({filelist:Editor.file.new_filelist}))
		}	
	}
}
//--------------------------------------------------------------------
