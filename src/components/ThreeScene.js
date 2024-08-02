// components/ThreeScene.js
"use client";

import React, { useRef, useEffect } from 'react';
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
  const secondaryCameraRef = useRef();

  useEffect(() => {
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(0, 0, 10);
    spotlight.angle = 0.3;
    spotlight.penumbra = 0.5;
    spotlight.castShadow = true;
    scene.add(spotlight);
    spotlightRef.current = spotlight;

    const spotlightTarget = new THREE.Object3D();
    scene.add(spotlightTarget);
    spotlight.target = spotlightTarget;
  }, [scene]);

  useFrame(() => {
    // Move the secondary camera with the mouse
    if (secondaryCameraRef.current) {
      secondaryCameraRef.current.position.x = mouse.x * 10;
      secondaryCameraRef.current.position.y = mouse.y * 10;
      secondaryCameraRef.current.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure the camera looks at the center

      // Move spotlight target with the mouse
      if (spotlightRef.current) {
        spotlightRef.current.target.position.x = mouse.x * 10;
        spotlightRef.current.target.position.y = mouse.y * 10;
      }

      // Render secondary camera view
      gl.autoClear = false;
      gl.clearDepth();
      const viewportWidth = 150; // Smaller viewport width
      const viewportHeight = 150; // Smaller viewport height
      const viewportX = (mouse.x + 1) * 0.5 * (size.width - viewportWidth);
      const viewportY = (1 - (mouse.y + 1) * 0.5) * (size.height - viewportHeight);

      gl.setScissorTest(true);
      gl.setScissor(viewportX, viewportY, viewportWidth, viewportHeight);
      gl.setViewport(viewportX, viewportY, viewportWidth, viewportHeight);
      gl.render(scene, secondaryCameraRef.current);
      gl.setScissorTest(false);
      gl.autoClear = true;
    }
  });

  return <perspectiveCamera ref={secondaryCameraRef} fov={10} aspect={1} position={[0, 0, 10]} />;
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
      <ambientLight intensity={0.5} />
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
