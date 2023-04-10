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






// function calculateAveragePitch(tempBuffer) {
//     // Set up the pitch detection algorithm
//     const pitchDetector = new PitchFinder.YIN();
  
//     // Get the pitch for each chunk of audio data in the buffer
//     const pitches = tempBuffer.reduce((acc, chunk) => {
//       const pitch = pitchDetector(chunk, sampleRate);
//       if (pitch !== null) {
//         acc.push(pitch);
//       }
//       return acc;
//     }, []);
  
//     // Calculate the average pitch
//     const avgPitch = pitches.reduce((sum, pitch) => sum + pitch, 0) / pitches.length;
  
//     return avgPitch;
//   }
                      


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
