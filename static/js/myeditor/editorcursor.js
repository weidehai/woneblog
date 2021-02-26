var editorCursor = {
	selection:document.getSelection(),
	nowRange:'',
	saveRange: function(){
		try{
			editorCursor.nowRange = editorCursor.selection.getRangeAt(0)
		}catch{}
	},
	restoreRange: function(){
		try{
			editorCursor.selection.removeAllRanges()
			editorCursor.selection.addRange(editorCursor.nowRange)
		}catch{}
	},
	setRange:function(node,position=2){
		try{
			var newrange = document.createRange()
			newrange.selectNodeContents(node)
			editorCursor.selection.removeAllRanges()
			editorCursor.selection.addRange(newrange)
			position==2?editorCursor.selection.collapseToEnd():editorCursor.selection.collapseToStart()
		}catch{}
	},
}