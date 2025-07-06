import os
from pymongo import MongoClient
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

# Load MongoDB URI
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.leads_col = None
        self.connect()
    
    def connect(self):
        """Initialize MongoDB connection"""
        if not mongo_uri:
            print("Warning: MONGO_URI not found in environment variables")
            return False
        
        try:
            self.client = MongoClient(mongo_uri)
            self.db = self.client.get_database("crm")
            self.leads_col = self.db.get_collection("leads")
            print("MongoDB connection established successfully")
            return True
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            return False
    
    def save_lead(self, data: Dict[str, Any]) -> str:
        """Save lead data to MongoDB"""
        if self.leads_col is None:
            print("Warning: MongoDB not connected, cannot save lead")
            return "no_connection"
        
        try:
            # Add timestamp
            data["created_at"] = data.get("processed_at")
            res = self.leads_col.insert_one(data)
            print(f"Lead saved with ID: {res.inserted_id}")
            return str(res.inserted_id)
        except Exception as e:
            print(f"Error saving lead: {e}")
            return f"error: {str(e)}"
    
    def get_leads(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Retrieve leads from MongoDB"""
        if self.leads_col is None:
            print("Warning: MongoDB not connected, returning empty list")
            return []
        
        try:
            query = {}
            cursor = self.leads_col.find(query, {"_id": False})
            
            if limit:
                cursor = cursor.limit(limit)
            
            leads = list(cursor.sort("created_at", -1))
            print(f"Retrieved {len(leads)} leads from database")
            return leads
        except Exception as e:
            print(f"Error retrieving leads: {e}")
            return []
    
    def get_lead_stats(self) -> Dict[str, Any]:
        """Get aggregated statistics about leads"""
        if self.leads_col is None:
            return {"total_leads": 0, "total_deals": 0, "total_value": 0}
        
        try:
            total_leads = self.leads_col.count_documents({})
            
            # Aggregate deal values
            pipeline = [
                {"$match": {"deal.value": {"$exists": True, "$ne": None}}},
                {"$group": {
                    "_id": None,
                    "total_value": {"$sum": {"$toDouble": "$deal.value"}},
                    "deal_count": {"$sum": 1}
                }}
            ]
            
            result = list(self.leads_col.aggregate(pipeline))
            
            if result:
                return {
                    "total_leads": total_leads,
                    "total_deals": result[0]["deal_count"],
                    "total_value": result[0]["total_value"]
                }
            else:
                return {"total_leads": total_leads, "total_deals": 0, "total_value": 0}
                
        except Exception as e:
            print(f"Error getting stats: {e}")
            return {"total_leads": 0, "total_deals": 0, "total_value": 0}

# Global database instance
db_manager = DatabaseManager()