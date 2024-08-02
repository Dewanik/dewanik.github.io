// components/ThreeScene.js
"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Extend to use non-standard Three.js objects
extend(THREE);

const RotatingText = () => {
  const textRef = useRef();

  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={1}
      color="white"
      position={[0, 0, 0]}
      anchorX="center"
      anchorY="middle"
      maxWidth={10}
      textAlign="center">
      {"Yantra Inc,\nSoftware Company of\nBirtamode, Jhapa, NP"}
    </Text>
  );
};

const Background = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial attach="material" color="purple" />
    </mesh>
  );
};

const CircularViewport = () => {
  const { scene, gl, size, mouse } = useThree();
  const secondaryCameraRef = useRef();

  useFrame(() => {
    if (secondaryCameraRef.current) {
      // Move the secondary camera with the mouse
      secondaryCameraRef.current.position.x = mouse.x * 10;
      secondaryCameraRef.current.position.y = mouse.y * 10;
      secondaryCameraRef.current.lookAt(new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0));

      // Render secondary camera view in a circular viewport
      gl.autoClear = false;
      gl.clearDepth();

      const viewportSize = 200;
      const viewportX = size.width - viewportSize - 20; // Fixed position in bottom right corner
      const viewportY = size.height - viewportSize - 20;

      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = viewportSize;
      maskCanvas.height = viewportSize;
      const maskContext = maskCanvas.getContext('2d');
      maskContext.beginPath();
      maskContext.arc(viewportSize / 2, viewportSize / 2, viewportSize / 2, 0, Math.PI * 2);
      maskContext.closePath();
      maskContext.fill();

      gl.setScissorTest(true);
      gl.setScissor(viewportX, viewportY, viewportSize, viewportSize);
      gl.setViewport(viewportX, viewportY, viewportSize, viewportSize);
      gl.render(scene, secondaryCameraRef.current);
      gl.setScissorTest(false);
      gl.autoClear = true;
    }
  });

  return <perspectiveCamera ref={secondaryCameraRef} fov={10} aspect={1} position={[0, 0, 10]} />;
};

const ThreeScene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #ff7e5f, #feb47b)' }} camera={{ position: [0, 0, 15], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Background />
      <RotatingText />
      <CircularViewport />
    </Canvas>
  );
};

export default ThreeScene;
