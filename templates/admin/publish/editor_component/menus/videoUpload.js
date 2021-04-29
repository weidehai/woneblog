import Service from "../../../../service";
import {isAllowedVideoType} from "../../../../utils"

(() => {
  const filePic = {
    dom: document.getElementById("file-video"),
    event(e) {
      if(!isAllowedVideoType(e.target.files[0])) return
      let formData = new FormData();
      let csrfToken = $("meta[name=csrf-token]")[0].content;
      formData.append("file", e.target.files[0]);
      e.target.value=''
      Service.upload(
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded", "X-CSRFToken": csrfToken } }
      ).then((res)=>{
        $('#editor').trigger('focus')
        let data = `<iframe id="video-frame" frameborder="0" src="${res.url}" allowfullscreen></iframe>`
			  document.execCommand('insertHTML',false,data)
      });
    },
    init() {
      this.dom.onchange = this.event;
    },
  };
  filePic.init();
})();
