import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "./serviceAccountKey.json")
if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
else:
    print("Warning: Firebase service account not found. DB disabled.")
    db = None

def save_meeting(meeting_id, data):
    if db: db.collection("meetings").document(meeting_id).set(data)

def get_meeting(meeting_id):
    if db: return db.collection("meetings").document(meeting_id).get().to_dict()
    return None