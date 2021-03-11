import './menu_type_defined'

(()=>{
    const split_line:Menu={
        dom:document.getElementById('cutline'),
        event(){
            document.execCommand("insertHTML",false,"<hr><p><br></p>")
        },
        init(){
            this.dom.onclick = this.event
        }
    }
    split_line.init()
})()