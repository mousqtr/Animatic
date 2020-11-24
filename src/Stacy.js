import * as THREE from "three";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import { getCoordinates } from "./utilities";

function moveJoint(joint, Rx, Ry, Rz){
  joint.rotation.x = Rx
  joint.rotation.y = Ry
  joint.rotation.z = Rz
}

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
    // moveJoint(nodes.mixamorigNeck, 0, Math.PI/2, 0)
    // var pos127 = localStorage.getItem("pos127")
    // var pos356 = localStorage.getItem("pos356")
    let pos127 = getCoordinates(127)
    let pos356 = getCoordinates(356)
    let pos168 = getCoordinates(168)

    let topSectionWidth = pos356[1] - pos168[1]
    console.log(topSectionWidth)
    let Rx_neck = -Math.PI/4

    let faceWidth = pos127[0] - pos356[0]
    let RightPartWidth = pos356[0] - pos168[0]
    let Ry_neck = 0.5 * Math.PI * ((RightPartWidth/faceWidth) + 0.5)
    

    moveJoint(nodes.mixamorigNeck, Rx_neck, Ry_neck, 0)
    moveJoint(nodes.mixamorigSpine, 0, 0, 0)
  })

  return (
    // dispose={null} to bail out of recursive dispose here to keep the geometry
    // without this it destroys the material and the buffergeometry on unmount
    // this is a react-three-fiber@beta feature
    <group ref={group} {...props} dispose={null}>
      <object3D
        name="Stacy"
        rotation={[1.5707964611537577, 0, 0]}
        scale={[
          0.009999999776482582,
          0.009999999776482582,
          0.009999999776482582
        ]}
      >
        <primitive object={nodes["mixamorigHips"]} />
        <skinnedMesh
          name="stacy"
          rotation={[-1.5707964611537577, 0, 0]}
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
