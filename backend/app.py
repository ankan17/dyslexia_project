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
