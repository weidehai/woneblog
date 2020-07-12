var stylecmd = {
	formatblockH1: function() {
		document.execCommand('formatblock',false,'H1')
		editorCursor.saveRange()
	},
	formatblockH2: function() {
		document.execCommand('formatblock',false,'H2')
		editorCursor.saveRange()
	},
	// clearformat: function(){
	// 	document.execCommand("formatblock",false,'p')
	// },
	insertcutline: function(){
		document.execCommand("insertHTML",false,"<hr><p><br></p>")
	},
	formatblockquote:function(){
		document.execCommand('formatblock',false,'BLOCKQUOTE')
	},
	insertList: function() {
		document.execCommand('insertUnorderedList',false,null)
		editorCursor.saveRange()
	},
	//代码块
	insertCode: function(e) {
		var active_pre = Editor.code.isCursorInCodeblock_byNowRange()
		if (active_pre) {
			return
		}
		if (editorCursor.nowRange.startOffset != editorCursor.nowRange.endOffset) {
			stylecmd.insert_keyboard()
			return
		}
		editorCursor.restoreRange()
		if (document.activeElement.id=="editor") {
			var text = `<pre class=javascript active=true></pre>`
			document.execCommand('insertHTML',false,text)
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'block'
			editorCursor.saveRange()
		}
	},
	insertlink: function() {
		//需要恢复光标保证插入位置正确
		editorCursor.restoreRange()
		var data = Editor.getLinkData()
		console.log(data)
		var link = `<a href=${data[0]}>${data[1]}</a>`
		document.execCommand('insertHTML',false,link)
		editorCursor.saveRange()
		editorCursor.selection.collapseToEnd()
	},
	insertfile: function(result){
		editorCursor.restoreRange()
		console.dir(document.activeElement)
		var data = `<img src="${result}">`
		document.execCommand('insertHTML',false,data)
		editorCursor.saveRange()
	},
	insert_keyboard:function(){
		if(!Editor.code.isRangeCantainerCodeLable() && !Editor.code.isCursorInCodeblock_byLabelAttr()){
			//如果两者不相等则说明当前range有内容，且需要满足当前选择区没有被code包含，则将内容包裹code标签
			var code = document.createElement('code') 
			editorCursor.nowRange.surroundContents(code)
		}	
	},
	justifyCenter:function(){
		document.execCommand('justifyCenter',false,'')
	},
	justifyLeft:function(){
		document.execCommand('justifyLeft',false,'')
	}
}



stylecmd.table = {
	insertTable:function(){
		if (!Editor.table.prevent_nest()) {
			document.execCommand('insertHTML',false,"<div><table data-col='2'><tr><td></td><td></td></tr></table></div>")
		}
	},
	insertRowFront:function(){
		let selected_tr = Editor.table.get_tr(editorCursor.nowRange.commonAncestorContainer)
		let table = Editor.getCursorNode('TABLE',editorCursor.nowRange.commonAncestorContainer)
		if (selected_tr && table) {
			let tr = document.createElement('tr')
			let col = table.getAttribute('data-col')
			for (let i=0;i<col;i++){
				let td = document.createElement('td')	
				tr.appendChild(td)
			}	
			selected_tr.parentElement.insertBefore(tr,selected_tr)
		}		
	},
	insertRowBehind:function(){
		let selected_tr = Editor.table.get_tr(editorCursor.nowRange.commonAncestorContainer)
		let table = Editor.getCursorNode('TABLE',editorCursor.nowRange.commonAncestorContainer)
		if (selected_tr && table) {
			let tr = document.createElement('tr')
			let col = table.getAttribute('data-col')
			for (let i=0;i<col;i++){
				let td = document.createElement('td')	
				tr.appendChild(td)
			}	
			Editor.table.insertAfter(selected_tr.parentElement,tr,selected_tr)
		}
	},
	removeRow:function(){
		let selected_tr = Editor.table.get_tr(editorCursor.nowRange.commonAncestorContainer)
		let previous_tr = selected_tr.previousElementSibling
		selected_tr.parentElement.removeChild(selected_tr)
		editorCursor.nowRange.selectNodeContents(previous_tr.firstChild)
		editorCursor.selection.collapseToEnd()
		//editorCursor.nowRange.collapse(false)
	},
	insertColFront:function(){
		let selected_td = Editor.table.get_td(editorCursor.nowRange.commonAncestorContainer)
		let table = Editor.getCursorNode('TABLE',editorCursor.nowRange.commonAncestorContainer)
		let col = Editor.table.get_col(selected_td)
		console.log(col)
		//找出所有的tr，也就是每一，在每一行的对应列（也就是上面找出的光标所在的列）进行增加
		let trs = selected_td.parentElement.parentElement.querySelectorAll('tr')
		for (let tr of trs){
			console.log(tr)
			let td = document.createElement('td')
			tr.insertBefore(td,tr.querySelectorAll('td')[col])
		}
		table.setAttribute('data-col',parseInt(table.getAttribute('data-col'))+1)
	},
	insertColBehind:function(){
		let selected_td = Editor.table.get_td(editorCursor.nowRange.commonAncestorContainer)
		let table = Editor.getCursorNode('TABLE',editorCursor.nowRange.commonAncestorContainer)
		let col = Editor.table.get_col(selected_td)
		console.log(col)
		//找出所有的tr，也就是每一，在每一行的对应列（也就是上面找出的光标所在的列）进行增加
		let trs = selected_td.parentElement.parentElement.querySelectorAll('tr')
		for (let tr of trs){
			console.log(tr)
			let td = document.createElement('td')
			Editor.table.insertAfter(tr,td,tr.querySelectorAll('td')[col])
		}
		table.setAttribute('data-col',parseInt(table.getAttribute('data-col'))+1)
	},
	removeCol:function(){
		let selected_td = Editor.table.get_td(editorCursor.nowRange.commonAncestorContainer)
		let table = Editor.getCursorNode('TABLE',editorCursor.nowRange.commonAncestorContainer)
		let col = Editor.table.get_col(selected_td)
		let trs = selected_td.parentElement.parentElement.querySelectorAll('tr')
		let previous_td = selected_td.previousElementSibling
		for (let tr of trs){
			console.log(tr)
			tr.removeChild(tr.querySelectorAll('td')[col])
		}
		if (col !== "0"){
			console.log(selected_td)
			editorCursor.nowRange.selectNodeContents(previous_td)
			editorCursor.selection.collapseToEnd()
			//editorCursor.nowRange.collapse(false)
		}
		table.setAttribute('data-col',parseInt(table.getAttribute('data-col'))-1)

	},
}