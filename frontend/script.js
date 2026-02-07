// Password toggle function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

// Upload Image
async function uploadImage() {
    const fileInput = document.getElementById('image-input');
    const resultDiv = document.getElementById('image-result');

    if (!fileInput.files[0]) {
        alert('Please select an image file.');
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Processing...';

    try {
        const response = await fetch('http://127.0.0.1:5000/upload-image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        resultDiv.innerHTML = `<strong>Summary:</strong> ${data.data.summary}<br><strong>MCQs:</strong> ${data.data.mcq.join(', ')}`;
    } catch (error) {
        resultDiv.innerHTML = 'Error processing image. Please try again.';
    }
}

// Solve Question
async function solveQuestion() {
    const question = document.getElementById('question-input').value.trim();
    const resultDiv = document.getElementById('question-result');

    if (!question) {
        alert('Please enter a question.');
        return;
    }

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Solving...';

    try {
        const response = await fetch('http://127.0.0.1:5000/solve-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        resultDiv.innerHTML = `<strong>Solution:</strong> ${data.data.solution}`;
    } catch (error) {
        resultDiv.innerHTML = 'Error solving question. Please try again.';
    }
}

// Process YouTube
async function processYouTube() {
    const url = document.getElementById('youtube-input').value.trim();
    const resultDiv = document.getElementById('youtube-result');

    if (!url) {
        alert('Please enter a YouTube URL.');
        return;
    }

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Processing...';

    try {
        const response = await fetch('http://127.0.0.1:5000/youtube-process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        resultDiv.innerHTML = `<strong>Summary:</strong> ${data.data.summary}<br><strong>MCQs:</strong> ${data.data.mcq.join(', ')}<br><strong>Notes:</strong> ${data.data.notes}`;
    } catch (error) {
        resultDiv.innerHTML = 'Error processing video. Please try again.';
    }
}

// Form submissions (dummy for now)
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Login functionality not implemented yet.');
    window.location.href = 'index.html';
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Signup functionality not implemented yet.');
    window.location.href = 'login.html';
});
