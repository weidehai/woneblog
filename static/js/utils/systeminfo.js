var systeminfo = {
	get_systeminfo:function(){
		var ua = navigator.userAgent
		var windows = /NT\s(.+?);/
		var android = /Android\s(.+?);/
		var ios = /OS\s(.+?)\s/
		if (ua.match(windows)) {
			var system = 'Windows '+ua.match(windows)[1]
			return system
		}else if(ua.match(android)){
			var system = 'Android '+ua.match(android)[1]
			return system
		}else if (ua.match(ios)) {
			var system = 'IOS '+ua.match(ios)[1].replace(/_/g,'.')
			return system
		}
	},
	get_browserinfo:function(){
		var ua = navigator.userAgent
		//alert(ua)
		var edge = /Edge\/(.+?)$/
		var ie = /Trident/
		var uc = /UCBrowser\/(.+?)\s/
		var chrome = /(Chrome|CriOS)\/(.+?)\s/
		var safari = /Version\/(.+?)\s/
		if (ua.match(edge)) {
			var browser = 'Edge '+ua.match(edge)[1]
			return browser
		}else if(ua.match(ie)){
			var browser = 'IE'
			return browser
		}else if (ua.match(uc)) {
			var browser = 'UC '+ua.match(uc)[1]
			return browser
		}else if (ua.match(chrome)) {
			//alert(ua.match(chrome))
			var browser = 'Chrome '+ua.match(chrome)[2]
			return browser
		}else if (ua.match(safari)) {
			var browser = 'Safari '+ua.match(safari)[1]
			return browser
		}
	}
}