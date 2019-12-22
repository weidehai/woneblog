window.onload = function() {
	get_info()
	suspended()

}


function register_write(){
	var write = document.getElementById('write')
	window.location.href = '/publish'
}

function editor(id) {
	url = '/publish?getid=' + id
	window.location.href = url
}


// function preventmove(e){
// 	e.preventDefault()
// }

function suspended(){
	var write = document.getElementById('write')
	mycoordinate = new coordinate(write)
	write.addEventListener('mousedown',mycoordinate.mousedown.bind(mycoordinate),false)
	//write.addEventListener('mousemove',mycoordinate.mousemove.bind(mycoordinate),false)
	write.addEventListener('mouseup',mycoordinate.mouseup.bind(mycoordinate),false)
	write.addEventListener('touchstart',mycoordinate.mousedown.bind(mycoordinate),false)
	//write.addEventListener('touchmove',mycoordinate.mousemove.bind(mycoordinate),false)
	write.addEventListener('touchend',mycoordinate.mouseup.bind(mycoordinate),false)

}
function coordinate(element){
	this.flag = false
	this.el = element
	this.time = 0
	this.offsetLeft = 0
	this.offsetTop = 0
	this.location={
		x:0,
		y:0
	}
}

coordinate.prototype.mousedown=function(e){
	e.preventDefault()
	e.stopPropagation()
	this.flag = true
	this.time = new Date().getTime()
	if (e.touches) {
		var touch = e.touches[0]
	}else{
		var touch = e
	}
	this.location.x = touch.clientX
	this.location.y = touch.clientY
	this.offsetLeft = this.el.offsetLeft
	this.offsetTop = this.el.offsetTop
	this.__newev__ = coordinate.prototype.mousemove.bind(this)
	document.body.addEventListener('mousemove',this.__newev__,false)
	document.body.addEventListener('touchmove',this.__newev__,{passive:false})
}

coordinate.prototype.mousemove=function(e){
	e.preventDefault()
	e.stopPropagation()
	if (e.touches) {
		var touch = e.touches[0]
	}else{
		var touch = e
	}
	if (this.flag) {
		var dx = touch.clientX-this.location.x
		var dy = touch.clientY-this.location.y
		var nx = dx+this.offsetLeft
		var ny = dy+this.offsetTop
		this.el.style.left = nx+"px"
		this.el.style.top = ny+"px"
	}
}

coordinate.prototype.mouseup=function(){
	this.flag = false
	ntime = new Date().getTime()
	dtime = ntime - this.time
	this.el.onclick = null
	if (dtime>150) {
		this.el.onclick = null
	}else{
		register_write()
	}
	document.body.removeEventListener('mousemove',this.__newev__)
	document.body.removeEventListener('touchmove',this.__newev__)
}


function get_info() {
	oajax = interactive.creatajax()
	myurl = '/adminofmanage'
	oajax.open('get',myurl,true);
	oajax.send(null)
	oajax.onreadystatechange = function() {
		if (oajax.readyState == 4) {
			try {
				wrapper = document.getElementsByClassName('wrapper')
				str = oajax.responseText
				var obj = eval('(' + str + ')')
				for (i=0;i<obj.length;i++) {
					ul = document.createElement('ul')
					li1 = document.createElement('li')
					li1.setAttribute('style','width:55%;')
					li2 = document.createElement('li')
					li2.setAttribute('style','width:23%;')
					li3 = document.createElement('li')
					li3.setAttribute('style','width:22%;')
					bt1 = document.createElement('button')
					func = "editor(" + obj[i]['postkey'] + ")"
					bt1.setAttribute('onclick',func)
					bt2 = document.createElement('button')
					bt2.setAttribute('class','delete')
					bt2.setAttribute('delid',obj[i]['postkey'])
					text1 = document.createTextNode(obj[i]['article_title'])
					text2 = document.createTextNode(obj[i]['article_time'].replace(' 00:00:00 GMT',''))
					text3 = document.createTextNode('编辑')
					text4 = document.createTextNode('删除')
					ul.appendChild(li1)
					ul.appendChild(li2)
					ul.appendChild(li3)
					li1.appendChild(text1)
					li2.appendChild(text2)
					li3.appendChild(bt1)
					li3.appendChild(bt2)
					bt1.appendChild(text3)
					bt2.appendChild(text4)
					wrapper[0].appendChild(ul)
				}
				register_del()

			}catch(e) {
				alert('the page you visit is error')
			}
		}
	}
}

//为每个del按钮注册命令
function register_del() {
	var del = document.getElementsByClassName('delete')
	for (var i=0;i<del.length;i++) {
		let delid = del[i].getAttribute('delid')
		del[i].addEventListener('click',function() {
			dialog = window.confirm('删除这篇文章？  delid='+delid)
			if (dialog) {
				interactive.postdel(delid)
			}
		})
	}
}