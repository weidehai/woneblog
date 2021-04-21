function getOneViewportHeigh():string {
  return document.documentElement.clientHeight + "px";
}
function getElementComputedProperty(element:Element, property:string):void {
  if (window.getComputedStyle)
    return property ? window.getComputedStyle(element, null)[property] : null;
  throw "浏览器不支持getComputedStyle，请升级您的浏览器"
}
function clearInnerhtml(element:Element):void {
  if (element instanceof Array) {
    element.forEach((ele)=>{
      this.clear_innerhtml(ele);
    })
  }
  element.innerHTML = "";
}


export {
  getOneViewportHeigh,
  getElementComputedProperty,
  clearInnerhtml
}
