from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://db:27017')
db = client['pymongo_test']

word_list = []
words = db.words.find()
for word in words:
    word_list.append({
        'id': str(word['_id']),
        'value': word['value']
    })


@app.route('/api/v1.0/words', methods=['GET'])
def words():
    return jsonify({'words': word_list})


@app.route('/api/v1.0/submit_data', methods=['POST'])
def get_data():
    files = request.files.to_dict()
    for file in files:
        files[file].save("%s.wav" % (file))

    return jsonify(request.form)


@app.route('/api/v1.0/register', methods=['POST'])
def register_student():
    subjects = db["subjects"]
    result = subjects.insert_one(request.json)
    return jsonify({'id': str(result.inserted_id)})


@app.route('/api/v1.0/status', methods=['GET'])
def get_test_status():
    id = request.args.get('id')
    response = {}

    subjects = db.subjects.find()
    for sub in subjects:
        if str(sub.get('_id'))[:8] == id:
            response['first_name'] = sub['first_name']
            response['last_name'] = sub['last_name']
            response['completed'] = []
            break

    status = db.status.find()
    for s in status:
        if str(s.get('id'))[:8] == id:
            response['completed'] += s.get('completed')
            break

    return response
