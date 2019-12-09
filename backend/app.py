import os
import librosa
import soundfile

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
    lang = request.args.get('lang')
    word_list = []
    words = db.words.find({'lang': lang})
    for word in words:
        word_list.append({
            'id': str(word['_id']),
            'value': word['value']
        })
    return jsonify({'words': word_list})


@app.route('/api/v1.0/submit_data', methods=['POST'])
def submit_data():
    id = request.args.get('id')
    lang = request.args.get('lang')

    subject = find_by_truncated_id(db.subjects, id)
    if not subject:
        e = "No student found with the id"
        return jsonify({'message': e}), 404
    full_id = subject.get('_id')

    dir_path = os.path.join(UPLOAD_FOLDER, id, lang)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    os.chdir(dir_path)

    response = {}
    response['first_name'] = subject['first_name']

    result = find_by_truncated_id(db.status, id, "subject_id")
    completed = result.get('completed')

    files = request.files.to_dict()
    for file in files:
        files[file].save(file)
        x, _ = librosa.load(file, sr=16000)
        soundfile.write(file, x, 16000)
        completed[lang].append(file.split('_')[0])

    response['completed'] = completed[lang]
    print(completed)

    db.status.update_one(
        {"subject_id": full_id},
        {"$set": {"completed": completed, }, }
    )

    return jsonify(response)


@app.route('/api/v2.0/submit_data', methods=['POST'])
def submit_data_v2():
    id = request.args.get('id')
    lang = request.args.get('lang')

    subject = find_by_truncated_id(db.subjects, id)
    if not subject:
        e = "No student found with the id"
        return jsonify({'message': e}), 404
    full_id = subject.get('_id')

    dir_path = os.path.join(UPLOAD_FOLDER, id, lang)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    os.chdir(dir_path)

    response = {}
    response['first_name'] = subject['first_name']

    result = find_by_truncated_id(db.status, id, "subject_id")
    completed = result.get('completed')

    files = request.files.to_dict()
    print(request.files)
    for file in files:
        files[file].save(file)
        x, _ = librosa.load(file, sr=16000)
        soundfile.write(file, x, 16000)

        start, end = file.split('_')
        start = int(start)
        end = int(end[:-4])
        print(start, end)
        words = db.words.find({'lang': lang})

        for index, word in enumerate(words):
            if start <= index <= end:
                completed[lang].append(str(word['_id']))

    response['completed'] = completed[lang]
    print(completed)

    db.status.update_one(
        {"subject_id": full_id},
        {"$set": {"completed": completed, }, }
    )

    print(db.status.find_one({"subject_id": full_id}))

    return jsonify(response)


@app.route('/api/v1.0/register', methods=['POST'])
def register_student():
    subjects = db["subjects"]
    status = db["status"]
    result = subjects.insert_one(request.json)
    result = status.insert_one({
        "subject_id": result.inserted_id,
        "completed": {"eng": [], "ben": []}  # Hardcoded
    })
    return jsonify({'id': str(result.inserted_id)})


@app.route('/api/v1.0/status', methods=['GET'])
def get_test_status():
    id = request.args.get('id')
    lang = request.args.get('lang')
    response = {}

    subject = find_by_truncated_id(db.subjects, id)
    if not subject:
        e = "No student found with the id"
        return jsonify(error=404, text=str(e)), 404

    response['first_name'] = subject['first_name']
    response['completed'] = []

    result = find_by_truncated_id(db.status, id, "subject_id")
    if result:
        response['completed'] += result.get('completed')[lang]

    print(response)

    return jsonify(response)


@app.route('/api/v1.0/subjects', methods=['GET'])
def get_subjects():
    eng_word_count = db.words.count({'lang': 'eng'})
    ben_word_count = db.words.count({'lang': 'eng'})

    response = {'subjects': []}

    subjects = db.subjects.find()
    for s in subjects:
        status = db.status.find_one({'subject_id': s['_id']})
        if status:
            eng_test_completed = len(status['completed']['eng']) == eng_word_count
            ben_test_completed = len(status['completed']['ben']) == ben_word_count
        else:
            eng_test_completed, ben_test_completed = False, False
        response['subjects'].append({
            'id': str(s['_id']),
            'name': "%s %s" % (s['first_name'], s['last_name']),
            'eng_test_status': eng_test_completed,
            'ben_test_status': ben_test_completed,
        })

    return jsonify(response)
