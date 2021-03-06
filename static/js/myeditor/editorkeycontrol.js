var editorKeyControl = {
	editorKeydown: function(e) {
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
	editorKeyup:function(){
		//防止编辑器被删除为空
		if (Editor.editor.innerHTML=='') {
			Editor.editor.innerHTML='<p><br></p>'
		}
		Editor.code.updatePreStatus()
		//防止删除后焦点为null(待实现)
		//console.log(editorCursor.selection)
	}
}
