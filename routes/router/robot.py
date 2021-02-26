@app.route('/robot.txt')
def robots():
    root = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(root, 'robot.txt')