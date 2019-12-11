String.prototype.replacePos = function(s1,s2,pos1,pos2){
	return (s1.substring(0,pos1)+s2+s1.substring(pos2))
}

var extralen = 0
var newstr
function hl_init(ele){
	var reg = new RegExp(/(\/{2}.*|".*"|'.*'|\/|var)/g)
	var str = ele.innerHTML
	newstr = str
	
	var i=true
	while(i){
		try{
			i = reg.exec(str)
			console.log(i,i.index,reg.lastIndex)
			set_hllabel(newstr,i[0],i.index,reg.lastIndex)
		}catch(e){
			ele.innerHTML = newstr
			extralen = 0
		}
		
	}
}
	


function set_hllabel(s1,s2,pos1,pos2){
	console.log(s1,s2,pos1,pos2)
	var olen = s2.length
	if (s2.startsWith('//')) {
		s2 = comment_tag(s2)
	}else if(s2.startsWith('"') || s2.startsWith("'")){
		s2 = string_tag(s2)
	}else{
		s2 = keyword_tag(s2)
	}
	console.log(s2)
	newstr = newstr.replacePos(s1,s2,pos1+extralen,pos2+extralen)
	extralen = s2.length-olen+extralen
	console.log(extralen)
	console.log(newstr)
}


function comment_tag(s){
	return `<span class='comment-hl'>${s}</span>`
}

function keyword_tag(s){
	return `<span class='keyword-hl'>${s}</span>`
}


function string_tag(s){
	return `<span class='string-hl'>${s}</span>`
}