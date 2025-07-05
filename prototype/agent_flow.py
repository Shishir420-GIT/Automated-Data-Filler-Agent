import os
import json
from dotenv import load_dotenv
from langchain.agents import initialize_agent, Tool, AgentType
from langchain_community.chat_models.openai import ChatOpenAI
from extractor import extract_entities
from pii_detector import detect_pii
from db import save_lead, get_leads

# Load environment
load_dotenv()
model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
llm = ChatOpenAI(model=model_name, temperature=0)

# Normalization helper
CONTACT_KEYS = ["name", "title", "email", "phone"]
COMPANY_KEYS = ["name", "industry", "size", "budget"]
DEAL_KEYS = ["value", "stage", "timeline", "competitor", "next_action"]

def normalize_schema(data: dict) -> dict:
    contact = data.get("contact") or {}
    company = data.get("company") or {}
    deal = data.get("deal") or {}
    return {
        "pii": data.get("pii", []),
        "contact": {k: contact.get(k) for k in CONTACT_KEYS},
        "company": {k: company.get(k) for k in COMPANY_KEYS},
        "deal": {k: deal.get(k) for k in DEAL_KEYS},
    }

# Simplified processing function that doesn't use agent chaining
def process_meeting_summary(summary: str) -> dict:
    """Process meeting summary through all steps and return normalized data"""
    try:
        # Step 1: Detect PII
        print("Step 1: Detecting PII...")
        pii_data = detect_pii(summary)
        
        # Step 2: Extract entities
        print("Step 2: Extracting entities...")
        entities_result = extract_entities(summary)
        
        # Handle extraction errors
        if isinstance(entities_result, dict) and "error" in entities_result:
            return {
                "error": "Entity extraction failed",
                "details": entities_result,
                "pii": pii_data
            }
        
        # Step 3: Combine data
        combined_data = {
            "pii": pii_data,
            "contact": entities_result.get("contact", {}),
            "company": entities_result.get("company", {}),
            "deal": entities_result.get("deal", {})
        }
        
        # Step 4: Normalize and save
        print("Step 3: Normalizing and saving...")
        normalized = normalize_schema(combined_data)
        save_lead(normalized)
        
        return normalized
        
    except Exception as e:
        return {
            "error": f"Processing failed: {str(e)}",
            "raw_summary": summary
        }

# Tool definitions for agent (if still needed for other purposes)
DetectPII = Tool(
    name="DetectPII",
    func=detect_pii,
    description="Extract PII spans from text. Input: text string. Output: list of PII entities with positions."
)

ExtractEntities = Tool(
    name="ExtractEntities", 
    func=extract_entities,
    description="Extract CRM contact, company, and deal info from text. Input: text string. Output: JSON with contact, company, deal keys."
)

def normalize_and_save_tool(json_input: str) -> str:
    """Tool wrapper that returns string for agent compatibility"""
    try:
        data = json.loads(json_input)
        normalized = normalize_schema(data)
        save_lead(normalized)
        return json.dumps(normalized, indent=2)
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Invalid JSON: {str(e)}", "raw": json_input})
    except Exception as e:
        return json.dumps({"error": f"Processing error: {str(e)}"})

NormalizeAndSave = Tool(
    name="NormalizeAndSave",
    func=normalize_and_save_tool,
    description="Normalize CRM data and save to database. Input: JSON string with pii, contact, company, deal keys. Output: normalized data confirmation."
)

# Agent initialization (kept for compatibility but not used in main flow)
agent = initialize_agent(
    tools=[DetectPII, ExtractEntities, NormalizeAndSave],
    llm=llm,
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    max_iterations=3,
    early_stopping_method="generate"
)

def run_agent(summary: str):
    """Main function that processes summary and returns results"""
    # Use direct processing instead of agent to avoid multiple runs and JSON issues
    processed = process_meeting_summary(summary)
    leads = get_leads()
    return processed, leads