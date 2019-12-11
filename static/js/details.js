
window.onload = function() {
	var action = document.getElementById('action')
	var a = action.getElementsByTagName('a')
	var postbtn = action.getElementsByClassName('postbtn')
	var emoji = document.getElementsByClassName('emoji')
	var bills = document.getElementsByClassName('icon-bills')
	var up = document.getElementsByClassName('icon-up')
	var detail = document.getElementsByClassName('detail')
	var tips = document.getElementsByClassName('postbtn-tips')
	var replybtn = document.getElementsByClassName('comment_btn')
	var mycomment = new mycomment_sys()
	mycomment.verify()
	emoji[0].addEventListener('click',detailU.emoji_show)
	up[0].addEventListener('click',detailU.back_to_up)
	replybtn[0].addEventListener('click',mycomment.reply.bind(mycomment))
	detailU.action_init(postbtn,tips,a)
	detailU.bills_init(bills)
	detailU.emoji_init()
	//构造查询参数，使用ajax向后端获取数据
	var query_str = detailU.geturl_param() + '?article_content'
	interactive.get_content(detail[0],query_str,mycomment)
	String.prototype.replacePos = function(s1,s2,pos1,pos2){
		console.log(s1)
		return (s1.substring(0,pos1)+s2+s1.substring(pos2))
	}
}



