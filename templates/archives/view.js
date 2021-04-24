import _ from 'lodash'
function generateArticleList(data){
  if(!_.isArray(data)) return
  let result = ''
  data.forEach((value,index,arr)=>{
    result+=`<li class="item"><p class="ellipsis"><time>${value.article_time}</time><a href="/article_detail/${value.article_id}">${value.article_title}</a></p></li>`
  })
  return result
}

export {generateArticleList}
