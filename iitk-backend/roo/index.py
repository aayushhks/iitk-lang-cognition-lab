import os
import json
import hashlib
import pandas as pd
import numpy as np

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
print(os.getcwd())
rel_file_path = './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt'
config_file_path = './roo/db/config.json'

with open(rel_file_path, 'r', encoding="utf-8") as fp:
    fc = fp.readlines()

with open(config_file_path, 'r', encoding="utf-8") as fp:
    config = json.load(fp)

words = [i.split(';')[0] for i in fc]
block_size = config['block_size']
block_count = len(words)//block_size

# df = pd.read_csv(rel_file_path, low_memory=False, on_bad_lines='warn')
# df = pd.read_csv(rel_file_path, low_memory=False, delimiter="\t")

last_used_idx = None
titles = ['New Imageability', 'New Dominance', 'New Arousal', 'Arousal', 'New Valence', 'Imageability', 'Familiarity', 'Age of Acquisition', 'Concreteness', 'New Concreteness', 'Valence', 'Dominance']
descs = ['Hindi Word Imageability Norms Survey', 'Hindi Word Dominance Norms Survey', 'Hindi Word Arousal Norms Survey', 'Hindi Word Arousal Norms Survey', 'Hindi word Valence Norms Survey', 'Hindi Word Imageability Norms Survey', 'Hindi Word Familiarity Norms Survey', 'Words Age of acquisition rating survey', 'Hindi Word Concreteness Norms Survey', 'Hindi Word Concreteness Norms Survey', 'Hindi Word Valence Norms Survey', 'Hindi Word Dominance Norms Survey']

def chunk_array(arr, s):
    return np.array_split(arr, np.ceil(len(arr) / s).astype(int))

@app.route('/get-block-size')
def get_block_size():
    return jsonify(block_size)

@app.route('/word')
def get_word():
    global words
    word_idx = request.args.get('word_idx', default=None, type=int)
    if word_idx is None:
        return "None"
    return words[word_idx]

@app.route('/words', methods=['POST'])
def get_words():
    global last_used_idx, words

    data = request.json
    slice_of_n, offset_idx, email, course = data
    reuse_words = False

    # slice_of_n = request.args.get('slice_of_n', default=None, type=int)
    # reuse_words = request.args.get('pop_word', default=False, type=int)
    # offset_idx = request.args.get('offset_idx', default=None, type=int)

    # df.sort_values(by="frequency", ascending=False, inplace=True)

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"
    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    my_projects = saved_data[email].get('myProjects')
    course_deets = my_projects[course]
    last_used_idx = course_deets["wordsCompleted"]

    if slice_of_n is not None:
        if reuse_words:
            # words = words.iloc[:slice_of_n]
            res = words[:slice_of_n]
        else:
            if offset_idx is not None:
                last_used_idx = offset_idx

            res = words[last_used_idx: last_used_idx+slice_of_n]
            last_used_idx += slice_of_n

            saved_data[email]['myProjects'][course]["wordsCompleted"] = last_used_idx
            saved_data[email]['myProjects'][course]["blocksCompleted"] = last_used_idx//block_size

            with open(user_file, 'w', encoding='utf-8') as fp:
                json.dump(saved_data, fp, indent=2)

    return jsonify([len(words), last_used_idx, res])

@app.route('/get-unreg-courses', methods=['POST'])
def get_unreg_courses():
    email, chunk_size = request.json
    print(email, chunk_size)

    # email = request.args.get('email', default=None, type=int)
    # word = request.args.get('word', default=None, type=int)
    # freq = request.args.get('freq', default=None, type=int)

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"
    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    my_projects = saved_data[email].get('myProjects')

    if my_projects is None:
        t = [i.tolist() for i in chunk_array(titles, chunk_size)]
        d = [i.tolist() for i in chunk_array(descs, chunk_size)]
        return jsonify([t, d])

    t = [course for course in titles if course not in my_projects]
    d = [desc for desc, course in zip(descs, titles) if course not in my_projects]

    if t == []:
        return jsonify([t, d])

    t = [i.tolist() for i in chunk_array(t, chunk_size)]
    d = [i.tolist() for i in chunk_array(d, chunk_size)]

    return jsonify([t, d])

@app.route('/get-reg-courses', methods=['POST'])
def get_reg_courses():
    email, chunk_size = request.json
    print('\n', email, chunk_size)

    # email = request.args.get('email', default=None, type=int)
    # word = request.args.get('word', default=None, type=int)
    # freq = request.args.get('freq', default=None, type=int)

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"
    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    my_projects = saved_data[email].get('myProjects')
    print(my_projects)

    if my_projects is None or my_projects == []:
        t = []
        d = []
        # t = [i.tolist() for i in chunk_array(titles, chunk_size)]
        # d = [i.tolist() for i in chunk_array(descs, chunk_size)]
        return jsonify([t, d, block_count])

    t = my_projects
    d = [descs[titles.index(k)] for k in my_projects.keys()]
    t = [{k:v} for k, v in t.items()]
    # d = [desc for desc, course in zip(descs, titles) if course in my_projects]

    t = [i.tolist() for i in chunk_array(t, chunk_size)]
    d = [i.tolist() for i in chunk_array(d, chunk_size)]

    return jsonify([t, d, block_count])

