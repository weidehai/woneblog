var Editor = {
	//初始化编辑框
	init: function() {
		var e = document.getElementById('editor')
		//将编辑框的默认换行元素改为p
		document.execCommand("defaultParagraphSeparator", false, "p")
		//初始化
		if (!e.innerText) {
			var p = document.createElement('p')
			var br = document.createElement('br')
			e.appendChild(p)
			p.appendChild(br)	
		}
		//控制keydown换行事件
		//为editor的鼠标和键盘事件注册处理函数
		e.addEventListener('keydown',editorKeyControl.editorKeydown)
    	e.addEventListener('focus',Editor.hideAllsusp)
    	e.addEventListener('keyup',editorKeyControl.editorKeyup)
		e.addEventListener("mouseup",editorKeyControl.editorMouseup)
		e.addEventListener('blur',editorCursor.saveRange)
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
		var language = document.getElementById('language').getElementsByTagName('li')
		for (var k=0,len=menus.length;k<len;k++) {
			menus[k].addEventListener('mousedown',function(e){
				e.preventDefault()
			})
		}
		for(var i=0,len=language.length;i<len-1;i++){
			language[i].addEventListener('mousedown',function(e){
				e.preventDefault()
			})
		}
		language[len-1].addEventListener('mousedown',function(e){
			e.preventDefault()
		})

	},
	eventListen:function(){
		var e = document.getElementById('editor')
		var picture = document.getElementById('picture')
		var h2 = document.getElementById('h2')
		var h1 = document.getElementById('h1')
		var list = document.getElementById('list')
		var link = document.getElementById('link')
		var linkbt = document.getElementById('insertL')
		var file = document.getElementById('file')
		var video = document.getElementById('video')
		var languagediv = document.getElementsByClassName('language')
		var language = languagediv[0].getElementsByTagName('li')
		var languageul = document.getElementById('language')
		var submitbt = document.getElementById('submit')
		var code = document.getElementById('code')
		var code_status = document.getElementsByClassName('code_status')
		var title = document.getElementById('title')
		var tag = document.getElementById('tag')
		var linkedit = document.getElementById('linkedit')
		var linkhref = document.getElementById('linkhref')

		var where = window.location.search.replace('?getid=','')
		if (where) {
			submitbt.addEventListener('click',function(){
				Interactive.XHRUpdate(Editor.getContent(),function(result){
					window.location.href = `'/articledetails?id=${Editor.getContent()["post_key"]}`
				})
			})
			Interactive.XHRQuery('articles','article_title,article_tag,article_content',where,(result)=>{
				e.innerHTML = result[0]['article_content']
				title.setAttribute('value',result[0]['article_title'])
				tag.setAttribute('value',result[0]['article_tag'])
			})
		}else{
			submitbt.addEventListener('click',function(){
				Interactive.XHRSave(Editor.getContent(),function(result){
					window.location.href = `'/articledetails?id=${Editor.getContent()["post_key"]}`
				})
			})
		}
		h1.addEventListener('click',stylecmd.formatblockH1)
		h2.addEventListener('click',stylecmd.formatblockH2)
		list.addEventListener('click',stylecmd.insertList)
		linkbt.addEventListener('click',stylecmd.insertlink)
		file.addEventListener('change',Interactive.XHRUpload)
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
		for(let i=0,len=language.length;i<len-1;i++){
			language[i].addEventListener('click',stylecmd.insertHtml)
		}
		if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { 
			code.addEventListener("click",function(){
				if (languageul.getAttribute('data-show')==="true") {
					languageul.style.display='none'
					languageul.setAttribute('data-show',false)
				}else{
					languageul.style.display='block'
					languageul.setAttribute('data-show',true)
				}
			})
		}else{
			languagediv[0].addEventListener("mouseover",function(){
				languageul.style.display='block'
				languageul.setAttribute('data-show',true)
			})
			languagediv[0].addEventListener("mouseout",function(){
				languageul.style.display='none'
				languageul.setAttribute('data-show',false)
			})
		}
	},
	getContent: function() {
		var e = document.getElementById('editor')
		var title = document.getElementById('title')
		var tag = document.getElementById('tag')
		var update = window.location.search.replace("?getid=","")
		var data = {
			"article_title":title.value,
			"article_content":e.innerHTML,
			"article_tag":tag.value,
			"text_for_search":e.innerText,
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
			lastele = editorU.get_deep_lastchild(lastele)
			return lastele
		}
		return targetElement
	},
	upload: function() {
		console.log("doupload.......")
		var f = document.getElementById('file').files[0]
		var formdata = new FormData()
		//将文件转换为二进制数据然后上传
		formdata.append('file',f)
		interactive.ajaxupload(formdata)
	},
	exit_code:function(el){
		var e = document.getElementById('editor')
		if (el.nextSibling) {  //如果active_pre有下一个兄弟元素就直接跳到下一个兄弟元素
			var endnode = editorU.get_deep_lastchild(el.parentNode)
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
			e.appendChild(p)
			editorCursor.setRange(p)
		}
		editorCursor.saveRange()
		//退出代码块，active属性设置为false
		el.setAttribute("active",false)
		var status = document.getElementsByClassName('code_status')
		status[0].style.display = 'none'
	}
}


window.onload = function() {
	Editor.init()
}