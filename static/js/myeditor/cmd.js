var stylecmd = {
	formatblockH1: function() {
		document.execCommand('formatblock',false,'H1')
		editorCursor.saveRange()
	},
	formatblockH2: function() {
		document.execCommand('formatblock',false,'H2')
		editorCursor.saveRange()
	},
	insertList: function() {
		document.execCommand('insertUnorderedList',false,null)
		editorCursor.saveRange()
	},
	//代码块
	insertHtml: function(e) {
		var active_pre = editorCursor.isCursorInCodeblock_byNowRange()
		if (active_pre) {
			return
		}
		editorCursor.restoreRange()
		if (document.activeElement.id=="editor") {
			var text = `<pre class=${this.innerText} active=true></pre>`
			document.execCommand('insertHTML',false,text)
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'block'
			editorCursor.saveRange()
		}
	},
	insertlink: function() {
		//需要恢复光标保证插入位置正确
		editorCursor.restoreRange()
		data = getData.getLinkData()
		document.execCommand('createLink',false,data)
		editorCursor.saveRange()
		editorCursor.selection.collapseToEnd()
	},
	insertmedia: function(data){
		editorCursor.restoreRange()
		document.execCommand('insertHTML',false,data)
		editorCursor.saveRange()
	},
	insert_keyboard:function(){
		if (editorCursor.nowRange.startOffset != editorCursor.nowRange.endOffset) {
			if(!editorCursor.isRangeCantainerCodeLable() && !editorCursor.isCursorInCodeblock_byLabelAttr()){
				//如果两者不相等则说明当前range有内容，且需要满足当前选择区没有被code包含，则将内容包裹code标签
				var code = document.createElement('code') 
				editorCursor.nowRange.surroundContents(code)
			}
		}
	}
	
}
