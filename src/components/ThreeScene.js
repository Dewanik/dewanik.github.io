// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

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
  return (
    <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RotatingText />
    </Canvas>
  );
};

export default ThreeScene;
