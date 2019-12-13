var myeditor = {
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
		writerU.addEvent(e,'keydown',myeditor.editor_keydown)
    	writerU.addEvent(e,'focus',myeditor.hideall)
    	writerU.addEvent(e,'keyup',myeditor.prevent_empty)
		writerU.addEvent(e,"mouseup",myeditor.checkpre)
	},
	//当编辑框获取焦点时隐藏所有的悬浮窗口
	hideall: function() {
		linkedit = document.getElementById('linkedit')
		linkedit.style.display = 'none'
		linkedit.setAttribute('data-show','false')
	},
	//获取编辑框内容
	getcontent: function() {
		var e = document.getElementById('editor')
		var tit = document.getElementById('title')
		var t = document.getElementById('tag')
		var title =tit.value
		var content = e.innerHTML;
		var tag = t.value
		var publishtime = writerU.getdate()
		var id = e.getAttribute('data-id')
		var postkey,update
		if (writerU.geturl_param()) {
			postkey = writerU.geturl_param()
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
	},
	editor_keydown: function(e) {
		//检查光标是否在代码区内，若果在则对换行做特殊处理
		//添加tab制表符功能,用4个空格代替
		try{
			myrange.sel = document.getSelection()
			var range = myrange.sel.getRangeAt(0)
			var active_pre_byrecu = myrange.nodeSelectByRe(range.commonAncestorContainer)
		}catch{}
		//通过data-show属性加上光标位置节点递归方式，双重确认光标位置
		var active_pre_byattr = myrange.nodeSelect()
		var active_pre = active_pre_byattr?active_pre_byattr:active_pre_byrecu
		if (active_pre) {
			if (e.keyCode==13) {
				e.preventDefault()
				document.execCommand('inserthtml',false,'\n')
				if(document.getSelection().getRangeAt(0).startOffset == range.startOffset){
					document.execCommand('inserthtml',false,'\n')
				}
			}else if(e.keyCode==9){
				e.preventDefault()
				document.execCommand('inserthtml',false,'    ')
			}else if(e.ctrlKey && e.keyCode==81) {   //按下ctrl+q退出代码块
				myeditor.exit_code(active_pre,range)
				
			}
		}
		//当文本为空，即编辑框内容为<p><br></p>时，阻止删除
		if (e.keyCode==8) {
			if (this.innerHTML=='<p><br></p>') {
				e.preventDefault()
			}
		}
		
	},
	checkpre:function(){
		try{
			myrange.sel = document.getSelection()
			var range = myrange.sel.getRangeAt(0)
			myrange.update_prestatus(range.commonAncestorContainer)
		}catch{}
	},
	//防止编辑器被删除为空
	prevent_empty: function(){
		myeditor.checkpre()
		//this表示触发这个事件的元素
		if (this.innerHTML=='') {
			this.innerHTML='<p><br></p>'
		}
	},
	getlinkdata: function() {
		linkedit = document.getElementById('linkedit')
		linkarea = document.getElementById('linkarea')
		data = linkarea.value 
		linkedit.style.display = 'none'
		linkedit.setAttribute('data-show','false')
		linkarea.value = ""
		return data
	},
	exit_code:function(el,range){
		if (el.nextSibling) {  //如果active_pre有下一个兄弟元素就直接跳到下一个兄弟元素
			var endnode = writerU.get_deep_lastchild(el.parentNode)
			try{
				var offset = endnode.nodeValue.length
			}catch{
				offset = 0 
			}
			range.setStart(endnode,offset)
			range.setEnd(endnode,offset)
		}else{
			//如果没有就新增一行
			var p = document.createElement("p")
			var br =document.createElement("br")
			p.appendChild(br)
			var e = document.getElementById('editor')
			e.appendChild(p)
			range.setStart(p,0)
			range.setEnd(p,0)
		}
		//退出代码块，active属性设置为false
		el.setAttribute("active",false)
		var status = document.getElementsByClassName('code_status')
		status[0].style.display = 'none'
	}
}