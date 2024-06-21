let siriWave;

function initializeSiriWave() {
    const container = document.getElementById("animation-container");
    const initialWidth = window.innerWidth;

    siriWave = new SiriWave({
        container: container,
        width: initialWidth,
        height: 100,
        color: "#000",
        speed: 0.06,
        amplitude: 0.3,
        frequency: 9
    });
    siriWave.start();
}

function updateSiriWaveWidth() {
    if (siriWave) {
        const newWidth = window.innerWidth;
        siriWave.setWidth(newWidth);
    }
}

function speakText(text) {
    try {
        const voices = speechSynthesis.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);

        if (voices.length > 0) {
            const selectedVoice = voices.find(voice => voice.name === "Microsoft Emma Online (Natural) - English (United States)");
            const fallbackVoice = voices.find(voice => voice.name === "Microsoft Mark - English (United States)");

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                console.log(`Voice set to: ${selectedVoice.name} (${selectedVoice.lang})`);
            } else {
                utterance.voice = fallbackVoice;
                console.log(`Voice not found: ${selectedVoice}`);
            }

            utterance.onstart = function (event) {
                setSiriWaveAmplitude(1.5);
                console.log("Speech started");
                showSubtitle(text);
            };

            utterance.onend = function (event) {
                setSiriWaveAmplitude(0.3);
                console.log("Speech ended");
                hideSubtitle();
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.log("No voices available yet. Waiting for voiceschanged event.");
            speechSynthesis.onvoiceschanged = function () {
                speechSynthesis.onvoiceschanged = null;
                speakText(text);
            };
        }
    } catch (error) {
        showError("Program ran into an error! Please try again later");
        console.log(error);
    }
}

function setSiriWaveAmplitude(amplitude) {
    if (siriWave) {
        siriWave.setAmplitude(amplitude);
    }
}

function showSubtitle(transcript) {
    const subtitleContainer = document.getElementById('assistant-subtitle-container');
    subtitleContainer.textContent = transcript;
    subtitleContainer.classList.add('visible');
}

function hideSubtitle() {
    const subtitleContainer = document.getElementById('assistant-subtitle-container');
    subtitleContainer.classList.remove('visible');
}

function showError(errorMessage) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = `❌ ${errorMessage}`;
    errorContainer.classList.add('visible');

    setTimeout(() => {
        errorContainer.classList.remove('visible');
    }, 3000);
}

function showWarning(warningMessage, duration = 3000) {
    const warningContainer = document.createElement('div');
    warningContainer.classList.add('warning-popup');
    warningContainer.textContent = warningMessage;

    document.body.appendChild(warningContainer);

    setTimeout(() => {
        warningContainer.classList.add('visible');
    }, 100); 

    setTimeout(() => {
        warningContainer.classList.remove('visible');
        setTimeout(() => {
            document.body.removeChild(warningContainer);
        }, 500); 
    }, duration);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeSiriWave();

    window.addEventListener('resize', function () {
        location.reload();
    });

    setTimeout(() => {
        if(window.innerWidth < 475){
            showWarning("⚠️ Sara is not yet optimized for mobile devices. Please use a desktop or laptop to use Sara.", 3000);
        }
        speakText("Hello, my name is Sara. How can I help you today?");
    }, 9000);
});
