/*
使用gif代替视频
现阶段只支持在本地先将视频转成gif在上传，以后会应用会支持视频转gif
*/

var Editor = {
	editor:document.getElementById('editor'),
	//初始化编辑框
	filelist:[],
	submited:false,
	article_tag:"Javascript",
	init: function() {
		//将编辑框的默认换行元素改为p
		document.execCommand("defaultParagraphSeparator", false, "p")
		//初始化
		if (!Editor.editor.innerText) {
			var p = document.createElement('p')
			var br = document.createElement('br')
			Editor.editor.appendChild(p)
			p.appendChild(br)
		}
		//控制keydown换行事件
		//为editor的鼠标和键盘事件注册处理函数
		Editor.editor.addEventListener('keydown',editorKeyControl.editorKeydown)
    	Editor.editor.addEventListener('focus',Editor.hideAllsusp)
    	Editor.editor.addEventListener('keyup',editorKeyControl.editorKeyup)
		Editor.editor.addEventListener("mouseup",Editor.updatePreStatus)
		Editor.editor.addEventListener("mousedown",editorCursor.saveRange)
		Editor.editor.addEventListener("input",editorCursor.saveRange)
		Editor.editor.addEventListener('blur',()=>{
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'none'
			editorCursor.saveRange
		})
		Editor.disableFocus()
		Editor.eventListen()
	},
	//当编辑框获取焦点时隐藏所有的悬浮窗口
	hideAllsusp: function() {
		var susp = document.getElementsByClassName('suspended')
		var length = susp.length
		for(var i=0;i<length;i++){
			susp[i].style.display = 'none'
			susp[i].setAttribute('data-show','false')
		}
	},
	//防止编辑器被删除为空
	prevent_editor_deltoempty: function(){
		//this表示触发这个事件的元素
		if (this.innerHTML=='') {
			this.innerHTML='<p><br></p>'
		}
	},
	disableFocus:function () {
		//阻止样式按钮的点击获取焦点事件
		var menus = document.getElementsByTagName('i')
		var video = document.getElementById("video")
		for (var k=0,len=menus.length;k<len;k++) {
			menus[k].addEventListener('mousedown',function(e){
				e.preventDefault()
			})
		}
		video.addEventListener('mousedown',function(e){
			e.preventDefault()
		})

	},
	eventListen:function(){
		var h2 = document.getElementById('h2')
		var h1 = document.getElementById('h1')
		var quote = document.getElementById('quote')
		var clear = document.getElementById('clear')
		var list = document.getElementById('list')
		var link = document.getElementById('link')
		var linkbt = document.getElementById('insertL')
		var file = document.getElementById('file')
		var submitbt = document.getElementById('submit')
		var code = document.getElementById('code')
		var code_status = document.getElementsByClassName('code_status')
		var suspension = document.getElementsByClassName('suspension')[0]
		var loading = suspension.getElementsByClassName('myloading_1')[0]
		var title = document.getElementById('title')
		var tags = document.getElementById('tags')
		var linkedit = document.getElementById('linkedit')
		var linkhref = document.getElementById('linkhref')
		var where = window.location.search.replace('?getid=','')
		tags.addEventListener("change",function(){
			Editor.article_tag = this.options[this.options.selectedIndex].value
			console.log(Editor.article_tag)
		})
		if (where) {
			submitbt.addEventListener('click',function(){
				let data = Editor.getContent()
				let post_key = data["post_key"]
				Editor.submited = true
				Interactive.XHRUpdate(data,function(result){
					window.location.href = `/articledetails?id=${post_key}`
				})
			})
			suspension.style.display = 'block'
			loading.style.display = 'block'
			Interactive.XHRQuery('articles','article_title,article_tag,article_content',where,(result)=>{
				Editor.editor.setAttribute("contenteditable","true")
				title.disabled = ""
				tags.disabled = ""
				Editor.editor.innerHTML = result[0]['article_content']
				title.setAttribute('value',result[0]['article_title'])
				Editor.article_tag = result[0]['article_tag']
				for (let i=tags.options.length-1;i>0;i--){
					if (tags.options[i].value===Editor.article_tag) {
						tags.options[i].selected = true
					}
				}
				suspension.style.display = 'none'
				//loading.className = "stylemenu status"
			})
		}else{
			submitbt.addEventListener('click',function(){
				let data = Editor.getContent()
				let post_key = data["post_key"]
				Editor.submited = true
				Interactive.XHRSave(data,function(result){
					let xhr = Interactive.creatXHR()
					xhr.open("GET",`/updatearticlenum?tag_name=${data['article_tag']}&operation=add`,true)
					xhr.onreadystatechange = function(){
						if (xhr.readyState===4) {
							if (xhr.responseText==="success") {
								window.location.href = `/articledetails?id=${post_key}`			
							}
						}
					}
					xhr.send(null)
				})

			})
			title.disabled = ""
			tags.disabled = ""
			Editor.editor.setAttribute("contenteditable","true")
			Editor.editor.focus()
		}
		h1.addEventListener('click',stylecmd.formatblockH1)
		h2.addEventListener('click',stylecmd.formatblockH2)
		quote.addEventListener('click',stylecmd.formatblockquote)
		clear.addEventListener('click',stylecmd.clearformat)
		list.addEventListener('click',stylecmd.insertList)
		linkbt.addEventListener('click',stylecmd.insertlink)
		file.addEventListener('change',Editor.upload)
		code.addEventListener('click',stylecmd.insertCode)
		link.addEventListener('click',function() {
			if (linkedit.getAttribute('data-show')==="true") {
				linkedit.style.display='none'
				linkedit.setAttribute('data-show',false)
			}else{
				linkedit.style.display='block'
				linkedit.setAttribute('data-show',true)
				linkhref.focus()
			}
		})
		code_status[0].addEventListener('click',function(){
			var el = editorCursor.isCursorInCodeblock_byLabelAttr()
			if (el) {
				Editor.exit_code(el)
			}
	    })
	},
	getContent: function() {
		var title = document.getElementById('title')
		var update = window.location.search.replace("?getid=","")
		var data = {
			"article_title":title.value,
			"article_content":editor.innerHTML,
			"article_tag":Editor.article_tag,
			"text_for_search":Editor.editor.innerText,
			"update_time":dateFormat('YYYY-MM-DD'),
			"article_time":dateFormat('YYYY-MM-DD'),
			"article_read":'0',
			"post_key": update || Math.random().toString().substring(2,5)+Date.now(),
			"table":'articles'
		}
		if (update) {
			delete data["article_time"]
			delete data["article_read"]
		}
		return data;
	},
	getLinkData: function() {
		linkedit = document.getElementById('linkedit')
		linkhref = document.getElementById('linkhref')
		linkname = document.getElementById('linkname')
		var href = linkhref.value
		var name = linkname.value
		var data = []
		data.push(href)
		data.push(name) 
		linkedit.style.display = 'none'
		linkedit.setAttribute('data-show','false')
		linkhref.value = ""
		linkname.value = ""
		return data
	},
	//更新pre代码块的active状态
	updatePreStatus:function(){
		editorCursor.saveRange()
		var is_active = editorCursor.isCursorInCodeblock_byNowRange()
		if (is_active) {
			is_active.setAttribute('active',true)
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'block'
		}else{
			var pre = document.getElementsByTagName("pre")
			var length = pre.length
			for(i=0;i<length;i++){
				pre[i].setAttribute('active',false)
			}
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'none'
		}
	},
	//获取指定元素的最后一个子元素，若此子元素还有子元素则继续获取，直到那个元素不再有子元素
	get_deep_lastchild:function(targetElement){
		lastele = targetElement.lastChild
		if (lastele) {
			lastele = Editor.get_deep_lastchild(lastele)
			return lastele
		}
		return targetElement
	},
	upload: function(e) {
		var suspension = document.getElementsByClassName('suspension')[0]
		var uploading_wrapper = suspension.getElementsByClassName('uploading_wrapper')[0]
		var uploading = uploading_wrapper.getElementsByClassName("uploading")[0]
		var percent = uploading_wrapper.getElementsByClassName('percent')[0]
		var f = e.target.files[0]
		var formdata = new FormData()
		//将文件转换为二进制数据然后上传
		formdata.append('file',f)
		e.target.value = null
		Interactive.XHRUpload(formdata,function(result){
			stylecmd.insertfile(result)
			Editor.filelist.push(result.substring(2))
			console.log(Editor.filelist)  
		},function(e){
			var total_lenght = uploading_wrapper.clientWidth
			console.log(total_lenght)
			uploading_wrapper.style.display = 'block'
			suspension.style.display="block"
			ratio = e.loaded/e.total
			percent.innerText = (ratio * 100).toFixed(2) + "%"
			uploading.style.width = ratio * total_lenght + 'px'
		},function(){
			suspension.style.display="none"
			uploading_wrapper.style.display = 'none'
		})
	},
	exit_code:function(el){
		if (el.nextSibling) {  //如果active_pre有下一个兄弟元素就直接跳到下一个兄弟元素
			var endnode = Editor.get_deep_lastchild(el.parentNode)
			try{
				var offset = endnode.nodeValue.length
			}catch{
				offset = 0 
			}
			editorCursor.setRange(endnode)
		}else{
			//如果没有就新增一行
			var p = document.createElement("p")
			var br = document.createElement('br')
			p.appendChild(br)
			Editor.editor.appendChild(p)
			editorCursor.setRange(p)
		}
		editorCursor.saveRange()
		//退出代码块，active属性设置为false
		el.setAttribute("active",false)
		var status = document.getElementsByClassName('code_status')
		status[0].style.display = 'none'
	},
	
}


window.onload = function() {
	Editor.init()
	let e = document.getElementById("editor")
}

window.onbeforeunload = function() {
	if (!Editor.submited) {
		return "离开此页面，这样您的内容将不会被保存"
	}
}

// window.onunload = function(){
// 	if (!Editor.submited) {
// 		Interactive.XHRUnload(JSON.stringify({filelist:Editor.filelist}))	
// 	}	
// }

window.onpagehide = function(){
	if (!Editor.submited) {
		navigator.sendBeacon("/deletefile",JSON.stringify({filelist:Editor.filelist}))
		//Interactive.XHRUnload(JSON.stringify({filelist:Editor.filelist}))
	}
	// for (let i=0,j=0;i<100000;i++){
	// 	j = j+1
	// 	j = Math.sqrt(j)/5 + i
	// 	console.log(j)
	// }
}