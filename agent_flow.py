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

# Tool definitions
DetectPII = Tool(
    name="DetectPII",
    func=detect_pii,
    description="Extract PII spans from text"
)
ExtractEntities = Tool(
    name="ExtractEntities",
    func=extract_entities,
    description="Extract CRM contact, company, and deal info"
)
def normalize_and_save(json_input: str) -> dict:
    try:
        data = json.loads(json_input)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON", "raw": json_input}
    normalized = normalize_schema(data)
    save_lead(normalized)
    return normalized
NormalizeAndSave = Tool(
    name="NormalizeAndSave",
    func=normalize_and_save,
    description="Normalize data and save to MongoDB"
)

# Agent initialization
agent = initialize_agent(
    tools=[DetectPII, ExtractEntities, NormalizeAndSave],
    llm=llm,
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    agent_kwargs={"max_iterations": 3, "early_stopping_method": "generate"}
)

def run_agent(summary: str):
    raw = agent.run(summary)
    if isinstance(raw, str):
        try:
            processed = json.loads(raw)
        except json.JSONDecodeError:
            processed = {"error": "Invalid JSON", "raw": raw}
    else:
        processed = raw
    leads = get_leads()
    return processed, leads