(()=>{
    const h1={
        dom:document.getElementById('h1'),
        event(){
            document.execCommand('formatblock',false,'H1')
        },
        init(){
            this.dom.onclick = this.event
        }
    }
    h1.init()
})()
