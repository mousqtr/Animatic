import * as posenet from "@tensorflow-models/posenet";

var pos6 = [0, 0]
var pos8 = [0, 0]
var pos10 = [0, 0]

var pos5 = [0, 0]
var pos7 = [0, 0]
var pos9 = [0, 0]

export var getPoseCoordinates = (num) => {
    let coordinates;
    switch(num){
        case 6:
            coordinates = pos6
          break;
        case 8:
            coordinates = pos8
          break;
        case 10:
            coordinates = pos10
          break;
        case 5:
            coordinates = pos5
          break;
        case 7:
            coordinates = pos7
          break;
        case 9:
            coordinates = pos9
          break;
        default:
          break;
      }   
    return coordinates;
  }

export const runPosenet = async (webcamReference, canvasReference) => {
    const net = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
    });

    setInterval(() => {
        detect(net, webcamReference, canvasReference);
    }, 100);
};

const detect = async (net, webcamRef, canvasRef) => {
    if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
    ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Make Detections
        const pose = await net.estimateSinglePose(video);

        const ctx = canvasRef.current.getContext("2d");

        // drawKeypoints(pose["keypoints"], 0.6, ctx);
        // drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    
    }
};

function drawKeypoints(keypoints, minConfidence, ctx) {
    for (let i = 0; i < keypoints.length; i++) {
        
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
        continue;
        }

        const { y, x } = keypoint.position;

        drawPoint(ctx, y, x, 3, "red");

        switch(i){
            case 5:
                pos5 = [x, y]
                ctx.fillText(i, x, y);
                break;
            case 6:
                pos6 = [x, y]
                ctx.fillText(i, x, y);
                break;
            case 8:
              pos8 = [x, y]
              ctx.fillText(i, x, y);
              break;

            default:
                break;
        }

        
    }
}

function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}