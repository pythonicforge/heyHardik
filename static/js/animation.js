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

document.addEventListener('DOMContentLoaded', function () {
    initializeSiriWave();

    window.addEventListener('resize', function () {
        location.reload()
    });

    window.addEventListener('load', function () {
        updateSiriWaveWidth();
    });
});

function speakText(text) {
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === "Microsoft Emma Online (Natural) - English (United States)");
    const fallbackVoice = voices.find(voice => voice.name === "Microsoft Mark - English (United States)")
    var utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Voice set to: ${selectedVoice.name} (${selectedVoice.lang})`);
    } else {
        utterance.voice = fallbackVoice
        console.log(`Voice not found: ${selectedVoice}`);
    }
    utterance.onstart = function (event) {
        setSiriWaveAmplitude(1.5);
    };
    utterance.onend = function (event) {
        setSiriWaveAmplitude(0.3);
    };
    window.speechSynthesis.speak(utterance);
}

function setSiriWaveAmplitude(amplitude) {
    if (siriWave) {
        siriWave.setAmplitude(amplitude);
    }
}

document.getElementById("speak-button").addEventListener("click", function () {
    var textToSpeak = "Hello, hey there! ";
    speakText(textToSpeak);
});

function updateSiriWaveAmplitude(audioContext) {
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function update() {
        analyser.getByteFrequencyData(dataArray);
        var amplitude = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength / 256;
        setSiriWaveAmplitude(amplitude);
        requestAnimationFrame(update);
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            var source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            update();
        })
        .catch(function (err) {
            console.error('Error getting audio input: ', err);
        });
}