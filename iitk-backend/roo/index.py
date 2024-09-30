# TODO: Ensure all JWT works correctly

import os
import sys
import json
import hashlib
import subprocess
import pandas as pd
import numpy as np

import security

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import Flask, jsonify, request, send_file
from datetime import datetime as dt
from dotenv import load_dotenv
from flask_cors import CORS

from copy import deepcopy # , copy

# Load environment variables from .env file
load_dotenv()
app = Flask(__name__)
# CORS(app)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = os.environ.get('LCL_SECRET_KEY', 'default_secret_key')
jwt = JWTManager(app)

# Defining global variables
words = []
word_types = []

config_file_path = './roo/db/config.json'
with open(config_file_path, 'r', encoding="utf-8" ) as fp:
    config = json.load(fp)

project_info = config['project']

datasets = project_info['project_dataset_paths']
titles = project_info['project_names']
descs = project_info['project_descs']

block_size = config['block_size']
checkpoint_size = config['checkpoint_size']
block_count = len(words) // block_size

last_used_idx = None

db_dir = "roo/db"
admin_dir = "roo/admin_db"
online_users_file = os.path.join(db_dir, "online_users.json")
users_file = os.path.join(db_dir, "users.json")
admin_file = "./roo/db/admin.json"

def get_mac_address():
    try:
        if sys.platform == 'win32':
            output = subprocess.check_output(["getmac", "/v", "/fo", "list"])
            for line in output.splitlines():
                if line.strip().startswith(b"Physical"):
                    data = line.split(b":")[1].strip().decode("utf-8")

        elif sys.platform in ['linux', 'darwin']:
            output = subprocess.check_output(["ifconfig"]).decode("utf-8")
            for line in output.split("\n"):
                if "ether" in line:
                    data = line.split()[1]

        sha256 = hashlib.sha256()
        sha256.update(data.encode('utf-8'))
        data_hash = sha256.hexdigest()

        return data_hash

    except Exception as e:
        return jsonify({"success": True, "err": f"An error occurred: {e}"})

def get_dataset(rel_file_path):
    global words, word_types, block_count, block_size
    with open(rel_file_path, 'r', encoding="utf-8") as fp:
        fc = fp.readlines()

    words = [i.split(';')[0] for i in fc]
    word_types = ['main' for _ in fc] # TODO: Change
    block_count = len(words) // block_size

def chunk_array(arr, s):
    return np.array_split(arr, np.ceil(len(arr) / s).astype(int))

def export_data(data_export_path,
                data_array,
                header_names,
                view_mode=None):

    # Only for Opted Surveys Export
    if header_names == []:
        if view_mode == 0:
            header_names = [
                "Customer Name",
                "Survey ID",
                "Survey Name",
                "Date",
                "Credits",
                "Words Attempted",
                "Status",
                "Block Size",
                "Block Completed",
            ]
        else:
            header_names = [
                "Customer Name",
                "Survey ID",
                "Question",
                "Answer",
                "Created DTM",
                "Block No",
                "Question Type",
                "QID",
                "Repeat Counter",
            ]
    try:
        os.makedirs(os.path.dirname(data_export_path), exist_ok=True)
        df = pd.DataFrame(data_array, columns=header_names)
        df.to_csv(data_export_path)
        # print(data_array)
        return 0

    except Exception as e:
        # raise
        print('e--->', e)
        return 1

