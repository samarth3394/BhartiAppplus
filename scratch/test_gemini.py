import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")

if api_key:
    genai.configure(api_key=api_key)
    try:
        model_name = 'gemini-flash-latest'
        print(f"Testing {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello! Say 'Gemini API is working'")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
