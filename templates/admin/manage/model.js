import service from './service'

class Model{
  constructor(){
    this.modelData = null
  }
  init(){
    return service.getArticles(0,10)
  }
}

export default new Model()
