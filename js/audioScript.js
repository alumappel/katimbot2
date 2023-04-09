// import { PitchAnalyzer } from './pitch-analyzer.js';
// // add event listener to start audio processing
// document.getElementById("startBtnAudio").addEventListener("click", async function () {
//     initAudio().catch(console.error);
// });
window.addEventListener("DOMContentLoaded", function () {
    // //אודיו הוספת מאזין לכפתור הזתחלת ניתוח
    document.getElementById("startBtnAudio").addEventListener("click", analyzeAudioFromMicrophone);


    // document.getElementById('startBtnAudio').addEventListener('click', () => {
    //     analyzeAudioFromMicrophone(10000, 100, (dataArray) => {
    //         // Do something with the dataArray, such as updating a chart
    //         console.log(dataArray);
    //     });
    // });

})


//    async function initAudio(){  
//     console.log("inside initAudio");
//       // create audio context
//       const audioContext = new AudioContext();

//       // register audio worklet processor
//       await audioContext.audioWorklet.addModule('js/audio-worklet-processor.js');

//       // create audio worklet node
//       const audioWorkletNode = new AudioWorkletNode(audioContext, 'my-audio-worklet-processor');

//       // create pitch analyzer
//       const pitchAnalyzer = new PitchAnalyzer(audioContext.sampleRate);

//       // initialize audio data array
//       const audioData = [];

//       // set interval to collect audio data
//       setInterval(() => {
//         console.log("inside initerval");
//         const currentAudioData = audioData.splice(0, audioContext.sampleRate);

//         // calculate average volume
//         const averageVolume = currentAudioData.reduce((sum, value) => sum + Math.abs(value)) / audioContext.sampleRate;

//         // calculate pitch data
//         const pitchData = pitchAnalyzer.getPitch(currentAudioData);
//         const averagePitch = pitchData.frequency;
//         const minPitch = pitchData.minFrequency;
//         const maxPitch = pitchData.maxFrequency;

//         // count number of words spoken
//         // const wordCount = countWords(currentAudioData);
//         const wordCount =0;

//         // create array of analysis data
//         const analysisData = [averageVolume, averagePitch, minPitch, maxPitch, wordCount];

//         // add analysis data to audio data array
//         audioData.push(analysisData);
//         console.log(audioData);

//         // output analysis data
//         console.log(analysisData);
//       }, 10000);

//       // connect audio worklet node to audio context
//       audioWorkletNode.connect(audioContext.destination);

//       // add message event listener to collect audio data from audio worklet node
//       audioWorkletNode.port.onmessage = function(event) {
//         const inputData = event.data;
//         audioData.push(inputData);
//       };
//     }     

//   // function to count number of words spoken
//   function countWords(audioData) {
//     // implementation goes here
//   }


// function initAudio() {
//     // create audio context
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//     // create script processor node to collect audio data
//     const bufferSize = 2048;
//     const scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
//     let audioData = [];

//     // create pitch analyzer
//     const pitchAnalyzer = new PitchAnalyzer(audioContext.sampleRate);

//     // get microphone input
//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(function (stream) {
//             const microphone = audioContext.createMediaStreamSource(stream);
//             microphone.connect(scriptNode);
//             scriptNode.connect(audioContext.destination);
//         })
//         .catch(function (error) {
//             console.log('Error getting microphone input:', error);
//         });

//     // collect audio data every 10 seconds
//     setInterval(function () {
//         if (audioData.length >= bufferSize) {
//             const currentAudioData = audioData.splice(0, bufferSize);

//             //   // calculate average volume
//             //   const averageVolume = currentAudioData.reduce((sum, value) => sum + Math.abs(value)) / bufferSize;

//             // calculate average volume
//             let averageVolume;
//             if (currentAudioData.length > 0) {
//                 averageVolume = currentAudioData.reduce((sum, value) => sum + Math.abs(value)) / bufferSize;
//             } else {
//                 averageVolume = none;
//             }


