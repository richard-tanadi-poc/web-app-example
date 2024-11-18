from flask import Flask, render_template, request
app = Flask(__name__)
import requests

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data_url = "http://192.168.1.242:80/api/vote"
        if request.form.get('Tree') == 'Tree':
            data = {'vote' : 'a'}
            response = requests.post(url = data_url, data=data)
        elif  request.form.get('Flower') == 'Flower':
            data = {'vote' : 'b'}
            response = requests.post(url = data_url, data=data)
        response = requests.get(url=data_url)
        data_from_url = response.text
        return render_template("index.html", data=data_from_url)
    elif request.method == 'GET':
        data_url = "http://192.168.1.242:80/api/vote"
        response = requests.get(url=data_url)
        data_from_url = response.text
        return render_template("index.html", data=data_from_url)

if __name__ == '__main__':
    app.run(debug=True)