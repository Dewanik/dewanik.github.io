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

const MovingText = ({ position, text }) => {
  return (
    <Text
      fontSize={0.5}
      color="white"
      position={position}
      anchorX="center"
      anchorY="middle">
      {text}
    </Text>
  );
};

const Spotlight = () => {
  const spotlightRef = useRef();
  const { scene, gl, size, mouse } = useThree();
  const cameraRef = useRef();

  useEffect(() => {
    if (spotlightRef.current) {
      const spotlight = spotlightRef.current;
      const spotlightTarget = new THREE.Object3D();
      scene.add(spotlightTarget);
      spotlight.target = spotlightTarget;
    }
  }, [scene]);

  useFrame(() => {
    // Move the secondary camera with the mouse
    if (cameraRef.current) {
      cameraRef.current.position.x = mouse.x * 10;
      cameraRef.current.position.y = mouse.y * 10;

      // Update spotlight target position
      const spotlightTarget = spotlightRef.current.target;
      spotlightTarget.position.set(mouse.x * 10, mouse.y * 10, 0);

      // Render secondary camera view
      gl.autoClear = false;
      gl.clearDepth();
      const viewportWidth = 200;
      const viewportHeight = 200;
      const viewportX = mouse.x * (size.width - viewportWidth);
      const viewportY = mouse.y * (size.height - viewportHeight);

      gl.setScissorTest(true);
      gl.setScissor(viewportX, viewportY, viewportWidth, viewportHeight);
      gl.setViewport(viewportX, viewportY, viewportWidth, viewportHeight);
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
      <perspectiveCamera ref={cameraRef} fov={75} aspect={1} position={[0, 0, 10]} />
    </>
  );
};

const ThreeScene = () => {
  const targetPositions = [
    [5, 5, 0], // About
    [-5, 5, 0], // Contact
    [0, -5, 0], // Privacy Policy
    [5, -5, 0], // Home
    [-5, -5, 0], // Services
  ];

  const targetTexts = [
    "About",
    "Contact",
    "Privacy Policy",
    "Home",
    "Services"
  ];

  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: '#000000' }} camera={{ position: [0, 0, 15], fov: 75 }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <MainText />
      <Spotlight />
      {targetTexts.map((text, index) => (
        <MovingText key={index} position={targetPositions[index]} text={text} />
      ))}
    </Canvas>
  );
};

export default ThreeScene;
