/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "moment"
var external_moment_namespaceObject = moment;
;// CONCATENATED MODULE: external "log"
var external_log_namespaceObject = log;
;// CONCATENATED MODULE: ./templates/archives/archives.js
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var current_year = parseFloat(external_moment_namespaceObject().format("YYYY"));
var offset = 0;
var fetched_count = 0;
var tag;
console.log('ddddd');

function get_data() {
  var xhr = new XMLHttpRequest();
  var url;

  if (tag) {
    url = "api/archives/".concat(tag, "/").concat(current_year, "?offset=").concat(offset, "&fetched_count=").concat(fetched_count);
  }

  if (!tag) {
    url = "api/articles/".concat(current_year, "?offset=").concat(offset, "&fetched_count=").concat(fetched_count);
  }

  xhr.open("get", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var res = xhr.responseText;
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
  var data_json = JSON.parse(data);

  if (!data_json.result) {
    --current_year;
    offset = 0;
    if (data_json.end) return;
    init_page();
    return;
  }

  fetched_count += data_json.data.length;
  var archive_dom = document.getElementById("archive");
  var year_dom = document.getElementById(data_json.year);
  var ul;
  var document_fragment = document.createDocumentFragment();

  function render_list(item) {
    var li = document.createElement("li");
    li.setAttribute("class", "item");
    var p = document.createElement("p");
    p.setAttribute("class", "ellipsis");
    li.appendChild(p);
    var time = document.createElement("time");

    var _item$1$split = item[1].split("T"),
        _item$1$split2 = _slicedToArray(_item$1$split, 2),
        day = _item$1$split2[0],
        datetime = _item$1$split2[1];

    time.innerText = datetime === "00:00:00" ? day : "".concat(day, " ").concat(time);
    var a = document.createElement("a");
    a.setAttribute("href", "/article_detail/".concat(item[0]));
    a.innerText = item[2];
    p.appendChild(time);
    p.appendChild(a);
    document_fragment.appendChild(li);
  }

  if (year_dom) {
    ul = year_dom.nextElementSibling;
  } else {
    var h3 = document.createElement("h3");
    h3.setAttribute("id", data_json.year);
    h3.innerText = data_json.year;
    ul = document.createElement("ul");
    ul.setAttribute("class", "post-list");
    archive_dom.appendChild(h3);
    archive_dom.appendChild(ul);
  }

  var _iterator = _createForOfIteratorHelper(data_json.data),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      render_list(item);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  ul.appendChild(document_fragment);
  offset += 10;
  if (data_json.end) return;
  init_page();
}

function event_register() {
  var tag_dom = document.getElementById("theme-tag");
  tag_dom.addEventListener("click", function (e) {
    e.preventDefault();
    tag = e.target.getAttribute("data-src");

    if (tag) {
      var archive_dom = document.getElementById("archive");
      archive_dom.innerHTML = "";
      current_year = parseFloat(external_moment_namespaceObject().format("YYYY"));
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
/******/ })()
;