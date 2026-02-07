from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload-image', methods=['POST'])
def upload_image():
    # Dummy logic
    return jsonify({
        "status": "success",
        "message": "Image uploaded and processed",
        "data": {"summary": "Dummy summary", "mcq": ["Q1", "Q2"]}
    })

@app.route('/solve-question', methods=['POST'])
def solve_question():
    # Dummy logic
    return jsonify({
        "status": "success",
        "message": "Question solved",
        "data": {"solution": "Dummy solution"}
    })

@app.route('/youtube-process', methods=['POST'])
def youtube_process():
    # Dummy logic
    return jsonify({
        "status": "success",
        "message": "YouTube video processed",
        "data": {"summary": "Dummy summary", "mcq": ["Q1", "Q2"], "notes": "Dummy notes"}
    })

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
