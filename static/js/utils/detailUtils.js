var detailU = {
	datehandle:function(time){
		var d,myminutes
		time?d=new Date(time):d=new Date()
		d.getMinutes()<10?myminutes = '0' + d.getMinutes():myminutes = d.getMinutes()
		var newdate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + myminutes
		return newdate
	},
	
	get_systeminfo:function(){
		var ua = navigator.userAgent
		var windows = /NT\s(.+?);/
		var android = /Android\s(.+?);/
		var ios = /OS\s(.+?)\s/
		if (ua.match(windows)) {
			var system = 'Windows '+ua.match(windows)[1]
			return system
		}else if(ua.match(android)){
			var system = 'Android '+ua.match(android)[1]
			return system
		}else if (ua.match(ios)) {
			var system = 'IOS '+ua.match(ios)[1].replace(/_/g,'.')
			return system
		}
	},
	get_browserinfo:function(){
		var ua = navigator.userAgent
		var edge = /Edge\/(.+?)$/
		var ie = /Trident/
		var uc = /UCBrowser\/(.+?)\s/
		var chrome = /Chrome\/(.+?)\s/
		var safari = /Version\/(.+?)\s/
		if (ua.match(edge)) {
			var browser = 'Edge '+ua.match(edge)[1]
			return browser
		}else if(ua.match(ie)){
			var browser = 'IE'
			return browser
		}else if (ua.match(uc)) {
			var browser = 'UC '+ua.match(uc)[1]
			return browser
		}else if (ua.match(chrome)) {
			var browser = 'Chrome '+ua.match(chrome)[1]
			return browser
		}else if (ua.match(safari)) {
			var browser = 'Safari '+ua.match(safari)[1]
			return browser
		}
	},
	emoji_init:function(){
		var emojiContent = document.getElementsByClassName('emoji_content')
		var emojiI = emojiContent[0].getElementsByTagName('i')
		var length = emojiI.length
		for (let i=0;i<length;i++){
			emojiI[i].addEventListener('mousedown',function(e){
				e.preventDefault()
			})
			emojiI[i].addEventListener("click",function(){
				if (detailU.isRangeIn()) {
					document.execCommand('insertHTML',false,emojiI[i].innerText)
				}else{
					var commentext = document.getElementsByClassName('commentext')
					commentext[0].focus()
					document.execCommand('insertHTML',false,emojiI[i].innerText)
				}
				
			})
		}	
	},
	//判断光标是否在编辑框内
	isRangeIn:function(){
		if (document.activeElement.tagName == 'TEXTAREA') {
			return true
		}else{
			return false
		}
	},
	bills_init:function(bills){
		bills[0].addEventListener('click',function() {
			var toc = document.getElementById('toc')
			if (toc.getAttribute('data-show') === 'true') {
				toc.style.display = 'none'
				toc.setAttribute('data-show',false)
			}else {
				toc.style.display = 'block'
				toc.setAttribute('data-show',true)
			}
		})
	},
	show_comment:function(){
		var comment_area = document.getElementById('comment_area')
		comment_area.style.display='block'
	},
	action_init:function(el1,el2,el3){
		//根据服务器端生成的数据渲染，若data-able为0则隐藏此li
		for(var i=0;i<el1.length;i++){
			//闭包保护变量
			(function(i){
				el1[i].addEventListener('mouseover',function(){
					el2[i].style.display = 'inline-block'
				})
				el1[i].addEventListener('mouseout',function(){
					el2[i].style.display = 'none'
				})
			})(i)
			try{
				able =el3[i].getAttribute('data-able')
			}catch(e){
				
			}
			if (able==0) {
				el1[i].style.display = 'none'
				el1[i].style.marginRight = '0';
				able=1
			}
		}
	},
	emoji_show: function(){
		var emoji_content = document.getElementsByClassName('emoji_content')
		if (emoji_content[0].style.display=='block') {
			emoji_content[0].style.display='none'
		}else{
			emoji_content[0].style.display='block'
		}
	},
	createTag: function() {
		var cont = document.getElementsByClassName('detail')
		var list = document.getElementById('lablelist')
		h1 = cont[0].getElementsByTagName('h1')
		h2 = cont[0].getElementsByTagName('h2')
		for(i=0;i<cont[0].childNodes.length;i++) {
			//创建一级标题和二级标题
			if (cont[0].childNodes[i].tagName == 'H1'){
				cont[0].childNodes[i].setAttribute('id',cont[0].childNodes[i].innerText)
				li_top = document.createElement('li')
				li_top.setAttribute('class','top-title')
				a_top = document.createElement('a')
				a_top.setAttribute('href',"#"+cont[0].childNodes[i].innerText)
				text_top_title = document.createTextNode(cont[0].childNodes[i].innerText)
				li_top.appendChild(a_top)
				list.appendChild(li_top)
				a_top.appendChild(text_top_title)
			}else if(cont[0].childNodes[i].tagName == 'H2' && list.lastElementChild!=null){
				cont[0].childNodes[i].setAttribute('id',cont[0].childNodes[i].innerText)
				li_sec = document.createElement('li')
				li_sec.setAttribute('class','sec-title')
				li_sec.style.display = 'none'
				a_sec = document.createElement('a')
				a_sec.setAttribute('href',"#"+cont[0].childNodes[i].innerText)
				text_sec_title = document.createTextNode(cont[0].childNodes[i].innerText)
				li_sec.appendChild(a_sec)
				list.lastElementChild.appendChild(li_sec)
				a_sec.appendChild(text_sec_title);
				//鼠标悬停在一级标题上显示二级标题
				//mouseout:当鼠标离开作用元素或者其子元素都会触发，mouseleave只有离开作用元素才会触发
				(function(el) {
					list.lastElementChild.firstElementChild.addEventListener('mouseover',function(){
						el.style.display = 'block'
					})
					list.lastElementChild.addEventListener('mouseleave',function(){
						el.style.display = 'none'
					})
				})(li_sec)
			}
		}
	},
	back_to_up: function(){
		backtop_animation = setInterval(function(){
			var top = document.documentElement.scrollTop
			var speed = top/4
			if (top!=0) {
				document.documentElement.scrollTop -=speed
			}
			if (top==0) {
				clearInterval(backtop_animation)
			}
		},30)
	},
	//当获取到后端返回的数据就关闭加载动画
	shutload: function() {
		loading = document.getElementsByClassName('loadingTip')
		loading[0].style.display = 'none';
	},
	geturl_param: function() {
		if (window.location.search != '') {
			var detail = document.getElementsByClassName('detail')
			var id = window.location.search.replace('?id=','')
			detail[0].setAttribute('data-id',id)
			return id
		}
		return ''
	}
}