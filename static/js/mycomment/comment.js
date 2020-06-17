function mycomment_sys(){
	this.xhr = Interactive.creatXHR()
	this.replybelong=''
	this.replyfor=''
	this.commentdata = ''
	this.aternick=""
	this.logined = false
	this.offset=0
	//注册@事件
	this.ater = function(e){
		var commentext = document.getElementsByClassName('commentext')
		var nick = e.target.getAttribute('nick')
		if (e.target.getAttribute('replybelong')) {
			this.replybelong = e.target.getAttribute('replybelong')
		}else{
			this.replybelong = e.target.getAttribute('ckey')
		}
		this.replyfor = e.target.getAttribute('ckey')
		commentext[0].focus()
		commentext[0].setAttribute('placeholder',"@"+nick)
		this.aternick="@"+nick
	}
	//注册删除事件
	this.delcomment = function(e){
		var delkey = e.target.getAttribute('delete_key')
		var url = `/commentdel?del_key=${delkey}`
		this.xhr.open('get',url,true)
		this.xhr.onreadystatechange=()=>{
			if (this.xhr.readyState===4) {
				if (this.xhr.responseText==="200ok") {
					e.target.parentElement.parentElement.parentElement.remove()
					var comment_data = document.getElementsByClassName("comment_data")
					if (comment_data[0].innerHTML=='') {
						comment_data[0].className += " empty"
						comment_data[0].innerText = '快来做第一个评论的人吧~'
					}
				}
			}
		}
		this.xhr.send()
	}
	//注册回复事件
	this.reply = function(){
		var commentext = document.getElementsByClassName('commentext')
		var content = commentext[0].value
		if (content) {
			this.send_commentdata()
		}else{
			commentext[0].focus()
		}
	}
	this.data_wrapper = function(){
		var commentext = document.getElementsByClassName('commentext')
		var commentor_nick = document.getElementsByClassName('commentor_nick')
		var commentor_mail = document.getElementsByClassName('commentor_mail')
		var commentor_link = document.getElementsByClassName('commentor_link')
		var content = commentext[0].value
		var nick = commentor_nick[0].value!=''?commentor_nick[0].value:'anonymous'
		var mail = commentor_mail[0].value
		var link = commentor_link[0].value
		var systemname = systeminfo.get_systeminfo()
		var browsername = systeminfo.get_browserinfo()
		var data ={
			"comment_user":nick,
			"comment_mail":mail,
			"comment_link":link,
			"comment_text":content,
			"comment_avatar":this.randomavatar(),
			"comment_system":systemname,
			"comment_browser":browsername,
			"comment_for_post_id":document.getElementsByClassName('detail')[0].getAttribute('data-id'),
			"comment_time":dateFormat("YYYY-MM-DD hh:mm"),
			"reply_for":this.replyfor,
			"comment_key":Math.random().toString().substring(2,5)+Date.now(),
			"reply_belong":this.replybelong,
			"ater_nick":this.aternick,
			"table":"comment"
		}
		return data
	}
	this.send_commentdata = function(){
		var commentor_name = document.getElementsByClassName('commentor_nick')
		var commentor_mail = document.getElementsByClassName('commentor_mail')
		var commentor_link = document.getElementsByClassName('commentor_link')
		var commentext = document.getElementsByClassName('commentext')
		this.xhr.open('post','/save',true)
		this.xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
		this.commentdata = this.data_wrapper()
		var legalmail = this.commentdata['mail']?this.filteremail(this.commentdata['mail']):true
		var legallink = this.commentdata['link']?this.filterlink(this.commentdata['link']):true
		var legalname = this.commentdata['comment_user']?this.filtername(this.commentdata['comment_user']):true
		if (legalmail && legallink && legalname) {
			//把对象转换成字符串发送	
			this.xhr.send(JSON.stringify(this.commentdata))
			this.xhr.onreadystatechange=function(){
				if (this.xhr.readyState == 4) {
					var resultcode = this.xhr.responseText
					if (resultcode=='post success') {	
						this.message_area_built()
						this.clearinput()
						commentext[0].setAttribute('placeholder',"说点什么？")
						commentor_name[0].placeholder='昵称'
						commentor_mail[0].placeholder='邮箱'
						commentor_link[0].placeholder='网址'
						this.replybelong=''
						this.replyfor=''
						this.aternick=''
						this.commentdata=''
					}
				}
			}.bind(this)
		}else if (!legalname) {
			commentor_name[0].placeholder='用户名不能超过15个字符'
			commentor_name[0].value=''
			commentor_name[0].focus()
		}else if (!legalmail){
			commentor_mail[0].placeholder='请输入正确的邮箱地址'
			commentor_mail[0].value=''
			commentor_mail[0].focus()
		}else {
			commentor_link[0].placeholder='网址不能超过50个字符'
			commentor_link[0].value=''
			commentor_link[0].focus()
		}
		
			
	}
	this.get_commentdata = function(){
		var postid = document.getElementsByClassName('detail')[0].getAttribute('data-id')
		var loading_wrapper = document.getElementsByClassName("loading_wrapper")
		var commentqueryurl = `/getcomment?id=${postid}&offset=${this.offset}`
		loading_wrapper[0].style.display = 'flex'
		this.xhr.open('get',commentqueryurl,true)
		this.xhr.send()
		this.xhr.onreadystatechange=function(){
			console.log(this.xhr.readyState)
			if (this.xhr.readyState == 4) {
				var resultdata = eval("("+this.xhr.responseText+")")
				var length = resultdata.length
				var comment_data = document.getElementsByClassName("comment_data")
				loading_wrapper[0].style.display = 'none'
				comment_data[0].style.display = 'block'
				if (length==0) {
					if (this.offset==0) {
						comment_data[0].className += " empty"
						comment_data[0].innerText = '快来做第一个评论的人吧~'
					}
					laflush.removelistener()
					return
				}else{
					for(i=length-1;i>=0;i--){
						this.commentdata = resultdata[i]
						this.message_area_built()
					}
				}
				this.offset= this.offset + 10
				laflush.eventlistener()
				laflush.content_height = document.documentElement.scrollHeight
				laflush.flush = ()=>{this.get_commentdata()}
			}
		}.bind(this)
	}
	this.message_area_built = function(){
		var comment_data = document.getElementsByClassName('comment_data')
		comment_data[0].className = "comment_data"
		if (this.commentdata["reply_belong"]) {
			var commentblock = document.createElement('div')
			commentblock.setAttribute('class','inline')
			commentblock.setAttribute('commentkey',this.commentdata["comment_key"])
		}else{
			var commentblock = document.createElement('div')
			commentblock.setAttribute('class','wrapper')
			commentblock.setAttribute('commentkey',this.commentdata["comment_key"])
		}
		var avatar = document.createElement('div')
		avatar.setAttribute('class','avatar')
		avatar.setAttribute('id',this.commentdata["comment_key"])
		var img = document.createElement('img')	
		img.setAttribute('src',this.commentdata["comment_avatar"])
		avatar.appendChild(img)
		var main = document.createElement('div')
		main.setAttribute('class','main')
		var span1 = document.createElement('span')
		var span2 = document.createElement('span')
		var span3 = document.createElement('span')
		var nick = document.createTextNode(this.commentdata["comment_user"])
		var systemname = document.createTextNode(this.commentdata["comment_system"])
		var browsername = document.createTextNode(this.commentdata["comment_browser"])
		span1.setAttribute('class','nick')
		span2.setAttribute('class','sysinfo')
		span3.setAttribute('class','sysinfo')
		span1.appendChild(nick)
		span2.appendChild(systemname)
		span3.appendChild(browsername)
		var div1 = document.createElement('div')
		var span4 = document.createElement('span')
		var span5 = document.createElement('span')
		span4.setAttribute('class','time')
		span4.style.verticalAlign = 'top'
		//sapn5为@按钮
		span5.setAttribute('class','reply')
		span5.setAttribute('ckey',this.commentdata["comment_key"])
		span5.setAttribute('replybelong',this.commentdata["reply_belong"])
		span5.setAttribute('nick',this.commentdata["comment_user"])
		var time = document.createTextNode(this.commentdata["comment_time"])
		var reply = document.createTextNode('回复')
		span4.appendChild(time)
		span5.appendChild(reply)
		//为@按钮注册@事件,bind保持this统一
		span5.addEventListener('click',this.ater.bind(this))
		div1.appendChild(span4)
		div1.appendChild(span5)
		if (this.logined) {
			var span6= document.createElement('span')
			span6.setAttribute('class','delete')
			span6.setAttribute('delete_key',this.commentdata["comment_key"])
			var del = document.createTextNode('删除')
			span6.appendChild(del)
			span6.addEventListener('click',this.delcomment.bind(this))
			div1.appendChild(span6)
		}
		var message = document.createElement('div')
		message.setAttribute('class','message')
		var p = document.createElement('p')
		var words = document.createTextNode(this.commentdata["comment_text"])
		if (this.commentdata['ater_nick']) {
			var aterlink = document.createElement('a')
			aterlink.setAttribute('class','ater')
			aterlink.setAttribute('replyfor',this.commentdata['reply_for'])
			aterlink.setAttribute('href','#'+this.commentdata['reply_for'])
			var ater = document.createTextNode(this.commentdata['ater_nick']+',')
			aterlink.appendChild(ater)
			aterlink.addEventListener('click',this.findater)
			p.appendChild(aterlink)
		}
		p.appendChild(words)
		message.appendChild(p)
		main.appendChild(span1)
		main.appendChild(span2)
		main.appendChild(span3)
		main.appendChild(div1)
		main.appendChild(message)
		commentblock.appendChild(avatar)
		commentblock.appendChild(main)
		if (this.commentdata["reply_belong"]) {
			var find = "[commentkey='"+this.commentdata['reply_belong']+"']"
			var replyfloor = document.querySelector(find)
			replyfloor.getElementsByClassName('main')[0].appendChild(commentblock)
		}else{
			comment_data[0].appendChild(commentblock)
		}	
	}
	this.clearinput = function(){
		var commentext = document.getElementsByClassName('commentext')
		var commentor_nick = document.getElementsByClassName('commentor_nick')
		var commentor_mail = document.getElementsByClassName('commentor_mail')
		var commentor_link = document.getElementsByClassName('commentor_link')
		commentext[0].value = ""
		commentor_nick[0].value = ""
		commentor_mail[0].value = ""
		commentor_link[0].value = ""
	}
	this.randomavatar = function(){
		var avatarsrc = "../static/avatar/avatar"+(parseInt(Math.random()*5)+1)+".png"
		return avatarsrc
	}
	this.findater=function(e){
		var ckey = e.target.getAttribute('replyfor')
		var find = "[commentkey='"+ckey+"']"
		var beater = document.querySelector(find).getElementsByClassName('nick')[0]
		beater.style.color='#ff9a00'
		var mytimeout = setTimeout(function(){
			beater.style.color='#1abc9c'
			clearTimeout(mytimeout)
		},3000)
	}
	this.filteremail=function(str){
		var patt = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
		var check = str.length>50?false:patt.test(str)
		return check
	}
	this.filterlink=function(str){
		var check = str.length<=50
		return check
	}
	this.filtername=function(str){
		var check = str.length<=15
		return check
	}
	this.verify = function(){
		Interactive.XHRVerify(result=>{
			if (result==="has been login") {
				this.logined = true
			}
			this.get_commentdata()
		})
	}
	
}