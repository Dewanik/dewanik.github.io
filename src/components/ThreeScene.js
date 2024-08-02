// components/ThreeScene.js
"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

const CameraControls = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    camera.rotation.x = mouse.current.y * Math.PI * 0.1;
    camera.rotation.y = mouse.current.x * Math.PI * 0.1;
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

const RandomBoxes = () => {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={`hsl(${Math.random() * 360}, 100%, 50%)`} />
        </mesh>
      ))}
    </group>
  );
};

const ThreeScene = () => {
  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 0, 10], fov: 25 }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />
      <pointLight position={[10, -10, 10]} intensity={1} color="red" />
      <pointLight position={[-10, 10, -10]} intensity={1} color="green" />
      <CameraControls />
      <SpotlightWithTarget />
      <RandomBoxes />
      <Text
        fontSize={1}
        color="white"
        position={[0, 0, 0]}
        anchorX="center"
        anchorY="middle"
      >
        Yantra Inc,
        Software Company of
        Birtamode, Jhapa, NP
      </Text>
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Canvas>
  );
};

export default ThreeScene;
