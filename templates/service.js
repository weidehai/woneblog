import axios from "axios";

const api = {
  getArticles: "/api/articles",
  upload:"/api/upload"
};

const Network = {
  fetch(url, config) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  put(url, data,config) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, data,config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post(url, config) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  delete(url, config) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

const Service = Object.create(Network)

Service.getArticles = function(config) {
  return this.fetch(api.getArticles,config)
}

Service.getArticlesByTagAndYear = function(tag,year,config){
  return this.fetch(`${api.getArticles}/${tag}/${year}`,config)
}

Service.getArticlesByYear = function(year,config){
  return this.fetch(`${api.getArticles}/${year}`,config)
}

Service.upload = function(data,config){
  return this.put(api.upload,data,config)
}

export default Service;
