//ajax接口
var interactive = {
	creatajax: function() {
		var oajax = null;
		try {
			oajax = new XMLHttpRequest();
		}catch(e) {
			oajax = new ActiveXobject("Microsoft.XMLHTTP");
		};
		return oajax
	},
	ajaxmain: function(el,qstr,mycomment) {
		var oajax = interactive.creatajax()
		var myurl = '/getmain?getid=' + qstr
		oajax.open('get',myurl,true);
		oajax.send(null)
		oajax.onreadystatechange = function() {
			if (oajax.readyState == 4) {
				try {
					var str = oajax.responseText
					var obj = eval('(' + str + ')')
					if (el.getAttribute('id') === 'editor') {
						el.innerHTML = obj[0]['article_content']
						var title = document.getElementById('title')
						var tag = document.getElementById('tag')
						title.setAttribute('value',obj[0]['article_title'])
						tag.setAttribute('value',obj[0]['article_tag'])
					}
					if (el.getAttribute('class') === 'detail') {
						el.innerHTML = obj[0]['article_content']
						console.log(el.getElementsByTagName('pre'))
						for(let ele of el.getElementsByTagName('pre')){
							if (ele.getAttribute('class')=='javascript') {
								hl_init(ele)
								console.log(ele.innerHTML) 
							}
							
							
						}
						
						seo.createTag()
						seo.createMeta()
						detailU.shutload()
						detailU.show_comment()
						mycomment.get_commentdata()
					}
				}catch(e) {
					alert('the page you visit is error'+e)
				}
			
			}
		}
	},
	ajaxpost: function() {
		var oajax = interactive.creatajax()
		var data = myeditor.getcontent()
		var postkey = data["postkey"]
		if (data['update']) {
			oajax.open('post','/updatepost',true);
			
		}else{
			oajax.open('post','/savepost',true);
		}
		oajax.setRequestHeader("Content-type","application/json;charset=utf-8");
		var data = JSON.stringify(data)
		oajax.send(data)
		oajax.onreadystatechange = function() {
			if (oajax.readyState == 4) {
				var r = oajax.responseText
				if (r=='200ok') {
					try {
						window.location.href= '/articledetails?id=' + postkey
					}catch(e) {
						alert('the page you visit is error')
					}
				}
				
			
			}
		}
	},
	ajaxupload: function(file) {
		var oajax = interactive.creatajax()
		oajax.open('post','/upload',true);
		oajax.send(file)
		oajax.onreadystatechange = function() {
			if (oajax.readyState == 4) {
				try {
					fileurl = oajax.responseText
					var type = fileurl.substr(fileurl.lastIndexOf('.')+1)
					if (type=='jpg'||type=='png'||type=='gif') {
						var data = `<img src="${fileurl}">`
					}else{
						var data = `<video autoplay="autoplay" controls="controls" width="100%" muted="muted" loop="loop" src="${fileurl}"></video>`
					}
					stylecmd.insertmedia(data)  
				}catch(e) {
					info = oajax.responseText
					alert(info)
				}
			
			}
		}
	},
	postdel: function(param) {
		var oajax = interactive.creatajax()
		var myurl = '/postdel?delid=' + param
		oajax.open('get',myurl,true);
		oajax.send(null)
		oajax.onreadystatechange = function() {
			if (oajax.readyState == 4) {
				var r = oajax.responseText
				if (r=='200ok') {
					try {
						window.location.reload()
					}catch(e) {
						alert('the page you visit is error')
					}
				}
					
			}
		}
	},
	get_content:function(el,qstr,mycomment) {
		interactive.ajaxmain(el,qstr,mycomment)
	}
}