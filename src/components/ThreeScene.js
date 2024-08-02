// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const RotatingText = () => {
  const textRef = useRef();
  const [fontSize, setFontSize] = useState(1);

  // Adjust font size based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize(0.5); // Smaller font size for mobile
      } else {
        setFontSize(1); // Default font size for desktop
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
      textRef.current.rotation.y += 0.01;
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

const Spotlight = ({ targetPositions }) => {
  const spotlightRef = useRef();
  const spotlightTargetRef = useRef(new THREE.Object3D());
  const { scene, gl, size, mouse } = useThree();
  const [currentTarget, setCurrentTarget] = useState(0);
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
    const spotlightTarget = spotlightTargetRef.current;
    if (spotlightTarget) {
      const targetPosition = targetPositions[currentTarget];
      spotlightTarget.position.lerp(
        new THREE.Vector3(...targetPosition),
        0.05
      );
    }

    // Move the secondary camera with the mouse
    if (cameraRef.current) {
      cameraRef.current.position.x = mouse.x * 10;
      cameraRef.current.position.y = mouse.y * 10;
      cameraRef.current.lookAt(spotlightTarget.position);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTarget((prevTarget) => (prevTarget + 1) % targetPositions.length);
    }, 2000); // Change target every 2 seconds

    return () => clearInterval(interval);
  }, [targetPositions]);

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
      <Sphere ref={spotlightTargetRef} args={[0.1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial attach="material" color="red" />
      </Sphere>
      <perspectiveCamera ref={cameraRef} fov={75} aspect={1} position={[0, 0, 10]} />
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

  return (
    <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }} camera={{ position: [0, 0, 15], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Spotlight targetPositions={targetPositions} />
      <RotatingText />
    </Canvas>
  );
};

export default ThreeScene;
