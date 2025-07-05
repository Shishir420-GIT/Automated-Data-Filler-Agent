import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load MongoDB URI
env_load_dotenv = load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database("crm")
leads_col = db.get_collection("leads")

def save_lead(data: dict) -> str:
    res = leads_col.insert_one(data)
    return str(res.inserted_id)

def get_leads() -> list:
    return list(leads_col.find({}, {"_id": False}))