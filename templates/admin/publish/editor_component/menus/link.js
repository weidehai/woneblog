(() => {
  const link = {
    dom: document.getElementById("link"),
    //orderList: document.getElementById("order-list"),
    //unorderList: document.getElementById("unorder-list"),
    event() {
      $("#link-editor").toggle();
    },
    insertOrderList() {
      document.execCommand("insertOrderedList", false, null);
      $("#link-editor").toggle();
    },
    insertUnorderList() {
      document.execCommand("insertUnorderedList", false, null);
      $("#link-editor").toggle();
    },
    init() {
      this.dom.onclick = this.event;
      //this.orderList.onclick = this.insertOrderList;
      //this.unorderList.onclick = this.insertUnorderList;
    },
  };
  link.init();
})();
