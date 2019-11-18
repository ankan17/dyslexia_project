import os

from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

from utils import find_by_truncated_id
from settings import UPLOAD_FOLDER


app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://db:27017')
db = client['pymongo_test']


@app.route('/api/v1.0/words', methods=['GET'])
def words():
    word_list = []
    words = db.words.find()
    for word in words:
        word_list.append({
            'id': str(word['_id']),
            'value': word['value']
        })
    return jsonify({'words': word_list})


@app.route('/api/v1.0/submit_data', methods=['POST'])
def get_data():
    id = request.args.get('id')
    subject = find_by_truncated_id(db.subjects.find(), id)
    if not subject:
        e = "No student found with the id"
        return jsonify({'message': e}), 404

    dir_path = os.path.join(UPLOAD_FOLDER, id)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    os.chdir(dir_path)

    response = {}
    response['first_name'] = subject['first_name']

    status = db.status.find()
    result = find_by_truncated_id(status, id)
    completed = result['completed']

    files = request.files.to_dict()
    for file in files:
        files[file].save(file)
        completed.append(file.split('_')[0])

    response['completed'] = completed

    # Note tested; Please check if it's working
    db.status.update(
        {"_id": result.get('_id')},
        {"$set": {"completed": completed}, }
    )

    return jsonify(response)


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
    subject = find_by_truncated_id(subjects, id)
    if not subject:
        e = "No student found with the id"
        return jsonify(error=404, text=str(e)), 404

    response['first_name'] = subject['first_name']
    response['completed'] = []

    status = db.status.find()
    result = find_by_truncated_id(status, id)
    if result:
        response['completed'] += result.get('completed')

    return jsonify(response)
