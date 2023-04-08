let runDetector = true;
let runFrame = false;
let runHands = false;
let runEyes = true;

let frameCount = 0;
const frameNumForCalculate = 30;

// מערך השומר מיקום של תנועות ידיים ומתעדכן כל X פריימים
// מבנה מערך:
// 1- מערך של ימין
//2- מערך של שמאל
let handsLocation = [];
// מערך עיניים, כל תא עין ימין ואז שמאל
let eyesLocation =[];


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
    //console.log("frame count: " + frameCount);

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
        // קריא לבדיקת מבט
        eyeTocamra(keypoints);
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
    handsLocation.push(keypoints[10]);
    handsLocation.push(keypoints[9]);



    // כל X פריים מנתחים:
    if (frameCount % frameNumForCalculate == 0) {
      // שמירה במערך זמני
      const handsLocationTemp = handsLocation;
      // איפוס המערך
      handsLocation = [];

      let rightNotShowCount = 0;
      let rightXMin = handsLocationTemp[0].x;
      let rightXMax = handsLocationTemp[0].x;
      let rightYMin = handsLocationTemp[0].y;
      let rightYMax = handsLocationTemp[0].y;
      let leftNotShowCount = 0;
      let leftXMin = handsLocationTemp[1].x;
      let leftXMax = handsLocationTemp[1].x;
      let leftYMin = handsLocationTemp[1].y;
      let leftYMax = handsLocationTemp[1].y;


      // איסוף נתונים
      //בדיקה של יד ימין
      // X 
      for (let i = 0; i < handsLocationTemp.length - 1; i += 2) {
        if (handsLocationTemp[i].score < 0.4) {
          rightNotShowCount++;
        }
        else {
          if (handsLocationTemp[i].x > rightXMax) {
            rightXMax = handsLocationTemp[i].x;
          }
          if (handsLocationTemp[i].x < rightXMin) {
            rightXMin = handsLocationTemp[i].x;
          }
          // Y 
          if (handsLocationTemp[i].y > rightYMax) {
            rightYMax = handsLocationTemp[i].y;
          }
          if (handsLocationTemp[i].y < rightYMin) {
            rightYMin = handsLocationTemp[i].y;
          }
        }
      }


      //בדיקה של יד שמאל
      // X 
      for (let i = 1; i < handsLocationTemp.length - 1; i += 2) {
        if (handsLocationTemp[i].score < 0.4) {
          leftNotShowCount++;
        }
        else {
          if (handsLocationTemp[i].x > leftXMax) {
            leftXMax = handsLocationTemp[i].x;
          }
          if (handsLocationTemp[i].x < leftXMin) {
            leftXMin = handsLocationTemp[i].x;
          }
          // Y 
          if (handsLocationTemp[i].y > leftYMax) {
            leftYMax = handsLocationTemp[i].y;
          }
          if (handsLocationTemp[i].y < leftYMin) {
            leftYMin = handsLocationTemp[i].y;
          }


        }
      }

      //  ביצוע חישוב והדפסה
      const minMargin = 30;
      document.getElementById("feedback").innerHTML = "";
      document.getElementById("feedback").innerHTML += "יד ימין: " + "</br>";
      if (rightNotShowCount > frameNumForCalculate / 2) {
        document.getElementById("feedback").innerHTML += "שים לב לא להסתיר את היד " + "</br>";
      }
      else {
        if (rightXMax - rightXMin > minMargin && rightYMax - rightYMin > minMargin) {
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
        if (leftXMax - leftXMin > minMargin && leftYMax - leftYMin > minMargin) {
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
function eyeTocamra(keypoints) {
  //בדיקה שיש רצון לבצע ניתוח
  if (runEyes == true) {
// בדיקה שיש וודאות במציאת הנקודה
    //שמירת המיקום במערך הזמני    
    eyesLocation.push(keypoints[2]);
    eyesLocation.push(keypoints[1]);

    // כל X פריים מנתחים:
    if (frameCount % frameNumForCalculate == 0) {
      // שמירה במערך זמני
      const eyesLocationTemp = eyesLocation;
      // איפוס המערך
      eyesLocation = [];

      // ספירת חוסר נראות לימין ולשמאל בנפד
      let rightNotShowCount=0;
      let leftNotShowCount=0;

      for (let i = 0; i < eyesLocationTemp.length - 1; i += 2) {
        if (eyesLocationTemp[i].score < 0.65) {
          rightNotShowCount++;
        }
      }
        for (let i = 1; i < eyesLocationTemp.length - 1; i += 2) {
          if (eyesLocationTemp[i].score < 0.65) {
            leftNotShowCount++;
          }
        }

        // הדפסה
        document.getElementById("feedback").innerHTML = "";
        if (rightNotShowCount > frameNumForCalculate / 2 || leftNotShowCount > frameNumForCalculate / 2) {
          document.getElementById("feedback").innerHTML += "שים לב להסתכל למצלמה " + "</br>";
        }
        else{
          document.getElementById("feedback").innerHTML += "מבט למצלמה מעולה!" + "</br>";
        }
    }
  }
}