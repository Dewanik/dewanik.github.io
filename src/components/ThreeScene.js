// components/ThreeScene.js
"use client";

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useFrame(() => {
    if (controls.current) {
      controls.current.update();
    }
  });

  return (
    <PointerLockControls ref={controls} args={[camera, gl.domElement]} />
  );
};

const SpotlightWithTarget = () => {
  const spotlightRef = useRef();
  const spotlightTargetRef = useRef(new THREE.Object3D());
  const { scene, mouse, camera } = useThree();

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
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      spotlightTargetRef.current.position.copy(pos);
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

const ThreeScene = () => {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CameraControls />
      <SpotlightWithTarget />
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
    </Canvas>
  );
};

export default ThreeScene;
