from datetime import datetime
from typing import Dict, Any
from pii_detector import detect_pii
from entity_extractor import extract_entities, calculate_confidence
from database import db_manager
from models import ProcessingResponse, PIIEntity, Contact, Company, Deal

# Normalization helper
CONTACT_KEYS = ["name", "title", "email", "phone"]
COMPANY_KEYS = ["name", "industry", "size", "budget"]
DEAL_KEYS = ["value", "stage", "timeline", "competitor", "next_action"]

def normalize_schema(data: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize extracted data to consistent schema"""
    contact = data.get("contact") or {}
    company = data.get("company") or {}
    deal = data.get("deal") or {}
    
    return {
        "pii": data.get("pii", []),
        "contact": {k: contact.get(k) for k in CONTACT_KEYS},
        "company": {k: company.get(k) for k in COMPANY_KEYS},
        "deal": {k: deal.get(k) for k in DEAL_KEYS},
        "confidence": data.get("confidence", 0.0),
        "processed_at": data.get("processed_at", datetime.utcnow())
    }

def process_meeting_summary(summary: str) -> ProcessingResponse:
    """Process meeting summary through all steps and return normalized data"""
    try:
        print("Step 1: Detecting PII...")
        pii_data = detect_pii(summary)
        
        print("Step 2: Extracting entities...")
        entities_result = extract_entities(summary)
        
        # Handle extraction errors
        if isinstance(entities_result, dict) and "error" in entities_result:
            return ProcessingResponse(
                pii=[],
                contact=Contact(),
                company=Company(),
                deal=Deal(),
                confidence=0.0,
                processed_at=datetime.utcnow(),
                success=False,
                error=f"Entity extraction failed: {entities_result['error']}"
            )
        
        # Calculate confidence
        confidence = calculate_confidence(entities_result)
        
        # Combine data
        combined_data = {
            "pii": pii_data,
            "contact": entities_result.get("contact", {}),
            "company": entities_result.get("company", {}),
            "deal": entities_result.get("deal", {}),
            "confidence": confidence,
            "processed_at": datetime.utcnow()
        }
        
        print("Step 3: Normalizing and saving...")
        normalized = normalize_schema(combined_data)
        
        # Save to database
        save_result = db_manager.save_lead(normalized)
        if save_result.startswith("error"):
            print(f"Warning: Failed to save to database: {save_result}")
        
        # Convert to response model
        return ProcessingResponse(
            pii=[PIIEntity(**item) for item in pii_data],
            contact=Contact(**normalized["contact"]),
            company=Company(**normalized["company"]),
            deal=Deal(**normalized["deal"]),
            confidence=confidence,
            processed_at=normalized["processed_at"],
            success=True
        )
        
    except Exception as e:
        print(f"Processing error: {e}")
        return ProcessingResponse(
            pii=[],
            contact=Contact(),
            company=Company(),
            deal=Deal(),
            confidence=0.0,
            processed_at=datetime.utcnow(),
            success=False,
            error=f"Processing failed: {str(e)}"
        )