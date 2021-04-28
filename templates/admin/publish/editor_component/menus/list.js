(() => {
  const list = {
    dom: document.getElementById("list"),
    orderList: document.getElementById("order-list"),
    unorderList: document.getElementById("unorder-list"),
    event() {
      $("#list-type-selector").toggle();
    },
    insertOrderList() {
      document.execCommand("insertOrderedList", false, null);
      $("#list-type-selector").toggle();
    },
    insertUnorderList() {
      document.execCommand("insertUnorderedList", false, null);
      $("#list-type-selector").toggle();
    },
    init() {
      this.dom.onclick = this.event;
      this.orderList.onclick = this.insertOrderList;
      this.unorderList.onclick = this.insertUnorderList;
    },
  };
  list.init();
})();
