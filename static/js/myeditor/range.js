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
	//������������һ��active��������ʾ��ǰ����Ƿ��ڴ������
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
	//�жϹ���Ƿ��ڴ������,��ȡ��ǰrang���ڽڵ㲢�������ϲ��ң�ֱ��div����
	�ع�����
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