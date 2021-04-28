(() => {
  const justify = {
    justifyLeftDom: document.getElementById("justifyleft"),
    justifyCenterDom:document.getElementById("justifycenter"),
    justifyLeftEvent() {
      document.execCommand('justifyLeft',false,'')
    },
    justifyCenterEvent() {
      document.execCommand('justifyCenter',false,'')
    },
    init() {
      this.justifyLeftDom.onclick = this.justifyLeftEvent;
      this.justifyCenterDom.onclick = this.justifyCenterEvent;
    },
  };
  justify.init();
})();
