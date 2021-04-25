import Service from "../../../../service";

(() => {
  const filePic = {
    dom: document.getElementById("file-pic"),
    event(e) {
      let formData = new FormData();
      let csrfToken = $("meta[name=csrf-token]")[0].content;
      formData.append("file", e.target.files[0]);
      e.target.value=''
      Service.upload(
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded", "X-CSRFToken": csrfToken } }
      ).then((res)=>{
        $('#editor').trigger('focus')
        var data = `<img src="${res.url}">`
			  document.execCommand('insertHTML',false,data)
      });
    },
    init() {
      this.dom.onchange = this.event;
    },
  };
  filePic.init();
})();
