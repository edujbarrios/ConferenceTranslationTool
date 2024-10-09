document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera-feed');
    const subtitles = document.getElementById('subtitles');
    let recognition;

    // Start camera
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            console.error("Error accessing camera:", err);
            handleCameraError();
        }
    }

    // Handle camera error
    function handleCameraError() {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = "Camera access is not available. Speech-to-text translation will still work.";
        errorMessage.style.color = "red";
        errorMessage.style.padding = "20px";
        errorMessage.style.textAlign = "center";
        video.parentNode.insertBefore(errorMessage, video);
        video.style.display = "none";
    }

    // Start speech recognition
    function startSpeechRecognition() {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            if (result.isFinal) {
                const text = result[0].transcript;
                translateText(text);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.start();
    }

    // Translate text
    async function translateText(text) {
        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            subtitles.textContent = data.translation;
        } catch (err) {
            console.error("Translation error:", err);
        }
    }

    // Initialize
    startCamera();
    startSpeechRecognition();
});
