var writerU = {
	getdate:function(){
		var d=new Date()
		var newdate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
		return newdate
	},
	preventDefault: function(el,event) {
		el.addEventListener(event,function(e) {
			e.preventDefault()
		})
	},
	prevent_line_break: function(el,event){
		el.addEventListener(event,function(e){
			if (e.keyCode == 13) {
				e.preventDefault()
			}
		})
	},
	//添加事件监听
	addEvent: function(el,eventname,handle) {
		//addEventListener(eventname,handle_function,useCapture),第三个函数为boolen值，true表示使用事件捕获模型，flase表示使用事件冒泡模型，默认false
		el.addEventListener(eventname,handle)
	},
	//控制悬浮窗口的开关,el为正在激活的悬浮窗口,获取所有的悬浮窗口，不为el时全部关闭
	controlSwitch: function(el,id) {
		isshow = el.getAttribute('data-show')
		console.log(isshow)
		sus = document.getElementsByClassName('suspended')
		for(var i=0;i<sus.length;i++){
			if (el == sus[i]) {
				if (isshow == 'false') {
					el.style.display = 'block'
					try{
						text = document.getElementById(id)
						text.focus()
					}catch{}
					el.setAttribute('data-show','true')
				}else {
					//当前窗口关闭编辑框获得焦点
					el.style.display = 'none'
					e = document.getElementById('editor')
					e.focus()
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
	//window.location.search获取url中？号后面的查询搜索参数
	geturl_param: function() {
		if (window.location.search != '') {
			var e = document.getElementById('editor')
			var id = window.location.search.replace('?getid=','')
			e.setAttribute('data-id',id)
			return id
		}
		return ''
	},
	upload: function() {
		var f = document.getElementById('file').files[0]
		var formdata = new FormData()
		//将文件转换为二进制数据然后上传
		formdata.append('file',f)
		interactive.ajaxupload(formdata)
	},
	//在指定节点之前插入元素节点
	insertAfter:function(targetElement,newElement){
		var parent = targetElement.parentNode
		if (parent.lastChild==targetElement) {
			parent.appendChild(newElement)
		}else{
			parent.insertBefore(newElement,targetElement.nextSibling)
		}
	},
	get_deep_lastchild:function(targetElement){
		lastele = targetElement.lastChild
		if (lastele) {
			lastele = writerU.get_deep_lastchild(lastele)
			return lastele
		}
		return targetElement
	}
	/**  貌似没什么用
	//插入代码块使光标焦点在代码块内
	----------------------------------------------
	focus_pre:function(){
		var is_active = myrange.nodeSelect()
		if (is_active) {
			var range = document.createRange()
			range.setStart(is_active,0)
			range.setEnd(is_active,0)
		}
	}
	----------------------------------------------
	**/
}
function backtoindex(){
	window.location.href='/'
}