var myrange = {
	nowRange:'',
	sel:'',
	saveRange: function(el,event){
		el.addEventListener(event,function(e){
			try{
				myrange.sel = document.getSelection()
				myrange.nowRange = myrange.sel.getRangeAt(0)
			}catch{

			}finally{
				if (e.type=="blur") {
					var status = document.getElementsByClassName('code_status')
					status[0].style.display = 'none'
				}
			}
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
	update_prestatus:function(e){
		console.log(e)
		var is_active = myrange.nodeSelectByRe(e)
		if (is_active) {
			is_active.setAttribute('active',true)
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'block'
		}else{
			var pre = document.getElementsByTagName("pre")
			var length = pre.length
			for(i=0;i<length;i++){
				pre[i].setAttribute('active',false)
			}
			var status = document.getElementsByClassName('code_status')
			status[0].style.display = 'none'
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