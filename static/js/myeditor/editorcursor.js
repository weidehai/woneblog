var editorCursor = {	
	nowRange:'',
	selection:'',
	saveRange: function(){
		try{
			editorCursor.selection = document.getSelection()
			editorCursor.nowRange = editorCursor.selection.getRangeAt(0)
			console.log(editorCursor.nowRange)
			console.log(editorCursor.selection)
			//console.log(editorCursor.selection)
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