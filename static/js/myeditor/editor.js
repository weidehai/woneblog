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