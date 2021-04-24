var touchBottomFlush = {
  flush: null,
  scrollEnd:null,
  eventListener: function () {
    window.onmousewheel = () => {
      if(this.scrollEnd) clearTimeout(this.scrollEnd)
      this.scrollEnd = setTimeout(() => {
        this.mouseWheel();
      }, 100);
    };
    window.addEventListener("touchmove", () => {
      this.mouseWheel();
    });
  },
  removeListener: function () {
    window.onmousewheel = null;
  },
  mouseWheel: function () {
    let scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop || window.pageXOffset;
    let contentHeight = document.documentElement.scrollHeight;
    let viewHeight = document.documentElement.clientHeight;
    let bottom = Math.ceil(scrollTop + viewHeight);
    if (bottom >= contentHeight) {
      this.flush();
    }
  },
  setup(action) {
    this.flush = action;
    this.eventListener();
  },
};

export { touchBottomFlush };
