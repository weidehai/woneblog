window.onload = function(){
	var button = document.getElementsByTagName('button')
	init = new init()
	login =new login()
	init.gettime()
	init.addevent(button[0],'click',login.getinput.bind(login))

	
}


function init(){
	this.date = new Date()
}
init.prototype.gettime = function(){
	var login = document.getElementsByClassName('login')
	var year = this.date.getFullYear()
	var month = this.date.getMonth()
	var day = this.date.getDate()
	var h = this.date.getHours()
	var m = this.date.getMinutes()
	var days = this.date.getDay()
	switch(days){
		case 1:
			days = '星期一'
			break
		case 2:
			days = '星期二'
			break
		case 3:
			days = '星期三'
			break
		case 4:
			days = '星期四'
			break
		case 5:
			days = '星期五'
			break
		case 6:
			days = '星期六'
			break
		case 0:
			days = '星期日'
			break
	}
	mydate  =`${year}年${month}月${day}日 ${days} ${h}时${m}分`
	span = document.createElement('span')
	span.style.display = 'block'
	span.style.marginTop = '30px'
	text = document.createTextNode(mydate)
	span.appendChild(text)
	login[0].appendChild(span)
}
init.prototype.addevent=function(el,e,fn){
	el.addEventListener(e,fn)
}


function login(){
	this.username = ''
	this.password = ''
}

login.prototype.getinput = function(){
	var user = document.getElementById('username')
	var pass = document.getElementById('password')
	this.username = user.value
	this.password = pass.value
	this.verify()
}
login.prototype.verify = function(){
	myajax = interactive.creatajax()
	myajax.open('post','/verify',true);
	userdata = {
		'username':this.username,
		'password':this.password
	}
	userdata = JSON.stringify(userdata)
	myajax.send(userdata)
	myajax.onreadystatechange = function(){
		if (myajax.readyState == 4) {
			r = myajax.responseText
			if (r=='login failed') {
				var tip = document.getElementsByClassName('tip')
				tip[0].style.display='block'
			}
			if (r=='login success') {
				window.location.href='/manage'
			}
		}
	}
}