import { KEYMAP } from "./keyMap";

function Range() {
  let dom = document.getElementById("editor");
  let range = null;
  let selection = document.getSelection();
  this.getRange = function () {
    return range
  };
  this.updateRange = function(){
    let trange = selection.getRangeAt(0);
    range = {
      cc:trange.commonAncestorContainer,
      ec:trange.endContainer,
      eo:trange.endOffset,
      sc:trange.startContainer,
      so:trange.startOffset,
      range:trange
    }
  }
  this.getCurrentRange = function(){
    let range = document.getSelection().getRangeAt(0)
    return {
      cc:range.commonAncestorContainer,
      ec:range.endContainer,
      eo:range.endOffset,
      sc:range.startContainer,
      so:range.startOffset,
      range
    }
  }
  this.isRangeEqual = function (range1,range2){
    let result =  true
    for(let prop of Object.keys(range1)){
      if(prop=='range') continue
      //console.log(prop)
      if(range1[prop]!=range2[prop]) return result=false
    }
    return result
  }
  this.hasNextSiblingElement = function(element){
    return !!element.nextElementSibling
  }
  this.findRootForNowRange = function(){
    if(!isRangeCollapsed(range.range)) return
    let startContainer = range.sc
    while(startContainer){
      if(isEditorContainer(startContainer.parentElement)) break
      startContainer = startContainer.parentElement
    }
    return startContainer
  }
  this.isCursorInElement = function(ElementName){
    let startContainer = range.sc
    let endContainer = range.ec
    //console.log(startContainer.nodeName)
    while(startContainer){
      if(isEditorContainer(startContainer)) break
      if(startContainer.nodeName==ElementName) return true
      startContainer = startContainer.parentElement
    }
    while(endContainer){
      if(isEditorContainer(endContainer)) break
      if(endContainer.nodeName==ElementName) return true
      endContainer = endContainer.parentElement
    }
    return false
  }
  function isRangeCollapsed(range){
    return range.collapsed
  }
  function isEditorContainer(container){
    return container.id=='editor'
  }
  function watchKeyEvent() {
    dom.addEventListener("keydown", (e) => {
      //console.log(range);
    });
    dom.addEventListener("keyup", (e) => {
      saveRange();
      //console.log(range);
    });
  }
  function watchMouseEvent() {
    dom.addEventListener("mousedown", (e) => {
      //saveRange();

    });
    dom.addEventListener("mouseup", (e) => {
      saveRange();
    });
  }
  function watchFocus() {
    dom.addEventListener("focus", (e) => {
      //saveRange();
    });
  }
  function watchBlur() {
    dom.addEventListener("blur", (e) => {
      saveRange();
    });
  }
  function saveRange() {
    let trange = selection.getRangeAt(0);
    range = {
      cc:trange.commonAncestorContainer,
      ec:trange.endContainer,
      eo:trange.endOffset,
      sc:trange.startContainer,
      so:trange.startOffset,
      range:trange
    }
  }
  function init() {
    watchKeyEvent();
    watchFocus();
    watchBlur();
    watchMouseEvent();
  }
  init();
}

export default new Range();
