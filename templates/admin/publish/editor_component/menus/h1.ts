import './menu_type_defined'

(()=>{
    const h1:Menu={
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
