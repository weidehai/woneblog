var editorCursor = {	
	nowRange:'',
	selection:'',
	saveRange: function(){
		try{
			editorCursor.selection = document.getSelection()
			editorCursor.nowRange = editorCursor.selection.getRangeAt(0)
			console.log(editorCursor.nowRange)
			console.log(editorCursor.selection)
		}catch{}
	},
	restoreRange: function(){
		try{
			editorCursor.selection.removeAllRanges()
			editorCursor.selection.addRange(editorCursor.nowRange)
		}catch{}
	},
	setRange:function(node){
		try{
			var newrange = document.createRange()
			newrange.selectNodeContents(node)
			editorCursor.selection.removeAllRanges()
			editorCursor.selection.addRange(newrange)
			editorCursor.selection.collapseToEnd()
		}catch{}
	},
	//给焦点pre代码块增加了active属性，通过pre标签属性判断光标是否在代码块内，真返回此元素，假返回false
	isCursorInCodeblock_byLabelAttr:function(){
		var pre = document.getElementsByTagName('pre')
		var length = pre.length
		for(var i=0;i<length;i++){
			if (pre[i].getAttribute("active")=='true') {
				return pre[i]
			}
		}
		return false
	},
	//判断光标是否在代码块内,通过nowRange节点向外递归查找，真返回此元素，假返回false
	//--------------------------------------------------------------------
	isCursorInCodeblock_byNowRange: function(){
		try{
			var commonAncestorContainer = editorCursor.nowRange.commonAncestorContainer
			if (commonAncestorContainer.parentNode.nodeName == 'PRE'){
				return commonAncestorContainer.parentNode
			}else if(commonAncestorContainer.nodeName == 'PRE'){
				return commonAncestorContainer
			}else if (commonAncestorContainer.parentNode.nodeName != 'DIV') {
				var commonAncestorContainer = commonAncestorContainer.parentNode
				editorCursor.isCursorInCodeblock_byNowRange(commonAncestorContainer)
			}else {
				return false
			}
		}catch{}
	},
	//-------------------------------------------------------------------------
	/**
	判断nowRange是否包含了code标签，三种情况
		1、code在Range头部
		2、code在Range尾部
		3、code在Range中间
	包含返回真，反之返回假
	**/
	isRangeCantainerCodeLable:function(){
		//在头部
		var startContainer = editorCursor.nowRange.startContainer
		if(startContainer.parentNode.nodeName=="CODE"){
			return true 
		}
		//在尾部
		if(editorCursor.nowRange.endContainer.parentNode.nodeName=="CODE"){
			return true
		}
		//在中间
		var nextsibling = startContainer.nextSibling
		while(nextsibling){
			if (nextsibling.nodename=="CODE") {
				return true
			}
			nextsibling = nextsibling.nextSibling
		}
		return false
	}
	

}