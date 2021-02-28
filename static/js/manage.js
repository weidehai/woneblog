function get_articles() {
    axios.get('/api/articles?page=1')
        .then(function (response) {
        console.log(response);
    })["catch"](function (error) {
        console.log(error);
    });
}
get_articles();
