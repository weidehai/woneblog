import axios from "axios";

const api = {
  getArticles: "/api/articles",
};

class netWork {
  fetch(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  put(url, params, data) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, { params, data })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  post(url, params, data) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params, data })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  delete(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, { params })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class Service extends netWork {
  getArticles(offset,limit) {
    return this.fetch(api.getArticles,{offset,limit})
  }
}

export default new Service();
