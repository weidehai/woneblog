(() => {
  const splitLine = {
    dom: document.getElementById("cutline"),
    event() {
      document.execCommand("insertHTML", false, "<hr><p><br></p>");
    },
    init() {
      this.dom.onclick = this.event;
    },
  };
  splitLine.init();
})();
