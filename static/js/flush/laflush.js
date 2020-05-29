/*
@@实现下拉刷新功能
*/

var laflush={
	content_height:document.documentElement.scrollHeight,
	flush:null,
	eventlistener:function(){
		console.log('www')
		window.onmousewheel = ()=>laflush.mousewheel
	},
	mousewheel:function(){
		scroll_top = document.documentElement.scrollTop
		bottom = Math.ceil(scroll_top+document.documentElement.clientHeight)
		console.log(bottom,this.content_height)
		if (bottom>=this.content_height) {
			flush()
		}
	}
}