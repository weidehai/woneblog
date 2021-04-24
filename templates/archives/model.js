import service from '../service'
import _ from 'lodash'
const INVALIDTIME = "00:00:00"
const Model = {
  modelData:[],
  initWithYear(year,config){
    return service.getArticlesByYear(...arguments)
  },
  initWithTagAndYear(tag,year,config){
    return service.getArticlesByTagAndYear(...arguments)
  },
  formatData(data){
    if(!_.isArray(data)) return
    data.forEach((value,index,arr)=>{
      let [day,time] = data[index].article_time.split('T')
      data[index].article_time = time === INVALIDTIME?day:`${day} ${time}`
    })
    return data
  }
}

export default Model
