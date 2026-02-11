// ─── Image/Link Selection (Summary Page) ──────────────────────────────────

function selectImageInput() {
    const imageSection = document.getElementById('imageInputSection');
    const linkSection = document.getElementById('linkInputSection');
    const imageBtn = document.getElementById('imageButton');
    const linkBtn = document.getElementById('linkButton');

    if (imageSection) imageSection.style.display = 'block';
    if (linkSection) linkSection.style.display = 'none';
    if (imageBtn) imageBtn.classList.add('active');
    if (linkBtn) linkBtn.classList.remove('active');
}

function selectLinkInput() {
    const imageSection = document.getElementById('imageInputSection');
    const linkSection = document.getElementById('linkInputSection');
    const imageBtn = document.getElementById('imageButton');
    const linkBtn = document.getElementById('linkButton');

    if (imageSection) imageSection.style.display = 'none';
    if (linkSection) linkSection.style.display = 'block';
    if (linkBtn) linkBtn.classList.add('active');
    if (imageBtn) imageBtn.classList.remove('active');
}

// ─── Process Input (Summary Page) ──────────────────────────────────────────

async function processInput() {
    const resultDiv = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    if (resultDiv) {
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';
    }
    if (spinner) spinner.style.display = 'block';

    const imageSection = document.getElementById('imageInputSection');
    const linkSection = document.getElementById('linkInputSection');
    const isImage = imageSection && imageSection.style.display !== 'none';
    const isLink = linkSection && linkSection.style.display !== 'none';

    try {
        if (isImage) {
            await processImage();
        } else if (isLink) {
            await processLink();
        } else if (resultDiv) {
            resultDiv.innerText = 'Please select an input type.';
            resultDiv.style.display = 'block';
        }
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// ─── Image Upload Processing ───────────────────────────────────────────────

async function processImage() {
    const fileInput = document.getElementById('imageInput');
    const cameraInput = document.getElementById('cameraInput');
    const resultDiv = document.getElementById('result');

    let file = null;
    if (fileInput && fileInput.files.length) {
        file = fileInput.files[0];
    } else if (cameraInput && cameraInput.files.length) {
        file = cameraInput.files[0];
    }

    if (!file) {
        if (resultDiv) {
            resultDiv.innerText = 'Please select an image.';
            resultDiv.style.display = 'block';
        }
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/upload-image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        renderSummaryResult(data, resultDiv);
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerText = 'Error processing image.';
            resultDiv.style.display = 'block';
        }
    }
}

// ─── YouTube Link Processing ───────────────────────────────────────────────

async function processLink() {
    const linkInput = document.getElementById('linkInput');
    const resultDiv = document.getElementById('result');

    if (!linkInput || !linkInput.value) {
        if (resultDiv) {
            resultDiv.innerText = 'Please paste a YouTube link.';
            resultDiv.style.display = 'block';
        }
        return;
    }

    try {
        const response = await fetch('/youtube-process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: linkInput.value })
        });

        const data = await response.json();
        renderSummaryResult(data, resultDiv);
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerText = 'Error processing link.';
            resultDiv.style.display = 'block';
        }
    }
}

// ─── Render Summary Result ─────────────────────────────────────────────────

function renderSummaryResult(data, resultDiv) {
    if (!resultDiv) return;
    resultDiv.innerHTML = '';

    if (data && data.error) {
        resultDiv.innerText = data.error;
        resultDiv.style.display = 'block';
        return;
    }

    if (data && data.summary) {
        resultDiv.innerHTML = `<strong>Result:</strong> ${data.summary}`;
        resultDiv.style.display = 'block';
        return;
    }

    resultDiv.innerText = 'Unable to generate result. Please try again.';
    resultDiv.style.display = 'block';
}

// ─── Modal Functions ───────────────────────────────────────────────────────

function openModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'none';
}

function openCamera() {
    closeModal();
    const cameraInput = document.getElementById('cameraInput');
    if (cameraInput) cameraInput.click();
}

function openGallery() {
    closeModal();
    const imageInput = document.getElementById('imageInput');
    if (imageInput) imageInput.click();
}

// ─── Password Toggle ──────────────────────────────────────────────────────

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

// ─── Auth Functions ────────────────────────────────────────────────────────

function loginUser() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (!username || !password || !username.value || !password.value) {
        alert('Please fill in all fields.');
        return;
    }

    // Submit the login form
    const form = document.getElementById('login-form');
    if (form) form.submit();
}

function logoutUser() {
    window.location.href = '/logout';
}

// ─── Settings Menu ─────────────────────────────────────────────────────────

function toggleSettingsMenu() {
    const menu = document.getElementById('settingsMenu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Close settings menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('settingsMenu');
    const settingsBtn = document.querySelector('.settings-button');
    if (menu && settingsBtn && !settingsBtn.contains(event.target) && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
});

// ─── Profile Modal Functions ───────────────────────────────────────────────

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.style.display = 'block';
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.style.display = 'none';
}

