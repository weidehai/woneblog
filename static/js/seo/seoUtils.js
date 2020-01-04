var seo = {
	//截取正文的一部分作为文章的描述，摘要
	createMeta: function() {
		metas = document.getElementsByTagName('meta')
		var cont = document.getElementsByClassName('detail')
		var text = cont[0].innerText
		var desc = text.slice(0,201)
		for (i=0;i<metas.length;i++) {
			if (metas[i].getAttribute('name') === "description") {
				metas[i].setAttribute('content',desc.replace(/[\n]/g, ""))
			}
			if (metas[i].getAttribute('property') === "og:description") {
				metas[i].setAttribute('content',desc.replace(/[\n]/g, ""))
			}
		}
	}
}