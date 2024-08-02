// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CameraControls = ({ isMousePressed }) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const smoothness = 0.05;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isMousePressed.current) {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMousePressed]);

  useFrame(() => {
    targetRotation.current.y = mouse.current.x * Math.PI * 0.1;
    targetRotation.current.x = mouse.current.y * Math.PI * 0.1;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * smoothness;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * smoothness;
  });

  return null;
};

const LightedText = ({ position, label, onMouseEnter, onMouseLeave }) => {
  const textRef = useRef();
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
    >
      {label}
    </Text>
  );
};

const ThreeScene = () => {
  const isMousePressed = useRef(false);
  const [hoveredText, setHoveredText] = useState(null);

  const handleMouseEnter = (label) => {
    setHoveredText(label);
    isMousePressed.current = true;
  };

  const handleMouseLeave = () => {
    setHoveredText(null);
    isMousePressed.current = false;
  };

  const textPositions = [
    [-3, 1, 0],
    [3, -1, 0],
    [-1, -3, 0],
    [1, 3, 0],
  ];

  const labels = [
    "About",
    "Contact",
    "Projects",
    "Policy",
  ];

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 3, 10], fov: 15 }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />
      <pointLight position={[10, -10, 10]} intensity={1} color="red" />
      <pointLight position={[-10, 10, -10]} intensity={1} color="green" />
      <CameraControls isMousePressed={isMousePressed} />
      {textPositions.map((position, index) => (
        <LightedText
          key={index}
          position={position}
          label={labels[index]}
          onMouseEnter={() => handleMouseEnter(labels[index])}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      <Text
        fontSize={0.5}
        color="white"
        position={[0, 0, 0]}
        anchorX="center"
        anchorY="middle"
      >
        Yantra Inc,
        Software Company of
        Birtamode, Jhapa, NP
      </Text>
    </Canvas>
  );
};

export default ThreeScene;
