from flask_script import Manager
# from pymongo import MongoClient
from app import app

manager = Manager(app)
# client = MongoClient('mongodb://db:27017')
# db = client['pymongo_test']


@manager.command
def runserver():
    app.run(debug=True, host='0.0.0.0', port=8000)


# @manager.command
# def loadwords(filename):
#     words = []
#     with open(filename, 'r') as words_file:
#         for line in words_file:
#             words.append({
#                 'value': line.strip()
#             })
#     words_obj = db.words
#     words_obj.insert(words)


if __name__ == "__main__":
    manager.run()
