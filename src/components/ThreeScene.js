// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const RotatingText = () => {
  const textRef = useRef();
  const { mouse } = useThree();
  const [fontSize, setFontSize] = useState(1);
  const [rotationMultiplier, setRotationMultiplier] = useState(2);

  // Adjust font size based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize(0.5); // Smaller font size for mobile
        setRotationMultiplier(1); // Less sensitive rotation for mobile
      } else {
        setFontSize(1); // Default font size for desktop
        setRotationMultiplier(2); // Default rotation sensitivity for desktop
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.y = mouse.x * rotationMultiplier;
      textRef.current.rotation.x = -mouse.y * rotationMultiplier;
    }
  });

  return (
    <Text
      ref={textRef}
      fontSize={fontSize}
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

const ThreeScene = () => {
  const spotlightRef = useRef();
  const spotlightTargetRef = useRef(new THREE.Object3D());
  const { camera, mouse, scene } = useThree();

  useEffect(() => {
    if (spotlightRef.current) {
      const spotlight = spotlightRef.current;
      const spotlightTarget = spotlightTargetRef.current;
      scene.add(spotlightTarget);
      spotlight.target = spotlightTarget;
    }
  }, [scene]);

  useFrame(() => {
    const spotlightTarget = spotlightTargetRef.current;
    if (spotlightTarget) {
      spotlightTarget.position.set(
        (mouse.x * window.innerWidth) / 2,
        (mouse.y * window.innerHeight) / 2,
        0
      );
    }
  });

  return (
    <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <spotLight
        ref={spotlightRef}
        position={[0, 0, 10]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
      />
      <RotatingText />
    </Canvas>
  );
};

export default ThreeScene;
