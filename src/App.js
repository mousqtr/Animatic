import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, extend, useThree, useLoader } from 'react-three-fiber'
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";


import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { TextureLoader, RepeatWrapping } from "three";

import Stacy from "./Stacy"
import { runFacemesh } from "./utilities";


extend({ OrbitControls });
const CameraControls = () => {  
  const {    
    camera,    
    gl: { domElement },  
  } = useThree();  
  
  const controls = useRef();  
  useFrame((state) => controls.current.update());  
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};


function Wall({ ...props }) {
  const texture = useLoader(TextureLoader, "/bricks.jpg");
  return (
    <mesh {...props} receiveShadow position={[0, 0, -30]} rotation={[0, 0, 0]}>
      <planeBufferGeometry args={[60, 60, 1, 1]}/>
      {/* <meshBasicMaterial color="green" /> */}
      <meshPhongMaterial map={texture} side={2}/>
    </mesh>
  )
}

function Floor({ ...props }) {
  const texture = useLoader(TextureLoader, "/floor.jpg");
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.offset.set( 0, 0 );
  texture.repeat.set( 2, 2 );
  return (
    <mesh {...props} receiveShadow position={[0, -20, 0]} rotation={[Math.PI/2, 0, 0]}>
      <planeBufferGeometry args={[60, 60, 1, 1]}/>
      <meshPhongMaterial map={texture}  side={2}/>
    </mesh>
  )
}




// function Box(props) {
//   // This reference will give us direct access to the mesh
//   const mesh = useRef()
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false)
//   const [active, setActive] = useState(false)
//   // Rotate mesh every frame, this is outside of React without overhead
//   useFrame(() => {
//     // mesh.current.rotation.x = mesh.current.rotation.y += 0.01

//     if (pos168  != [0, 0, 0]){
//       mesh.current.position.x = 8*(pos168[0]/640) - 4
//       mesh.current.position.y = -6*(pos168[1]/480) + 3
//       mesh.current.position.z = 0

//       // var faceWidth = pos127[0] - pos356[0]
//       // var RightPartWidth = pos356[0] - pos168[0]

//       // var faceHeight = pos10[0] - pos152[0]
//       // var TopPartHeight = pos168[0] - pos10[0]


//       mesh.current.rotation.x = 0
//       // mesh.current.rotation.y = 0.5 * Math.PI * ((RightPartWidth/faceWidth) + 0.5)
//       mesh.current.rotation.y = 0
//       mesh.current.rotation.z = 0
//     }else{
//       mesh.current.position.x = 0
//       mesh.current.position.y = 0
//       mesh.current.position.z = 0

//       mesh.current.rotation.x = 0
//       mesh.current.rotation.y = 0
//       mesh.current.rotation.z = 0
//     }

//     // console.log(mesh.current.rotation.x)


//   })
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//       onClick={(e) => setActive(!active)}
//       onPointerOver={(e) => setHover(true)}
//       onPointerOut={(e) => setHover(false)}>
//       <boxBufferGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
//     </mesh>
//   )
// }




export default function App() {
  const mouse = useRef({ x: 0, y: 0 })
  const d = 8.25

  const webcamRef = React.useRef(null);
  const canvasRef = useRef(null);

  runFacemesh(webcamRef, canvasRef);


  return (
    <>
    <div style={{ position: "relative", width:"640px", height:"480px", float:"left", border: "2px solid black" }}>
        <Webcam
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
        />

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
        <Canvas shadowMap pixelRatio={[1, 1.5]} camera={{ position: [0, 0, 5]}}>
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
          {/* <mesh position={[0, 0, -30]}>
            <circleBufferGeometry args={[8, 64]} />
            <meshBasicMaterial color="lightpink" />
          </mesh> */}
          <Suspense fallback={null}>
            <Wall />
          </Suspense>
          <Suspense fallback={null}>
            <Floor />
          </Suspense>
          <Suspense fallback={null}>
            <Stacy 
              position={[0, -16, -5]} 
              scale={[10, 10 , 10]} />
          </Suspense>
          {/* <Box position={[0, 0, 0]} /> */}
        </Canvas>

    </div>

    </>

  )
}
