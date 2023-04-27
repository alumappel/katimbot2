// Importing libraries
import { PitchDetector } from "https://esm.sh/pitchy@4";


// window.addEventListener("DOMContentLoaded", function () {
//     // //אודיו הוספת מאזין לכפתור הזתחלת ניתוח
//   //  document.getElementById("startBtnAudio").addEventListener("click", analyzeAudioFromMicrophone);
// })


export function analyzeAudioFromMicrophone() {
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
                    let pichMin;
                    let pichMax;

                    for (let i = 0; i < tempBuffer.length; i += 2048) {
                        const slice = tempBuffer.slice(i, i + 2048);
                        // Use the pitch detector to find the pitch and clarity of the audio signal
                        const [pitch, clarity] = detector.findPitch(slice, audioContext.sampleRate);
                        //Calculate  the pitch in Hz
                        const pitchInHz = Math.round(pitch * 10) / 10;
                        for (let i = 0; i < tempBuffer.length; i++) {
                            if (pichMax !== undefined) {
                                if (pitchInHz > pichMax) {
                                    pichMax = pitchInHz;
                                }
                            }
                            else {
                                pichMax = pitchInHz;
                            }

                            if (pichMin !== undefined) {
                                if (pitchInHz < pichMin) {
                                    pichMin = pitchInHz;
                                }
                            }
                            else {
                                pichMin = pitchInHz;
                            }
                        }
                    }



                    dataArry.push([maxVolume, minVolume, avgVolume, pichMax, pichMin]);
                    showDataArry(dataArry);
                    //console.log(dataArry);


                }
            };
        })
        .catch((error) => console.error(error));
}

//show dataArry live
function showDataArry(dataArry) {
    console.log("show data");
    //pitch
    const pitchElement = document.getElementById("pitchDiv");
    console.log("max: " +dataArry[dataArry.length-1][3]+ "min: "+dataArry[dataArry.length-1][4]);
    if (dataArry.length <= 2) {
        if (dataArry[0][3] - dataArry[0][4] > 5) {
            if (pitchElement.classList.contains("redG")) {
                pitchElement.classList.remove("redG");
            }
            pitchElement.classList.add("greenG");
        }
        else {
            if (pitchElement.classList.contains("greenG")) {
                pitchElement.classList.remove("greenG");
            }
            pitchElement.classList.add("redG");
        }
    }
    else {
        let max20Seconds;
        let min20Seconds;
        if (dataArry[dataArry.length - 1][3] > dataArry[dataArry.length - 2][3]) {
            max20Seconds = dataArry[dataArry.length - 1][3];
        }
        else {
            max20Seconds = dataArry[dataArry.length - 2][3];
        }
        if (dataArry[dataArry.length - 1][4] < dataArry[dataArry.length - 2][4]) {
            min20Seconds = dataArry[dataArry.length - 1][4];
        }
        else {
            min20Seconds = dataArry[dataArry.length - 2][4];
        }


        if (max20Seconds - min20Seconds > 5) {
            if (pitchElement.classList.contains("redG")) {
                pitchElement.classList.remove("redG");
            }
            pitchElement.classList.add("greenG");
        }
        else {
            if (pitchElement.classList.contains("redG")) {
                pitchElement.classList.remove("redG");
            }
            pitchElement.classList.add("greenG");
        }
    }


    // vol

}



