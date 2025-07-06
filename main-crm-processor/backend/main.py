from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import uvicorn

from models import ProcessingRequest, ProcessingResponse, LeadResponse
from processor import process_meeting_summary
from database import db_manager

# Initialize FastAPI app
app = FastAPI(
    title="CRM Lead Processor API",
    description="AI-powered meeting summary processing for CRM data extraction",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5174", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5174", "http://127.0.0.1:5173"],
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
        
        result = process_meeting_summary(request.summary.strip())
        
        if not result.success:
            raise HTTPException(status_code=500, detail=result.error)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/leads", response_model=LeadResponse)
async def get_leads(limit: int = None):
    """Retrieve all stored leads"""
    try:
        leads = db_manager.get_leads(limit=limit)
        return LeadResponse(leads=leads, total=len(leads))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve leads: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    """Get aggregated statistics"""
    try:
        stats = db_manager.get_lead_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stats: {str(e)}")

@app.delete("/api/leads")
async def clear_leads():
    """Clear all leads (for testing purposes)"""
    try:
        if db_manager.leads_col:
            result = db_manager.leads_col.delete_many({})
            return {"message": f"Deleted {result.deleted_count} leads"}
        else:
            raise HTTPException(status_code=500, detail="Database not connected")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear leads: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )