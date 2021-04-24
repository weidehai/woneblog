import Service from '../../service'
import _ from 'lodash'
const INVALIDTIME = "00:00:00"
const Model = {
  modelData:[],
  initArticles(config){
    return Service.getArticles(...arguments)
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