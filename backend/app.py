import os
import re
import io
import json
import platform

import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
from PIL import Image
import pytesseract
from youtube_transcript_api import YouTubeTranscriptApi

# ─── Configuration ──────────────────────────────────────────────────────────

# Resolve paths relative to this file's directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, "users.json")

# Gemini API Key – load from environment
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not set. AI features will not work.")

# Initialize Gemini model (strict format per spec)
model = genai.GenerativeModel('gemini-1.5-flash')

# Pytesseract – Windows path fix
if platform.system() == "Windows":
    # Common Tesseract install locations on Windows
    tesseract_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        r"C:\Users\{}\AppData\Local\Tesseract-OCR\tesseract.exe".format(os.getenv("USERNAME", "")),
    ]
    for path in tesseract_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            print(f"Tesseract found at: {path}")
            break
    else:
        print("WARNING: Tesseract not found. Image OCR will not work.")
        print("Install from: https://github.com/UB-Mannheim/tesseract/wiki")

# ─── Flask App ──────────────────────────────────────────────────────────────

app = Flask(
    __name__,
    template_folder="../templates",
    static_folder="../static",
)
app.secret_key = 'your_secret_key_here'  # Change this to a secure key in production
CORS(app)

# ─── Helper Functions ───────────────────────────────────────────────────────

def load_users():
    """Load users from JSON file."""
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w') as f:
            json.dump({}, f)
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    """Save users to JSON file."""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

def get_video_id(url):
    """Extract YouTube video ID from URL."""
    match = re.search(r'(?:v=|/)([0-9A-Za-z_-]{11}).*', url)
    return match.group(1) if match else None

def get_transcript_text(url):
    """Get transcript text from a YouTube video URL."""
    video_id = get_video_id(url)
    if not video_id:
        return None
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        parts = [item.get("text", "") for item in transcript]
        text = " ".join(part for part in parts if part).strip()
        return text or None
    except Exception as e:
        print(f"Transcript error: {e}")
        return None

def generate_summary(text):
    """Generate a summary using Gemini AI."""
    if not text or len(text) < 30:
        return None
    try:
        response = model.generate_content(f"Summarize this text clearly:\n{text}")
        return getattr(response, "text", None)
    except Exception as e:
        print(f"Gemini summary error: {e}")
        return None

def generate_solution(question):
    """Generate a detailed solution using Gemini AI."""
    if not question or len(question.strip()) < 3:
        return None
    try:
        response = model.generate_content(
            f"Solve this question with a detailed step-by-step explanation:\n{question}"
        )
        return getattr(response, "text", None)
    except Exception as e:
        print(f"Gemini solution error: {e}")
        return None

def generate_notes(text):
    """Generate study notes using Gemini AI."""
    if not text or len(text) < 30:
        return None
    try:
        response = model.generate_content(
            f"Generate detailed study notes from this text. Use bullet points and headings:\n{text}"
        )
        return getattr(response, "text", None)
    except Exception as e:
        print(f"Gemini notes error: {e}")
        return None

def extract_text_from_image(image_file):
    """Extract text from an uploaded image using OCR. Returns (text, error)."""
    try:
        image_bytes = io.BytesIO(image_file.read())
        image = Image.open(image_bytes)
    except Exception as e:
        print(f"Image open error: {e}")
        return None, "Failed to open the uploaded image. Please upload a valid image file."

    try:
        extracted_text = pytesseract.image_to_string(image).strip()
        return extracted_text, None
    except Exception as e:
        print(f"OCR error: {e}")
        return None, "OCR processing failed. Please ensure Tesseract is installed."

def success_response(summary):
    """Standardized success JSON: {"summary": "...", "error": null}"""
    return jsonify({"summary": summary, "error": None})

def error_response(message, status=400):
    """Standardized error JSON: {"summary": null, "error": "..."}"""
    return jsonify({"summary": None, "error": message}), status

# ─── Base Route ─────────────────────────────────────────────────────────────

@app.route('/')
def index():
    """Base route – serves index.html."""
    return render_template('index.html')

