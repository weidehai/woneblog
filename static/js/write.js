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
	var lang_item = document.getElementById('lang_item')
	//阻止样式按钮的点击获取焦点事件,点击每个样式按钮时要保存当前range
	for (var k=0;k<i.length;k++) {
		writerU.preventDefault(i[k],'mousedown')
	}
	writerU.preventDefault(picture,'mousedown')
	writerU.preventDefault(video,'mousedown')
    myrange.saveRange(picture,'mouseup')
    myrange.saveRange(video,'mouseup')
    myrange.saveRange(e,'blur')

	myeditor.init()
	//为每个样式按钮注册命令
	writerU.addEvent(h1,'click',stylecmd.formatblockH1)
	writerU.addEvent(h2,'click',stylecmd.formatblockH2)
	writerU.addEvent(list,'click',stylecmd.insertList)
	writerU.addEvent(linkbt,'click',stylecmd.insertlink)
	writerU.addEvent(file,'change',writerU.upload)
	
	
	
	
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { 
		writerU.addEvent(code,"click",function(){
			writerU.controlSwitch(language)
		})
		for (let i of language.getElementsByTagName('li')){
			writerU.preventDefault(i,'mousedown')
			writerU.addEvent(i,'click',stylecmd.inserthtml)
		}
	}else{
		writerU.addEvent(languagediv[0],"mouseover",function(){
			language.style.display='block'
			language.setAttribute('data-show',true)
		})
		writerU.addEvent(languagediv[0],"mouseout",function(){
			language.style.display='none'
			language.setAttribute('data-show',false)
		})
		//语法选择列表
		var code_keyword = language.getElementsByTagName('li')[language.getElementsByTagName('li').length-1]
		writerU.preventDefault(code_keyword,'mousedown')
		myrange.saveRange(code_keyword,'mouseup')
		writerU.addEvent(code_keyword,'click',stylecmd.insert_keyboard)
		for(let i=0;i<language.getElementsByTagName('li').length-1;i++){
			writerU.preventDefault(language.getElementsByTagName('li')[i],'mousedown')
			writerU.addEvent(language.getElementsByTagName('li')[i],'click',stylecmd.inserthtml)
		}
	}
	
	//为提交按钮注册点击命令
	writerU.addEvent(submitbt,'click',interactive.ajaxpost)


	//悬浮窗口不能同时存在，一个打开其他的自动关闭
	writerU.addEvent(link,'click',function() {
		var linkedit = document.getElementById('linkedit')
		writerU.controlSwitch(linkedit,"linkarea")
	})

	if (writerU.geturl_param()) {
		var query_str = writerU.geturl_param() + '?article_title?article_tag?article_content'
		interactive.ajaxmain(e,query_str)
	}
}
	








