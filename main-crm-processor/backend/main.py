from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import uvicorn
import os

from models import ProcessingRequest, ProcessingResponse, LeadResponse
from processor import process_meeting_summary
from database import db_manager

# Initialize FastAPI app
app = FastAPI(
    title="CRM Lead Processor API",
    description="AI-powered meeting summary processing for CRM data extraction",
    version="1.0.0"
)

# Add CORS middleware with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://0.0.0.0:3000",
        "http://0.0.0.0:5173",
        "http://0.0.0.0:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "CRM Lead Processor API is running", "status": "healthy"}

@app.post("/api/process", response_model=ProcessingResponse)
async def process_meeting(request: ProcessingRequest):
    """Process meeting summary and extract CRM data"""
    try:
        if not request.summary or not request.summary.strip():
            raise HTTPException(status_code=400, detail="Meeting summary cannot be empty")
        
        print(f"Processing meeting summary: {request.summary[:100]}...")
        result = process_meeting_summary(request.summary.strip())
        
        if not result.success:
            print(f"Processing failed: {result.error}")
            raise HTTPException(status_code=500, detail=result.error)
        
        print(f"Processing successful with confidence: {result.confidence}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/leads", response_model=LeadResponse)
async def get_leads(limit: int = None):
    """Retrieve all stored leads"""
    try:
        print(f"Retrieving leads with limit: {limit}")
        leads = db_manager.get_leads(limit=limit)
        print(f"Retrieved {len(leads)} leads")
        return LeadResponse(leads=leads, total=len(leads))
    except Exception as e:
        print(f"Error retrieving leads: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve leads: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    """Get aggregated statistics"""
    try:
        print("Retrieving statistics...")
        stats = db_manager.get_lead_stats()
        print(f"Stats retrieved: {stats}")
        return stats
    except Exception as e:
        print(f"Error retrieving stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stats: {str(e)}")

@app.delete("/api/leads")
async def clear_leads():
    """Clear all leads (for testing purposes)"""
    try:
        print("Clearing all leads...")
        if db_manager.leads_col:
            result = db_manager.leads_col.delete_many({})
            print(f"Deleted {result.deleted_count} leads")
            return {"message": f"Deleted {result.deleted_count} leads"}
        else:
            raise HTTPException(status_code=500, detail="Database not connected")
    except Exception as e:
        print(f"Error clearing leads: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear leads: {str(e)}")

# Add startup event to check environment
@app.on_event("startup")
async def startup_event():
    """Check environment variables and connections on startup"""
    print("🚀 Starting CRM Processor API...")
    
    # Check required environment variables
    required_vars = ["OPENAI_API_KEY", "MONGO_URI"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("Please check your .env file configuration.")
    else:
        print("✅ All required environment variables are set")
    
    # Test database connection
    if db_manager.client:
        print("✅ Database connection established")
    else:
        print("❌ Database connection failed")

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )