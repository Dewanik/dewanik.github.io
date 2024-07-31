// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';

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

const InteractiveText = ({ position, children, link }) => {
  const textRef = useRef();
  const { mouse } = useThree();
  const [visible, setVisible] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      const distance = Math.hypot(
        textRef.current.position.x - mouse.x * 10,
        textRef.current.position.y + mouse.y * 10
      );
      setVisible(distance < 1.5); // Adjust the radius of the torch effect
    }
  });

  return (
    <group>
      {visible && (
        <Html>
          <a href={link} style={{ color: 'white', position: 'absolute' }}>
            {children}
          </a>
        </Html>
      )}
      <Text
        ref={textRef}
        fontSize={1}
        color={visible ? "white" : "black"} // Hide text if not visible
        position={position}
        anchorX="center"
        anchorY="middle">
        {children}
      </Text>
    </group>
  );
};

const TorchEffect = () => {
  const torchRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (torchRef.current) {
      torchRef.current.position.x = mouse.x * 10;
      torchRef.current.position.y = -mouse.y * 10;
    }
  });

  return (
    <spotLight
      ref={torchRef}
      position={[0, 0, 10]}
      angle={0.3}
      penumbra={1}
      intensity={3}
      castShadow
    />
  );
};

const ThreeScene = () => {
  return (
    <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TorchEffect />
      <RotatingText />
      <InteractiveText position={[-3, 3, 0]} link="#about">About</InteractiveText>
      <InteractiveText position={[3, 3, 0]} link="#contact">Contact</InteractiveText>
      <InteractiveText position={[0, -3, 0]} link="#privacy">Privacy Policy</InteractiveText>
    </Canvas>
  );
};

export default ThreeScene;
