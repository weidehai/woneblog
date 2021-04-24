import * as moment from "moment";
import model from "./model";
import { generateArticleList } from "./view";
import { clearInnerhtml } from "../utils";
import $ from "jquery";
import { touchBottomFlush } from "../touchBottomFlush";

(() => {
  let currentYear = parseFloat(moment().format("YYYY"));
  const archiveDom = document.getElementById("archive");
  let offset = 0;
  let limit = 10;
  let fetched_count = 0;
  let allEnd = false;
  let tag;
  let modelType;
  function renderOneViewPortYPage() {
    let modelInitor;
    if (allEnd) return;
    switch (modelType) {
      case "year":
        modelInitor = model.initWithYear(currentYear, { params: { offset, limit, fetched_count } });
        break;
      case "year and tag":
        modelInitor = model.initWithTagAndYear(tag, currentYear, {
          params: { offset, limit, fetched_count },
        });
        break;
      default:
        modelInitor = model.initWithYear(currentYear, { params: { offset, limit, fetched_count } });
        break;
    }
    modelInitor.then((res) => {
      if (res.end) {
        allEnd = true;
        return;
      }
      if (!res.result) {
        currentYear--, (offset = 0);
        if (!isEnoughOneViewPortY()) renderOneViewPortYPage(modelType);
        return;
      }
      model.modelData.concat(model.formatData(res.data));
      if (isExsitDom(`h3[id=${currentYear}]`))
        $(`#${currentYear}`).next().append(generateArticleList(res.data));
      if (!isExsitDom(`h3[id=${currentYear}]`))
        $("div[id=archive]").append(
          `<h3 id='${currentYear}'>${currentYear}</h3><ul class='post-list'>${generateArticleList(
            res.data
          )}</ul>`
        );
      (offset += 10), (fetched_count += res.data.length);
      if (res.data.length < 10) {
        (offset = 0), currentYear--;
      }
      if (!isEnoughOneViewPortY()) renderOneViewPortYPage(modelType);
    });
  }
  function isExsitDom(selector) {
    return $(selector).length > 0;
  }
  function isEnoughOneViewPortY() {
    return document.documentElement.offsetHeight >= window.innerHeight + 50;
  }
  (function init() {
    touchBottomFlush.setup(renderOneViewPortYPage);
    $(`#theme-tag`).on("click", (e) => {
      (tag = e.target.getAttribute("tag")),
        (currentYear = parseFloat(moment().format("YYYY"))),
        (offset = 0),
        (fetched_count = 0),
        (model.modelData = []);
      clearInnerhtml(archiveDom);
      allEnd = false;
      modelType = "year and tag";
      renderOneViewPortYPage();
    });
    clearInnerhtml(archiveDom);
    modelType = "year";
    renderOneViewPortYPage();
  })();
})();
