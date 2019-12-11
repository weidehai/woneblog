var stylecmd = {
	formatblockH1: function() {
		document.execCommand('formatblock',false,'H1')
	},
	formatblockH2: function() {
		document.execCommand('formatblock',false,'H2')
	},
	insertList: function() {
		document.execCommand('insertUnorderedList',false,null)
	},
	//代码块
	inserthtml: function(e) {	
		var text = `<pre class=${this.innerText} active=true></pre>`
		document.execCommand('insertHTML',false,text)
		var status = document.getElementsByClassName('code_status')
		status[0].style.display = 'block'
		writerU.controlSwitch(document.getElementById('language'))
		writerU.focus_pre()
		
	},
	insertlink: function() {
		//需要恢复光标保证插入位置正确
		myrange.restoreRange()
		data = myeditor.getlinkdata()
		document.execCommand('createLink',false,data)
	},
	insertmedia: function(data){
		myrange.restoreRange()
		document.execCommand('insertHTML',false,data)
	},
	insert_keyboard:function(){
		if (myrange.nowRange.startOffset != myrange.nowRange.endOffset) {
			//如果两者不相等则说明当前range有内容，则将内容包裹code标签
			var code = document.createElement('code') 
			myrange.nowRange.surroundContents(code)
			range = document.getSelection().getRangeAt(0)
			range.collapse(false)
		}
	}
	
}
