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
      fontSize={3}
      color="white"
      position={[0, 0, 0]}
      anchorX="center"
      anchorY="middle">
      Yantra Inc
    </Text>
  );
};

const FlashlightEffect = () => {
  const { scene, gl, size, mouse } = useThree();
  const secondaryCameraRef = useRef();

  useEffect(() => {
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(0, 0, 10);
    spotlight.angle = 0.3;
    spotlight.penumbra = 0.5;
    spotlight.castShadow = true;
    scene.add(spotlight);

    const spotlightTarget = new THREE.Object3D();
    scene.add(spotlightTarget);
    spotlight.target = spotlightTarget;
  }, [scene]);

  useFrame(() => {
    // Move the secondary camera with the mouse
    if (secondaryCameraRef.current) {
      secondaryCameraRef.current.position.x = mouse.x * 10;
      secondaryCameraRef.current.position.y = mouse.y * 10;
      secondaryCameraRef.current.lookAt(new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0)); // Ensure the camera looks at the mouse position

      // Render secondary camera view
      gl.autoClear = false;
      gl.clearDepth();
      const viewportWidth = 150; // Smaller viewport width
      const viewportHeight = 150; // Smaller viewport height
      const viewportX = (mouse.x + 1) * 0.5 * (size.width - viewportWidth);
      const viewportY = (1 - (mouse.y + 1) * 0.5) * (size.height - viewportHeight);

      gl.setScissorTest(true);
      gl.setScissor(viewportX, viewportY, viewportWidth, viewportHeight);
      gl.setViewport(viewportX, viewportY, viewportWidth, viewportHeight);
      gl.render(scene, secondaryCameraRef.current);
      gl.setScissorTest(false);
      gl.autoClear = true;
    }
  });

  return <perspectiveCamera ref={secondaryCameraRef} fov={30} aspect={1} position={[0, 0, 10]} />;
};

const ThreeScene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', background: '#000000' }} camera={{ position: [0, 0, 15], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RotatingText />
      <FlashlightEffect />
    </Canvas>
  );
};

export default ThreeScene;
