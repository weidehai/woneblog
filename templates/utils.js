function getOneViewportHeigh() {
  return document.documentElement.clientHeight + "px";
}
function getElementComputedProperty(element, property) {
  if (window.getComputedStyle)
    return property ? window.getComputedStyle(element, null)[property] : null;
  if (element.currentStyle)
    return element.currentStyle[property]
}
function clearInnerhtml(element) {
  if (element instanceof Array) {
    element.forEach((ele)=>{
      this.clearInnerhtml(ele);
    })
  }
  element.innerHTML = "";
}
function isExsitDom(selector){
  return $(selector).length>0
}

function isAllowedImgType(file){
  let type = file.type
  return !!type.match(/^image\/(png|jpg|jpeg|bmp|gif)$/i)
}
function isAllowedVideoType(file){
  let type = file.type
  return !!type.match(/^video\/(mp4|avi|mpeg|wmv|mov|ts|flv)$/i)
}
function isValidUrl(url){
  return !!url.match(/^(?:(A-Za-z+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/)
}

export {
  getOneViewportHeigh,
  getElementComputedProperty,
  clearInnerhtml,
  isExsitDom,
  isAllowedVideoType,
  isAllowedImgType,
  isValidUrl
}
