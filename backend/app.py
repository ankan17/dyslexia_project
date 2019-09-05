# post_data = {
#     'title': 'Python and MongoDB',
#     'content': 'PyMongo is fun, you guys',
#     'author': 'Bill'
# }
# result = posts.insert_one(post_data)
# print('One post: {0}'.format(result.inserted_id))

# bills_post = posts.find_one({'author': 'Bill'})
# print(bills_post)

from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

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
def get_tasks():
    return jsonify({'words': word_list})
