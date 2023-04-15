// Importing libraries
import { PitchDetector } from "https://esm.sh/pitchy@4";


window.addEventListener("DOMContentLoaded", function () {
    // //אודיו הוספת מאזין לכפתור הזתחלת ניתוח
    document.getElementById("startBtnAudio").addEventListener("click", analyzeAudioFromMicrophone);
})


function analyzeAudioFromMicrophone() {
    const dataArry = [];
    // Set up audio context and media stream
    const audioContext = new AudioContext();
    // Create an AnalyserNode instance to analyze the audio signal
    const analyserNode = audioContext.createAnalyser();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const source = audioContext.createMediaStreamSource(stream);

            // Set up script processor node to receive audio data
            const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
            source.connect(scriptNode);
            scriptNode.connect(audioContext.destination);

            // Set up variables to hold audio data
            let audioBuffer = [];
            let tempBuffer = [];

            // Create a PitchDetector instance for the given FFT size of the AnalyserNode
            const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);


            // Process audio data
            scriptNode.onaudioprocess = (event) => {
                const audioData = event.inputBuffer.getChannelData(0);
                audioBuffer.push(...audioData);

                // Replicate audio buffer every 10 seconds
                if (audioContext.currentTime % 10 < 0.1) {
                    tempBuffer = audioBuffer.slice();
                    audioBuffer = [];

                    // Calculate max and min volume in dB
                    const reference = 1.0;
                    let maxAmplitude = -Infinity;
                    let minAmplitude = Infinity;
                    for (let i = 0; i < tempBuffer.length; i++) {
                        const amplitude = tempBuffer[i];
                        if (amplitude > maxAmplitude) {
                            maxAmplitude = amplitude;
                        }
                        if (amplitude < minAmplitude) {
                            minAmplitude = amplitude;
                        }
                    }

                    // Calculate maximum and minimum volume in dB units
                    const maxVolume = 20 * Math.log10(Math.abs(maxAmplitude) / reference);
                    const minVolume = minAmplitude === 0 ? -Infinity : -20 * Math.log10(Math.abs(minAmplitude) / reference);


                    // Calculate average volume in dB
                    const rmsAmplitude = Math.sqrt(tempBuffer.reduce((sum, sample) => sum + sample * sample, 0) / tempBuffer.length);
                    const avgVolume = 20 * Math.log10(rmsAmplitude / reference);


                    // here should bee the pich code
                    // Use the pitch detector to find the pitch and clarity of the audio signal
                    const [pitch, clarity] = detector.findPitch(tempBuffer.slice(-2048), audioContext.sampleRate);
                    //Calculate  the pitch in Hz
                    const pitchInHz = Math.round(pitch * 10) / 10;
                    // const pitchClarity= Math.round(clarity * 100);


                    dataArry.push([maxVolume, minVolume, avgVolume, pitchInHz])
                    console.log(dataArry);


                }
            };
        })
    .catch((error) => console.error(error));
}



// async function getWordsPerMinute() {
//     // // Create an instance of VAD.js
//     // const vad = new VAD(VAD.Mode.NORMAL);
  
//     // Create an instance of Web Audio API
//     const audioContext = new AudioContext();
//     const mediaStreamSource = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const source = audioContext.createMediaStreamSource(mediaStreamSource);

//     // Setup options
//     var options = {
//         source: source,
//         voice_stop: function() {console.log('voice_stop');}, 
//         voice_start: function() {console.log('voice_start');}
//        }; 
       
//        // Create VAD
//        var vad = new VAD(options);
     
  
//     // Create a script processor node
//     const scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);
//     let wordCount = 0;
//     let startTime = null;
//     let wordsPerMinute = null;
//     scriptProcessorNode.onaudioprocess = (event) => {
//       const inputBuffer = event.inputBuffer.getChannelData(0);
//       const vadResult = vad.process(inputBuffer);
//       if (vadResult === VAD.Event.VOICE) {
//         if (startTime === null) {
//           startTime = Date.now();
//         }
//         const words = inputBuffer.split(' ');
//         wordCount += words.length;
//       } else {
//         if (startTime !== null) {
//           const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
//           wordsPerMinute = wordCount / elapsedTimeInSeconds * 60;
//           wordCount = 0;
//           startTime = null;
//         }
//       }
//     };
  
//     // Connect the nodes
//     source.connect(scriptProcessorNode);
//     scriptProcessorNode.connect(audioContext.destination);
  
//     // return wordsPerMinute;
//     console.log("wordsPerMinute: "+wordsPerMinute);
//   }












// async function getWordsPerMinute() {
// // const vad = require('js/VAD.js');

// const audioContext = new AudioContext();

// navigator.mediaDevices.getUserMedia({ audio: true })
//         .then((stream) => {  
 
//   const source = audioContext.createMediaStreamSource(stream);

//      // Setup options
//      var options = {
//         source: source,
//         voice_stop: function() {console.log('voice_stop');}, 
//         voice_start: function() {console.log('voice_start');},
//         voice_stop_sensitivity: 0.1,
//         voice_start_sensitivity: 1.0
        
//        }; 
// var vad = new VAD(options);


//   const vadStream = vad.createStream(audioContext.sampleRate);

//   source.connect(vadStream);

//   let startTime = new Date().getTime();
//   let endTime = new Date().getTime() + 60000;

//   let nbrOfWords = 0;
//   let minutes = (endTime - startTime) / 60000;
//   let wpm = nbrOfWords / minutes;

//   vadStream.on('data', function (speech) {
//     if (speech) {
//       nbrOfWords++;
//     }
//   });

//   console.log(wpm);
// });
// }



