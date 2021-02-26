/*
@@实现触底刷新功能
*/

var laflush={
	content_height:0,
	flush:null,
	ready_to_flush:false,
	eventlistener:function(){
		window.onmousewheel = ()=>{laflush.mousewheel()}
		window.addEventListener('touchmove',()=>{laflush.mousewheel()})
	},
	removelistener:function(){
		window.onmousewheel = null
	},
	mousewheel:function(){
		scroll_top = document.documentElement.scrollTop || document.body.scrollTop || window.pageXOffset
		bottom = Math.ceil(scroll_top+document.documentElement.clientHeight)
		console.log(bottom,this.content_height)
		if (bottom>=this.content_height) {
			if (this.ready_to_flush) {
				this.ready_to_flush=false
				this.flush()
			}
		}
	}
}