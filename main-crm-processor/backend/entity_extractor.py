import os
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from typing import Dict, Any

# Load environment variables
load_dotenv()

# Initialize ChatOpenAI with updated import
model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
llm = ChatOpenAI(model=model_name, temperature=0)

# Improved prompt template for more reliable JSON extraction
template = '''
You are a CRM data extraction expert. Extract information from the meeting summary and return ONLY valid JSON.

Required JSON structure:
{{
  "contact": {{
    "name": "string or null",
    "title": "string or null", 
    "email": "string or null",
    "phone": "string or null"
  }},
  "company": {{
    "name": "string or null",
    "industry": "string or null",
    "size": "string or null",
    "budget": "string or null"
  }},
  "deal": {{
    "value": "string or null",
    "stage": "string or null", 
    "timeline": "string or null",
    "competitor": "string or null",
    "next_action": "string or null"
  }}
}}

Rules:
- Return ONLY the JSON object, no other text
- Use null for missing information
- Ensure all JSON is properly formatted
- Extract information accurately from the context
- For deal value, extract only the numeric value without currency symbols

Meeting Summary:
{text}
'''

prompt = PromptTemplate(template=template, input_variables=["text"])
chain = LLMChain(llm=llm, prompt=prompt)

def extract_entities(text: str) -> Dict[str, Any]:
    """Extract CRM entities and return JSON dict, or error dict on failure."""
    try:
        print(f"Extracting entities from text: {text[:100]}...")
        response = chain.run(text=text)
        
        # Clean the response - remove any markdown formatting or extra text
        response = response.strip()
        if response.startswith('```json'):
            response = response[7:]
        if response.endswith('```'):
            response = response[:-3]
        response = response.strip()
        
        print(f"Raw LLM response: {response}")
        
        # Parse JSON
        parsed_data = json.loads(response)
        
        # Validate structure
        required_keys = ["contact", "company", "deal"]
        for key in required_keys:
            if key not in parsed_data:
                parsed_data[key] = {}
        
        print(f"Successfully extracted entities: {parsed_data}")
        return parsed_data
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {response}")
        return {
            "error": f"Invalid JSON response: {str(e)}", 
            "raw": response,
            "contact": {},
            "company": {},
            "deal": {}
        }
    except Exception as e:
        print(f"Extraction error: {e}")
        return {
            "error": f"Extraction failed: {str(e)}",
            "contact": {},
            "company": {},
            "deal": {}
        }

def calculate_confidence(extracted_data: Dict[str, Any]) -> float:
    """Calculate confidence score based on extracted data completeness"""
    total_fields = 0
    filled_fields = 0
    
    # Check contact fields
    contact = extracted_data.get("contact", {})
    contact_fields = ["name", "title", "email", "phone"]
    for field in contact_fields:
        total_fields += 1
        if contact.get(field) and contact[field] != "null" and contact[field] is not None:
            filled_fields += 1
    
    # Check company fields
    company = extracted_data.get("company", {})
    company_fields = ["name", "industry", "size", "budget"]
    for field in company_fields:
        total_fields += 1
        if company.get(field) and company[field] != "null" and company[field] is not None:
            filled_fields += 1
    
    # Check deal fields
    deal = extracted_data.get("deal", {})
    deal_fields = ["value", "stage", "timeline", "competitor", "next_action"]
    for field in deal_fields:
        total_fields += 1
        if deal.get(field) and deal[field] != "null" and deal[field] is not None:
            filled_fields += 1
    
    # Calculate confidence (minimum 0.1 to avoid 0 confidence)
    confidence = max(0.1, filled_fields / total_fields if total_fields > 0 else 0.1)
    print(f"Confidence calculation: {filled_fields}/{total_fields} = {confidence}")
    return round(confidence, 2)