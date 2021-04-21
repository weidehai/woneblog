//import {getOneViewportHeigh} from "../../utils"
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import model from './model'

(() => {
  function initModel(){
    model.init().then((res)=>{
      model.modelData = res.data
    })
  }
  function renderTable(data){
    `<tr>
      <td>${data.article_title}<td>
      <td>${data.article_tag}<td>
      <td>${data.article_time}<td>
      <td><button onclick="">编辑</button><button onclick="">删除</button><td>
     <tr>`
  }
  initModel()
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
