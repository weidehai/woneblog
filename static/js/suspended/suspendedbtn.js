function coordinate(element){
	this.flag = false
	this.el = element
	this.el.computed_style = window.getComputedStyle(element)
	this.el.show = false
	this.el.m_p_b_height = parseInt(this.el.computed_style.height) + parseInt(this.el.computed_style.marginTop) + parseInt(this.el.computed_style.marginBottom) + parseInt(this.el.computed_style.borderBottomWidth) + parseInt(this.el.computed_style.borderTopWidth)
	this.el.m_p_b_width = parseInt(this.el.computed_style.width) + parseInt(this.el.computed_style.marginLeft) + parseInt(this.el.computed_style.marginRight) + parseInt(this.el.computed_style.borderLeftWidth) + parseInt(this.el.computed_style.borderRightWidth)
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
		console.log(nx,ny,this.el.m_p_b_width,this.el.m_p_b_height)
		//设定边界，上左下右
		if (nx<0 || ny<0 || ny > (document.documentElement.clientHeight-this.el.m_p_b_height) || nx>(document.documentElement.clientWidth-this.el.m_p_b_width)) {
			return	
		}
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
		//SuspendedBtn.register_write()
		SuspendedBtn.pop_menu(this.el)
	}
	document.body.removeEventListener('mousemove',this.__newev__)
	document.body.removeEventListener('touchmove',this.__newev__)
}


var SuspendedBtn={
	register_menu: function (){
		var menus = document.getElementById('menus')
		console.log(menus)
		var menu_1 = document.getElementById('menu_1')
		var menu_2 = document.getElementById('menu_2')
		var menu_3 = document.getElementById('menu_3')
		menus.addEventListener("click",(e)=>{
			console.log(e)
			let menu = e.srcElement.id
			console.log(menu)
			switch (menu){
				case "blogs":
					menu_1.style.display='block'
					menu_3.style.display='none'
					menu_2.style.display='none'
					if (table !== "articles") {
						document.querySelector('main').innerHTML = ""
						table = 'articles'
						first_get()	
					}
					break
				case "write":
					window.location.href = '/publish'
					break
				case "lable":
					menu_1.style.display='none'
					menu_3.style.display='none'
					menu_2.style.display='flex'
					break
				case "mood":
					menu_1.style.display='none'
					menu_2.style.display='none'
					menu_3.style.display='flex'
					break
				case "home":
					window.location.href="/"
					break
				case "draft":
					menu_1.style.display='block'
					menu_3.style.display='none'
					menu_2.style.display='none'
					if (table !== "drafts") {
						document.querySelector('main').innerHTML = ""
						table = 'drafts'
						first_get()	
					}
					break
			}
				
		})
		
	},
	pop_menu:function(element){
		console.log('click')
		if(element.show){
			element.style.overflow = 'hidden'
			element.show = false
		}else{
			element.style.overflow = 'inherit'
			element.show = true
		}
	},
	suspended: function (){
		var suspende_menu = document.getElementById('suspende_menu')
		mycoordinate = new coordinate(suspende_menu)
		suspende_menu.addEventListener('mousedown',mycoordinate.mousedown.bind(mycoordinate),false)
		suspende_menu.addEventListener('mouseup',mycoordinate.mouseup.bind(mycoordinate),false)
		suspende_menu.addEventListener('touchstart',mycoordinate.mousedown.bind(mycoordinate),false)
		suspende_menu.addEventListener('touchend',mycoordinate.mouseup.bind(mycoordinate),false)
	},
	
}

