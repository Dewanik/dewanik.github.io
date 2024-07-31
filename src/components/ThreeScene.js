// components/ThreeScene.js
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Html } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import * as THREE from 'three';
import './ThreeScene.css'; // Import the CSS file for styling

const RotatingText = () => {
  const textRef = useRef();
  const font = new FontLoader().parse(require('./helvetiker_regular.typeface.json')); // Load your font file

  useFrame(() => {
    if (textRef.current) {
      textRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Text3D
      ref={textRef}
      font={font}
      size={1}
      height={0.2}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.04}
      bevelSegments={5}
      position={[0, 0, 0]}
      anchorX="center"
      anchorY="middle"
    >
      {"Yantra Inc,\nSoftware company from,\nBirtamode Nepal"}
      <meshStandardMaterial attach="material" color="white" />
    </Text3D>
  );
};

const InteractiveLinks = ({ visible }) => {
  return (
    <>
      <Html position={[3, 3.5, 0]}>
        <div style={{ opacity: visible.about ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
          <a href="#about" className="link">About</a>
        </div>
      </Html>
      <Html position={[3, 2.5, 0]}>
        <div style={{ opacity: visible.contact ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
          <a href="#contact" className="link">Contact</a>
        </div>
      </Html>
      <Html position={[3, 1.5, 0]}>
        <div style={{ opacity: visible.privacy ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
          <a href="#privacy" className="link">Privacy Policy</a>
        </div>
      </Html>
    </>
  );
};

const Scene = ({ setVisible, visible }) => {
  const { size, mouse } = useThree();

  useFrame(() => {
    const x = mouse.x * (size.width / 2) + size.width / 2;
    const y = -mouse.y * (size.height / 2) + size.height / 2;

    const aboutDistance = Math.hypot(x - size.width + 60, y - 60);
    const contactDistance = Math.hypot(x - size.width + 60, y - 110);
    const privacyDistance = Math.hypot(x - size.width + 60, y - 160);

    setVisible({
      about: aboutDistance < 150,
      contact: contactDistance < 150,
      privacy: privacyDistance < 150,
    });

    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    }
  });

  return (
    <>
      <RotatingText />
      <InteractiveLinks visible={visible} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

const ThreeScene = () => {
  const [visible, setVisible] = useState({ about: false, contact: false, privacy: false });

  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    return () => {
      document.body.removeChild(cursor);
    };
  }, []);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh', background: '#000000', cursor: 'none' }}>
        <Scene setVisible={setVisible} visible={visible} />
      </Canvas>
    </>
  );
};

export default ThreeScene;
