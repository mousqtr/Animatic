import * as THREE from "three";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import { getFaceCoordinates } from "./FaceDetection";
import { getPoseCoordinates } from "./PoseDetection";


function moveJoint(joint, Rx, Ry, Rz){
  joint.rotation.x = Rx
  joint.rotation.y = Ry
  joint.rotation.z = Rz
}


function find_angle(A,B,C) {
  var AB = Math.sqrt(Math.pow(B[0]-A[0],2)+ Math.pow(B[1]-A[1],2));    
  var BC = Math.sqrt(Math.pow(B[0]-C[0],2)+ Math.pow(B[1]-C[1],2)); 
  var AC = Math.sqrt(Math.pow(C[0]-A[0],2)+ Math.pow(C[1]-A[1],2));
  return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

let Ry_neck = 0;

export default function Stacy(props) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, "/stacy.glb");
  const { nodes, animations } = useLoader(GLTFLoader, "/stacy.glb")

  const texture = useLoader(TextureLoader, "/stacy.jpg");
  const actions = useRef();
  const [mixer] = useState(() => new THREE.AnimationMixer());

  useEffect(() => {
    actions.current = { idle: mixer.clipAction(animations[8], group.current) }
    actions.current.idle.play()
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])

  useFrame((state, delta) => {
    mixer.update(delta)

    //Get Face coordinates
    let pos10 = getFaceCoordinates(10)
    let pos152 = getFaceCoordinates(152)

    let alpha = (pos152[1] -  pos10[1])/480
    // let zMax = 0
    // let zMin = -40
    let zMax = 200
    let zMin = -200
    let Pz = (zMax - zMin)* alpha + zMin
    nodes["mixamorigHips"].position.y = Pz;
    nodes["mixamorigHips"].position.x = 0;
    nodes["mixamorigHips"].position.z = -270;
    // console.log(alpha)

    //Get Face coordinates
    let pos127 = getFaceCoordinates(127)
    let pos356 = getFaceCoordinates(356)
    let pos168 = getFaceCoordinates(168)

    //Face Vertical rotation
    let topSectionWidth = pos356[1] - pos168[1]
    // console.log(topSectionWidth)
    let Rx_neck = 0

    //Face lateral rotation
    let faceWidth = pos127[0] - pos356[0]
    let RightPartWidth = pos356[0] - pos168[0]
    if (faceWidth !== 0){
      Ry_neck = 0.5 * Math.PI * ((RightPartWidth/faceWidth) + 0.5)
    }
    
    //Update Face joints
    moveJoint(nodes.mixamorigNeck, Rx_neck, Ry_neck, 0)
    moveJoint(nodes.mixamorigSpine, 0, 0, 0)

    //Get Pose coordinates
    let pos5 = getFaceCoordinates(5)
    let pos6 = getFaceCoordinates(6)
    let pos8 = getFaceCoordinates(8)
    // console.log(pos5, pos6, pos8)
    if ((pos5 !== undefined) && (pos6 !== undefined) && (pos8 !== undefined)){
      // console.log(find_angle(pos5, pos6, pos8))
    }
    
    nodes["mixamorigHips"].scale.x = 1;
    nodes["mixamorigHips"].scale.y = 1;
    nodes["mixamorigHips"].scale.z = 1;



    


  })

  return (
    // dispose={null} to bail out of recursive dispose here to keep the geometry
    // without this it destroys the material and the buffergeometry on unmount
    // this is a react-three-fiber@beta feature
    <group ref={group} {...props} dispose={null}>
      <object3D
        name="Stacy"
        rotation={[Math.PI/2, 0, 0]}
        scale={[
          0.009999999776482582,
          0.009999999776482582,
          0.009999999776482582
        ]}
      >
        <primitive object={nodes["mixamorigHips"]} />
        <skinnedMesh
          name="stacy"
          rotation={[-Math.PI/2, 0, 0]}
          scale={[100, 100, 99.9999771118164]}
          skeleton={nodes["stacy"].skeleton}
        >
          <bufferGeometry attach="geometry" {...nodes["stacy"].geometry} />
          <meshPhongMaterial map={texture} map-flipY={false} skinning />
        </skinnedMesh>
      </object3D>
    </group>
  );
}
