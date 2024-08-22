import os
import json
import hashlib
import pandas as pd
import numpy as np

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

words = []
datasets = [
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
    './data/Corpus_Processing_Outcomes/Hindi_word_frpm_96122.txt',
]

config_file_path = './roo/db/config.json'
with open(config_file_path, 'r', encoding="utf-8") as fp:
    config = json.load(fp)

block_size = config['block_size']
checkpoint_size = config['checkpoint_size']
block_count = len(words)//block_size

def get_dataset(rel_file_path):
    global words, block_count, block_size
    with open(rel_file_path, 'r', encoding="utf-8") as fp:
        fc = fp.readlines()

    words = [i.split(';')[0] for i in fc]
    block_count = len(words)//block_size

last_used_idx = None
titles = ['New Imageability', 'New Dominance', 'New Arousal', 'Arousal', 'New Valence', 'Imageability', 'Familiarity', 'Age of Acquisition', 'Concreteness', 'New Concreteness', 'Valence', 'Dominance']
descs = ['Hindi Word Imageability Norms Survey', 'Hindi Word Dominance Norms Survey', 'Hindi Word Arousal Norms Survey', 'Hindi Word Arousal Norms Survey', 'Hindi word Valence Norms Survey', 'Hindi Word Imageability Norms Survey', 'Hindi Word Familiarity Norms Survey', 'Words Age of acquisition rating survey', 'Hindi Word Concreteness Norms Survey', 'Hindi Word Concreteness Norms Survey', 'Hindi Word Valence Norms Survey', 'Hindi Word Dominance Norms Survey']

def chunk_array(arr, s):
    return np.array_split(arr, np.ceil(len(arr) / s).astype(int))

@app.route('/get-block-size/<courseName>', methods=['GET'])
def get_block_size(courseName):
    try:
        dataset_index = titles.index(courseName)
        dataset_path = datasets[dataset_index]
        get_dataset(dataset_path)
        return jsonify(block_size=block_size)
    except ValueError:
        return jsonify(error="Course not found"), 404

# @app.route('/word')
# def get_word():
    # return 2
    # wd = get_dataset(datasets[0])
    # # global words
    # # print(words)
    # word_idx = request.args.get('word_idx', default=None, type=int)
    # # if word_idx is None:
    # #     return "None"
    # return wd[word_idx]
    # return words[word_idx]

@app.route('/words', methods=['POST'])
def get_words():
    global last_used_idx, words

    data = request.json
    slice_of_n, offset_idx, email, course, get_last = data
    reuse_words = False

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"
    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    my_projects = saved_data[email].get('myProjects')
    course_deets = my_projects[course]
    
    last_used_idx = course_deets.get("wordsCompleted")
    if get_last:
        if last_used_idx != 0:
            last_used_idx -= 1

    if last_used_idx is None:
        last_used_idx = 0

    if slice_of_n is not None:
        if reuse_words:
            res = words[:slice_of_n]
        else:
            if offset_idx is not None:
                last_used_idx = offset_idx

            if last_used_idx > len(words):
                res = [[]]
            else:
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

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    # email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"
    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    my_projects = saved_data[email].get('myProjects')

    if my_projects is None or my_projects == []:
        t = []
        d = []
        return jsonify([t, d, block_count])

    t = my_projects
    d = [descs[titles.index(k)] for k in my_projects.keys()]

    t = [{k:v} for k, v in t.items()]
    t = [i.tolist() for i in chunk_array(t, chunk_size)]
    d = [i.tolist() for i in chunk_array(d, chunk_size)]

    return jsonify([t, d, block_count])

@app.route('/reg-course', methods=['POST'])
def reg_course():
    data = request.json
    email, course = data

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    db_file = f"roo/db/users.json"
    user_file = f"roo/db/{email_hash}"
    with open(db_file, 'r', encoding='utf-8') as fp:
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

    with open(db_file, 'w', encoding='utf-8') as fp:
        json.dump(saved_data, fp, indent=2)

    return jsonify({"success": True, "msg": msg})

@app.route('/export-data', methods=["POST"])
def generate_excel():
    global checkpoint_size
    data = request.json
    email = data

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/{email_hash}"

    with open(user_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    df = pd.DataFrame(saved_data)
    df = df.reset_index()
    df = df.rename(columns={'index': 'word'})
    df.to_csv(f"exported_data_{email_hash}.csv")

    # Save DataFrame to different checkpoints
    checkpoint_idx = last_used_idx//checkpoint_size
    print('cp:', checkpoint_idx)
    with pd.ExcelWriter(f"exported_data_{email_hash}.xlsx", engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=f"checkpoint_{checkpoint_idx + 1}", index=False)

    return jsonify({"success": True, "msg": "Data exported successfully"})

@app.route('/save-freq', methods=['POST'])
def save_freq():
    data = request.json
    email, course_name, word, freq = data

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/{email_hash}"

    if not os.path.isfile(user_file):
        with open(user_file, 'w', encoding='utf-8') as fp:
            json.dump({course_name: {word: freq}}, fp, indent=2)

        return jsonify({
            "success": True,
            "email_hash": email_hash,
            "saved_word_info": {
                "word": word,
                "freq": freq,
            }
        })

    if word is not None:
        word = words[last_used_idx-2]

        with open(user_file, 'r', encoding='utf-8') as fp:
            user_data = json.load(fp)
        
        if user_data is not None:
            info = {word: freq}
            if course_name in user_data:
                user_data[course_name].update(info)
            else:
                user_data[course_name] = info

            with open(user_file, 'w', encoding='utf-8') as fp:
                json.dump(user_data, fp, indent=2)

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

    return jsonify({"success": True, "profile": my_profile})

    if my_profile is None:
        msg = ('Please enter your profile')
        return jsonify({"success": False, "msg": msg})
    print(my_profile)

@app.route('/update-profile', methods=['POST'])
def update_profile():
    updated_profile = request.json.get('formData')
    email = request.json.get('email')

    if updated_profile is None:
        msg = ('Please enter your profile')
        return jsonify({"success": False, "msg": msg})

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    db_file = f"roo/db/users.json"

    if os.path.isfile(db_file):
        with open(db_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

    # Update details
    saved_data[email].update(updated_profile)

    with open(db_file, 'w', encoding='utf-8') as fp:
        json.dump(saved_data, fp, indent=2)

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
    app.run(host='0.0.0.0', debug=True, port=4997)