@app.route('/reg-course', methods=['POST'])
def reg_course():
    data = request.json
    email, course = data

    print(email)
    print(course)

    # email = request.args.get('email', default=None, type=int)
    # word = request.args.get('word', default=None, type=int)
    # freq = request.args.get('freq', default=None, type=int)

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"
    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    msg = "Course successfully registered"

    course_info = {
        course: {
            "tags": ["हिन्दी"],
            "blocksCompleted": 0,
            "wordsCompleted": 0,
            "credits": 0
        }
    }

    if saved_data[email].get('myProjects') is None:
        saved_data[email]['myProjects'] = course_info
    else:
        saved_data[email]['myProjects'].update(course_info)

    # if course in saved_data['myProjects']:
    #     saved_data['myProjects'].remove(course)
    #     msg = "Course successfully unregistered"
    # else:
    #     saved_data['myProjects'].append(course)
    #     msg = "Course successfully registered"

    with open(user_file, 'w', encoding='utf-8') as fp:
        json.dump(saved_data, fp, indent=2)

    return jsonify({"success": True, "msg": msg})

@app.route('/save-freq', methods=['POST'])
def save_freq():
    data = request.json
    email, word, freq = data
    print(email, word, freq)
    # email = request.args.get('email', default=None, type=int)
    # word = request.args.get('word', default=None, type=int)
    # freq = request.args.get('freq', default=None, type=int)

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/{email_hash}"

    if word is not None:
        word = words[last_used_idx-2]
        with open(user_file, 'a', encoding='utf-8') as fp:
            fp.write(f"{word}: {freq},\n")

        return jsonify({
            "success": True,
            "email_hash": email_hash,
            "saved_word_info": {
                "word": word,
                "freq": freq,
            }
        })

    return jsonify({"success": False, "email_hash": email_hash})

@app.route('/login', methods=['POST'])
def login():
    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    db_file = "./roo/db/users.json"
    data = request.json

    email = data.get('email')
    password = data.get('password')

    if os.path.isfile(db_file):
        with open(db_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

    if email in saved_data.keys():
        # Email is valid
        if password == saved_data[email]['password']:
            d = {k: v for k, v in saved_data[email].items() if k != 'password'}
            # Password is correct
            return jsonify({"success": True, 'data': d}), 200

    return jsonify({"success": False}), 401

@app.route('/get-profile', methods=['POST'])
def get_profile():
    msg = ('Your profile lol')
    email = request.json.get('email')

    # temporary db
    os.makedirs("roo/db", exist_ok=True)

    db_file = "./roo/db/users.json"

    if os.path.isfile(db_file):
        with open(db_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

    my_profile = saved_data[email]
    # print(my_profile)

    # print(my_details)
    return jsonify({"success": True, "profile": my_profile})

    # my_profile = request.json.get('formData')
    if my_profile is None:
        msg = ('Please enter your profile')
        return jsonify({"success": False, "msg": msg})
    print(my_profile)

@app.route('/update-profile', methods=['POST'])
def update_profile():
    updated_profile = request.json.get('formData')
    email = request.json.get('email')
    new_email = updated_profile.pop('email')

    # email_updated = (email == new_email)

    if updated_profile is None:
        msg = ('Please enter your profile')
        return jsonify({"success": False, "msg": msg})

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    db_file = f"roo/db/users.json"

    if os.path.isfile(db_file):
        with open(db_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

    print(email)
    print(updated_profile)

    # Update details
    saved_data[email].update(updated_profile)

    # if email_updated:
    #     # Update email
    #     saved_data[updated_profile.email] = saved_data.pop(email)

    print('=====')
    print(saved_data[email])
    # print('---')

    with open(db_file, 'w', encoding='utf-8') as fp:
        json.dump(saved_data, fp, indent=2)

    # print(updated_profile)
    msg = ('Your profile has been updated')
    return jsonify({"success": False, "msg": msg})

@app.route('/signup', methods=['POST'])
def signup():
    # temporary db
    os.makedirs("roo/db", exist_ok=True)

    db_file = "./roo/db/users.json"
    form_data = request.json['formData']

    if os.path.isfile(db_file):
        with open(db_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

    data = {key: value for key, value in form_data.items() if key != 'email'}
    email = form_data['email']

    if os.path.isfile(db_file):
        # print(saved_data.keys(), email)
        if email in saved_data.keys():
            msg = "User already registered"
            return jsonify({"success": False, "msg": msg})
        else:
            saved_data.update({email: data})
            new_data = saved_data
    else:
        new_data = {email: data}

    with open(db_file, 'w', encoding='utf-8') as fp:
        json.dump(new_data, fp, indent=2)

    msg = "User successfully registered"
    return jsonify({"success": True, "msg": msg})

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True, port=4999)


