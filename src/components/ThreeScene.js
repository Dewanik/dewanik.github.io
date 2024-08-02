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

const SpotlightWithTarget = () => {
  const spotlightRef = useRef();
  const spotlightTargetRef = useRef(new THREE.Object3D());
  const { scene, camera } = useThree();

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
      spotlightTargetRef.current.position.copy(camera.position);
    }
  });

  return (
    <>
      <spotLight
        ref={spotlightRef}
        position={[0, 0, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        castShadow
      />
    </>
  );
};

const ClickableBox = ({ position, label, onMouseDown, onMouseUp }) => {
  const boxRef = useRef();
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (boxRef.current) {
      boxRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <mesh
      ref={boxRef}
      position={position}
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </mesh>
  );
};

const ThreeScene = () => {
  const isMousePressed = useRef(false);

  const handleMouseDown = () => {
    isMousePressed.current = true;
  };

  const handleMouseUp = () => {
    isMousePressed.current = false;
  };

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
      <SpotlightWithTarget />
      <ClickableBox
        position={[-5, 2, 0]}
        label="About"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <ClickableBox
        position={[0, -2, 0]}
        label="Contact"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <ClickableBox
        position={[5, 2, 0]}
        label="Projects"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <ClickableBox
        position={[10, -2, 0]}
        label="Policy"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <Text
        fontSize={0.3}
        color="white"
        position={[0, 3, 0]}
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
