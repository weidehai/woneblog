var seo = {
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
			}else if(cont[0].childNodes[i].tagName == 'H2'){
				cont[0].childNodes[i].setAttribute('id',cont[0].childNodes[i].innerText)
				li_sec = document.createElement('li')
				li_sec.setAttribute('class','sec-title')
				li_sec.style.display = 'none'
				a_sec = document.createElement('a')
				a_sec.setAttribute('href',"#"+cont[0].childNodes[i].innerText)
				text_sec_title = document.createTextNode(cont[0].childNodes[i].innerText)
				li_sec.appendChild(a_sec)
				if (list.lastElementChild==null) {
					continue
				}
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
	//截取正文的一部分作为文章的描述，摘要
	createMeta: function() {
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
}