//             // calculate pitch data
//             const pitchData = pitchAnalyzer.getPitch(currentAudioData);
//             const averagePitch = pitchData.frequency;
//             const minPitch = pitchData.minFrequency;
//             const maxPitch = pitchData.maxFrequency;
//             const wordCount = 0 // implement word counting logic

//             // store data in array
//             const dataArray = [averageVolume, averagePitch, minPitch, maxPitch, wordCount];
//             // add data array to audio data array
//             audioData.push(dataArray);
//             console.log(dataArray);
//         }
//     }, 10000);

//     // collect audio data from script processor node
//     scriptNode.onaudioprocess = function (audioProcessingEvent) {
//         const inputBuffer = audioProcessingEvent.inputBuffer;
//         const inputData = inputBuffer.getChannelData(0);

//         // add audio data to array
//         audioData.push(inputData);
//         //console.log(audioData);
//     };
// }

// function initAudio() {
//     // create audio context
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//     // create pitch analyzer
//     const pitchAnalyzer = new PitchAnalyzer(audioContext.sampleRate);

//     // register audio worklet
//     audioContext.audioWorklet.addModule('worklet.js').then(() => {
//       // create audio worklet node to collect and analyze audio data
//       class AudioAnalyzer extends AudioWorkletProcessor {
//         constructor() {
//           super();
//           this.audioData = [];
//           this.bufferSize = 2048;
//           this.port.onmessage = this.onmessage.bind(this);
//         }

//         onmessage(event) {
//           if (event.data === 'start') {
//             // get microphone input
//             navigator.mediaDevices.getUserMedia({ audio: true })
//               .then((stream) => {
//                 const source = audioContext.createMediaStreamSource(stream);
//                 this.port.postMessage({ action: 'source', source: source });
//               })
//               .catch((error) => {
//                 console.log('Error getting microphone input:', error);
//               });
//           } else if (event.data === 'analyze') {
//             if (this.audioData.length >= this.bufferSize) {
//               const currentAudioData = this.audioData.splice(0, this.bufferSize);
//               // calculate average volume
//               let averageVolume;
//               if (currentAudioData.length > 0) {
//                 averageVolume = currentAudioData.reduce((sum, value) => sum + Math.abs(value)) / this.bufferSize;
//               } else {
//                 averageVolume = 'none';
//               }
//               // calculate pitch data
//               const pitchData = pitchAnalyzer.getPitch(currentAudioData);
//               const averagePitch = pitchData.frequency;
//               const minPitch = pitchData.minFrequency;
//               const maxPitch = pitchData.maxFrequency;
//               const wordCount = 0; // implement word counting logic
//               // send data to main thread
//               this.port.postMessage({
//                 action: 'data',
//                 data: [averageVolume, averagePitch, minPitch, maxPitch, wordCount],
//               });
//             }
//           }
//         }

//         process(inputs, outputs) {
//           const inputData = inputs[0][0];
//           // add audio data to array
//           this.audioData.push(inputData);
//           return true;
//         }
//       }

//       audioContext.audioWorklet.addModule('worklet.js').then(() => {
//         const analyzerNode = new AudioWorkletNode(audioContext, 'audio-analyzer');
//         analyzerNode.port.postMessage('start');
//         setInterval(() => {
//           analyzerNode.port.postMessage('analyze');
//         }, 10000);
//         analyzerNode.port.onmessage = (event) => {
//           if (event.data.action === 'source') {
//             const source = event.data.source;
//             source.connect(analyzerNode);
//             analyzerNode.connect(audioContext.destination);
//           } else if (event.data.action === 'data') {
//             console.log(event.data.data);
//           }
//         };
//       });
//     });
//   }



// function analyzeAudioFromMicrophone(intervalTime, sampleTime, onDataReady) {
//     // Create an AudioContext object
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//     // Create an AnalyserNode for analyzing the audio data
//     const analyserNode = audioContext.createAnalyser();

//     // Set the AnalyserNode properties
//     analyserNode.fftSize = 2048;
//     analyserNode.smoothingTimeConstant = 0.8;

