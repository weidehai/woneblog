(() => {
  const quote = {
    dom: document.getElementById("quote"),
    event() {
      document.execCommand("formatblock", false, "BLOCKQUOTE");
    },
    init() {
      this.dom.onclick = this.event;
    },
  };
  quote.init();
})();
