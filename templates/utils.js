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

export {
  getOneViewportHeigh,
  getElementComputedProperty,
  clearInnerhtml,
  isExsitDom
}
