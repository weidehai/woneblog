import "../menus/menus";
import "./range";
import { KEYMAP } from "./keyMap";
import $ from "jquery";
import Service from "../../../../service";
import moment from "moment";
import range from "./range";

(() => {
  const editor = {
    dom: document.getElementById("editor"),
    submitBtn: document.getElementById("submit"),
    insertLFIfNeed(before, after) {
      if (range.isRangeEqual(before, after)) return document.execCommand("inserthtml", false, "\n");
      if (before.so == after.so && before.eo == after.eo)
        return document.execCommand("inserthtml", false, "\n");
    },
    watchKeyEvent() {
      this.dom.addEventListener("keydown", (e) => {
        this.onEditorStateChange("active");
        e.stopPropagation();
        switch (e.key) {
          case KEYMAP.ENTER:
            if (range.isCursorInElement("PRE")) {
              e.preventDefault();
              let beforeInsertRange = range.getCurrentRange();
              document.execCommand("inserthtml", false, "\n");
              let afterInsertRange = range.getCurrentRange();
              console.log(beforeInsertRange, afterInsertRange);
              this.insertLFIfNeed(beforeInsertRange, afterInsertRange);
            }
            break;
          case KEYMAP.BACKSPACE:
            if (this.dom.innerHTML == "<p><br></p>") e.preventDefault();
            break;
        }
      });
      this.dom.addEventListener("keyup", (e) => {
        if (this.dom.innerHTML == "") this.dom.innerHTML = "<p><br></p>";
      });
    },
    watchMouseEvent() {
      this.dom.addEventListener("mousedown", (e) => {
        this.onEditorStateChange("active");
      });
      this.dom.addEventListener("mouseup", (e) => {});
    },
    onEditorStateChange(state) {
      switch (state) {
        case "active":
          this.hideAllHoverMenu();
          break;
      }
    },
    hideAllHoverMenu() {
      $("div[data-mark='hover-menus']").hide();
    },
    watchFocus() {
      this.dom.addEventListener("focus", (e) => {
        this.onEditorStateChange("active");
      });
    },
    watchBlur() {
      this.dom.addEventListener("blur", (e) => {});
    },
    saveArticle() {
      let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let csrfToken = $("meta[name=csrf-token]")[0].content;
      let params = {
        article_title: $("#title").val(),
        article_tag: $("#tags").val(),
        article_content: $("#editor").html(),
        text_for_search: $("#editor")
          .text()
          .replace(/(\t|\n)/g, ""),
        article_time: currentTime,
        update_time: currentTime,
        post_key: Math.random().toString().substring(2, 5) + Date.now(),
      };
      if (!params.article_title) {
        $("#title").prop("placeholder", "请输入标题"),
        $("#title").addClass("alert"),
        $("#title").trigger("focus");
        return;
      }
      Service.saveArticles(params, { headers: { "X-CSRFToken": csrfToken } });
    },
    init() {
      document.execCommand("defaultParagraphSeparator", false, "p");
      this.submitBtn.addEventListener("click", this.saveArticle);
      if (!this.dom.innerText) {
        let p = document.createElement("p");
        let br = document.createElement("br");
        this.dom.appendChild(p);
        p.appendChild(br);
      }
      this.watchKeyEvent();
      this.watchFocus();
      this.watchBlur();
      this.watchMouseEvent();
    },
  };
  editor.init();
})();
