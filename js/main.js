﻿// משתנים לגודל הוידיאו מהמצלמה
let videoHeight;
let videoWidth;

window.addEventListener("DOMContentLoaded", function () {
  // בדיקה שיש תמיחה בווידיאו
  // וקריאה לפונקצייה שמתחילה להזרים וידיאו
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    startVideo();
    startAudioChart();
  } else {
    console.log("camera or mic not supported");
  }

  // הוספת מאזין לכפתור הזתחלת ניתוח
  document.getElementById("startBtn").addEventListener("click", function () {
    initSkeleton(videoHeight,videoWidth).catch(console.error);
  });

//      //אודיו הוספת מאזין לכפתור הזתחלת ניתוח
// document.getElementById("startBtnAudio").addEventListener("click", async function () {
//   initAudio().catch(console.error);
// });
  

})


async function startVideo() {
  // נשמור את תג הוידאו לתוך משתנה
  const player = document.getElementById('player');
  // נגדיר דרישות למדיה - נרצה להציג רק וידאו 
  const constraints = {
    audio: false,
    video: {
      facingMode: 'environment'
    }
  };
  //במידה ונצליח לפנות למצלמה, נזרים את הוידאו לתג הוידאו
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
      player.srcObject = mediaStream;
      player.addEventListener('loadedmetadata', function() {
       videoWidth = player.videoWidth;
       videoHeight = player.videoHeight;       
      });
    })
    .catch(function (err) { console.log(err.name + ": " + err.message); });
}

function startAudioChart() {
  // Define chart options
  const chartOptions = {
    chart: {
      type: 'line',
      height: '90vh',
      width: '70%',
      padding: 0,
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    series: [{
      data: [],
    }],
    xaxis: {
      type: 'datetime',
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  };
  
  
  // Create chart instance
  const chart = new ApexCharts(document.querySelector('#chart'), chartOptions);
  chart.render();
  
  // Get microphone input and analyze audio data
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      const sourceNode = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      sourceNode.connect(analyserNode);
      
      // Keep track of volume data over time
      const volumeData = [];
      const startTime = Date.now();
      
      // Update chart with audio data in real-time
      function updateChart() {
        // Get the audio data from the analyserNode
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(dataArray);
        
        // Calculate the average volume of the audio data
        const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        
        // Add the volume to the volumeData array
        const currentTime = Date.now();
        volumeData.push([currentTime, volume]);
        
        // Remove old data from the volumeData array
        const thirtySecondsAgo = currentTime - 10 * 1000;
        while (volumeData.length > 0 && volumeData[0][0] < thirtySecondsAgo) {
          volumeData.shift();
        }
        
        // Update the chart data with the volumeData array
        chart.updateSeries([{ data: volumeData }], true);
        
        // Schedule the next update
        requestAnimationFrame(updateChart);
      }
      
      updateChart();
    })
    .catch(error => {
      console.error(error);
    });
}