//     // Create a MediaStreamSourceNode to capture audio from the microphone
//     navigator.mediaDevices.getUserMedia({audio: true})
//       .then(stream => {
//         const sourceNode = audioContext.createMediaStreamSource(stream);
//         sourceNode.connect(analyserNode);
//       })
//       .catch(error => {
//         console.error('Error accessing microphone:', error);
//       });

//     // Create an array to store the analyzed data
//     const dataArray = [];

//     // Create a function to analyze the data
//     function analyzeData() {
//       const time = audioContext.currentTime;
//       const dataArrayItem = [];

//       // Create an array to store the pitch values
//       const pitchArray = [];

//       // Create a Float32Array to store the frequency data
//       const frequencyData = new Float32Array(analyserNode.frequencyBinCount);

//       // Get the frequency data from the AnalyserNode
//       analyserNode.getFloatFrequencyData(frequencyData);

//       // Calculate the average volume
//       const volume = Math.max(...frequencyData);

//       // Create a PitchFinder object to detect the pitch
//       const pitchFinder = new window.PitchFinder.YIN({sampleRate: audioContext.sampleRate});

//       // Loop through the frequency data and detect the pitch for each sample
//       for (let i = 0; i < frequencyData.length; i += sampleTime) {
//         const frequency = Math.max(...frequencyData.subarray(i, i + sampleTime));
//         const pitch = pitchFinder.getPitch(frequency);
//         pitchArray.push(pitch);
//       }

//       // Calculate the average pitch, minimum pitch, and maximum pitch
//       const pitchArrayFiltered = pitchArray.filter(pitch => pitch !== null);
//       const pitchArraySorted = pitchArrayFiltered.sort();
//       const pitchArrayLength = pitchArrayFiltered.length;
//       const pitchArrayMidpoint = Math.floor(pitchArrayLength / 2);
//       const averagePitch = pitchArrayFiltered.reduce((a, b) => a + b, 0) / pitchArrayLength;
//       const minimumPitch = pitchArraySorted[0];
//       const maximumPitch = pitchArraySorted[pitchArrayLength - 1];

//       // Add the data to the dataArrayItem
//       dataArrayItem.push(time, volume, averagePitch, minimumPitch, maximumPitch);

//       // Add the dataArrayItem to the dataArray
//       dataArray.push(dataArrayItem);

//       // Remove old data from the dataArray
//       const oldestTime = dataArray[0][0];
//       while (dataArray.length > 0 && dataArray[0][0] + intervalTime < oldestTime) {
//         dataArray.shift();
//       }

//       // Call the onDataReady callback function with the dataArray
//       onDataReady(dataArray);

//       // Call the analyzeData function again after the intervalTime has elapsed
//       setTimeout(analyzeData, intervalTime);
//     }

//     // Start analyzing the data
//     analyzeData();
//   }


function analyzeAudioFromMicrophone() {
    const dataArry = [];
    // Set up audio context and media stream
    const audioContext = new AudioContext();
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



                    dataArry.push([maxVolume, minVolume,avgVolume])
                    console.log(dataArry);

                }
            };
        })
        .catch((error) => console.error(error));

}

// and an AnalyserNode object to analyze the audio data
// Set the desired buffer size and sample rate for the analyzer
// Set the minimum and maximum frequencies to analyze
// Set the number of FFT bins for the analyzer
// Set the time interval for collecting and analyzing audio data
// Create an empty array to store the analyzed data for each interval

// Define a function that starts the audio stream and analysis process
  // Request access to the user's microphone
  // Create a MediaStreamSourceNode to receive the microphone input
  // Connect the source node to the analyzer node
  // Create an array to store the analyzed data for each 10-second interval
  // Define a function that analyzes the audio data and stores the results
    // Create a new Float32Array to store the frequency data
    // Collect the frequency data from the analyzer node
    // Calculate the average volume of the frequency data
    // Calculate the average pitch of the frequency data
    // Calculate the minimum pitch of the frequency data
    // Calculate the maximum pitch of the frequency data
    // Store the analyzed data in an array
    // If the array length exceeds the desired number of intervals, remove the first element
  // Set an interval to collect and analyze audio data every 10 seconds
  // Return the array of analyzed data for each interval