@app.route('/word-attempted', methods=['POST'])
def word_attempted():
    global users_file

    given_user_name = request.json.get('userName')
    given_course_name = request.json.get('courseName')

    filters = request.json.get('modeFilter')

    headers = request.json.get('columnNames', None)
    logged_email = request.json.get('email', None)
    export = request.json.get('export_', False)

    sha256 = hashlib.sha256()
    sha256.update(logged_email.encode('utf-8'))
    email_hash_ = sha256.hexdigest()

    with open(users_file, 'r', encoding='utf-8') as fp:
        users_data = json.load(fp)

    emails = users_data.keys()

    result = []
    for email in emails:
        users_data[email]
        sha256 = hashlib.sha256()
        sha256.update(email.encode('utf-8'))
        email_hash = sha256.hexdigest()

        with open(f"roo/db/{email_hash}") as fp:
            data = json.load(fp)

        with open(users_file) as fp:
            users_data = json.load(fp)

        user_name = users_data[email]['name']

        if given_user_name is not None:
            if email != given_user_name:
                continue

        for course_name, items in data.items():
            if course_name == given_course_name or given_course_name is None:
                for key, value in items.items():
                    val, created_dtm = value, "NA"
                    if isinstance(value, list):
                        val, created_dtm, dataset, word_idx = value

                    block_idx = "Unavailable"
                    block_idx = word_idx // block_size
                    word_offset = (word_idx-1) % block_size

                    if val == -10 and len(items) == 1:
                        word_idx = 0

                    if 0 <= word_offset < config['calibrated_thresh']:
                        word_type = 'calibrated'
                    elif config['calibrated_thresh'] <= word_offset < config['control_thresh']:
                        word_type = 'control'
                    else:
                        word_type = 'main'

                    info = [user_name,
                            titles.index(course_name) + 1,
                            key,
                            val,
                            created_dtm,
                            block_idx + 1,
                            word_type,
                            word_idx,
                            5]

                    if (
                        (filters[0].strip() == "" or (filters[0].lower() in info[0].lower())) and
                        (filters[2].strip() == "" or (filters[2].lower() in info[2].lower())) and
                        (filters[4].strip() == "" or (filters[4].lower() in info[4].lower())) and
                        (filters[6].strip() == "" or (filters[6].lower() in info[6].lower())) and

                        (filters[1].strip() == "" or (filters[1].strip().isdigit() and int(filters[1].strip()) == info[1])) and
                        (filters[3].strip() == "" or (filters[3].strip().isdigit() and int(filters[3].strip()) == info[3])) and
                        (filters[5].strip() == "" or (filters[5].strip().isdigit() and int(filters[5].strip()) == info[5])) and
                        (filters[7].strip() == "" or (filters[7].strip().isdigit() and int(filters[7].strip()) == info[7])) and
                        (filters[8].strip() == "" or (filters[8].strip().isdigit() and int(filters[8].strip()) == info[8]))
                    ):
                        result.append(info)

    if export:
        send_file_data_export_path = os.path.join('db', f"{email_hash_}/exported_data_words_attempted.csv")
        data_export_path = os.path.join('roo/db', f"{email_hash_}/exported_data_words_attempted.csv")

        # Removed the last "action" col from header
        export_data(data_export_path, result, headers[:-1], 1)
        return send_file(
            send_file_data_export_path,
            as_attachment=True,
        )

    return jsonify({"success": True, "data": result})

@app.route('/get-ad-mgmt-table', methods=['POST'])
def get_ad_mgmt_table():
    global titles, words, word_types

    filter_type, filter_query = None, None
    offset_start, offset_end, filter_type, filter_query = request.json
    
    dataset_path = datasets[-1]
    get_dataset(dataset_path)
    try:
        if isinstance(filter_query, str): 
            filter_query = filter_query.lower()

        if True:
            data = [{"title": titles[j], "question": words[i], "wordType": word_types[i]} 
                    for i in range(len(words))
                    for j in range(len(titles))]

            if filter_type == 0 or filter_type == 'search all':
                return jsonify({"success": True, "data": data, "result_count": len(data)})

            elif filter_query.strip() == "":
                return jsonify({"success": True, "data": [], "result_count": 0})

        if filter_query == 0:
            data = [{"title": titles[j], "question": words[i], "wordType": word_types[i]} 
                    for i in range(len(words))
                    for j in range(len(titles))]

        else:
            data = []
            if filter_type == '1':
                for i in range(len(words)):
                    for j in range(len(titles)):
                        if filter_query in titles[j].lower():
                            data.append({"title": titles[j], "question": words[i], "wordType": word_types[i]})

            elif filter_type == '2':
                for i in range(len(words)):
                    for j in range(len(titles)):
                        if filter_query in words[i].lower():
                            data.append({"title": titles[j], "question": words[i], "wordType": word_types[i]})

            elif filter_type == '3':
                for i in range(len(words)):
                    for j in range(len(titles)):
                        if filter_query in word_types[i].lower():
                            data.append({"title": titles[j], "question": words[i], "wordType": word_types[i]})

        final_data = data[offset_start : offset_end]
        return jsonify({"success": True, "data": final_data, "result_count": len(data)})
    except Exception as e:
        return jsonify({"success": False, "err": str(e)})

