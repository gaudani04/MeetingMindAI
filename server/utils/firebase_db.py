# import firebase_admin
# from firebase_admin import credentials, firestore
# import os
# from dotenv import load_dotenv
# import json

# load_dotenv()

# cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "./serviceAccountKey.json")
# #cred_path = json.loads(os.getenv("FIREBASE_CREDENTIALS"))

# if os.path.exists(cred_path):
#     cred = credentials.Certificate({
#         "type": "service_account",
#         "project_id": os.getenv("FIREBASE_PROJECT_ID"),
#         "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
#         "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
#         "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
#         "token_uri": "https://oauth2.googleapis.com/token",
#     })
#     firebase_admin.initialize_app(cred)
#     db = firestore.client()
# else:
#     print("Warning: Firebase service account not found. DB disabled.")
#     db = None

# def save_meeting(meeting_id, data):
#     if db: db.collection("meetings").document(meeting_id).set(data)

# def get_meeting(meeting_id):
#     if db: return db.collection("meetings").document(meeting_id).get().to_dict()
#     return None

import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

if firebase_json:
    cred = credentials.Certificate(json.loads(firebase_json))
    
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    print("Firebase connected ✅")
else:
    print("Firebase NOT connected ❌")
    db = None


def save_meeting(meeting_id, data):
    if db: db.collection("meetings").document(meeting_id).set(data)

def get_meeting(meeting_id):
    if db: return db.collection("meetings").document(meeting_id).get().to_dict()
 