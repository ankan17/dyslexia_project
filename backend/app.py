# post_data = {
#     'title': 'Python and MongoDB',
#     'content': 'PyMongo is fun, you guys',
#     'author': 'Bill'
# }
# result = posts.insert_one(post_data)
# print('One post: {0}'.format(result.inserted_id))

# bills_post = posts.find_one({'author': 'Bill'})
# print(bills_post)

from flask import Flask, jsonify, request
# from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# client = MongoClient('mongodb://db:27017')
# db = client['pymongo_test']
#
# word_list = []
# words = db.words.find()
# for word in words:
#     word_list.append({
#         'id': str(word['_id']),
#         'value': word['value']
#     })
#
#
# @app.route('/api/v1.0/words', methods=['GET'])
# def words():
#     return jsonify({'words': word_list})


@app.route('/api/v1.0/submit_data', methods=['POST'])
def get_data():
    print(request.data)
    f= open("./file.wav",'wb')
    f.write(request.data)
    f.close()
    # print(type(request.form))
    # print(request.form['data'])
    print("Apna try")
    return jsonify(request.form)
