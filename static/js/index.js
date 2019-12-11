window.onload = function() {
	var i = document.getElementsByClassName('navicon')[0].getElementsByTagName('i')
	i[0].addEventListener('click',function() {
		var ul = document.getElementsByTagName('ul')
		if (ul[0].getAttribute('class')) {
			ul[0].setAttribute('class','')
		}else {
			ul[0].setAttribute('class','responsive')
		}
		
	})
}

