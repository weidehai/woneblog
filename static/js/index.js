window.onload = function() {
	eventListen()
}

function eventListen(){
	var i = document.getElementsByClassName('navicon')[0].getElementsByTagName('i')
	var r = document.getElementsByClassName('recently')[0]
	var requesting = false
	var className = r.className
	i[0].addEventListener('click',function() {
		var ul = document.getElementsByTagName('ul')
		if (ul[0].getAttribute('class')) {
			ul[0].setAttribute('class','')
		}else {
			ul[0].setAttribute('class','responsive')
		}
	})
	r.addEventListener('click',function(){
		if (requesting) {
			return
		}
		requesting = true
		r.className += " recently_loading"
		if (r.getAttribute("recently")==="false") {
			getrecently((obj)=>{
				render(obj)
				r.setAttribute("tips","最近更新")
				r.setAttribute("recently","true")
				r.style.color='orange'
				requesting = false
				r.className = className
			})
		}else{
			Interactive.XHRApart("articles","article_time,article_title,post_key","article_id",0,10,(obj)=>{
				render(obj)
				r.setAttribute("tips","最新发表")
				r.setAttribute("recently","false")
				r.style.color='#c9cacc'
				requesting = false
				r.className = className
			})
		}
	})
}



function render(obj){
	var r = document.getElementsByClassName('recently')[0]
	var ul = document.createElement('ul')
	var p = document.getElementById('writing')
	var u = document.getElementsByClassName('post-list')
	ul.className='post-list'
	for (item of obj){
		var li = document.createElement('li')
		var div = document.createElement('div')
		var time = document.createElement('time')
		var span = document.createElement('span')
		var a = document.createElement('a')
		span.className = 'ellipsis'
		li.className='post-item'
		div.className = 'meta'
		a.href = `/articledetails?id=${item['post_key']}`
		ul.appendChild(li)
		li.appendChild(div)
		li.appendChild(span)
		div.appendChild(time)
		time.append(item["article_time"])
		a.append(item["article_title"])
		span.appendChild(a) 	
	}
	p.replaceChild(ul,u[0])
}

function getrecently(cb) {
	let xhr = Interactive.creatXHR()
	var myurl = '/getrecently'
	xhr.open('get',myurl,true);
	xhr.send(null)
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var str = xhr.responseText
			var obj = eval('(' + str + ')')
			cb(obj)				
		}
	}
}