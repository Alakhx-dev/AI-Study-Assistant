function selectImageInput() {
    document.getElementById('imageInputSection').style.display = 'block';
    document.getElementById('linkInputSection').style.display = 'none';
    document.getElementById('imageButton').classList.add('active');
    document.getElementById('linkButton').classList.remove('active');
}

function selectLinkInput() {
    document.getElementById('imageInputSection').style.display = 'none';
    document.getElementById('linkInputSection').style.display = 'block';
    document.getElementById('linkButton').classList.add('active');
    document.getElementById('imageButton').classList.remove('active');
}

async function processInput() {
    const resultDiv = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none';
    spinner.style.display = 'block';

    const isImage = document.getElementById('imageInputSection').style.display !== 'none';
    const isLink = document.getElementById('linkInputSection').style.display !== 'none';

    try {
        if (isImage) {
            await processImage();
        } else if (isLink) {
            await processLink();
        } else {
            resultDiv.innerText = 'Please select an input type.';
            resultDiv.style.display = 'block';
        }
    } finally {
        spinner.style.display = 'none';
    }
}

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
        resultDiv.innerText = 'Please select an image.';
        resultDiv.style.display = 'block';
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
        resultDiv.innerText = 'Error processing image.';
        resultDiv.style.display = 'block';
    }
}

async function processLink() {
    const linkInput = document.getElementById('linkInput');
    const resultDiv = document.getElementById('result');

    if (!linkInput.value) {
        resultDiv.innerText = 'Please paste a YouTube link.';
        resultDiv.style.display = 'block';
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
        resultDiv.innerText = 'Error processing link.';
        resultDiv.style.display = 'block';
    }
}

function renderSummaryResult(data, resultDiv) {
    resultDiv.innerHTML = '';

    if (data && data.error) {
        resultDiv.innerText = data.error;
        resultDiv.style.display = 'block';
        return;
    }

    if (data && data.summary) {
        resultDiv.innerHTML = `<strong>Summary:</strong> ${data.summary}`;
        resultDiv.style.display = 'block';
        return;
    }

    resultDiv.innerText = 'Unable to generate summary. Please try again.';
    resultDiv.style.display = 'block';
}

function openModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function openCamera() {
    closeModal();
    const cameraInput = document.getElementById('cameraInput');
    if (cameraInput) {
        cameraInput.click();
    }
}

function openGallery() {
    closeModal();
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    selectImageInput();

    const cameraInputEl = document.getElementById('cameraInput');
    if (cameraInputEl) {
        cameraInputEl.addEventListener('change', () => {
            processInput();
        });
    }

    const imageInputEl = document.getElementById('imageInput');
    if (imageInputEl) {
        imageInputEl.addEventListener('change', () => {
            processInput();
        });
    }
});
