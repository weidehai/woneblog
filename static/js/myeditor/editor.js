/*
使用gif代替视频
现阶段只支持在本地先将视频转成gif在上传，以后会应用会支持视频转gif
*/

var Editor = {
	editor:document.getElementById('editor'),
	//初始化编辑框
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
		Editor.editor.addEventListener("mouseup",Editor.code.updatePreStatus)
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
		var table = document.getElementById('table')
		var rowfront = document.getElementById('rowfront')
		var colfront = document.getElementById('colfront')
		var rowbehind = document.getElementById('rowbehind')
		var colbehind = document.getElementById('colbehind')
		var removerow = document.getElementById('removerow')
		var removecol = document.getElementById('removecol')
		var justifyleft = document.getElementById('justifyleft')
		var justifycenter = document.getElementById('justifycenter')
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
				console.log(data.article_content)
				Editor.file.diff_file(data.article_content)
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
				Editor.file.get_filelist(result[0]['article_content'])
				title.setAttribute('value',result[0]['article_title'])
				Editor.article_tag = result[0]['article_tag']
				for (let i=tags.options.length-1;i>0;i--){
					if (tags.options[i].value===Editor.article_tag) {
						tags.options[i].selected = true
					}
				}
				suspension.style.display = 'none'
				loading.style.display = 'none'
			})
		}else{
			submitbt.addEventListener('click',function(){
				let data = Editor.getContent()
				let post_key = data["post_key"]
				Editor.submited = true
				Editor.file.diff_file(data.article_content)
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
			editorCursor.saveRange()
		}
		h1.addEventListener('click',stylecmd.formatblockH1)
		h2.addEventListener('click',stylecmd.formatblockH2)
		table.addEventListener('click',stylecmd.table.insertTable)
		rowfront.addEventListener('click',stylecmd.table.insertRowFront)
		colfront.addEventListener('click',stylecmd.table.insertColFront)
		rowbehind.addEventListener('click',stylecmd.table.insertRowBehind)
		colbehind.addEventListener('click',stylecmd.table.insertColBehind)
		removerow.addEventListener("click",stylecmd.table.removeRow)
		removecol.addEventListener("click",stylecmd.table.removeCol)
		justifyleft.addEventListener('click',stylecmd.justifyLeft)
		justifycenter.addEventListener('click',stylecmd.justifyCenter)
		quote.addEventListener('click',stylecmd.formatblockquote)
		clear.addEventListener('click',stylecmd.clearformat)
		list.addEventListener('click',stylecmd.insertList)
		linkbt.addEventListener('click',stylecmd.insertlink)
		file.addEventListener('change',Editor.file.upload)
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
			var el = Editor.code.isCursorInCodeblock_byLabelAttr()
			if (el) {
				Editor.code.exit_code(el)
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
	//获取指定元素的最后一个子元素，若此子元素还有子元素则继续获取，直到那个元素不再有子元素
	get_deep_lastchild:function(targetElement){
		lastele = targetElement.lastChild
		if (lastele) {
			lastele = Editor.get_deep_lastchild(lastele)
			return lastele
		}
		return targetElement
	},
	getCursorNode: function(nodename,node){
		try{
			if (node.nodeName == nodename){
				return node
			}else if(node.parentNode.nodeName == nodename){
				return node.parentNode
			}else if (node.id !== 'editor' && node.parentNode.id !== 'editor') {
				var node = node.parentNode
				return Editor.getCursorNode(nodename,node)
			}else {
				return false
			}
		}catch{}
	},
	
}







Editor.file = {
	filelist:[],
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
			Editor.file.filelist.push(result.substring(2))
			stylecmd.insertfile(result)
			console.log(Editor.file.filelist)
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
	get_filelist:function(content){
		let find_file = /(\.(\\|\/)static(\\|\/)upload(\\|\/)\S+?)(?=">)/g
		Editor.file.filelist = content.match(find_file) || []
		// try{
		// 	for(let file of content.match(find_file)){
		// 		console.log(file)
		// 		Editor.filelist.push(file[1])
		// 	}	
		// }catch(e){
		// 	alert(e)
		// }		
		console.log(Editor.file.filelist)
	},
	diff_file:function(content){
		if (Editor.file.filelist===null || Editor.file.filelist.length === 0) return
		for(let index in Editor.file.filelist){
			console.log(content.indexOf(Editor.file.filelist[index]))
			if (content.indexOf(Editor.file.filelist[index]) !== -1) {
				Editor.file.filelist.splice(index,1)
			}
		}
		if (Editor.file.filelist.length !== 0) {
			Interactive.XHRDelFile(JSON.stringify({filelist:Editor.file.filelist}))
		}
	}
}




//----------------------------表格组件------------------------------
Editor.table = {
	get_tr:function(node){
		try{
			if (node.nodeName === "TR") return node;
			if (node.id==='editor') return false;
			node = node.parentElement
			return Editor.table.get_tr(node)	
		}catch{
			return false
		}
		
	},
	get_td:function(node){
		try{
			if (node.nodeName === "TD") return node;
			if (node.id==='editor') return false;
			node = node.parentElement
			return Editor.table.get_td(node)
		}catch{	
			return false
		}
	},
	get_col:function(node){
		let col = 0;
		console.log(node.parentElement)
		let tds = node.parentElement.querySelectorAll('td')
		console.log(tds)
		//找到光标在哪一列
		for (let i in [...tds]){
			console.log(i)
			if(tds[i]===node){
				col = i
				break
			}
		}
		return col
	},
	insertAfter:function(parent,target,src){
		if (parent.lastChild === src) {
			parent.appendChild(target)
		}else{
			parent.insertBefore(target,src.nextSibling)
		}
	},
	//防止表格嵌套。深度和广度搜索，保证光标不在表格内
	prevent_nest:function(){
		let commonAncestorContainer = editorCursor.nowRange.commonAncestorContainer
		//使用collapsed来判断光标是否重叠，也就是是否有选中内容
		console.log(editorCursor.nowRange.collapsed)
		if (editorCursor.nowRange.collapsed){
			if (Editor.getCursorNode("TABLE",commonAncestorContainer)) {
				return true
			}
			return false
		}
		return true;
	},
}
//-----------------------------------------------------------------


//-----------------------------菜单栏拖动----------------------------
Editor.scroll_menu = {
	menu:document.getElementsByClassName("stylemenu_wrapper")[0],
	start_x:0,
	scroll_x:0,
	scroll_lenght:0,
	bindevent:function(){
		Editor.scroll_menu.scroll_x = Editor.scroll_menu.menu.scrollLeft
		Editor.scroll_menu.scroll_lenght = Editor.scroll_menu.menu.scrollWidth - 500
		Editor.scroll_menu.menu.addEventListener('mousedown',function(e){
			e.preventDefault()
			Editor.scroll_menu.start_x = e.pageX
			Editor.scroll_menu.menu.addEventListener('mousemove',Editor.scroll_menu.scrollto)
		})
		Editor.scroll_menu.menu.addEventListener("mouseup",()=>{
			Editor.scroll_menu.scroll_x = Editor.scroll_menu.menu.scrollLeft
			Editor.scroll_menu.menu.removeEventListener('mousemove',Editor.scroll_menu.scrollto)
		})
		Editor.scroll_menu.menu.addEventListener("mouseleave",()=>{
			Editor.scroll_menu.scroll_x = Editor.scroll_menu.menu.scrollLeft
			Editor.scroll_menu.menu.removeEventListener('mousemove',Editor.scroll_menu.scrollto)	
		})
	},
	scrollto:function(e){
	    let delta_x = e.pageX-Editor.scroll_menu.start_x
		console.log(Editor.scroll_menu.scroll_x)
		console.log(e.pageX-Editor.scroll_menu.start_x)
		if (Editor.scroll_menu.scroll_lenght<=(Editor.scroll_menu.scroll_x+delta_x)) {
			console.log("return")
			return
		}
		if (Editor.scroll_menu.scroll_x+delta_x<=0) {
			console.log("left limit")
			return	
		}
		Editor.scroll_menu.menu.scrollTo((Editor.scroll_menu.scroll_x + delta_x),0)
	}	
}
//------------------------------------------------------------------




//----------------------------代码块------------------------------
Editor.code = {
	//给焦点pre代码块增加了active属性，通过pre标签属性判断光标是否在代码块内，真返回此元素，假返回false
	isCursorInCodeblock_byLabelAttr:function(){
		var pre = document.getElementsByTagName('pre')
		var length = pre.length
		for(var i=0;i<length;i++){
			if (pre[i].getAttribute("active")=='true') {
				return pre[i]
			}
		}
		return false
	},
	//判断光标是否在代码块内,通过nowRange节点向外递归查找，真返回此元素，假返回false
	//--------------------------------------------------------------------
	isCursorInCodeblock_byNowRange: function(){
		//console.log(Editor.getCursorNode("PRE"))
		let commonAncestorContainer = editorCursor.nowRange.commonAncestorContainer
		return Editor.getCursorNode("PRE",commonAncestorContainer)
	},
	//-------------------------------------------------------------------------
	/**
	判断nowRange是否包含了code标签，三种情况
		1、code在Range头部
		2、code在Range尾部
		3、code在Range中间
	包含返回真，反之返回假
	**/
	isRangeCantainerCodeLable:function(){
		//在头部
		var startContainer = editorCursor.nowRange.startContainer
		if(startContainer.parentNode.nodeName=="CODE"){
			return true 
		}
		//在尾部
		if(editorCursor.nowRange.endContainer.parentNode.nodeName=="CODE"){
			return true
		}
		//在中间
		var nextsibling = startContainer.nextSibling
		while(nextsibling){
			if (nextsibling.nodename=="CODE") {
				return true
			}
			nextsibling = nextsibling.nextSibling
		}
		return false
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
	//更新pre代码块的active状态
	updatePreStatus:function(){
		editorCursor.saveRange()
		var is_active = Editor.code.isCursorInCodeblock_byNowRange()
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
	}
}
//-----------------------------------------------------------------


window.onload = function() {
	Editor.init()
	if (systeminfo.get_systeminfo().indexOf('IOS') === -1 && systeminfo.get_systeminfo().indexOf('Android') === -1) {
		if (document.documentElement.clientWidth<1090) {
			Editor.scroll_menu.bindevent()
		}
		window.addEventListener("resize",()=>{
			if (document.documentElement.clientWidth<1090) {
				Editor.scroll_menu.bindevent()
			}
		})	
	}
}
//--------------------------------页面卸载拦截--------------------------
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
	if (!Editor.submited && Editor.file.filelist !== null && Editor.file.filelist.length!==0) {
		navigator.sendBeacon("/deletefile",JSON.stringify({filelist:Editor.file.filelist}))
	}
}
//--------------------------------------------------------------------

