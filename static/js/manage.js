let num = 10
let offset = 0
let end = false
let manager_loading = document.getElementsByClassName("myloading_1")[0]
window.onload = function() {
	//console.log(manager_loading)
	first_get()
	SuspendedBtn.suspended()
	eventListen()
	manager_loading.style.display = "block"
}

function first_get(){
	Interactive.XHRApart('articles','article_title,article_time,article_tag,post_key','article_time',offset,10,(result)=>{
		render(result)
		if (result.length < 10) {
			end = true
			return
		}
		offset = offset + 10
		if(document.documentElement.scrollHeight <= document.documentElement.clientHeight){
			first_get()
			num = num + 10
			return
		}
		offset = 0
		console.log(offset,num)
		pagebtn_init()
	})
}

function pagebtn_init(){
	let page = document.getElementById('page')
	let next = document.getElementById('next_page')
	let previous = document.getElementById('previous_page') 
	let total = page.getAttribute("total")
	let page_num = Math.ceil(total/num)
	let current_page = 1
	let next_active = true
	let previous_active = false
	let pagebtn = []
	let page_active = null
	//let fragment = document.createDocumentFragment()
	let div_wrapper = document.createElement('nav')
	if (page_num<=1) {return}
	for (let i=1;i<=page_num;i++){
		let div = document.createElement('div')
		div.innerText = i
		div.style.display = 'inline-block'
		//fragment.appendChild(div)
		div_wrapper.appendChild(div)
		pagebtn.push(div)
	}
	page.insertBefore(div_wrapper,next)
	page.style.display = "flex"
	page_active = div_wrapper.querySelectorAll("div")[0]
	page_active.style.backgroundColor = 'gray'
	div_wrapper.addEventListener("click",(e)=>{
		let want_page = parseInt(e.target.innerText)
		if (want_page===current_page) {return}
		page_active.style.backgroundColor = "#409eff"
		e.target.style.backgroundColor = 'gray'
		page_active = e.target
		current_page=want_page
		offset = (want_page-1) * num
		manager_loading.style.display = 'block'
		get_info()
		if (current_page===1) {
			is_head()
		}
		if (current_page===page_num) {
			is_tail()	
		}
		 
	})
	//previous.addEventListener('click',previous_page)
	next.addEventListener('click',next_page)

	function next_page() {
		current_page++
		console.log(current_page,page_num)
		offset = offset + num
		manager_loading.style.display = 'block'
		get_info()
		page_active.style.backgroundColor = '#409eff'
		pagebtn[current_page-1].style.backgroundColor = "gray"
		page_active = pagebtn[current_page-1]
		is_tail()
	}

	function previous_page() {
		current_page--
		offset = offset - num
		manager_loading.style.display = 'block'
		get_info()
		page_active.style.backgroundColor = '#409eff'
		pagebtn[current_page-1].style.backgroundColor = "gray"
		page_active = pagebtn[current_page-1]
		is_head()
	}
	function is_head() {
		console.log("head")
		if (current_page===1) {
			previous.removeEventListener("click",previous_page)
			previous.style.backgroundColor='gray'
			previous_active=false	
		}
		if (!next_active) {
			next.addEventListener("click",next_page)
			next.style.backgroundColor='#409eff'
			next_active=true
		}
	}
	function is_tail() {
		console.log("tail")
		if (current_page===page_num) {
			next.removeEventListener("click",next_page)
			next.style.backgroundColor='gray'
			next_active=false
		}
		if (!previous_active) {
			previous.addEventListener("click",previous_page)
			previous.style.backgroundColor="#409eff"
			previous_active=true
		}
	}
}


function render(result){
	main = document.querySelector('main')
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
					main.removeChild(bt2.parentElement.parentElement)
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
		//这里可以使用document.createDocumentFragment()来创建一个文档片段。先将节点放在文档片段中在统一渲染，避免直接插入dom造成多次渲染
		main.appendChild(ul)
	}
	manager_loading.style.display = "none"
}
function get_info() {
	Interactive.XHRApart('articles','article_title,article_time,article_tag,post_key','article_time',offset,num,(result)=>{
		document.querySelector('main').innerHTML = ""
		render(result)
		//console.log(result.length,offset,num)
		if (result.length<num) {
			end = true
			return
		}

	})
}


function eventListen(){
	
}