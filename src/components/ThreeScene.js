// components/ThreeScene.js
"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

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

const JungleBackground = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <boxGeometry args={[100, 100, 1]} />
      <meshBasicMaterial attach="material" color="green" />
    </mesh>
  );
};

const CircularViewport = () => {
  const { scene, gl, size, mouse } = useThree();
  const secondaryCameraRef = useRef();

  useFrame(() => {
    if (secondaryCameraRef.current) {
      // Move the secondary camera with the mouse
      secondaryCameraRef.current.position.x = mouse.x * 20;
      secondaryCameraRef.current.position.y = mouse.y * 20;
      secondaryCameraRef.current.lookAt(new THREE.Vector3(mouse.x * 20, mouse.y * 20, 0));

      // Render secondary camera view in a circular viewport
      gl.autoClear = false;
      gl.clearDepth();

      const viewportSize = 150;
      const viewportX = size.width - viewportSize - 20; // Fixed position in bottom right corner
      const viewportY = size.height - viewportSize - 20;

      gl.setScissorTest(true);
      gl.setScissor(viewportX, viewportY, viewportSize, viewportSize);
      gl.setViewport(viewportX, viewportY, viewportSize, viewportSize);
      
      // Use stencil buffer to create circular viewport
      const stencilBuffer = new Uint8Array(viewportSize * viewportSize * 4);
      gl.readPixels(viewportX, viewportY, viewportSize, viewportSize, gl.RGBA, gl.UNSIGNED_BYTE, stencilBuffer);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

      gl.enable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
      gl.colorMask(false, false, false, false);
      gl.depthMask(false);
      
      gl.drawPixels(stencilBuffer, viewportSize, viewportSize, viewportX, viewportY);

      gl.colorMask(true, true, true, true);
      gl.depthMask(true);
      gl.stencilFunc(gl.EQUAL, 1, 0xFF);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

      gl.render(scene, secondaryCameraRef.current);
      
      gl.disable(gl.STENCIL_TEST);
      gl.setScissorTest(false);
      gl.autoClear = true;
    }
  });

  return <perspectiveCamera ref={secondaryCameraRef} fov={10} aspect={1} position={[0, 0, 10]} />;
};

const ThreeScene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #ff7e5f, #feb47b)' }} camera={{ position: [0, 0, 50], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <JungleBackground />
      <RotatingText />
      <CircularViewport />
    </Canvas>
  );
};

export default ThreeScene;