@app.route('/update-admin-settings', methods=['POST'])
def update_admin_settings():
    global admin_dir
    settings_data = request.json

    # temporary db
    os.makedirs(db_dir, exist_ok=True)
    settings_file = os.path.join(admin_dir, "admin_settings.json")

    try:
        with open(settings_file, 'w', encoding='utf-8') as fp:
            data = json.dump(settings_data, fp, indent=2)
    except Exception as e:
        return jsonify({"success": False, "msg": e})

    return jsonify({"success": True, "data": data})

@app.route('/get-admin-settings', methods=['GET'])
def get_admin_settings():
    global admin_dir

    # temporary db
    os.makedirs(admin_dir, exist_ok=True)

    settings_file = os.path.join(admin_dir, "admin_settings.json")

    if (not os.path.isfile(settings_file)):
        with  open(settings_file, 'w', encoding='utf-8') as fp:
            json.dump({}, fp)

        return jsonify({"success": False, "msg": "Admin settings file not found"})

    try:
        with open(settings_file, 'r', encoding='utf-8') as fp:
            settings_data = json.load(fp)
    except Exception as e:
        return jsonify({"success": False, "msg": e})

    return jsonify({"success": True, "data": settings_data})

@app.route('/get-completed-course-count', methods=['POST'])
def get_completed_course_count():
    global users_file
    email = request.json.get('email')
    
    # temporary db
    os.makedirs(db_dir, exist_ok=True)

    completed_courses = []

    try:
        with open(users_file, 'r', encoding='utf-8') as fp:
            users_data = json.load(fp)
        if users_data[email].get('myProjects') is not None:
            completed_courses = [i for i, j in users_data[email]['myProjects'].items() if 'courseCompleted' in j]
    except Exception as e:
        return jsonify({"success": False, "err": e}), 400

    return jsonify({"success": True, "completed_courses": completed_courses})

@app.route('/course-completion-update', methods=['POST'])
def course_completion_update():
    global users_file
    email = request.json['email']
    course = request.json['courseName']

    # temporary db
    os.makedirs(db_dir, exist_ok=True)

    try:
        with open(users_file, 'r', encoding='utf-8') as fp:
            users_data = json.load(fp)
        users_data[email]['myProjects'][course].update({'courseCompleted': True})
        with open(users_file, 'w', encoding='utf-8') as fp:
            json.dump(users_data, fp, indent=2)
    except Exception as e:
        return jsonify({"success": False, "err": e})

    return jsonify({"success": True, "data": users_data})

@app.route('/delete-user-account', methods=['POST'])
def del_user_acc():
    global users_file
    email_rem = request.json['email']

    # temporary db
    os.makedirs(db_dir, exist_ok=True)

    try:
        with open(users_file, 'r', encoding='utf-8') as fp:
            users_data = json.load(fp)
        del users_data[email_rem] # Remove information regarding the given user
        with open(users_file, 'w', encoding='utf-8') as fp:
            json.dump(users_data, fp, indent=2)
    except Exception as e:
        return jsonify({"success": False, "err": e})

    return jsonify({"success": True, "data": users_data})

@app.route('/edit-user-account', methods=['POST'])
def edit_user_acc():
    global db_dir, users_file
    email_rem = request.json

    # temporary db
    os.makedirs(db_dir, exist_ok=True)

    try:
        with open(users_file, 'r', encoding='utf-8') as fp:
            users_data = json.load(fp)
        del users_data[email_rem] # Remove information regarding the given user
        with open(users_file, 'w', encoding='utf-8') as fp:
            json.dump(users_data, fp, indent=2)
    except Exception as e:
        return jsonify({"success": False, "err": e})

    return jsonify({"success": True, "data": users_data})

# TODO: Complete following code
@app.route('/get-words-info', methods=['GET'])
def get_words_info():

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    words_info_file = f"roo/db/words_info.json"

    try:
        with open(words_info_file, 'r', encoding='utf-8') as fp:
            words_data = json.load(fp)
    except Exception as e:
        return jsonify({"success": False, "err": e})

    return jsonify({"success": True, "data": words_data})

@app.route('/get-block-size/<courseName>', methods=['GET'])
def get_block_size(courseName):
    try:
        dataset_index = titles.index(courseName)
        dataset_path = datasets[dataset_index]
        get_dataset(dataset_path)
        return jsonify(block_size=block_size)
    except ValueError:
        return jsonify(error="Course not found"), 404

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

