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
		SuspendedBtn.pop_menu()
	}
	document.body.removeEventListener('mousemove',this.__newev__)
	document.body.removeEventListener('touchmove',this.__newev__)
}


var SuspendedBtn={
	//检查是click还是touch
	touchevent: "ontouchstart" in suspende_menu?true:false,
	menus: document.getElementById('menus'),
	suspende_menu: document.getElementById('suspende_menu'),
	menus_show: false,
	manage_navigate:function(route){
		switch (route){
			case "articles":
				this.menu_1.style.display='block'
				this.menu_3.style.display='none'
				this.menu_2.style.display='none'
				if (table !== "articles") {
					document.querySelector('main').innerHTML = ""
					table = 'articles'
					sessionStorage.setItem(`manage_table`,`${table}`)
					change_hash_nocallback(`${table}`)
					auto_get()
					return
				}
				change_hash_nocallback(`${table}`)
				if(should_first_get){
					should_first_get = false
					//state_pop()
					first_get()
				}
				break
			case "write":
				this.close_menu_force()
				window.location.href = '/publish'
				break
			case "lable":
				this.menu_1.style.display='none'
				this.menu_3.style.display='none'
				this.menu_2.style.display='flex'
				change_hash_nocallback('lable')
				break
			case "mood":
				this.menu_1.style.display='none'
				this.menu_2.style.display='none'
				this.menu_3.style.display='flex'
				change_hash_nocallback('mood')
				break
			case "home":
				window.location.href="/"
				break
			case "drafts":
				this.menu_1.style.display='block'
				this.menu_3.style.display='none'
				this.menu_2.style.display='none'
				if (table !== "drafts") {
					document.querySelector('main').innerHTML = ""
					table = 'drafts'
					sessionStorage.setItem(`manage_table`,`${table}`)
					change_hash_nocallback(`${table}`)
					auto_get()
					return
				}
				change_hash_nocallback(`${table}`)
				if(should_first_get){
					should_first_get = false
					first_get()
				}
				break
		}
	},
	register_menu: function (){
		console.log(this)
		this.menu_1 = document.getElementById('menu_1')
		this.menu_2 = document.getElementById('menu_2')
		this.menu_3 = document.getElementById('menu_3')
		if (!this.touchevent) {
			this.menus.addEventListener('mousedown',(e)=>{
				e.stopPropagation()
			})
		}else{
			this.menus.addEventListener('touchstart',(e)=>{
				e.stopPropagation()
			})
		}
		this.menus.addEventListener("click",(e)=>{
			console.log(e)
			let menu = e.srcElement.id
			//console.log(menu)
			this.manage_navigate(menu)
			this.pop_menu()
				
		})
		
	},
	pop_menu:function(){
		if(this.menus_show){
			this.suspende_menu.style.overflow = 'hidden'
			this.menus.style.display = "none"
			this.menus_show = false
		}else{
			this.suspende_menu.style.overflow = 'inherit'
			this.menus.style.display = "block"
			this.menus_show = true
		}
	},
	close_menu_force:function(){
		this.suspende_menu.style.overflow = 'hidden'
		this.menus.style.display = "none"
		this.menus_show = false
	},
	suspended: function (){
		mycoordinate = new coordinate(this.suspende_menu)
		if (!this.touchevent) {
			this.suspende_menu.addEventListener('mousedown',mycoordinate.mousedown.bind(mycoordinate),false)
			this.suspende_menu.addEventListener('mouseup',mycoordinate.mouseup.bind(mycoordinate),false)	
		}else{
			this.suspende_menu.addEventListener('touchstart',mycoordinate.mousedown.bind(mycoordinate),false)
			this.suspende_menu.addEventListener('touchend',mycoordinate.mouseup.bind(mycoordinate),false)	
		}
	},
	
}

