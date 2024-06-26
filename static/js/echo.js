let siriWave;
let recognition;
let isRecognizing = false;
let transcript;
let assistantName = "ECHO";
let isAssistantLaunched = false;

window.onload = function() {
    const launchButton = document.getElementById('launch-assistant');
    const listeningIndicator = document.getElementById('listening-indicator');
    const instructionIndicator = document.getElementById('instructions');

    setTimeout(() => {
        if(window.innerWidth < 475){
            showWarning(`⚠️ This website is not yet optimized for mobile devices yet. Please use a desktop or laptop for better experience`, 5000);
        }
    }, 8000);

    launchButton.addEventListener('click', function() {
        if (!isAssistantLaunched) {
            initializeSiriWave();
            speakText("Hello, my name is ECHO ! I am Hardik's personal assistant. Feel free to ask any questions about him.");
            isAssistantLaunched = true;
            launchButton.classList.add("hidden");
            setTimeout(() => {
                launchButton.disabled = true; 
            }, 300);
            setupSpeechRecognition();
        }
    });

    function setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        } else {
            showError('Your browser does not support speech recognition. Please use Chrome or Edge.');
            return;
        }

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Voice recognition started. Try speaking into the microphone.');
            instructionIndicator.classList.add('hidden');
            listeningIndicator.classList.remove('hidden');
        };

        recognition.onspeechend = function() {
            console.log('Voice recognition stopped.');
            instructionIndicator.classList.remove('hidden');
            listeningIndicator.classList.add('hidden');
            isRecognizing = false;
            recognition.stop();
        };

        recognition.onresult = function(event) {
            transcript = event.results[0][0].transcript;
            console.log('Transcript: ', transcript);
            speakText(transcript);
        };

        recognition.onerror = function(event) {
            isRecognizing = false;
            let error;

            switch(event.error) {
                case 'network':
                    error = 'Network error. Please check your internet connection and try again.';
                    break;
                case 'no-speech':
                    error = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    error = 'No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.';
                    break;
                case 'not-allowed':
                    error = 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone';
                    break;
                default:
                    error = 'An unknown error occurred: ' + event.error;
            }
            showError(error);
        };

        document.addEventListener('keydown', function(event) {
            if ((event.key === 'v' || event.key === 'V') && isAssistantLaunched) {
                toggleRecognition();
            }
        });

        instructionIndicator.addEventListener('click', toggleRecognition);

        function toggleRecognition() {
            if (isRecognizing) {
                recognition.stop();
                isRecognizing = false;
            } else {
                recognition.start();
                isRecognizing = true;
            }
        }

        function showError(errorMessage) {
            const errorContainer = document.getElementById('error-container');
            errorContainer.textContent = `❌ ${errorMessage}`;
            errorContainer.classList.add('visible');

            setTimeout(() => {
                errorContainer.classList.remove('visible');
            }, 3000);
        }

        window.addEventListener('resize', function() {
            location.reload();
        });
    }

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

    function speakText(text) {
        try {
            const voices = speechSynthesis.getVoices();
            const utterance = new SpeechSynthesisUtterance(text);

            if (voices.length > 0) {
                const selectedVoice = voices.find(voice => voice.name === "Microsoft Emma Online (Natural) - English (United States)");
                const fallbackVoice = voices.find(voice => voice.name === "Microsoft Mark - English (United States)");
                const defaultVoice = voices[0]

                if(selectedVoice){
                    utterance.voice = selectedVoice;
                }
                else if(fallbackVoice){
                    utterance.voice = fallbackVoice;
                }
                else{
                    utterance.voice = defaultVoice;
                }

                console.log(`Voice set to: ${assistantName} (${utterance.voice.lang})`);

                utterance.onstart = function() {
                    setSiriWaveAmplitude(1.5);
                    console.log("Speech started");
                    showSubtitle(text);
                };

                utterance.onend = function() {
                    setSiriWaveAmplitude(0.3);
                    console.log("Speech ended");
                    hideSubtitle();
                };

                window.speechSynthesis.speak(utterance);
            } else {
                console.log("No voices available yet. Waiting for voiceschanged event.");
                speechSynthesis.onvoiceschanged = function() {
                    speechSynthesis.onvoiceschanged = null;
                    speakText(text);
                };
            }
        } catch (error) {
            showError("Program ran into an error! Please try again later");
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

    function showError(errorMessage) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = errorMessage;
        errorContainer.classList.add('visible');
    
        setTimeout(() => {
            errorContainer.classList.remove('visible');
        }, 5000);
    }
};
