import "./h1";
import "./h2";
import "./splitLine";
import "./imgUpload";

(() => {
  const menusComponent = {
    dom: document.getElementsByClassName("menus")[0],
    init() {
      this.disableFocus();
    },
    disableFocus: function () {
      this.dom.onmousedown = (e) => {
        e.preventDefault();
      };
    },
  };
  menusComponent.init();
})();
