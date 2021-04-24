import "../menus/menus";
import { KEYMAP } from "./keyMap";

(() => {
  const editor = {
    dom: document.getElementById("editor"),
    init() {
      document.execCommand("defaultParagraphSeparator", false, "p");
      if (!this.dom.innerText) {
        let p = document.createElement("p");
        let br = document.createElement("br");
        this.dom.appendChild(p);
        p.appendChild(br);
      }
      this.watchKeyEvent();
    },
    watchKeyEvent() {
      this.dom.addEventListener("keydown", (e) => {
        console.log(e.key);
        if (e.key == KEYMAP.BACKSPACE) {
          if (this.dom.innerHTML == "<p><br></p>") e.preventDefault();
        }
      });
      this.dom.addEventListener("keyup", (e) => {
        if (this.dom.innerHTML == "") this.dom.innerHTML = "<p><br></p>";
      });
    },
  };
  editor.init();
})();
