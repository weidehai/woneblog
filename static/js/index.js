window.onload = function() {
	eventListen()
}


function eventListen(){
	var i = document.getElementsByClassName('navicon')[0].getElementsByTagName('i')
	var r = document.getElementsByClassName('recently')[0]
	i[0].addEventListener('click',function() {
		var ul = document.getElementsByTagName('ul')
		if (ul[0].getAttribute('class')) {
			ul[0].setAttribute('class','')
		}else {
			ul[0].setAttribute('class','responsive')
		}
	})
	r.addEventListener('click',function(){
		if (r.getAttribute("recently")==="false") {
			getrecently()
			r.setAttribute("tips","最近更新")
			r.setAttribute("recently","true")
		}else{
			Interactive.XHRApart("articles","article_time,article_title,post_key","article_id",0,render)
			r.setAttribute("tips","最新发表")
			r.setAttribute("recently","false")
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
function getrecently() {
	let xhr = Interactive.creatXHR()
	var myurl = '/getrecently'
	xhr.open('get',myurl,true);
	xhr.send(null)
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
				var str = xhr.responseText
				var obj = eval('(' + str + ')')
				render(obj)
			}	
		}
}