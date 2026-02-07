# AI Study Assistant

A modern, professional AI-powered study assistant website with a clean and cute UI.

## Features

- **Image Processing**: Upload images to get summaries and multiple-choice questions
- **Question Solving**: Get detailed solutions to academic questions
- **YouTube Processing**: Extract summaries, MCQs, and notes from YouTube videos
- **User Authentication**: Login and signup pages (UI ready, backend auth to be added later)

## Tech Stack

- **Backend**: Python + Flask
- **Frontend**: HTML, CSS, JavaScript
- **AI Integration**: Placeholder functions (ready for API integration)

## Project Structure

```
AI-Study-Assistant/
├── backend/
│   ├── app.py              # Flask application with API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── index.html          # Main dashboard
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── style.css           # Global styles
│   └── script.js           # Frontend JavaScript
├── uploads/                # Directory for uploaded files
└── README.md               # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Copy environment file:
   ```
   cp .env.example .env
   ```

4. Run the Flask app:
   ```
   python app.py
   ```

   The backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. Open any of the HTML files in your browser (e.g., `frontend/login.html`)

2. For full functionality, ensure the backend is running.

## API Endpoints

- `POST /upload-image`: Upload an image for processing
- `POST /solve-question`: Solve a given question
- `POST /youtube-process`: Process a YouTube video URL

All endpoints return JSON responses with status, message, and data.

## Development Notes

- CORS is enabled for frontend-backend communication
- UI uses modern CSS with Flexbox and soft colors
- JavaScript handles form submissions and API calls
- Authentication UI is ready; backend auth can be added later

## Future Enhancements

- Integrate real AI APIs (OpenAI, etc.)
- Add user authentication backend
- Implement database for user data
- Add more study tools and features
