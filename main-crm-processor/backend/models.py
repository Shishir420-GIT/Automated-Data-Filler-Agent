from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class PIIEntity(BaseModel):
    entity: str
    start: int
    end: int
    score: float

class Contact(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class Company(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    budget: Optional[str] = None

class Deal(BaseModel):
    value: Optional[str] = None
    stage: Optional[str] = None
    timeline: Optional[str] = None
    competitor: Optional[str] = None
    next_action: Optional[str] = None

class ProcessingRequest(BaseModel):
    summary: str

class ProcessingResponse(BaseModel):
    pii: List[PIIEntity]
    contact: Contact
    company: Company
    deal: Deal
    confidence: float
    processed_at: datetime
    success: bool
    error: Optional[str] = None

class LeadResponse(BaseModel):
    leads: List[Dict[str, Any]]
    total: int