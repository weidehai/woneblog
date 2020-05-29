function dateFormat(fmt){
	let d = new Date()
	let opt={
		"YYYY-MM-DD":`${d.getFullYear().toString()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`,
		"YYYY-MM-DD hh:mm":`${d.getFullYear().toString()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
	}
	return opt[fmt]
}