@app.route('/get-cust-mgmt-data', methods=['POST'])
def get_cust_mgmt_data():
    global users_file

    filters = request.json['filter']

    headers = request.json.get('header', None)
    logged_email = request.json.get('email', None)
    export = request.json.get('export', False)

    sha256 = hashlib.sha256()
    sha256.update(logged_email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # Check if the file exists; if not, handle it appropriately
    if not os.path.exists(users_file):
        return jsonify({"success": False, "err": "Users file not found."}), 404

    try:
        with open(users_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

        # Create the output
        output = []

        for email, user_data in saved_data.items():
            for project in user_data['myProjects']:
                info = [
                    email,
                    saved_data[email]['name'],
                    saved_data[email]['dateOfBirth'],
                    saved_data[email]['motherTongue'],
                    user_data['currentLocation'],
                    user_data['hailFrom'],
                    project,
                    int('courseCompleted' in user_data['myProjects'][project]),
                    user_data['myProjects'][project]['wordsCompleted'] - 1,
                ]

                if (
                    (filters[0].strip() == "" or (filters[0].lower() in info[0].lower())) and
                    (filters[1].strip() == "" or (filters[1].lower() in info[1].lower())) and
                    (filters[2].strip() == "" or (filters[2].lower() in info[2].lower())) and
                    (filters[3].strip() == "" or (filters[3].lower() in info[3].lower())) and
                    (filters[4].strip() == "" or (filters[4].lower() in info[4].lower())) and
                    (filters[5].strip() == "" or (filters[5].lower() in info[5].lower())) and
                    (filters[6].strip() == "" or (filters[6].lower() in info[6].lower())) and

                    (filters[7].strip() == "" or (filters[7].strip().isdigit() and int(filters[7].strip()) == info[7])) and
                    (filters[8].strip() == "" or (filters[8].strip().isdigit() and int(filters[8].strip()) == info[8]))
                ):
                    output.append(info)

        if export:
            send_file_data_export_path = os.path.join('db', f"{email_hash}/exported_data_users_data.csv")
            data_export_path = os.path.join('roo/db', f"{email_hash}/exported_data_users_data.csv")

            # Removed the last "action" col from header
            export_data(data_export_path, output, headers[:-1])
            return send_file(
                send_file_data_export_path,
                as_attachment=True,
            )

        return jsonify({"success": True, "data": output}), 200

    except Exception as e:
        return jsonify({"success": False, "err": str(e)}), 500

@app.route('/get-users-data', methods=['POST'])
def get_users_data():
    global users_file

    filters = request.json['filter']

    headers = request.json.get('header', None)
    logged_email = request.json.get('email', None)
    export = request.json.get('export', False)

    sha256 = hashlib.sha256()
    sha256.update(logged_email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # Check if the file exists; if not, handle it appropriately
    if not os.path.exists(users_file):
        return jsonify({"success": False, "err": "Users file not found."}), 404

    try:
        with open(users_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)

        # Create the output 
        output = []
        for email, user_data in saved_data.items():
            for project in user_data['myProjects']:
                info = [
                    email, # email
                    titles.index(project) + 1, # surveyid
                    project, # Survey Name
                    user_data['myProjects'][project]['datetime'], # Date of registration
                    user_data['myProjects'][project]['blocksCompleted'] / 10,
                    user_data['myProjects'][project]['wordsCompleted'],
                    "Registered",
                    60,
                    user_data['myProjects'][project]['blocksCompleted']
                ]

                condition = (
                    (filters[0].strip() == "" or (filters[0].lower() in info[0].lower())) and
                    (filters[2].strip() == "" or (filters[2].lower() in info[2].lower())) and
                    (filters[3].strip() == "" or (filters[3].lower() in info[3].lower())) and
                    (filters[5].strip() == "" or (filters[5].lower() in info[5].lower())) and
                    (filters[6].strip() == "" or (filters[6].lower() in info[6].lower())) and

                    (filters[1].strip() == "" or (filters[1].strip().isdigit() and int(filters[1].strip()) == info[1])) and
                    (filters[4].strip() == "" or (filters[4].replace('.', '').strip().isdigit() and float(filters[4].strip()) == info[4])) and
                    (filters[7].strip() == "" or (filters[7].strip().isdigit() and int(filters[7].strip()) == info[7])) and
                    (filters[8].strip() == "" or (filters[8].strip().isdigit() and int(filters[8].strip()) == info[8]))
                )

                if condition:
                    output.append(info)

        if export:
            send_file_data_export_path = os.path.join('db', f"{email_hash}/exported_data_users_data.csv")
            data_export_path = os.path.join('roo/db', f"{email_hash}/exported_data_users_data.csv")

            # Removed the last "action" col from header
            export_data(data_export_path, output, headers[:-1], 0)
            return send_file(
                send_file_data_export_path,
                as_attachment=True,
            )

        return jsonify({"success": True, "data": output}), 200

    except Exception as e:
        raise
        return jsonify({"success": False, "err": str(e)}), 500

@app.route('/get-unreg-courses', methods=['POST'])
def get_unreg_courses():
    email, chunk_size = request.json

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/users.json"

    if not os.path.isfile(user_file):
        return jsonify({"success": False})

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
    # user_file = f"roo/db/{email_hash}"
    with open(db_file, 'r', encoding='utf-8') as fp:
        saved_data = json.load(fp)

    msg = "Course successfully registered"

    course_info = {
        course: {
            "datetime": dt.now().strftime('[%d/%b/%Y %H:%M:%S]'),
            "tags": ["हिन्दी"],
            "blocksCompleted": 0,
            "wordsCompleted": 0,
            "credits": 0,
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

    # Ensure dir path exists
    os.makedirs(f'./roo/db/{email_hash}', exist_ok=True)

    df.to_csv(f"./roo/db/{email_hash}/exported_data_course.csv")

    # Save DataFrame to different checkpoints
    checkpoint_idx = last_used_idx//checkpoint_size
    with pd.ExcelWriter(f"./roo/db/{email_hash}/exported_data_course.xlsx", engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=f"checkpoint_{checkpoint_idx + 1}", index=False)

    return jsonify({"success": True, "msg": "Data exported successfully"})

@app.route('/save-freq', methods=['POST'])
def save_freq():
    data = request.json
    email, course_name, word, freq = data

    if freq == -10:
        return jsonify({"success": True, "msg": "Frequency not set correctly"})

    sha256 = hashlib.sha256()
    sha256.update(email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    user_file = f"roo/db/{email_hash}"

    with open('roo/db/users.json', 'r', encoding='utf-8') as fp:
        users_data = json.load(fp)

    if not os.path.isfile(user_file):
        with open(user_file, 'w', encoding='utf-8') as fp:
            dtnow = dt.now().strftime('[%d/%b/%Y %H:%M:%S]')
            dataset = datasets[titles.index(course_name)]
            word_idx = users_data[email]["myProjects"][course_name]["wordsCompleted"]
            info = {course_name: {word: [freq, dtnow, dataset, word_idx - 1]}}
            json.dump(info, fp, indent=2)

        return jsonify({
            "success": True,
            "email_hash": email_hash,
            "saved_word_info": {
                "word": word,
                "freq": freq,
            },
            "dataset": dataset,
            "word_idx": word_idx - 1
        })

    if word is not None:
        word = words[last_used_idx-2]

        with open(user_file, 'r', encoding='utf-8') as fp:
            user_data = json.load(fp)

        if user_data is not None:
            dtnow = dt.now().strftime('[%d/%b/%Y %H:%M:%S]')
            dataset = datasets[titles.index(course_name)]
            word_idx = users_data[email]["myProjects"][course_name]["wordsCompleted"]
            info = {word: [freq, dtnow, dataset, word_idx - 1]}
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

def get_json_contents(file_path):
    with open(file_path, 'r', encoding='utf-8') as fp:
        file_contents = json.load(fp)
    return file_contents

def get_admin_details():
    global admin_file
    return get_json_contents(admin_file)

def get_user_details():
    global users_file
    return get_json_contents(users_file)

@app.route('/is-token-valid')
@jwt_required()
def is_token_valid():
    email = get_jwt_identity()
    return jsonify({ "success": True, "email": email })

@app.route('/logout', methods=['POST'])
# @jwt_required()
def logout():
    auth_header = request.headers.get('Authorization')

    email = request.json.get('email')
    
    if not email:
        return jsonify({"success": False, "msg": "Email is required"}), 400
    
    saved_data_admin = get_admin_details()

    if email not in saved_data_admin:
        return jsonify({"success": False, "msg": "Admin not found"}), 404
    
    # Update login status
    saved_data_admin[email]['loggedIn'] = False
    
    # Save changes back to the file
    with open(admin_file, 'w', encoding='utf-8') as fp:
        json.dump(saved_data_admin, fp, indent=4)

    return jsonify({"success": True, "msg": "Logged out successfully"}), 200

@app.route('/login', methods=['POST'])
def login():
    global admin_file

    # temporary db
    os.makedirs("roo/db", exist_ok=True)
    db_file = "./roo/db/users.json"

    data = request.json

    email = data.get('email')
    password = data.get('password')
    hashed_password = security.hash_password(password)

    assert os.path.isfile(admin_file)
    auth_token = create_access_token(
        identity=email
    )

    if os.path.isfile(admin_file):
        saved_data_admin = get_admin_details()
        if email in saved_data_admin.keys():
            saved_data_admin['isadmin'] = True
            # Email is valid

            if security.verify_password(password, saved_data_admin[email]['password']):
                # Password is correct
                # In the admin.json file, set "loggedIn" key to True

                if saved_data_admin[email]['loggedIn'] == False:
                    saved_data_admin[email]['loggedIn'] = True
                    with open(admin_file, 'w', encoding='utf-8') as fp:
                        json.dump(saved_data_admin, fp, indent=4)

                    return jsonify({
                        "success": True,
                        "data": saved_data_admin,
                        "auth_token": f"Bearer {auth_token}",
                    }), 200

                elif saved_data_admin[email]['loggedIn'] == True:
                    return jsonify({
                        "success": True,
                        "data": saved_data_admin,
                        "auth_token": f"Bearer {auth_token}",
                    }), 200

    if os.path.isfile(db_file):
        with open(db_file, 'r', encoding='utf-8') as fp:
            saved_data = json.load(fp)
    else:
        return jsonify({"success": False}), 200

    if email in saved_data.keys():

        # Email is valid
        if security.verify_password(password, saved_data[email]['password']):
            d = {k: v for k, v in saved_data[email].items() if k != 'password'}
            if d.get('isadmin') is None:
                d['isadmin'] = False

            # Password is correct
            return jsonify({
                "success": True,
                'data': d,
                "auth_token": f"Bearer {auth_token}",
            }), 200

    return jsonify({"success": False}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Get the current user's identity from the JWT
    current_user = get_jwt_identity()
    return jsonify({"success": True, "data": current_user}), 200

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

@app.route('/update-online-users', methods=['POST'])
def update_online_status():
    global online_users_file

    email_add = request.json.get('email_add')
    email_rem = request.json.get('email_rem')

    if email_add == email_rem:
        return jsonify({"success": False, "msg": "Emails to be added and removed must not be the same"}), 200
    
    if email_add is None and email_rem is None:
        return jsonify({"success": False, "msg": "Email is required"}), 200

    try:
        if os.path.isfile(online_users_file):
            with open(online_users_file, 'r', encoding='utf-8') as fp:
                online_users_data = json.load(fp)
        else:
            online_users_data = {}

        dtnow = dt.now().strftime('[%d/%b/%Y %H:%M:%S]')

        # Handle sign out
        if email_rem:
            if email_rem in online_users_data:
                online_users_data[email_rem]["out"] = dtnow

        # Handle sign in
        if email_add:
            online_users_data[email_add] = {"in": dtnow, "out": None}

        # Write the updated data back to the file
        with open(online_users_file, 'w', encoding='utf-8') as fp:
            json.dump(online_users_data, fp, indent=2)

        return jsonify({"success": True, "msg": "Online users updated"}), 200

    except Exception as e:
        return jsonify({"success": False, "msg": f"Error {e}"}), 400

@app.route('/get-online-count')
def get_online_count():
    global online_users_file
    try:
        if os.path.isfile(online_users_file):
            with open(online_users_file, 'r', encoding='utf-8') as fp:
                online_users_data = json.load(fp)
            online_count = len([0 for data in online_users_data.values() if data['out'] is None])
            return jsonify({"success": True, "online_count": online_count})
        else:
            return jsonify({"success": False, "msg": "Online users file not found"})
    except Exception as e:
        return jsonify({"success": False, "msg": "Online users file could not be read"})

@app.route('/get-registered-count')
def get_reg_user_count():
    users_file = './roo/db/users.json'
    reg_user_count = -1

    try:
        if os.path.isfile(users_file):
            with open(users_file, 'r', encoding='utf-8') as fp:
                users_file_data = json.load(fp)
                reg_user_count = len(users_file_data)
            return jsonify({"success": True, "reg_user_count": reg_user_count})
        else:
            return jsonify({"success": False, "msg": "Online users file not found"})
    except Exception as e:
        return jsonify({"success": False, "msg": "Online users file could not be read"})

    if reg_user_count == -1:
        return jsonify({"success": False, "msg": "Online users file could not be read"})

@app.route('/get-total-surveys', methods=['GET'])
def get_total_surveys():
    total_surveys = 0
    return jsonify({"success": True, "total_surveys": total_surveys})

@app.route('/get-candidates', methods=['GET'])
def get_candidate_count():
    candidate_count = 0
    return jsonify({"success": True, "candidate_count": candidate_count})

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

@app.route('/get-lang-mgmt-data', methods=['GET'])
def get_lang_mgmt_data():
    global users_file
    msg = 'Successfully retrieved data for language management'

    out = {k: 0 for k in titles}
    try:
        if os.path.isfile(users_file):
            with open(users_file, 'r', encoding='utf-8') as fp:
                saved_data = json.load(fp)

            projs = [saved_data[user].get('myProjects') for user in saved_data if saved_data[user].get('myProjects') is not None]
            for i in projs:
                for j in i.keys():
                    out[j] += 1

        res = [[titles.index(i), i, 0, j, 7, 0] for i, j in out.items()]

    except Exception as e:
        return jsonify({"success": False, "msg": e})

    return jsonify({"success": True, "data": res, "msg": msg})

@app.route('/get-surveys-data', methods=['POST'])
def get_surveys_data():
    global users_file
    filters = request.json.get('filter')

    headers = request.json.get('header', None)
    logged_email = request.json.get('email', None)
    export = request.json.get('export', False)

    sha256 = hashlib.sha256()
    sha256.update(logged_email.encode('utf-8'))
    email_hash = sha256.hexdigest()

    msg = 'Successfully retrieved data for surveys data'

    out = {k: 0 for k in titles}
    try:
        if os.path.isfile(users_file):
            with open(users_file, 'r', encoding='utf-8') as fp:
                saved_data = json.load(fp)

            projs = [saved_data[user].get('myProjects') for user in saved_data if saved_data[user].get('myProjects') is not None]
            for i in projs:
                for j in i.keys():
                    out[j] += 1

        # TODO: Write logic to calculate the static numbers in the line below
        res = []
        for proj_name, proj_users_count in out.items():
            info = [
                titles.index(proj_name),
                proj_name,
                dt.strptime(
                    ' '.join(config['project']['project_creation_dates'][titles.index(proj_name)]),
                    '%m-%d-%Y %H:%M:%S'
                ).strftime('%m %B %Y [%I:%M:%S %p]'),
                proj_users_count,
                7, # TODO: Set dynamically
                config['project']['block_repeats'][titles.index(proj_name)]
            ]

            condition = (
                (filters[1].strip() == "" or (filters[1].lower() in info[1].lower())) and
                (filters[2].strip() == "" or (filters[2].lower() in info[2].lower())) and

                (filters[0].strip() == "" or (filters[0].strip().isdigit() and int(filters[0].strip()) == info[0]+1)) and
                (filters[3].strip() == "" or (filters[3].strip().isdigit() and int(filters[3].strip()) == info[3])) and
                (filters[4].strip() == "" or (filters[4].strip().isdigit() and int(filters[4].strip()) == info[4])) and
                (filters[5].strip() == "" or (filters[5].strip().isdigit() and int(filters[5].strip()) == info[5]))
            )
            if condition:
                res.append(info)

        if export:
            send_file_data_export_path = os.path.join('db', f"{email_hash}/exported_data_surveys_data.csv")
            data_export_path = os.path.join('roo/db', f"{email_hash}/exported_data_surveys_data.csv")

            export_res = deepcopy(res)
            export_res = [
                [i[0]+1] + i[1:]
            for i in export_res]

            # Removed the last "action" col from header
            export_data(data_export_path, export_res, headers[:-1])
            return send_file(
                send_file_data_export_path,
                as_attachment=True,
            )

        return jsonify({"success": True, "data": res, "msg": msg}), 200

    except Exception as e:
        return jsonify({"success": False, "msg": str(e)})

    # return jsonify({"success": True, "data": res, "msg": msg})

@app.route('/signup', methods=['POST'])
def signup():
    # temporary db
    os.makedirs("roo/db", exist_ok=True)

    db_file = "./roo/db/users.json"
    form_data = request.json['formData']
    form_data['password'] = security.hash_password(form_data['password'])

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
    # Add IP Here
    app.run(host='10.162.132.77', debug=True, port=4997)
