/*
使用gif代替视频
现阶段只支持在本地先将视频转成gif在上传，以后会应用会支持视频转gif(放弃，因为视频转gif体积会变大几倍到几十倍)
*/
/*
待修复bug
1.首次（非首次同样）进入publish页面，然后光标首先（非第一次同样）落在pre中，点击菜单右上角退出代码块按钮无效（此时代码块下面已经有了一行空白行）
并且代码块位于文章最末（修复完毕）
2.新需求
从别的地方复制粘贴过来的文本需要清除样式
 */
Editor.ui = {
	editor:document.getElementById('editor'),
<<<<<<< HEAD
	title:document.getElementById('title'),
	tags:document.getElementById('tags'),
	submitbt:document.getElementById('submit'),
	submited:false,
=======
>>>>>>> 8184acc81e0a91aa22f37f461d82e3acb5d26bcb
	//初始化编辑框
	init: function() {
		//将编辑框的默认换行元素改为p
		document.execCommand("defaultParagraphSeparator", false, "p")
		//初始化
		if (!Editor.ui.editor.innerText) {
			var p = document.createElement('p')
			var br = document.createElement('br')
			p.appendChild(br)
			Editor.ui.editor.appendChild(p)
		}
<<<<<<< HEAD
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
		submitbt.addEventListener('click',function(){
			//savepost()
			let data = Editor.get_content()
			let post_key = data["post_key"]
			Editor.submited = true
			Interactive.XHRPost(data,post_key)
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
=======
>>>>>>> 8184acc81e0a91aa22f37f461d82e3acb5d26bcb
	},
}

Editor.event = {
	init:function(){
		//为editor的鼠标和键盘事件注册处理函数
		Editor.ui.editor.addEventListener('keydown',editorKeyControl.editorKeydown)
		Editor.ui.editor.addEventListener('keyup',editorKeyControl.editorKeyup)
		Editor.ui.editor.addEventListener("mouseup",editorMouseControl.editor_mouse_down)
		Editor.ui.editor.addEventListener("mousedown",editorMouseControl.editor_mouse_up)
		//Editor.ui.editor.addEventListener("input",editorCursor.saveRange)
	}
}


Editor.util = {
	//获取指定元素的最后一个子元素，若此子元素还有子元素则继续获取，直到那个元素不再有子元素
	get_deep_lastchild:function(targetElement){
		lastele = targetElement.lastChild
		if (lastele) {
			lastele = Editor.get_deep_lastchild(lastele)
			return lastele
		}
		return targetElement
	},
	//判断nodename是否被node包含
	if_node_contained_by: function(nodename,node){
		try{
			if (node.nodeName == nodename){
				return node
			}else if(node.parentNode.nodeName == nodename){
				return node.parentNode
			}else if (node.id !== 'editor' && node.parentNode.id !== 'editor') {
				var node = node.parentNode
				return Editor.if_node_contained_by(nodename,node)
			}else {
				return false
			}
		}catch{}
	},
<<<<<<< HEAD
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
}



Editor.tableinfo = {
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
=======
>>>>>>> 8184acc81e0a91aa22f37f461d82e3acb5d26bcb
}

Editor.menus = {
	menus:document.getElementsByTagName('i'),
	menu_wrap:document.getElementsByClassName("stylemenu_wrapper")[0],
	menu_susp:document.getElementsByClassName('suspended'),
	scroll_x:0,
	scroll_lenght:0,
	start_x:0,
	init:function(){
		Editor.menus.disable_focus()
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
		var cutline = document.getElementById('cutline')
		var list = document.getElementById('list')
		var link = document.getElementById('link')
		var linkbt = document.getElementById('insertL')
		var file = document.getElementById('file')
		var code = document.getElementById('code')
		var code_status = document.getElementsByClassName('code_status')
		var linkedit = document.getElementById('linkedit')
		var linkhref = document.getElementById('linkhref')
<<<<<<< HEAD
		var draftbt = document.getElementById('draft')
=======
>>>>>>> 8184acc81e0a91aa22f37f461d82e3acb5d26bcb
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
		cutline.addEventListener("click",stylecmd.insertcutline)
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
<<<<<<< HEAD
	    draftbt.addEventListener("click",function(){
	    	//savadraft(待实现)
	    })
=======
		//移动端原生支持不显示滚动条滚动，pc端不显示滚动条则无法滚动，所以需要判断移动端或pc端，只有在pc端绑定菜单滚动事件
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
>>>>>>> 8184acc81e0a91aa22f37f461d82e3acb5d26bcb
	},
	disable_focus:function () {
		//阻止样式按钮的点击获取焦点事件
		for (var k=0,len=Editor.menus.menus.length;k<len;k++) {
			Editor.menus.menus[k].addEventListener('mousedown',function(e){
				e.preventDefault()
			})
		}
	},
	//当编辑框获取焦点时隐藏菜单悬浮窗口
	hide_all_menu_susp: function() {
		var length = Editor.menus.menu_susp.length
		for(var i=0;i<length;i++){
			Editor.menus.menu_susp[i].style.display = 'none'
			Editor.menus.menu_susp[i].setAttribute('data-show','false')
		}
	},
	get_link_data: function() {
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
	//菜单栏拖动
	enable_scroll_menu:function{
		Editor.menus.scroll_x = Editor.menus.menu_wrap.scrollLeft
		Editor.menus.scroll_lenght = Editor.menus.menu_wrap.scrollWidth - 500
		Editor.menus.menu_wrap.addEventListener('mousedown',function(e){
			e.preventDefault()
			Editor.menus.start_x = e.pageX
			Editor.menus.menu_wrap.addEventListener('mousemove',Editor.menus.scrollto)
		})
		Editor.menus.menu.addEventListener("mouseup",()=>{
			Editor.menus.scroll_x = Editor.menus.menu.scrollLeft
			Editor.menus.menu.removeEventListener('mousemove',Editor.menus.scrollto)
		})
		Editor.menus.menu.addEventListener("mouseleave",()=>{
			Editor.menus.scroll_x = Editor.menus.menu.scrollLeft
			Editor.menus.menu.removeEventListener('mousemove',Editor.menus.scrollto)	
		})
	},
	scrollto:function(e){
	    let delta_x = e.pageX-Editor.menus.start_x
		console.log(Editor.menus.scroll_x)
		console.log(e.pageX-Editor.menus.start_x)
		if (Editor.scroll_menu.scroll_lenght<=(Editor.menus.scroll_x+delta_x)) {
			console.log("return")
			return
		}
		if (Editor.menus.scroll_x+delta_x<=0) {
			console.log("left limit")
			return	
		}
		Editor.menus.menu.scrollTo((Editor.menus.scroll_x + delta_x),0)
	}	
}


Editor.file = {
	filelist:[],
	deleted_filelist:[],
	new_filelist:[],
	upload: function(e) {
		//20201211文件一律上传到temp
		var suspension = document.getElementsByClassName('suspension')[0]
		var uploading_wrapper = suspension.getElementsByClassName('uploading_wrapper')[0]
		var uploading = uploading_wrapper.getElementsByClassName("uploading")[0]
		var percent = uploading_wrapper.getElementsByClassName('percent')[0]
		var f = e.target.files[0]
		var file_type = Editor.file.get_filetype(e.target.value)
		var formdata = new FormData()
		var type = 'temporary'
		var dir = Editor.post_key
		//将文件转换为二进制数据然后上传
		formdata.append('file',f)
		e.target.value = null
		Interactive.XHRUpload(formdata,type,dir,function(result){
			Editor.file.filelist.push(result.substring(2))
			Editor.file.new_filelist.push(result.substring(2))
			stylecmd.insertmedia(result,file_type)
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
	get_filetype:function(name){
		var type = name.substring(name.lastIndexOf("."))
		if (/mp4|wmv|avi/i.test(type)) {
			return 1 //video
		}else if(/png|gif|jpeg|jpg/i.test(type)){
			return 2 //image
		}
	},
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
			if (Editor.if_node_contained_by("TABLE",commonAncestorContainer)) {
				return true
			}
			return false
		}
		return true;
	},
}
//-----------------------------------------------------------------



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
		let commonAncestorContainer = editorCursor.nowRange.commonAncestorContainer
		return Editor.if_node_contained_by("PRE",commonAncestorContainer)
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
		console.log(el)
		let nextsb = el.nextSibling
		console.log(nextsb)
		if (nextsb) {
			/*
			 如果active_pre有下一个兄弟元素就直接跳到下一个兄弟元素
			 2020-7-28》》
			 如果有一下个兄弟元素，但是这个元素是空的比如<p></p>，那么光标无法设置成功，也就是空元素无法设置光标，需要加一个空白占位符<br>
			 */
			//兼容空元素的情况 2020-07-28
			if(!nextsb.innerHTML){
				nextsb.innerHTML = '<br>'
				editorCursor.setRange(nextsb)
			}else{
				var endnode = Editor.get_deep_lastchild(el.parentNode)
				editorCursor.setRange(endnode)
			}
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



//----------------------------视频块控制-----------------------------
Editor.video_control = {
	video_focued_node:null,
	on_init(){
		console.log("init video_control")
		Editor.video_control.video_control()
	},
	find_root_elementfor(node){
		if(node.id==="editor"){
			return null
		}
		while(node.parentElement.id!=="editor"){
			node = node.parentElement
		}
		return node
	},
	video_get_focus(focus_video){
		Editor.video_control.video_focued_node = focus_video
		editorCursor.selection.removeAllRanges()
		if(!document.activeElement.id==="editor"){
			Editor.editor.focus()
		}
		Editor.video_control.video_focued_node.className = Editor.video_control.video_focued_node.className + " videofocus"
	},
	video_loss_focus(){
		Editor.video_control.video_focued_node.className = Editor.video_control.video_focued_node.className.replace(" videofocus","")
		Editor.video_control.video_focued_node = null
	},
	del_video(){
		if(Editor.video_control.video_focued_node.previousElementSibling){
			editorCursor.setRange(Editor.video_control.video_focued_node.previousElementSibling)
		}else if(Editor.video_control.video_focued_node.nextElementSibling){
			editorCursor.setRange(Editor.video_control.video_focued_node.nextElementSibling,1)
		}
		Editor.video_control.video_focued_node.remove()
		Editor.video_control.video_focued_node = null
	},
	video_control(){
		Editor.editor.addEventListener("keydown",(e)=>{
			var pes,nes
			//删除video
			if(Editor.video_control.video_focued_node && e.keyCode===8){
				Editor.video_control.del_video()
				return
			}
			//上下左右及tab键处理
			//tab:9  left:37  right:39  down:40  up:38
			if(e.keyCode===40){
				if(!Editor.video_control.video_focued_node){
					var rootnode = Editor.video_control.find_root_elementfor(editorCursor.selection.focusNode)
					if(rootnode && rootnode.nextElementSibling && rootnode.nextElementSibling.nodeName==="VIDEO"){
						e.preventDefault()
						e.stopPropagation()
						Editor.video_control.video_get_focus(rootnode.nextElementSibling)
					}
				}else{
					e.preventDefault()
					e.stopPropagation()
					nes = Editor.video_control.video_focued_node.nextElementSibling
					if(nes){
						editorCursor.setRange(nes,1)	
					}
					Editor.video_control.video_loss_focus()
				}
				return
			}
			if(e.keyCode===38){
				if(!Editor.video_control.video_focued_node){
					var rootnode = Editor.video_control.find_root_elementfor(editorCursor.selection.focusNode)
					if(rootnode && rootnode.previousElementSibling &&rootnode.previousElementSibling.nodeName==="VIDEO"){
						e.preventDefault()
						e.stopPropagation()
						Editor.video_control.video_get_focus(rootnode.previousElementSibling)
					}
				}else{
					e.preventDefault()
					e.stopPropagation()
					pes = Editor.video_control.video_focued_node.previousElementSibling
					if(pes){
						editorCursor.setRange(pes)	
					}
					Editor.video_control.video_loss_focus()
				}
				return
			}
			if(e.keyCode===9){
				if(Editor.video_control.video_focued_node){
					Editor.video_control.video_loss_focus()
				}
				return
			}


			if(editorCursor.selection.focusNode){
				pes = editorCursor.selection.focusNode.previousElementSibling || null
			}
			var offset = editorCursor.selection.focusOffset
			console.log(editorCursor.selection.focusNode.innerHTML=="")
			if(offset==1 && editorCursor.selection.focusNode.innerHTML=="<br>"){
				offset=0
			}
			if(pes && e.keyCode===8 && pes.nodeName==="VIDEO" && offset===0){
				e.preventDefault()
				e.stopPropagation()
				console.log(pes)
				if(!Editor.video_control.video_focued_node){
					Editor.video_control.video_get_focus(pes)
					return
				}
			}
			if(offset===0 && e.keyCode===8){
				var pe = editorCursor.selection.focusNode.parentElement
				while(pe.id!=="editor"){
					if(pe){
						if(pe.previousElementSibling){
							if(pe.previousElementSibling.nodeName==="VIDEO"){
								e.preventDefault()
								e.stopPropagation()
								if(!Editor.video_control.video_focued_node){
									Editor.video_control.video_get_focus(pe.previousElementSibling)
									return
								}
							}	
						}
					}
					pe = pe.parentElement
				}
			}
			if(Editor.video_control.video_focued_node && e.keyCode===8){
				Editor.video_control.del_video()
			}
		},true)
		Editor.editor.addEventListener("mousedown",(e)=>{
			var target = e.target
			if(target.nodeName==="VIDEO"){
				e.preventDefault()
				e.stopPropagation()
				if(Editor.video_control.video_focued_node){
					return
				}
			}
			if(target.nodeName!=="VIDEO" && Editor.video_control.video_focued_node){
				Editor.video_control.video_loss_focus()
			}else if(target.nodeName==="VIDEO" && !Editor.video_control.video_focued_node){
				Editor.video_control.video_get_focus(target)
			}
		})
	}

}



Editor.key_control = {
	editor_key_down: function(e) {
		e.stopPropagation()
		//检查光标是否在代码区内，如果在则对换行做特殊处理
		var active_pre = Editor.code.isCursorInCodeblock_byNowRange()
		if (active_pre) {
			if (e.keyCode==13) {
				e.preventDefault()
				editorCursor.saveRange()
				var oldrange = editorCursor.nowRange
				document.execCommand('inserthtml',false,'\n')
				editorCursor.saveRange()
				if(oldrange.startOffset == editorCursor.nowRange.startOffset){
					document.execCommand('inserthtml',false,'\n')
				}
			}else if(e.keyCode==9){
				e.preventDefault()
				document.execCommand('inserthtml',false,'    ')  //添加tab制表符功能,用4个空格代替
			}else if(e.ctrlKey && e.keyCode==81) {   //按下ctrl+q退出代码块
				Editor.exit_code(active_pre)
			}
		}
		//当文本为空，即编辑框内容为<p><br></p>时，阻止删除
		if (e.keyCode==8) {
			if (this.innerHTML=='<p><br></p>') {
				e.preventDefault()
			}
		}
	},
	editor_key_up:function(){
		//防止编辑器被删除为空
		if (Editor.editor.innerHTML=='') {
			Editor.editor.innerHTML='<p><br></p>'
		}
		Editor.code.updatePreStatus()
	}
}


Editor.mouse_control = {
	editor_mouse_down:function(){},
	editor_mouse_up:function(){}
}
