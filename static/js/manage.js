window.onload = function() {
	get_info()
	SuspendedBtn.suspended()
}


function get_info() {
	Interactive.XHRApart('articles','article_title,article_time,article_tag,post_key','article_time',0,(result)=>{
		try {
			wrapper = document.getElementsByClassName('wrapper')
			for (let i=0;i<result.length;i++) {
				let ul = document.createElement('ul')
				let li1 = document.createElement('li')
				let li2 = document.createElement('li')
				let li3 = document.createElement('li')
				let li4 = document.createElement('li')
				let bt1 = document.createElement('button')
				let bt2 = document.createElement('button')
				let text1 = document.createTextNode(result[i]['article_title'])
				let text2 = document.createTextNode(result[i]['article_tag'])
				let text3 = document.createTextNode(result[i]['article_time'])
				let text4 = document.createTextNode('编辑')
				let text5 = document.createTextNode('删除')

				li1.setAttribute('style','width:52%;')
				li2.setAttribute('style','width:16%;')
				li3.setAttribute('style','width:16%;')
				li4.setAttribute('style','width:16%;')
				bt1.addEventListener('click',()=>{
					window.location.href = `/publish?getid=${result[i]['post_key']}`
				})
				bt2.addEventListener('click',()=>{
					dialog = window.confirm(`您确定要删除 ${result[i]['article_title']} 这篇文章？`)
					if (dialog) {
						Interactive.XHRDel('articles',result[i]['post_key'],()=>{
							wrapper.removeChild(bt2.parentElement.parentElement)
						})
					}
				})
				ul.appendChild(li1)
				ul.appendChild(li2)
				ul.appendChild(li3)
				ul.appendChild(li4)
				li1.appendChild(text1)
				li2.appendChild(text2)
				li3.appendChild(text3)
				li4.appendChild(bt1)
				li4.appendChild(bt2)
				bt1.appendChild(text4)
				bt2.appendChild(text5)
				wrapper[0].appendChild(ul)
			}
		}catch(e) {
			alert('the page you visit is error')
		}
	})
}
