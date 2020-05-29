window.onload = function() {
	eventListen()
	actionInit()
	billsInit()
	emojiInit()
	createMeta()
	createTag()
	initComment()
	highlight()
}


function initComment(argument) {
	var mycomment = new mycomment_sys()
	var replybtn = document.getElementsByClassName('comment_btn')
	replybtn[0].addEventListener('click',mycomment.reply.bind(mycomment))
	mycomment.verify()
}

function eventListen(){
	var emoji = document.getElementsByClassName('emoji')
	var up = document.getElementsByClassName('icon-up')
	emoji[0].addEventListener('click',function(){
		var emoji_content = document.getElementsByClassName('emoji_content')
		if (emoji_content[0].style.display=='block') {
			emoji_content[0].style.display='none'
		}else{
			emoji_content[0].style.display='block'
		}
	})
	up[0].addEventListener('click',function(){
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
	})
}


function billsInit(){
	var bills = document.getElementsByClassName('icon-bills')
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
}
function emojiInit(){
	var emojiContent = document.getElementsByClassName('emoji_content')
	var emojiI = emojiContent[0].getElementsByTagName('i')
	var length = emojiI.length
	for (let i=0;i<length;i++){
		emojiI[i].addEventListener('mousedown',function(e){
			e.preventDefault()
		})
		emojiI[i].addEventListener("click",function(){
			if (document.activeElement.tagName == 'TEXTAREA') {
				document.execCommand('insertHTML',false,emojiI[i].innerText)
			}else{
				var commentext = document.getElementsByClassName('commentext')
				commentext[0].focus()
				document.execCommand('insertHTML',false,emojiI[i].innerText)
			}
			
		})
	}	
}

function emojiShow(){
	
}
function actionInit(){
	//根据服务器端生成的数据渲染，若data-able为0则隐藏此li
	var action = document.getElementById('action')
	var postbtn = action.getElementsByClassName('postbtn')
	var tips = document.getElementsByClassName('postbtn-tips')
	var a = action.getElementsByTagName('a')
	for(var i=0;i<postbtn.length;i++){
		//闭包保护变量
		(function(i){
			postbtn[i].addEventListener('mouseover',function(){
				tips[i].style.display = 'inline-block'
			})
			postbtn[i].addEventListener('mouseout',function(){
				tips[i].style.display = 'none'
			})
		})(i)
		try{
			able =a[i].getAttribute('data-able')
		}catch(e){
			
		}
		if (able==0) {
			postbtn[i].style.display = 'none'
			postbtn[i].style.marginRight = '0';
			able=1
		}
	}
}

function createMeta() {
	//截取正文的一部分作为文章的描述，摘要
	metas = document.getElementsByTagName('meta')
	var cont = document.getElementsByClassName('detail')
	var text = cont[0].innerText
	var desc = text.slice(0,201)
	for (i=0;i<metas.length;i++) {
		if (metas[i].getAttribute('name') === "description") {
			metas[i].setAttribute('content',desc.replace(/[\n]/g, ""))
		}
		if (metas[i].getAttribute('property') === "og:description") {
			metas[i].setAttribute('content',desc.replace(/[\n]/g, ""))
		}
	}
}


function createTag() {
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
}


function highlight() {
	main = document.getElementsByClassName('detail')[0]
	for(let ele of main.getElementsByTagName('pre')){
		if (main.getAttribute('class')=='javascript') {
			var uhl = new whl(ele)
			uhl.startMatch()
		}
	}		
}