import * as moment from "moment";
import log from "loglevel";

let current_year = parseFloat(moment().format("YYYY"));
let offset = 0;
let fetched_count = 0;
let tag;
console.log('ddddd')
function get_data() {
  const xhr = new XMLHttpRequest();
  let url;
  if (tag) {
    url = `api/archives/${tag}/${current_year}?offset=${offset}&fetched_count=${fetched_count}`;
  }
  if (!tag) {
    url = `api/articles/${current_year}?offset=${offset}&fetched_count=${fetched_count}`;
  }
  xhr.open("get", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const res = xhr.responseText;
      render_page(res);
    }
  };
  xhr.send();
}

function init_page() {
  if (document.documentElement.offsetHeight > window.innerHeight + 50) return;
  get_data();
}

function render_page(data) {
  const data_json = JSON.parse(data);
  if (!data_json.result) {
    --current_year;
    offset = 0;
    if(data_json.end) return
    init_page();
    return;
  }

  fetched_count += data_json.data.length
  const archive_dom = document.getElementById("archive");
  const year_dom = document.getElementById(data_json.year);
  let ul;
  const document_fragment = document.createDocumentFragment();
  function render_list(item) {
    const li = document.createElement("li");
    li.setAttribute("class", "item");
    const p = document.createElement("p");
    p.setAttribute("class", "ellipsis");
    li.appendChild(p);
    const time = document.createElement("time");
    const [day, datetime] = item[1].split("T");
    time.innerText = datetime === "00:00:00" ? day : `${day} ${time}`;
    const a = document.createElement("a");
    a.setAttribute("href", `/article_detail/${item[0]}`);
    a.innerText = item[2];
    p.appendChild(time);
    p.appendChild(a);
    document_fragment.appendChild(li);
  }
  if (year_dom) {
    ul = year_dom.nextElementSibling;
  } else {
    const h3 = document.createElement("h3");
    h3.setAttribute("id", data_json.year);
    h3.innerText = data_json.year;
    ul = document.createElement("ul");
    ul.setAttribute("class", "post-list");
    archive_dom.appendChild(h3);
    archive_dom.appendChild(ul);
  }
  for (const item of data_json.data) {
    render_list(item);
  }
  ul.appendChild(document_fragment);
  offset += 10;
  if(data_json.end) return
  init_page();
}

function event_register() {
  const tag_dom = document.getElementById("theme-tag");
  tag_dom.addEventListener("click", (e) => {
    e.preventDefault();
    tag = e.target.getAttribute("data-src");
    if (tag) {
      const archive_dom = document.getElementById("archive");
      archive_dom.innerHTML = "";
      current_year = parseFloat(moment().format("YYYY"));
      offset = 0;
      fetched_count = 0;
      init_page();
    }
  });
}
init_page();
event_register();
/*
let data_sort = []
let archives_done = 0
sessionStorage.setItem("archives_where",where)
window.onpagehide = function(){
	var scroll_top = document.documentElement.scrollTop
	sessionStorage.setItem("archives_scroll_top",scroll_top)
}

window.onload = function () {
	eventListen()
	let archives = JSON.parse(sessionStorage.getItem("archives"))
	console.log(JSON.parse(sessionStorage.getItem("archives")))
	if(archives && cache_where==where){
		offset = parseInt(sessionStorage.getItem("archives_offset")) || 0
		archives_done = parseInt(sessionStorage.getItem("archives_done")) || 0
		years = Object.keys(archives)
		if(years.length>0){
			for(let year_key of years){
				year = parseInt(year_key)
				//console.log(archives[year_key])
				//入栈
				data_sort.push(archives[year_key])
				data_sort.push(year)
			}
			while(data_sort.length>0){
				//出栈
				year = data_sort.pop()
				render(data_sort.pop())
			}
		}
		let scroll_top = sessionStorage.getItem("archives_scroll_top") || 0
		document.documentElement.scrollTop = scroll_top
		window.scrollTo(scroll_top,0)
		window.scrollTop = scroll_top
		year = parseInt(sessionStorage.getItem("archives_year"))
	}else{
		sessionStorage.clear()
		sessionStorage.setItem("archives_where",where)
		getData("articles","article_time, article_title, post_key",where,render)
	}
	laflush.eventlistener()
	laflush.flush = function(){
		getData("articles","article_time, article_title, post_key",where,render)
	}
}
function getData(table,fields,where,cb){
	if (year<2019 || archives_done) {
		//laflush.removelistener()
		sessionStorage.setItem("archives_done",1)
		return
	}
	let loading_wrapper = document.getElementsByClassName("loading_wrapper")[0]
	let xhr = new XMLHttpRequest()
	let myurl = `/articles/year/`
	loading_wrapper.style.display = "block"
	xhr.open("get",myurl,true)
	xhr.onreadystatechange=function(){
		if (xhr.readyState===4) {
			var str = xhr.responseText
			var obj = eval('(' + str + ')')
			loading_wrapper.style.display = 'none'
			offset = offset + 10
			if (obj.length !== 0) {
				//{"archive":{2020:[],2019:[]}}
				let archives = sessionStorage.getItem("archives")
				let data={}
				console.log("set cache")
				if(archives){
					if(year in JSON.parse(archives)){
						console.log("innnnnnnnn")
						data = JSON.parse(archives)
						data[year] = data[year].concat(obj)
						console.log(data)
						sessionStorage.setItem("archives",JSON.stringify(data))
					}else{
						data = JSON.parse(archives)
						data[year] = obj
						sessionStorage.setItem("archives",JSON.stringify(data))
					}
				}else{
					data[year] = obj
					console.log(data)
					sessionStorage.setItem("archives",JSON.stringify(data))
					//console.log(sessionStorage.getItem("archives"))
				}
				cb(obj)
			}

			if (obj.length<10) {
				year = year - 1
				offset = 0
			}
			console.log(offset,year)
			sessionStorage.setItem("archives_offset",offset)
			sessionStorage.setItem("archives_year",year)
			if (document.documentElement.scrollHeight<=document.documentElement.clientHeight) {
				getData("articles","article_time, article_title, post_key",where,render)
			}
		}
	}
	xhr.send()
}

function render(result){


}

function eventListen(){
	//var theme_tag = document.getElementById('theme-tag')
	// var a = theme_tag.getElementsByTagName('a')
	// var sizebox = ['12px','16px','22px']
	// for (i=0;i<a.length;i++) {
	// 	var index = Math.floor(Math.random()*3)
	// 	var fontsize = sizebox[index]
	// 	a[i].style.fontSize = fontsize
	// }
	// //事件委托
	// theme_tag.addEventListener('click',function(e){
	// 	getData("articles","article_time, article_title, post_key",`article_tag="${e.target.innerText}"`,render)
	// })
	var i = document.getElementsByClassName('navicon')[0].getElementsByTagName('i')
	i[0].addEventListener('click',function() {
		var nav = document.getElementById('nav')
		var ul = document.getElementsByTagName('ul')
		if (ul[0].getAttribute('class')) {
			ul[0].setAttribute('class','')
		}else {
			ul[0].setAttribute('class','responsive')
		}
	})
}*/
