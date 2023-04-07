window.addEventListener("DOMContentLoaded", function () {
  // בדיקה שיש תמיחה בווידיאו
  // וקריאה לפונקצייה שמתחילה להזרים וידיאו
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    startVideo();
  } else {
    console.log("camera not supported");
  }

// הוספת מאזין לכפתור הזתחלת ניתוח
  document.getElementById("startBtn").addEventListener("click", function() {
    initSkeleton().catch(console.error);
  });
  
})

// פונקצייה שפועלת לאחר לחיצה על כפתור התחלה ומפעילה הצגת וידאו
async function startVideo() {
  // נשמור את תג הוידאו לתוך משתנה
  const player = document.getElementById('player');
  // נגדיר דרישות למדיה - נרצה להציג רק וידאו מהמצלמה האחורית
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
    })
    .catch(function (err) { console.log(err.name + ": " + err.message); });
}



