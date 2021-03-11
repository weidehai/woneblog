declare let axios: any
declare let log: any
declare let wone_util:any

interface article_model{
    article_id:string,
    article_title:string,
    article_tag:string,
    article_time:string
}

(()=>{
    const manage_articles = {
        state:{
            current_page:0,
            pre_page:10,
            isfirst:true,
            is_new_page:true,
            article_total:0,
            page_count:0,
            next_active:false,
            previous_active:false,
            pagebtn:[]
        },
        dom:{
            table:document.getElementsByClassName('post-list')[0].getElementsByTagName('table')[0],
            page_selector:document.getElementById('page-selector'),
            page_nextbtn:document.getElementById('next-page'),
            page_previousbtn:document.getElementById('previous-page'),
            pagebtn_wrapper:document.getElementById('pagination'),
            selected_pagebtn:null
        },
        compute_pageinfo(){
            if(this.state.isfirst){
                this.state.pre_page = this.state.current_page*this.state.pre_page
                this.state.current_page = 1
                this.state.article_total = parseInt(manage_articles.dom.page_selector.getAttribute("data-article-total"))
                this.state.page_count = Math.ceil(manage_articles.state.article_total/manage_articles.state.pre_page)
                this.state.isfirst = false
            }
        },
        get_articles(page){
            axios.get(`/api/articles?page=${page}&limit=${this.state.pre_page}`)
                .then(function (response){
                    this.render(response.data)
                }.bind(this))
                .catch(function (error){
                    console.log(error)
                })
        },
        render(data:article_model[]):boolean {
            let item:article_model
            if(this.state.is_new_page) clear_article_list_content(),this.state.is_new_page=false
            for (item of data){
                let row = document.createElement('tr')
                let title = document.createElement('td')
                let tag = document.createElement('td')
                let time = document.createElement('td')
                let operation = document.createElement('td')
                let editbtn = document.createElement("button")
                let delbtn =  document.createElement("button")
                title.innerText=item.article_title
                tag.innerText=item.article_tag
                time.innerText=item.article_time
                editbtn.innerText = '编辑'
                delbtn.innerText = '删除'
                operation.append(editbtn,delbtn)
                row.append(title,tag,time,operation)
                manage_articles.dom.table.append(row)
            }
            if (this.state.isfirst && wone_util.get_element_computed_property(manage_articles.dom.table,'height') < wone_util.get_one_viewport_height()){
                this.get_articles(++this.state.current_page)
                return true
            }
            if(this.state.isfirst) this.compute_pageinfo(),this.pagebtn_init()
            return true
            function clear_article_list_content(){
                manage_articles.dom.table.innerHTML='<tr>\n' +
                    '\t\t\t\t\t<th style="width: 52%">标题</th>\n' +
                    '\t\t\t\t\t<th style="width: 16%">分类</th>\n' +
                    '\t\t\t\t\t<th style="width: 16%">时间</th>\n' +
                    '\t\t\t\t\t<th style="width: 5rem">操作</th>\n' +
                    '\t\t\t\t</tr>'
            }
        },
        pagebtn_init(){
            clear_pagebtn_wrapper_content()
            check_page_count() && build_pagebtn()
            //page_active = div_wrapper.querySelectorAll("div")[current_page-1]
            //page_active.style.backgroundColor = 'gray'
            //check_whether_headortail()
            function check_page_count(){
                if (manage_articles.state.page_count<=1) return 0
                return 1;
            }
            function clear_pagebtn_wrapper_content(){
                wone_util.clear_innerhtml(manage_articles.dom.pagebtn_wrapper)
            }
            function build_pagebtn(){
                let fragment = document.createDocumentFragment()
                for (let i=1;i<=manage_articles.state.page_count;i++){
                    let div = document.createElement('div')
                    if(i==1) div.style.backgroundColor='gray',manage_articles.dom.selected_pagebtn=div
                    div.innerText = i+''
                    fragment.appendChild(div)
                }
                manage_articles.dom.page_previousbtn.style.backgroundColor='gray'
                manage_articles.dom.page_selector.style.display = "flex"
                manage_articles.dom.pagebtn_wrapper.appendChild(fragment)
                manage_articles.dom.pagebtn_wrapper.addEventListener("click",(e)=>{
                    if(e.target==manage_articles.dom.pagebtn_wrapper) return;
                    let want_page = parseInt((e.target as HTMLDivElement).innerText)
                    if (want_page===manage_articles.state.current_page) return
                    manage_articles.dom.selected_pagebtn.style.backgroundColor = '#409eff';
                    (e.target as HTMLDivElement).style.backgroundColor = 'gray';
                    manage_articles.dom.selected_pagebtn = e.target
                    manage_articles.state.current_page=want_page
                    manage_articles.state.is_new_page=true
                    manage_articles.get_articles(manage_articles.state.current_page)
                })
            }
        }
    }
    manage_articles.get_articles(++manage_articles.state.current_page)
})()



