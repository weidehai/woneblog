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
	//给焦点pre代码块增加了active属性，通过此属性判断光标是否在代码块内
	nodeSelect:function(){
		var pre = document.getElementsByTagName('pre')
		var length = pre.length
		for(var i=0;i<length;i++){
			if (pre[i].getAttribute("active")) {
				return pre[i]
			}
		}
		return false
	},
	//pre代码块的状态
	prestatus:function(e){
		var is_active = myrange.nodeSelectByRe(e)
		console.log(is_active)
		if (is_active) {
			is_active.setAttribute('active',true)
		}
	},
	//判断光标是否在代码块内,通过递归元素节点
	//--------------------------------------------------------------------
	nodeSelectByRe: function(commonAncestorContainer){
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
	//-------------------------------------------------------------------------

}