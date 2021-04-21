import './h1'
import './h2'
import './split_line'



(()=>{
    const menus_component={
        dom:document.getElementsByClassName('menus')[0],
        init(){
            this.disable_focus()
        },
        disable_focus:function () {
            this.dom.onmousedown=(e)=>{
                e.preventDefault()
            }
        }
    }
    menus_component.init()
})

