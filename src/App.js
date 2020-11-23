import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
// import { drawMesh } from "./utilities";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



import Stacy from "./Stacy"
import { getMousePos } from "./utils"


extend({ OrbitControls });
const CameraControls = () => {  
  const {    
    camera,    
    gl: { domElement },  
  } = useThree();  
  
  const controls = useRef();  
  useFrame((state) => controls.current.update());  
  return <orbitControls ref={controls} args={[camera, domElement]} />
  ;};


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

      // var faceWidth = pos127[0] - pos356[0]
      // var RightPartWidth = pos356[0] - pos168[0]

      // var faceHeight = pos10[0] - pos152[0]
      // var TopPartHeight = pos168[0] - pos10[0]


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

              const x = keypoints[i][0];
              const y = keypoints[i][1];
              const z = keypoints[i][2];

              switch(i){
                case 168:
                  pos168 = [x, y, z]
                  break;
                case 10:
                  pos10 = [x, y, z]
                  break;
                case 152:
                  pos152 = [x, y, z]
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
              // ctx.beginPath();
              // ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
              // ctx.fillStyle = "aqua";
              // ctx.fill();

          }

      });
  }
};


export default function App() {
  const mouse = useRef({ x: 0, y: 0 })
  const d = 8.25

  const webcamRef = React.useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    
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
        {/* <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        /> */}

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
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
      {/* <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[0, 0, 0]} />
        {/* <mesh position={[0, 0, -10]}>
          <circleBufferGeometry args={[8, 64]} />
          <meshBasicMaterial color="green" />
        </mesh> */}
        {/* <Suspense fallback={null}>
          <Stacy mouse={mouse} position={[0, -10, 0]} scale={[0.08, 0.08, 0.08]} />
        </Suspense>
      </Canvas>  */}
        <Canvas shadowMap pixelRatio={[1, 1.5]} camera={{ position: [0, -3, 18]}}>
        <CameraControls />
          <hemisphereLight skyColor={"black"} groundColor={0xffffff} intensity={0.68} position={[0, 50, 0]} />
          <directionalLight
            position={[-8, -20, 8]}
            shadow-camera-left={d * -1}
            shadow-camera-bottom={d * -1}
            shadow-camera-right={d}
            shadow-camera-top={d}
            shadow-camera-near={0.1}
            shadow-camera-far={1500}
            castShadow
          />
          <mesh position={[0, 0, -30]}>
            <circleBufferGeometry args={[8, 64]} />
            <meshBasicMaterial color="lightpink" />
          </mesh>
          <Suspense fallback={null}>
            <Stacy 
              position={[0, -20, 0]} 
              scale={[10, 10 , 10]} />
          </Suspense>
          {/* <Box position={[0, 0, 0]} /> */}
        </Canvas>

    </div>

    </>

  )
}
