//import {getOneViewportHeigh} from "../../utils"
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Model from './model'
import {articleManage,pagination} from './view'
import $ from 'jquery'
import {isExsitDom,clearInnerhtml} from '../../utils'

(() => {
  let offset=0
  let limit=10
  let total=0
  let totalPage = 0
  let currentPage = 1
  let lastPage = 1
  function initArticleModel(){
    Model.initArticles({params:{offset,limit}}).then((res)=>{
      if(!res.result) return
      total = res.total
      console.log(res)
      Model.modelData.concat(Model.formatData(res.data))
      if(isExsitDom('#artilces-manage tbody')){
        $('#artilces-manage tbody').append(renderTable(res.data))
      }
      if(!isExsitDom('#artilces-manage tbody')){
        $('#manage').append(articleManage.replace('tbodytodo',renderTable(res.data)))
      }
      if(!isExsitDom('#page-selector')) offset+=limit
      if(!isEnoughOneViewPortY() && !isExsitDom('#page-selector')) initArticleModel()
      if(isEnoughOneViewPortY() && !isExsitDom('#page-selector')){
        limit=offset,offset=0
        $('#artilces-manage').append(pagination.replace('todo',renderPagination()))
        $('#page-selector').on('click',(e)=>{
          let action = e.target.getAttribute('action')
          lastPage = currentPage
          switch (action) {
            case 'next':
              if(currentPage>=totalPage) return
              offset += limit
              currentPage++
              clearInnerhtml($('#artilces-manage tbody')[0])
              initArticleModel()
              break;
            case 'previous':
              if(currentPage<=1) return
              offset -= limit
              currentPage--
              clearInnerhtml($('#artilces-manage tbody')[0])
              initArticleModel()
              break;
            default:
              if(!action) return
              if(currentPage==action) return
              offset = (action-1)*limit
              currentPage=action
              clearInnerhtml($('#artilces-manage tbody')[0])
              initArticleModel()
              break;
          }
          onPageChange()
        })
      }
    })
  }
  function onPageChange(){
    console.log(currentPage,totalPage,currentPage===totalPage)
    currentPage==totalPage?$('#next-page').removeClass('enable').addClass('disabled'):$('#next-page').removeClass('disabled').addClass('enable')
    currentPage==1?$('#previous-page').removeClass('enable').addClass('disabled'):$('#previous-page').removeClass('disabled').addClass('enable')
    $(`div[action=${currentPage}]`).removeClass('enable').addClass('disabled')
    $(`div[action=${lastPage}]`).removeClass('disabled').addClass('enable')
  }
  function renderTable(data){
    let dom = ''
    data.forEach((value,index,arr)=>{
      dom += `<tr><td>${value.article_title}</td><td>${value.article_tag}</td><td>${value.article_time}</td><td><button action="modify" id="${value.article_id}">编辑</button><button action="delete" id="${value.article_id}">删除</button></td></tr>`
    })
    return dom
  }
  function renderPagination(){
    let dom = []
    let page = Math.ceil(total/limit)
    totalPage = page
    currentPage = 1
    while(page){
      if(page==1){
        dom.unshift(`<div action="${page}" class='disabled'>${page}</div>`)
      }else{
        dom.unshift(`<div action="${page}">${page}</div>`)
      }
      page--
    }
    return dom.join('')
  }
  function isEnoughOneViewPortY(){
    return document.documentElement.offsetHeight >= window.innerHeight + 50
  }
  (function init(){
    $('#manage').on('click',(e)=>{
      let action = e.target.getAttribute('action')
      let id = e.target.getAttribute('id')
      switch (action) {
        case 'modify':
          window.location = `/adminpublish/modify?article_id=${id}`
          break;
        case 'modify':
          //window.location = `/adminpublish/modify?article_id=${id}`
          break;
      }
    })
    initArticleModel()
  }())

  // const manage_articles: manage_articles = {


  //   compute_pageinfo() {
  //     if (this.state.isfirst) {
  //       this.state.pre_page = this.state.current_page * this.state.pre_page;
  //       this.state.current_page = 1;
  //       this.state.article_total = parseInt(
  //         manage_articles.dom.page_selector.getAttribute("data-article-total")
  //       );
  //       this.state.page_count = Math.ceil(
  //         manage_articles.state.article_total / manage_articles.state.pre_page
  //       );
  //       this.state.isfirst = false;
  //     }
  //   },
  //   getArticles(page: number | string) {
  //     axios
  //       .get(`/api/articles?page=${page}&limit=${this.state.pre_page}`)
  //       .then(
  //         function (response:any) {
  //           this.render(response.data);
  //         }.bind(this)
  //       )
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   },
  //   render(data: article_model[]): boolean {
  //     let item: article_model;
  //     if (this.state.is_new_page) clear_article_list_content(), (this.state.is_new_page = false);




  //     if (
  //       this.state.isfirst &&
  //       wone_util.get_element_computed_property(manage_articles.dom.table, "height") <
  //       wone_util.get_one_viewport_height()
  //     ) {
  //       this.get_articles(++this.state.current_page);
  //       return true;
  //     }
  //     if (this.state.isfirst) this.compute_pageinfo(), this.pagebtn_init();
  //     return true;
  //     function clear_article_list_content() {
  //       manage_articles.dom.table.innerHTML =
  //         "<tr>\n" +
  //         '\t\t\t\t\t<th style="width: 52%">标题</th>\n' +
  //         '\t\t\t\t\t<th style="width: 16%">分类</th>\n' +
  //         '\t\t\t\t\t<th style="width: 16%">时间</th>\n' +
  //         '\t\t\t\t\t<th style="width: 5rem">操作</th>\n' +
  //         "\t\t\t\t</tr>";
  //     }
  //   },
  //   pagebtn_init() {
  //     clear_pagebtn_wrapper_content();
  //     check_page_count() && build_pagebtn();
  //     function check_page_count() {
  //       if (manage_articles.state.page_count <= 1) return 0;
  //       return 1;
  //     }
  //     function clear_pagebtn_wrapper_content() {
  //       wone_util.clear_innerhtml(manage_articles.dom.pagebtn_wrapper);
  //     }
  //     function check_headortail(){
  //       if(manage_articles.state.current_page===1){
  //         manage_articles.dom.page_previousbtn.setAttribute('class','disabled')
  //       }
  //       if(manage_articles.state.current_page<manage_articles.state.page_count){
  //         manage_articles.dom.page_nextbtn.setAttribute('class','enable')
  //       }
  //       if(manage_articles.state.current_page==manage_articles.state.page_count){
  //         manage_articles.dom.page_nextbtn.setAttribute('class','disabled')
  //       }
  //       if(manage_articles.state.current_page>1){
  //         manage_articles.dom.page_previousbtn.setAttribute('class','enable')
  //       }
  //     }
  //     function build_pagebtn() {
  //       const fragment = document.createDocumentFragment();
  //       for (let i = 1; i <= manage_articles.state.page_count; i++) {
  //         const div = document.createElement("div");
  //         if (i == 1)
  //           (div.setAttribute('class','active')), (manage_articles.dom.selected_pagebtn = div),div.setAttribute('id','beginbtn');
  //         div.innerText = i + "";
  //         if(i===manage_articles.state.page_count){
  //           div.setAttribute('id','endbtn')
  //         }
  //         fragment.appendChild(div);
  //       }
  //       manage_articles.dom.page_previousbtn.setAttribute('class','disabled')
  //       manage_articles.dom.page_selector.style.display = "flex";
  //       manage_articles.dom.pagebtn_wrapper.appendChild(fragment);
  //       manage_articles.dom.pagebtn_wrapper.addEventListener("click", (e:Event) => {
  //         if (e.target == manage_articles.dom.pagebtn_wrapper) return;
  //         const want_page = parseInt((e.target as HTMLDivElement).innerText);
  //         if (want_page === manage_articles.state.current_page) return;
  //         manage_articles.dom.selected_pagebtn.setAttribute('class','deactive');
  //         (e.target as HTMLDivElement).setAttribute('class','active')
  //         manage_articles.dom.selected_pagebtn = e.target;
  //         manage_articles.state.current_page = want_page;
  //         manage_articles.state.is_new_page = true;
  //         manage_articles.get_articles(manage_articles.state.current_page);
  //         check_headortail()
  //       });
  //       manage_articles.dom.page_nextbtn.addEventListener('click',()=>{
  //         if(manage_articles.state.current_page===manage_articles.state.page_count){
  //           return
  //         }
  //         manage_articles.state.is_new_page = true;
  //         const active = document.querySelector('.active')
  //         manage_articles.dom.selected_pagebtn = active.nextElementSibling
  //         active.nextElementSibling.setAttribute('class','active')
  //         active.setAttribute('class','deactive')
  //         manage_articles.get_articles(++manage_articles.state.current_page);
  //         check_headortail()
  //       })
  //       manage_articles.dom.page_previousbtn.addEventListener('click',()=>{
  //         if(manage_articles.state.current_page===1){
  //           return
  //         }
  //         manage_articles.state.is_new_page = true;
  //         const active = document.querySelector('.active')
  //         manage_articles.dom.selected_pagebtn = active.previousElementSibling
  //         active.previousElementSibling.setAttribute('class','active')
  //         active.setAttribute('class','deactive')
  //         manage_articles.get_articles(--manage_articles.state.current_page);
  //         check_headortail()
  //       })
  //     }
  //   },
  // };
  // manage_articles.get_articles(++manage_articles.state.current_page);
})();
