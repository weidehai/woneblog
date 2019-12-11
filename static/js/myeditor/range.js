var myrange = {
	nowRange:'',
	sel:'',
	saveRange: function(el,event){
		el.addEventListener(event,function(e){
			try{

				myrange.sel = document.getSelection()
				myrange.nowRange = myrange.sel.getRangeAt(0)
				console.log(myrange.nowRange)
			}catch{}
			
		})
	},
	restoreRange: function(){
		try{
			myrange.sel.removeAllRanges()
			myrange.sel.addRange(myrange.nowRange)
		}catch{}
		
	},
	//给代码块添加了一个active属性来表示当前光标是否在代码块内
	nodeSelect:function(){
		var pre = document.getElementsByTagName('pre')
		var length = pre.length
		for(var i=0;i<length;i++){
			if (pre[i].getAttribute("active")) {
				return pre[i]
			}
		}
		return false
	}
	/**
	//判断光标是否在代码块内,获取当前rang所在节点并不断往上查找，直到div结束
	重构代码
	--------------------------------------------------------------------
	nodeSelect: function(commonAncestorContainer){
		if (commonAncestorContainer.parentElement.nodeName == 'PRE'){
			return commonAncestorContainer.parentElement
		}else if(commonAncestorContainer.nodeName == 'PRE'){
			return commonAncestorContainer
		}else if (commonAncestorContainer.parentElement.nodeName != 'DIV') {
			var commonAncestorContainer = commonAncestorContainer.parentElement
			myrange.nodeSelect(commonAncestorContainer)
		}else {
			return false
		}
	}
	-------------------------------------------------------------------------
	**/

}