function showBuiltInAvatars() {
    closeProfileModal();
    const modal = document.getElementById('avatarsModal');
    if (modal) modal.style.display = 'block';
}

function closeAvatarsModal() {
    const modal = document.getElementById('avatarsModal');
    if (modal) modal.style.display = 'none';
}

function selectBuiltInAvatar(src) {
    const profileImg = document.getElementById('profileImage');
    if (profileImg) {
        profileImg.src = src;
        localStorage.setItem('profileImage', src);
    }
    closeAvatarsModal();
}

// ─── Crop Modal Functions ──────────────────────────────────────────────────

function closeCropModal() {
    const modal = document.getElementById('cropModal');
    if (modal) modal.style.display = 'none';
}

function handleCameraInput(event) {
    handleImageFile(event.target.files[0]);
}

function handleGalleryInput(event) {
    handleImageFile(event.target.files[0]);
}

function handleImageFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const profileImg = document.getElementById('profileImage');
        if (profileImg) {
            profileImg.src = e.target.result;
            localStorage.setItem('profileImage', e.target.result);
        }
        closeProfileModal();
    };
    reader.readAsDataURL(file);
}

function cropAndSaveImage() {
    // Simplified – just close the modal
    closeCropModal();
}

// ─── Language Support ──────────────────────────────────────────────────────

function applyLanguage(lang) {
    localStorage.setItem('language', lang);
    if (lang === 'hi') {
        document.documentElement.className = 'language-hi';
    } else {
        document.documentElement.className = '';
    }
    // Close settings menu
    const menu = document.getElementById('settingsMenu');
    if (menu) menu.style.display = 'none';
}

// ─── Solve Question (Solution Page) ────────────────────────────────────────

async function solveQuestion() {
    const questionInput = document.getElementById('question-input');
    const resultDiv = document.getElementById('question-result') || document.getElementById('result');
    const spinner = document.getElementById('spinner');

    if (!questionInput || !questionInput.value.trim()) {
        if (resultDiv) {
            resultDiv.innerText = 'Please enter a question.';
            resultDiv.style.display = 'block';
        }
        return;
    }

    if (resultDiv) {
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';
    }
    if (spinner) spinner.style.display = 'block';

    try {
        const response = await fetch('/solve-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: questionInput.value.trim() })
        });

        const data = await response.json();
        renderSummaryResult(data, resultDiv);
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerText = 'Error solving question. Please try again.';
            resultDiv.style.display = 'block';
        }
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// ─── Process Video (YouTube/Notes Pages) ───────────────────────────────────

async function processVideo() {
    const youtubeInput = document.getElementById('youtubeInput');
    const resultDiv = document.getElementById('youtubeResult') || document.getElementById('result');
    const spinner = document.getElementById('spinner');

    if (!youtubeInput || !youtubeInput.value.trim()) {
        if (resultDiv) {
            resultDiv.innerText = 'Please enter a YouTube URL.';
            resultDiv.style.display = 'block';
        }
        return;
    }

    if (resultDiv) {
        resultDiv.innerHTML = '';
        resultDiv.style.display = 'none';
    }
    if (spinner) spinner.style.display = 'block';

    try {
        const response = await fetch('/youtube-process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: youtubeInput.value.trim() })
        });

        const data = await response.json();
        renderSummaryResult(data, resultDiv);
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerText = 'Error processing video. Please try again.';
            resultDiv.style.display = 'block';
        }
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// ─── Image Upload (Image Page) ─────────────────────────────────────────────

async function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const resultDiv = document.getElementById('imageResult');

    if (!fileInput || !fileInput.files.length) {
        if (resultDiv) {
            resultDiv.innerText = 'Please select an image.';
            resultDiv.style.display = 'block';
        }
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('/upload-image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        renderSummaryResult(data, resultDiv);
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerText = 'Error processing image.';
            resultDiv.style.display = 'block';
        }
    }
}

// ─── DOMContentLoaded Initialization ───────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Auto-select image input on summary page
    if (document.getElementById('imageInputSection')) {
        selectImageInput();
    }

    // Auto-process on file selection
    const cameraInputEl = document.getElementById('cameraInput');
    if (cameraInputEl) {
        cameraInputEl.addEventListener('change', () => {
            if (typeof processInput === 'function' && document.getElementById('processButton')) {
                processInput();
            }
        });
    }

    const imageInputEl = document.getElementById('imageInput');
    if (imageInputEl) {
        imageInputEl.addEventListener('change', () => {
            if (typeof processInput === 'function' && document.getElementById('processButton')) {
                processInput();
            }
        });
    }

    // Load saved profile image
    const savedProfile = localStorage.getItem('profileImage');
    const profileImg = document.getElementById('profileImage');
    if (savedProfile && profileImg) {
        profileImg.src = savedProfile;
    }

    // Load saved language
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'hi') {
        document.documentElement.className = 'language-hi';
    }
});
