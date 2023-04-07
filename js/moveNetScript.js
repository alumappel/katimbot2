let runDetector = true;
let runFrame = false;
let runHands = true;

let frameCount = 0;
const frameNumForCalculate = 30;

// מערך השומר מיקום של תנועות ידיים ומתעדכן כל X פריימים
// מבנה המערך:
// 0 - ימין X
// 1-ימין Y 
// 2- שמאל X 
// 3-שמאל Y 
let handsLocation=[];



// פונקצייה שמכינה את כל מה שצריך כדי להתחיל לאסוף וידיאו ולנתח אותו 
async function initSkeleton() {
  const video = document.getElementById('player');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
  );

  // פונקצייה שחוזרת כל פריים ומבצעת ניתוח על הוידיאו יחד עם הצגה של שלד
  async function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ספירת הפריים
    frameCount++;

    try {
      // Detect poses in the video
      const poses = await detector.estimatePoses(video);

      // Check that at least one pose is detected
      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;

        // Draw keypoints
        keypoints.forEach(keypoint => {
          if (keypoint.score > 0.4) {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          }
        });

        // Draw lines between keypoints
        const pairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
        pairs.forEach(pair => {
          const from = keypoints[pair[0]];
          const to = keypoints[pair[1]];
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = 'blue';
          ctx.stroke();
        });


        // קריאה למיקום בפריים
        fullBodyInFrame(keypoints);
        // קריאה לתנועות ידיים
        handsMovment(keypoints);
      }

      // Call the redraw function again to draw the next frame
      requestAnimationFrame(redraw);
    } catch (e) {
      console.error('Failed to estimate poses:', e);
    }
  }

  // קריאה ראשונה לפונקצייה שחוזקת
  redraw();
}

// פונקצייה שבודקת מיקום בפריים
function fullBodyInFrame(keypoints) {
  //בדיקה שיש רצון לבצע ניתוח
  if (runFrame == true) {
    //בדיקה של אברים בפריים
    let topRight = false;
    let topLeft = false;
    let bodyRight = false;
    let bodyLeft = false;
    let bottomRight = false;
    let bottomLeft = false;
    // הגדרת ערכי גבולות
    let leftBorder = 20 + 5;
    let rightBorder = 620 - 5;
    let topBorder = 35 + 5;
    let bottomBorder = 450 - 5;

    // בדיקת וודאות בזיהוי נקודה
    if (keypoints[1].score > 0.4 && keypoints[3].score > 0.4) {
      let i = 1;
      let b = 3;
      // בדיקה שהנקודה בפריים
      if ((keypoints[i].y > topBorder && keypoints[i].x < rightBorder && keypoints[i].y < bottomBorder && keypoints[i].x > leftBorder) == true || (keypoints[b].y > topBorder && keypoints[b].x < rightBorder && keypoints[b].y < bottomBorder && keypoints[b].x > leftBorder) == true) {
        topRight = true;
      }
    }
    if (keypoints[2].score > 0.4 && keypoints[4].score > 0.4) {
      let i = 2;
      let b = 4;
      if ((keypoints[i].y > topBorder && keypoints[i].x < rightBorder && keypoints[i].y < bottomBorder && keypoints[i].x > leftBorder) == true || (keypoints[b].y > topBorder && keypoints[b].x < rightBorder && keypoints[b].y < bottomBorder && keypoints[b].x > leftBorder) == true) {
        topLeft = true;
      }
    }
    if (keypoints[5].score > 0.4 && keypoints[7].score > 0.4) {
      let i = 5;
      let b = 7;
      if ((keypoints[i].y > topBorder && keypoints[i].x < rightBorder && keypoints[i].y < bottomBorder && keypoints[i].x > leftBorder) == true || (keypoints[b].y > topBorder && keypoints[b].x < rightBorder && keypoints[b].y < bottomBorder && keypoints[b].x > leftBorder) == true) {
        bodyRight = true;
      }
    }
    if (keypoints[6].score > 0.4 && keypoints[8].score > 0.4) {
      let i = 6;
      let b = 8;
      if ((keypoints[i].y > topBorder && keypoints[i].x < rightBorder && keypoints[i].y < bottomBorder && keypoints[i].x > leftBorder) == true || (keypoints[b].y > topBorder && keypoints[b].x < rightBorder && keypoints[b].y < bottomBorder && keypoints[b].x > leftBorder) == true) {
        bodyLeft = true;
      }
    }
    if (keypoints[13].score > 0.4 && keypoints[11].score > 0.4) {
      let i = 13;
      let b = 11;
      if ((keypoints[i].y > topBorder && keypoints[i].x < rightBorder && keypoints[i].y < bottomBorder && keypoints[i].x > leftBorder) == true || (keypoints[b].y > topBorder && keypoints[b].x < rightBorder && keypoints[b].y < bottomBorder && keypoints[b].x > leftBorder) == true) {
        bottomRight = true;
      }
    }
    if (keypoints[14].score > 0.4 && keypoints[12].score > 0.4) {
      let i = 12;
      let b = 16;
      if ((keypoints[i].y > topBorder && keypoints[i].x < rightBorder && keypoints[i].y < bottomBorder && keypoints[i].x > leftBorder) == true || (keypoints[b].y > topBorder && keypoints[b].x < rightBorder && keypoints[b].y < bottomBorder && keypoints[b].x > leftBorder) == true) {
        bottomLeft = true;
      }
    }

    // הדפסת משוב
    if (topRight == false || topLeft == false || bodyLeft == false || bodyRight == false || bottomLeft == false || bottomRight == false) {
      document.getElementById("feedback").innerHTML = "לא תקין ";
    }
    else {
      document.getElementById("feedback").innerHTML = "תקין ";
    }
  }
}

