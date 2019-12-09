import os
import speech_recognition as sr

from settings import UPLOAD_FOLDER


def find_by_truncated_id(relation, id, key='_id'):
    for item in relation.find():
        if str(item[key])[:8] == id:
            return item

    return None


def delete_item(relation, id=None):
    if not id:
        relation.delete_many({})


def recognize_word(id, lang):
    r = sr.Recognizer()
    lang_codes = {'ben': 'bn-IN', 'eng': 'en-IN'}

    response = []

    dir_path = os.path.join(UPLOAD_FOLDER, id, lang)
    if os.path.exists(dir_path):
        os.chdir(dir_path)
        for filename in os.listdir(dir_path):
            if filename.endswith(".wav"):
                word_id, original_word = filename.split('_')
                original_word = original_word[:-4]
                with sr.AudioFile(filename) as source:
                    audio = r.record(source)
                recognized_word = r.recognize_google(audio, language=lang_codes[lang])

                response.append({
                    'id': word_id,
                    'original': original_word,
                    'recognized': recognized_word
                })

    return response
