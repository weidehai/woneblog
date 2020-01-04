window.onload = function() {
	var i = document.getElementsByTagName('i')
	var e = document.getElementById('editor')
	var picture = document.getElementById('picture')
	var h2 = document.getElementById('h2')
	var h1 = document.getElementById('h1')
	var list = document.getElementById('list')
	var link = document.getElementById('link')
	var linkbt = document.getElementById('insertL')
	var file = document.getElementById('file')
	var submitbt = document.getElementById('submit')
	var video = document.getElementById('video')
	var language = document.getElementById('language')
	var languagediv = document.getElementsByClassName('language')
	var code = document.getElementById('code')
	var code_status = document.getElementsByClassName('code_status')
	var lang_item = document.getElementById('lang_item')
	var code_keyword = language.getElementsByTagName('li')[language.getElementsByTagName('li').length-1]
	//阻止样式按钮的点击获取焦点事件
	for (var k=0;k<i.length;k++) {
		editorU.preventDefault(i[k],'mousedown')
	}
	editorU.preventDefault(code_keyword,'mousedown')
    code_status[0].addEventListener('click',function(){
		var el = editorCursor.isCursorInCodeblock_byLabelAttr()
		Editor.exit_code(el)
    })
	Editor.init()
	//为每个样式按钮注册命令
	h1.addEventListener('click',stylecmd.formatblockH1)
	h2.addEventListener('click',stylecmd.formatblockH2)
	list.addEventListener('click',stylecmd.insertList)
	linkbt.addEventListener('click',stylecmd.insertlink)
	file.addEventListener('change',network_operation.upload)
	code_keyword.addEventListener('click',stylecmd.insert_keyboard)
	for(let i=0;i<language.getElementsByTagName('li').length-1;i++){
		editorU.preventDefault(language.getElementsByTagName('li')[i],'mousedown')
		language.getElementsByTagName('li')[i].addEventListener('click',stylecmd.insertHtml)
	}
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { 
		code.addEventListener("click",function(){
			editorU.suspendControl(language)
			e.blur()
		})
	}else{
		languagediv[0].addEventListener("mouseover",function(){
			language.style.display='block'
			language.setAttribute('data-show',true)
		})
		languagediv[0].addEventListener("mouseout",function(){
			language.style.display='none'
			language.setAttribute('data-show',false)
		})
	}
	//为提交按钮注册点击命令
	submitbt.addEventListener('click',interactive.ajaxpost)
	link.addEventListener('click',function() {
		var linkedit = document.getElementById('linkedit')
		editorU.suspendControl(linkedit,"linkhref")
	})
	if (editorU.geturl_param()) {
		var query_str = editorU.geturl_param() + '?article_title?article_tag?article_content'
		interactive.ajaxmain(e,query_str)
	}
}
	








