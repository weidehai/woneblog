import { isValidUrl } from "@/utils";

(() => {
  const link = {
    dom: document.getElementById("link"),
    linkHrefDom: document.getElementById("link-href"),
    linkNameDom: document.getElementById("link-name"),
    insertBtn: document.getElementById("insert"),
    event() {
      $("#link-editor").toggle();
    },
    inputLinkHref(e) {
      e.stopPropagation();
      //document.execCommand("insertOrderedList", false, null);
      //$("#link-editor").toggle();
    },
    inputLinkName(e) {
      e.stopPropagation();
      //document.execCommand("insertUnorderedList", false, null);
      //$("#link-editor").toggle();
    },
    insertLink(e) {
      console.log(this.linkHrefDom.value)
      let url = this.linkHrefDom.value;
      let name = this.linkNameDom.value;
      if (!isValidUrl(url)) {
        $(this.linkHrefDom).val(''),
        $(this.linkHrefDom).prop("placeholder", "请输入正确的url"),
        $(this.linkHrefDom).addClass("alert"),
        $(this.linkHrefDom).trigger("focus");
        return;
      }
      if (!name) name = url;
      var link = `<a href="${url}">${name}</a>`;
      document.execCommand("insertHTML", false, link);
    },
    init() {
      this.dom.onclick = this.event;
      this.linkHrefDom.onmousedown = this.inputLinkHref;
      this.linkNameDom.onmousedown = this.inputLinkName;
      this.insertBtn.onclick = ()=>{this.insertLink()};
    },
  };
  link.init();
})();
