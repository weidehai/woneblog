(() => {
  const h2 = {
    dom: document.getElementById("h2"),
    event() {
      document.execCommand("formatblock", false, "H2");
    },
    init() {
      this.dom.onclick = this.event;
    },
  };
  h2.init();
})();
