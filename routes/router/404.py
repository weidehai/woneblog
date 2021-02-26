@app.errorhandler(404)
def page_not_found(error):
    return render_template('404error.html')