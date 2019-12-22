var editorU = {
	getDate:function(){
		var d=new Date()
		var newdate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
		return newdate
	},
	preventDefault:function(el,ev){
		el.addEventListener(ev,function(e){
			e.preventDefault()
		})
	},
	//控制悬浮窗口的开关,el为正在激活的悬浮窗口,获取所有的悬浮窗口，不为el时全部关闭
	suspendControl: function(el,id) {
		isshow = el.getAttribute('data-show')
		sus = document.getElementsByClassName('suspended')
		for(var i=0;i<sus.length;i++){
			if (el == sus[i]) {
				if (isshow == 'false') {
					el.style.display = 'block'
					//有需要输入操作的获取焦点
					try{
						text = document.getElementById(id)
						text.focus()
					}catch{}
					el.setAttribute('data-show','true')
				}else {
					//当前窗口关闭编辑框获得焦点
					el.style.display = 'none'
					myrange.restoreRange()
					el.setAttribute('data-show','false')
				}
			}else{
				sus[i].style.display='none'
				sus[i].setAttribute('data-show','false')
			}
		}
	},
	//获取url的参数
	//window.location.search获取url中？号后面的查询搜索参数,获取到则返回id，没有则返回空字符
	geturl_param: function() {
		if (window.location.search != '') {
			var e = document.getElementById('editor')
			var id = window.location.search.replace('?getid=','')
			e.setAttribute('data-id',id)
			return id
		}
		return ''
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
	}
}


var getData={
	//获取要插入的链接
	getLinkData: function() {
		linkedit = document.getElementById('linkedit')
		linkarea = document.getElementById('linkarea')
		data = linkarea.value 
		linkedit.style.display = 'none'
		linkedit.setAttribute('data-show','false')
		linkarea.value = ""
		return data
	},
	//获取文章标题，标签，发表时间，postkey
	getContent: function() {
		var e = document.getElementById('editor')
		var tit = document.getElementById('title')
		var t = document.getElementById('tag')
		var title =tit.value
		var content = e.innerHTML;
		var tag = t.value
		var publishtime = editorU.getDate()
		var postkey,update
		if (editorU.geturl_param()) {
			postkey = editorU.geturl_param()
			update=true
		}else{
			postkey =Math.random().toString().substring(2,5)+Date.now()
			update=false
		}
		var data = {
			"title":title,
			"content":content,
			"tag":tag,
			"publishtime":publishtime,
			"postkey":postkey,
			"update":update
		}
		return data;
	}
}

var network_operation = {
	upload: function() {
		var f = document.getElementById('file').files[0]
		var formdata = new FormData()
		//将文件转换为二进制数据然后上传
		formdata.append('file',f)
		interactive.ajaxupload(formdata)
	},
}

function backtoindex(){
	window.location.href='/'
}