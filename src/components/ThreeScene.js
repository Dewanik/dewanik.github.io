// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CameraControls = ({ direction }) => {
  const { camera } = useThree();
  const speed = 0.1;

  useFrame(() => {
    if (direction.forward) camera.position.z -= speed;
    if (direction.backward) camera.position.z += speed;
    if (direction.left) camera.position.x -= speed;
    if (direction.right) camera.position.x += speed;
  });

  return null;
};

const RandomBox = ({ position, label, onClick }) => {
  const boxRef = useRef();
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (boxRef.current) {
      boxRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <mesh ref={boxRef} position={position} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      {label && (
        <Text
          position={[0, 0, 0.6]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </mesh>
  );
};

const ControllerInterface = ({ onDirectionChange }) => {
  const buttonStyle = {
    width: '50px',
    height: '50px',
    fontSize: '24px',
    margin: '5px',
    textAlign: 'center',
    lineHeight: '50px',
    cursor: 'pointer',
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={buttonStyle}
          onMouseDown={() => onDirectionChange('forward', true)}
          onMouseUp={() => onDirectionChange('forward', false)}
          onTouchStart={() => onDirectionChange('forward', true)}
          onTouchEnd={() => onDirectionChange('forward', false)}
        >
          ↑
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={buttonStyle}
            onMouseDown={() => onDirectionChange('left', true)}
            onMouseUp={() => onDirectionChange('left', false)}
            onTouchStart={() => onDirectionChange('left', true)}
            onTouchEnd={() => onDirectionChange('left', false)}
          >
            ←
          </div>
          <div
            style={buttonStyle}
            onMouseDown={() => onDirectionChange('right', true)}
            onMouseUp={() => onDirectionChange('right', false)}
            onTouchStart={() => onDirectionChange('right', true)}
            onTouchEnd={() => onDirectionChange('right', false)}
          >
            →
          </div>
        </div>
        <div
          style={buttonStyle}
          onMouseDown={() => onDirectionChange('backward', true)}
          onMouseUp={() => onDirectionChange('backward', false)}
          onTouchStart={() => onDirectionChange('backward', true)}
          onTouchEnd={() => onDirectionChange('backward', false)}
        >
          ↓
        </div>
      </div>
    </div>
  );
};

const ThreeScene = () => {
  const [direction, setDirection] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const handleDirectionChange = (dir, state) => {
    setDirection((prev) => ({ ...prev, [dir]: state }));
  };

  const handleClick = (label) => {
    alert(`Clicked on ${label}`);
  };

  const labeledPositions = [
    [-3, 1, -5],
    [3, -1, -10],
    [-1, -2, -15],
    [1, 2, -20],
  ];

  const labels = [
    "About",
    "Contact",
    "Projects",
    "Policy",
  ];

  const randomPositions = [
    [-5, 1, -5],
    [3, -1, -10],
    [-10, -2, -15],
    [7, 2, -20],
    [5, -3, -25],
    [-15, 3, -30],
    [10, 1, -35],
    [0, 0, -40],
  ];

  return (
    <>
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Canvas style={{ borderRadius: '50%' }} camera={{ position: [0, 1, 5], fov: 10 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />
          <CameraControls direction={direction} />
          {randomPositions.map((position, index) => (
            <RandomBox key={index} position={position} />
          ))}
          {labeledPositions.map((position, index) => (
            <RandomBox key={index} position={position} label={labels[index]} onClick={() => handleClick(labels[index])} />
          ))}
          <Text
            fontSize={0.5}
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
      </div>
      <ControllerInterface onDirectionChange={handleDirectionChange} />
    </>
  );
};

export default ThreeScene;
