import Service from "../../../../service";
import {isAllowedImgType} from '@/utils'

(() => {
  const filePic = {
    dom: document.getElementById("file-pic"),
    event(e) {
      if(!isAllowedImgType(e.target.files[0])) return
      let formData = new FormData();
      let csrfToken = $("meta[name=csrf-token]")[0].content;
      formData.append("file", e.target.files[0]);
      e.target.value=''
      Service.upload(
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded", "X-CSRFToken": csrfToken } }
      ).then((res)=>{
        console.log(res)
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