# ─── Auth Routes ────────────────────────────────────────────────────────────

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if not username or not password or password != confirm_password:
            return render_template('signup.html', error="Invalid input or passwords do not match")

        users = load_users()

        if username in users:
            return render_template('signup.html', error="Username already exists")

        users[username] = password
        save_users(users)

        session['user'] = username
        return redirect(url_for('home'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        users = load_users()

        if username in users and users[username] == password:
            session['user'] = username
            return redirect(url_for('home'))
        else:
            return render_template('login.html', error="Invalid username or password")

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

# ─── Page Routes ────────────────────────────────────────────────────────────

@app.route('/home')
def home():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("home.html")

@app.route('/summary')
def summary():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("summary.html")

@app.route('/solution')
def solution():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("solution.html")

@app.route('/notes')
def notes():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("notes.html")

# ─── API Endpoints ──────────────────────────────────────────────────────────
# All endpoints return standardized JSON: {"summary": "...", "error": null}

@app.route('/upload-image', methods=['POST'])
def upload_image():
    """Process an uploaded image: OCR → Gemini summary."""
    if "image" not in request.files:
        return error_response("Please upload an image.")

    image_file = request.files["image"]
    if image_file.filename == "":
        return error_response("Please upload an image.")

    # Extract text with proper error handling
    extracted_text, err = extract_text_from_image(image_file)
    if err:
        return error_response(err)

    if not extracted_text:
        return error_response("No text could be extracted from the image. Please upload a clearer image.")

    # Generate summary via Gemini (wrapped in try-except)
    try:
        result = generate_summary(extracted_text)
    except Exception as e:
        print(f"Unexpected Gemini error: {e}")
        return error_response("AI service error. Please try again later.", 500)

    if not result:
        return error_response("Failed to generate summary. Please try again.")

    return success_response(result)

@app.route('/solve-question', methods=['POST'])
def solve_question():
    """Solve a question using Gemini AI."""
    data = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()
    if not question:
        return error_response("Please provide a question.")

    try:
        result = generate_solution(question)
    except Exception as e:
        print(f"Unexpected Gemini error: {e}")
        return error_response("AI service error. Please try again later.", 500)

    if not result:
        return error_response("Failed to generate solution. Please try again.")

    return success_response(result)

@app.route('/youtube-process', methods=['POST'])
def youtube_process():
    """Process a YouTube video: transcript → Gemini summary."""
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()
    if not url:
        return error_response("Please provide a YouTube link.")

    transcript_text = get_transcript_text(url)
    if not transcript_text:
        return error_response("Could not retrieve transcript. The video may not have captions available.")

    try:
        result = generate_summary(transcript_text)
    except Exception as e:
        print(f"Unexpected Gemini error: {e}")
        return error_response("AI service error. Please try again later.", 500)

    if not result:
        return error_response("Failed to generate summary. Please try again.")

    return success_response(result)

@app.route('/generate-notes', methods=['POST'])
def generate_notes_endpoint():
    """Generate notes from an image or YouTube link."""
    # Check if image uploaded
    if "image" in request.files and request.files["image"].filename:
        image_file = request.files["image"]
        extracted_text, err = extract_text_from_image(image_file)
        if err:
            return error_response(err)

        if not extracted_text:
            return error_response("No text could be extracted from the image.")

        try:
            result = generate_notes(extracted_text)
        except Exception as e:
            print(f"Unexpected Gemini error: {e}")
            return error_response("AI service error. Please try again later.", 500)

        if not result:
            return error_response("Failed to generate notes. Please try again.")
        return success_response(result)

    # Check if YouTube URL provided
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()
    if not url:
        return error_response("Please provide an image or YouTube link.")

    transcript_text = get_transcript_text(url)
    if not transcript_text:
        return error_response("Could not retrieve transcript. The video may not have captions available.")

    try:
        result = generate_notes(transcript_text)
    except Exception as e:
        print(f"Unexpected Gemini error: {e}")
        return error_response("AI service error. Please try again later.", 500)

    if not result:
        return error_response("Failed to generate notes. Please try again.")

    return success_response(result)

# ─── Run Server ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
