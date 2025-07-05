import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load MongoDB URI
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    print("Warning: MONGO_URI not found in environment variables")
    client = None
    db = None
    leads_col = None
else:
    try:
        client = MongoClient(mongo_uri)
        db = client.get_database("crm")
        leads_col = db.get_collection("leads")
        print("MongoDB connection established successfully")
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        client = None
        db = None
        leads_col = None

def save_lead(data: dict) -> str:
    """Save lead data to MongoDB"""
    if leads_col is None:
        print("Warning: MongoDB not connected, cannot save lead")
        return "no_connection"
    
    try:
        res = leads_col.insert_one(data)
        print(f"Lead saved with ID: {res.inserted_id}")
        return str(res.inserted_id)
    except Exception as e:
        print(f"Error saving lead: {e}")
        return f"error: {str(e)}"

def get_leads() -> list:
    """Retrieve all leads from MongoDB"""
    if leads_col is None:
        print("Warning: MongoDB not connected, returning empty list")
        return []
    
    try:
        leads = list(leads_col.find({}, {"_id": False}))
        print(f"Retrieved {len(leads)} leads from database")
        return leads
    except Exception as e:
        print(f"Error retrieving leads: {e}")
        return []