from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

# Ambil API Key
api_key = os.getenv("GEMINI_API_KEY")

# Inisialisasi Gemini Client
client = genai.Client(api_key=api_key)

# Flask App
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Gemini Chatbot Backend Aktif!"

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        user_message = data.get("message")

        if not user_message:
            return jsonify({
                "error": "Pesan tidak boleh kosong"
            }), 400

        # Generate response Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message
        )

        return jsonify({
            "reply": response.text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)