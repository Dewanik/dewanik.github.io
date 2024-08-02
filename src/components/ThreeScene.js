// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const MainText = () => {
  return (
    <Text
      fontSize={1}
      color="white"
      position={[0, 0, 0]}
      anchorX="center"
      anchorY="middle">
      Yantra Inc,{"\n"}
      Software company of{"\n"}
      Birtamode, Jhapa
    </Text>
  );
};

const Spotlight = ({ targetPositions, targetTexts }) => {
  const spotlightRef = useRef();
  const spotlightTargetRef = useRef(new THREE.Object3D());
  const { scene, gl, size, mouse } = useThree();
  const cameraRef = useRef();

  useEffect(() => {
    if (spotlightRef.current) {
      const spotlight = spotlightRef.current;
      const spotlightTarget = spotlightTargetRef.current;
      scene.add(spotlightTarget);
      spotlight.target = spotlightTarget;
    }
  }, [scene]);

  useFrame(() => {
    if (spotlightTargetRef.current) {
      spotlightTargetRef.current.position.x = mouse.x * 10;
      spotlightTargetRef.current.position.y = mouse.y * 10;
    }

    // Move the secondary camera with the mouse
    if (cameraRef.current) {
      cameraRef.current.position.x = mouse.x * 10;
      cameraRef.current.position.y = mouse.y * 10;
      cameraRef.current.lookAt(spotlightTargetRef.current.position);

      // Render secondary camera view
      gl.autoClear = false;
      gl.clearDepth();
      gl.setScissorTest(true);
      gl.setScissor(0, 0, size.width, size.height);
      gl.setViewport(0, 0, size.width, size.height);
      gl.render(scene, cameraRef.current);
      gl.setScissorTest(false);
      gl.autoClear = true;
    }
  });

  return (
    <>
      <spotLight
        ref={spotlightRef}
        position={[0, 0, 10]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
      />
      <perspectiveCamera ref={cameraRef} fov={75} aspect={size.width / size.height} position={[0, 0, 10]} />
      {targetTexts.map((text, index) => (
        <Text
          key={index}
          fontSize={0.5}
          color="white"
          position={targetPositions[index]}
          anchorX="center"
          anchorY="middle">
          {text}
        </Text>
      ))}
    </>
  );
};

const ThreeScene = () => {
  // Positions for "about", "contact", "privacy policy" around the page
  const targetPositions = [
    [2, 2, 0], // About
    [-2, 2, 0], // Contact
    [0, -2, 0], // Privacy Policy
  ];

  const targetTexts = [
    "About",
    "Contact",
    "Privacy Policy",
  ];

  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: '#000000' }} camera={{ position: [0, 0, 15], fov: 75 }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <MainText />
      <Spotlight targetPositions={targetPositions} targetTexts={targetTexts} />
    </Canvas>
  );
};

export default ThreeScene;
