// components/ThreeScene.js
"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const RotatingText = () => {
  const textRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.y = mouse.x * 2;
      textRef.current.rotation.x = -mouse.y * 2;
    }
  });

  return (
    <Text
      ref={textRef}
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