// פונקצייה שבודקת תנועות ידיים
function handsMovment(keypoints) {
  //בדיקה שיש רצון לבצע ניתוח
  if (runHands == true) {
    // בדיקה שיש וודאות במציאת הנקודה
    //שמירת המיקום במערך הזמני
    if (keypoints[10].score > 0.4) {
      handsLocation.push(keypoints[10].x);
      handsLocation.push(keypoints[10].y);
    }
    else {
      handsLocation.push(0);
      handsLocation.push(0);
    }
    if (keypoints[9].score > 0.4) {
      handsLocation.push(keypoints[9].x);
      handsLocation.push(keypoints[9].y);
    }
    else {
      handsLocation.push(0);
      handsLocation.push(0);
    }

    // כל X פריים מנתחים:
    if (frameCount % frameNumForCalculate) {
      let rightNotShowCount = 0;
      let rightXMin = 0;
      let rightXMax = 0;
      let rightYMin = 0;
      let rightYMax = 0;
      let leftNotShowCount = 0;
      let leftXMin = 0;
      let leftXMax = 0;
      let leftYMin = 0;
      let leftYMax = 0;


      // איסוף נתונים
      //בדיקה של יד ימין
      // X 
      for (i = 0; i < handsLocation.length; i + 4) {
        if (handsLocation[i] == 0) {
          rightNotShowCount++;
        }
        else {
          if (handsLocation[i] > rightXMax) {
            rightXMax = handsLocation[i];
          }
          if (handsLocation[i] < rightXMin) {
            rightXMin = handsLocation[i];
          }
        }
      }
      // Y 
      for (i = 1; i < handsLocation.length; i + 4) {
        if (handsLocation[i] != 0) {
          if (handsLocation[i] > rightYMax) {
            rightYMax = handsLocation[i];
          }
          if (handsLocation[i] < rightYMin) {
            rightYMin = handsLocation[i];
          }
        }
      }

      //בדיקה של יד שמאל
      // X 
      for (i = 2; i < handsLocation.length; i + 4) {
        if (handsLocation[i] == 0) {
          leftNotShowCount++;
        }
        else {
          if (handsLocation[i] > leftXMax) {
            leftXMax = handsLocation[i];
          }
          if (handsLocation[i] < leftXMin) {
            leftXMin = handsLocation[i];
          }
        }
      }
      // Y 
      for (i = 3; i < handsLocation.length; i + 4) {
        if (handsLocation[i] != 0) {
          if (handsLocation[i] > leftYMax) {
            leftYMax = handsLocation[i];
          }
          if (handsLocation[i] < leftYMin) {
            leftYMin = handsLocation[i];
          }
        }
      }

      // איפוס המערך
      handsLocation=[];


      //  ביצוע חישוב והדפסה
      document.getElementById("feedback").innerHTML = "";
      document.getElementById("feedback").innerHTML += "יד ימין: " + "</br>";
      if (rightNotShowCount > frameNumForCalculate / 2) {
        document.getElementById("feedback").innerHTML += "שים לב לא להסתיר את היד " + "</br>";
      }
      else {
        if (rightXMax - rightXMin > 20 && rightYMax - rightYMin > 20) {
          document.getElementById("feedback").innerHTML += "כל הכבוד! יש תנועה מספקת עם היד" + "</br>";
        }
        else {
          document.getElementById("feedback").innerHTML += "אינך מזיז/ה את היד מספיק" + "</br>";
        }
      }
      document.getElementById("feedback").innerHTML += "יד שמאל: " + "</br>";
      if (leftNotShowCount > frameNumForCalculate / 2) {
        document.getElementById("feedback").innerHTML += "שים לב לא להסתיר את היד " + "</br>";
      }
      else {
        if (leftXMax - leftXMin > 20 && leftYMax - leftYMin > 20) {
          document.getElementById("feedback").innerHTML += "כל הכבוד! יש תנועה מספקת עם היד" + "</br>";
        }
        else {
          document.getElementById("feedback").innerHTML += "אינך מזיז/ה את היד מספיק" + "</br>";
        }
      }
    }
  }
}

  //פונקציה שבודקת מבט למצלמה
    //בדיקה שיש רצון לבצע ניתוח


