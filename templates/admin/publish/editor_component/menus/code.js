import range from "../editor/range";
import { KEYMAP } from "../editor/keyMap";

(() => {
  const code = {
    dom: document.getElementById("code"),
    event(e) {
      e.preventDefault()
      e.stopPropagation()
      if(range.isCursorInElement('PRE')) return
      //var active_pre = Editor.code.isCursorInCodeblock_byNowRange();
      // if (active_pre) {
      //   return;
      // }
      // if (editorCursor.nowRange.startOffset != editorCursor.nowRange.endOffset) {
      //   stylecmd.insert_keyboard();
      //   return;
      // }
      //editorCursor.restoreRange();
      if (document.activeElement.id == "editor") {
        let  text = `<pre class=javascript active=true></pre>`;
        document.execCommand("insertHTML", false, text);
        range.updateRange()
        let pre = range.findRootForNowRange()
        //console.log(pre)
        if(!range.hasNextSiblingElement(pre)){
          $(pre).after('<p><br></p>')
        }
        //var status = document.getElementsByClassName("code_status");
        //status[0].style.display = "block";
        //editorCursor.saveRange();
      }
    },
    init() {
      this.dom.onclick = this.event;
    },
    isCursorInCodeblock_byNowRange() {
      let commonAncestorContainer = editorCursor.nowRange.commonAncestorContainer;
      return Editor.if_node_contained_by("PRE", commonAncestorContainer);
    },
  };
  code.init();
})();
