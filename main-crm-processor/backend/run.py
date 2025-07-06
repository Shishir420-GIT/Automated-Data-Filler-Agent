#!/usr/bin/env python3
"""
Development server runner for the CRM Processor API
"""
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Check for required environment variables
    required_vars = ["OPENAI_API_KEY", "MONGO_URI"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease create a .env file with the required variables.")
        print("See .env.example for reference.")
        exit(1)
    
    print("🚀 Starting CRM Processor API...")
    print("📝 Make sure your .env file is configured with:")
    print("   - OPENAI_API_KEY")
    print("   - MONGO_URI")
    print("   - OPENAI_MODEL (optional)")
    print()
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )