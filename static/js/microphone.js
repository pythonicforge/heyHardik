window.onload = function() {
    const listeningIndicator = document.getElementById('listening-indicator');
    const instructionIndicator = document.getElementById('instructions');
    let recognition;
    let transcript;
    let error;
    let isRecognizing = false;

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
        showSubtitle(transcript);
    };

    recognition.onerror = function(event) {
        isRecognizing = false;

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
        if ((event.key === 'v' || event.key === 'V')) {
            if (isRecognizing) {
                recognition.stop();
                isRecognizing = false;
                // hideSiriAnimation()
            } else {
                recognition.start();
                isRecognizing = true;
                // showSiriAnimation()
            }
        }
    });

    instructionIndicator.addEventListener('click', function(e) {
        if (isRecognizing) {
            recognition.stop();
            isRecognizing = false;
            // hideSiriAnimation()
        } else {
            recognition.start();
            isRecognizing = true;
            // showSiriAnimation()
        }
    })

    function showSubtitle(transcript) {
        const subtitleContainer = document.getElementById('subtitle-container');
        subtitleContainer.textContent = transcript;
        subtitleContainer.classList.add('visible');
    
        setTimeout(() => {
            subtitleContainer.classList.remove('visible');
        }, 5000);
    }

    function showError(errorMessage) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = errorMessage;
        errorContainer.classList.add('visible');
    
        setTimeout(() => {
            errorContainer.classList.remove('visible');
        }, 5000);
    }

    // function showSiriAnimation() {
    //     const siriAnimation = document.getElementById('siri-animation');
    //     siriAnimation.classList.remove('hidden');
    // }
    
    // function hideSiriAnimation() {
    //     const siriAnimation = document.getElementById('siri-animation');
    //     siriAnimation.classList.add('hidden');
    // }
    
};