import "./h1";
import "./h2";
import "./splitLine";
import "./imgUpload";
import "./videoUpload";
import "./justify";
import "./code";
import './quote'
import './list'
import './link'

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
