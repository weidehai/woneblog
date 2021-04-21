import '../menus/menus'
import {KEY_MAP} from "./key_map";

(()=>{
    const editor = {
        dom:document.getElementById('editor'),
        init(){
            document.execCommand("defaultParagraphSeparator", false, "p")
            if (!this.dom.innerText) {
                let p = document.createElement('p')
                let br = document.createElement('br')
                this.dom.appendChild(p)
                p.appendChild(br)
            }
            this.watch_key_event()
        },
        watch_key_event(){
            this.dom.addEventListener('keydown',(e)=>{
                console.log(e.key)
                if(e.key==KEY_MAP.BACKSPACE){
                    if(this.dom.innerHTML=='<p><br></p>') e.preventDefault()
                }

            })
            this.dom.addEventListener('keyup',(e)=>{
                if(this.dom.innerHTML=='') this.dom.innerHTML='<p><br></p>'
            })

        }

    }
    editor.init()
})()
