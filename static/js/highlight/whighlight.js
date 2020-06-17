String.prototype.replacePos = function(s1,s2,pos1,pos2){
	return (s1.substring(0,pos1)+s2+s1.substring(pos2))
}

class whl {
	constructor(ele){
		this.word = "[a-zA-Z0-9_$]+|"
		this.number = "^[-\+][0-9]+\.[0-9]+|^[-\+][0-9]+|[0-9]+\.[0-9]+|[0-9]+"   //带符号和不带符号的小数和整数
		this.keyword = "var|function|if|else|true|false|try|catch|break|continue|for|let|this|do|while|null|new|class"
		this.comment = "\/{2}.*|"
		this.str = '".*"|' + "'.*'|"
		this.regular = "\/.*\/|"
		this.builtInObj = "Array|Date|Math|Number|String|prototype|document|history|navigator|window|Function|Object"
		this.builtInMethod = "alert|eval|clearInterval|clearTimeout|blur|foucs|confirm|setTimeout"
		this.keywordArray = this.keyword.split('|')
		this.builtInObjArray = this.builtInObj.split('|')
		this.builtInMethodArray = this.builtInMethod.split('|')
		this.reg = new RegExp("(" + this.comment + this.str + this.regular + this.word + this.number + ")","g")
		this.ele = ele
		this.str = ele.innerHTML
		this.extralen = 0
		this.newstr = this.str
	}
	startMatch(){
		// var myreg = new RegExp(/([a-zA-Z_]+)/g)
		// var mystr = 'if(a==b){var btn = document.getelementbyid("btn")}'
		// var res = myreg.exec(mystr)
		// console.log(res,myreg.lastIndex)
		//exec可以接着上次匹配到的位置继续匹配，lastindex保存上次匹配到的位置
		//匹配结果i的index保存其首字符在原文中的位置，结合上面的lastindex就可以直到i在原文中的位置
		while(true){
			var matched =this.reg.exec(this.str)
			if (matched) {
				this.setHllabel(this.newstr,matched[0],matched.index,this.reg.lastIndex)			
			}
			if (this.reg.lastIndex==0) {
				this.ele.innerHTML = this.newstr
				return
			}
		}
	}
	setHllabel(s1,s2,pos1,pos2){
		var olen = s2.length
		if (s2.startsWith('//')) {
			s2 = this.comment_tag(s2)
		}else if(s2.startsWith('"') || s2.startsWith("'")){
			s2 = this.string_tag(s2)
		}else if (s2.startsWith('/')) {
			s2 = this.reg_tag(s2)
		}else if (this.builtInObjArray.indexOf(s2)!=-1) {
			s2 = this.builtIn_Obj(s2)
		}else if (this.builtInMethodArray.indexOf(s2)!=-1) {
			s2 = this.builtIn_Method(s2)
		}else if (this.keywordArray.indexOf(s2)!=-1) {
			s2 = this.keyword_tag(s2)
		}else if (this.isNumber(s2)) {
			s2 = this.number_tag(s2)
		}else{
			return false
		}
		this.newstr = this.newstr.replacePos(s1,s2,pos1+this.extralen,pos2+this.extralen)
		//console.log(this.newstr)
		this.extralen = s2.length-olen+this.extralen
	}

	isNumber(res){
		var reg = new RegExp("("+this.number+")","g")
		return reg.test(res)
	}
	comment_tag(s){
		return `<span class='comment-hl'>${s}</span>`
	}
    number_tag(s){
    	return `<span class='number-hl'>${s}</span>`	
    }
 	keyword_tag(s){
		return `<span class='keyword-hl'>${s}</span>`
	}	

	string_tag(s){
		return `<span class='string-hl'>${s}</span>`
	}

	reg_tag(s){
		return `<span class='reg-hl'>${s}</span>`
	}

	builtIn_Method(s){
		return `<span class='builtIn-Method'>${s}</span>`
	}
	builtIn_Obj(s){
		return `<span class='builtIn-Obj'>${s}</span>`
	}
}
