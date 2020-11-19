import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
// import { drawMesh } from "./utilities";


var pos168 = [0, 0, 0]
var pos10 = [0, 0, 0]
var pos152 = [0, 0, 0]
var pos127 = [0, 0, 0]
var pos356 = [0, 0, 0]

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    // mesh.current.rotation.x = mesh.current.rotation.y += 0.01

    if (pos168  != [0, 0, 0]){
      mesh.current.position.x = 8*(pos168[0]/640) - 4
      mesh.current.position.y = -6*(pos168[1]/480) + 3
      mesh.current.position.z = 0

      var faceWidth = pos127[0] - pos356[0]
      var RightPartWidth = pos356[0] - pos168[0]

      var faceHeight = pos10[0] - pos152[0]
      var TopPartHeight = pos168[0] - pos10[0]


      mesh.current.rotation.x = 0
      // mesh.current.rotation.y = 0.5 * Math.PI * ((RightPartWidth/faceWidth) + 0.5)
      mesh.current.rotation.y = 0
      mesh.current.rotation.z = 0
    }else{
      mesh.current.position.x = 0
      mesh.current.position.y = 0
      mesh.current.position.z = 0

      mesh.current.rotation.x = 0
      mesh.current.rotation.y = 0
      mesh.current.rotation.z = 0
    }

    // console.log(mesh.current.rotation.x)


  })
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const drawMesh = (predictions, ctx) => {
  if (predictions.length > 0) {
      predictions.forEach((prediction) => {
          const keypoints = prediction.scaledMesh;
         
          for (let i = 0; i < keypoints.length; i++) {

              // console.log(keypoints[i])

              const x = keypoints[i][0];
              const y = keypoints[i][1];
              const z = keypoints[i][2];

              switch(i){
                case 168:
                  pos168 = [x, y, z]
                  break;
                case 10:
                  pos10 = [x, y, z]
                  ctx.fillText(y, x, y);
                  break;
                case 152:
                  pos152 = [x, y, z]
                  ctx.fillText(y, x, y);
                  break;
                case 127:
                  pos127 = [x, y, z]
                  break;
                case 356:
                  pos356 = [x, y, z]
                  break;
                default:
                  break;
              }

              // ctx.fillText(z, x, y);
              ctx.beginPath();
              ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
              ctx.fillStyle = "aqua";
              ctx.fill();

          }

      });
  }
};


export default function App() {

  const webcamRef = React.useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detect(net);
    }, 100);
  };
  
  const detect = async (net) => {
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

  runFacemesh();

  return (
    <>
    <div style={{ position: "relative", width:"640px", height:"480px", float:"left", border: "2px solid black" }}>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </div>
    

    <div style={{ position: "relative", width:"640px", height:"480px", float:"left", border: "2px solid black" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>

    </>

  )
}
