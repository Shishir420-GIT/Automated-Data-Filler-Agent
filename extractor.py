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

# Prompt template for CRM extraction
template = '''
Extract CRM data from this meeting summary. Return JSON exactly with keys: contact, company, deal.
Use null for missing values.

Summary:
{text}
'''
prompt = PromptTemplate(template=template, input_variables=["text"])
chain = LLMChain(llm=llm, prompt=prompt)

def extract_entities(text: str) -> dict:
    """Extract CRM entities and return JSON dict, or raw on failure."""
    response = chain.run(text=text)
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON", "raw": response}