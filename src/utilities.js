import * as facemesh from "@tensorflow-models/facemesh";

var pos168 = [0, 0, 0]
var pos10 = [0, 0, 0]
var pos152 = [0, 0, 0]
var pos127 = [0, 0, 0]
var pos356 = [0, 0, 0]

localStorage.setItem("pos168",pos168);
localStorage.setItem("pos10",pos10);
localStorage.setItem("pos152",pos152);
localStorage.setItem("pos127",pos127);
localStorage.setItem("pos356",pos356);

export var getCoordinates = (num) => {
    let coordinates;
    switch(num){
        case 168:
            coordinates = pos168
          break;
        case 10:
            coordinates = pos10
          break;
        case 152:
            coordinates = pos152
          break;
        case 127:
            coordinates = pos127
          break;
        case 356:
            coordinates = pos356
          break;
        default:
          break;
      }   
    return coordinates;
}

export const drawMesh = (predictions, ctx) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const keypoints = prediction.scaledMesh;
           
            for (let i = 0; i < keypoints.length; i++) {
  
                const x = keypoints[i][0];
                const y = keypoints[i][1];
                const z = keypoints[i][2];
  
                switch(i){
                  case 168:
                    pos168 = [x, y, z]
                    localStorage.setItem('pos168', pos168);
                    // ctx.fillText(z, x, y);
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "aqua";
                    ctx.fill();
                    break;
                  case 10:
                    pos10 = [x, y, z]
                    // ctx.fillText(z, x, y);
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "aqua";
                    ctx.fill();
                    break;
                  case 152:
                    pos152 = [x, y, z]
                    // ctx.fillText(z, x, y);
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "aqua";
                    ctx.fill();
                    break;
                  case 127:
                    pos127 = [x, y, z]
                    localStorage.setItem('pos127', pos127);
                    // ctx.fillText(z, x, y);
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "aqua";
                    ctx.fill();
                    break;
                  case 356:
                    pos356 = [x, y, z]
                    localStorage.setItem('pos356', pos356);
                    // ctx.fillText(z, x, y);
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "aqua";
                    ctx.fill();
                    break;
                  default:
                    break;
                }
  
                // ctx.fillText(z, x, y);
                // ctx.beginPath();
                // ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
                // ctx.fillStyle = "aqua";
                // ctx.fill();
  
            }
  
        });
    }
  };
  
  export const runFacemesh = async (webcamReference, canvasReference) => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    
    setInterval(() => {
      detect(net, webcamReference, canvasReference);
    }, 100);
  };
  
  export const detect = async (net, webcamRef, canvasRef) => {
  
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
  
      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
  
      // Make Detections
      const face = await net.estimateFaces(video);
      // console.log(face);
  
      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      
      drawMesh(face, ctx);
    }
  };



//   // Drawing Mesh
// export const drawMesh = (predictions, ctx) => {
//     if (predictions.length > 0) {
//         predictions.forEach((prediction) => {
//             const keypoints = prediction.scaledMesh;
//             var pointsX = [];
//             var pointsY = [];
//             var pointsZ = [];
           
//             for (let i = 0; i < keypoints.length; i++) {

//                 // console.log(keypoints[i])

//                 const x = keypoints[i][0];
//                 const y = keypoints[i][1];
//                 const z = keypoints[i][2];

//                 // ctx.font = '10px serif';
//                 // if ((i == 10) || (i == 127) || (i == 152) || (i == 356)){
//                 //     var nbx = Math.floor(x);
//                 //     var nby = Math.floor(y);
//                 //     var nbz = Math.floor(z);

//                 //     pointsX.push(nbx);
//                 //     pointsY.push(nby);
//                 //     pointsZ.push(nbz);
                    
//                 //     ctx.fillText(i, x, y);
//                 //     ctx.beginPath();
//                 //     ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
//                 //     ctx.fillStyle = "aqua";
//                 //     ctx.fill();
//                 // }
//                 ctx.beginPath();
//                 ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
//                 ctx.fillStyle = "aqua";
//                 ctx.fill();
  
//             }

//             var X1 = pointsX[4] - pointsX[3];
//             var X2 = pointsX[3] - pointsX[1];
//             // var Y = pointsY[] - pointsY[];
//             console.log(X1, X2)


//         });
//     }
// };