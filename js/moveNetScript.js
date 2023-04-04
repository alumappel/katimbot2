// async function startsceletone(){
//     const video = document.getElementById('player');
// // Create a detector.
// const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER});
// // Pass in a video stream to the model to detect poses.
// const poses = await detector.estimatePoses(video);
// console.log(poses[0].keypoints);
// } 
  
async function initSkeleton() {
    const video = document.getElementById('player');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
    );
  
    async function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
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
        }
  
        // Call the redraw function again to draw the next frame
        requestAnimationFrame(redraw);
      } catch (e) {
        console.error('Failed to estimate poses:', e);
      }
    }
  
    redraw();
  }
  
  