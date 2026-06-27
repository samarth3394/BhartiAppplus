import os
from dotenv import load_dotenv

load_dotenv()

try:
    import google.generativeai as genai
    print("genai imported successfully")
except ImportError:
    print("genai could not be imported")
    exit(1)

GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    print("No GEMINI_API_KEY found")
    exit(1)

try:
    genai.configure(api_key=GENAI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello! Are you working?")
    print("Success! Gemini response:", response.text)
except Exception as e:
    print("Error:", str(e))
