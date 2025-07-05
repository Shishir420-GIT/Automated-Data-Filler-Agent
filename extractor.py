import os
import json
from dotenv import load_dotenv
from langchain_community.chat_models.openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

# Initialize ChatOpenAI
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

Meeting Summary:
{text}
'''

prompt = PromptTemplate(template=template, input_variables=["text"])
chain = LLMChain(llm=llm, prompt=prompt)

def extract_entities(text: str) -> dict:
    """Extract CRM entities and return JSON dict, or error dict on failure."""
    try:
        response = chain.run(text=text)
        
        # Clean the response - remove any markdown formatting or extra text
        response = response.strip()
        if response.startswith('```json'):
            response = response[7:]
        if response.endswith('```'):
            response = response[:-3]
        response = response.strip()
        
        # Parse JSON
        parsed_data = json.loads(response)
        
        # Validate structure
        required_keys = ["contact", "company", "deal"]
        for key in required_keys:
            if key not in parsed_data:
                parsed_data[key] = {}
        
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