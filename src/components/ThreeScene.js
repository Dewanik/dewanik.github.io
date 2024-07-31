// components/ThreeScene.js
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import './ThreeScene.css'; // Import the CSS file for styling

const GlowingText = ({ children, position, fontSize }) => {
  const textRef = useRef();

  useEffect(() => {
    if (textRef.current) {
      textRef.current.material = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { type: 'c', value: new THREE.Color('white') },
          viewVector: { type: 'v3', value: new THREE.Vector3(0, 0, 100) },
        },
        vertexShader: `
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(0.8 - dot(vNormal, vNormel), 6.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec4 color = vec4(glowColor, 1.0);
            color.a = intensity;
            gl_FragColor = color;
          }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
    }
  }, []);

  return (
    <Text
      ref={textRef}
      fontSize={fontSize}
      position={position}
      anchorX="center"
      anchorY="middle">
      {children}
    </Text>
  );
};

const RotatingText = ({ rotate }) => {
  const textRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (textRef.current) {
      if (rotate) {
        textRef.current.rotation.y += 0.01;
      }
      textRef.current.rotation.y = mouse.x * 0.1;
      textRef.current.rotation.x = -mouse.y * 0.1;
    }
  });

  return (
    <GlowingText
      ref={textRef}
      fontSize={1}
      position={[0, 0, 0]}
      anchorX="center"
      anchorY="middle">
      Yantra Inc,{"\n"}
      Software company of{"\n"}
      Birtamode, Jhapa
    </GlowingText>
  );
};

const InteractiveLinks = ({ positions }) => {
  return (
    <div className="links-container">
      <a href="#about" className="link" style={{ opacity: positions.about.opacity }}>
        About
      </a>
      <a href="#contact" className="link" style={{ opacity: positions.contact.opacity }}>
        Contact
      </a>
      <a href="#privacy" className="link" style={{ opacity: positions.privacy.opacity }}>
        Privacy Policy
      </a>
    </div>
  );
};

const TorchEffect = ({ positions, setPositions }) => {
  const torchRef = useRef();
  const { mouse, size } = useThree();

  useFrame(() => {
    if (torchRef.current) {
      const x = (mouse.x * size.width) / 2;
      const y = (mouse.y * size.height) / 2;
      torchRef.current.style.transform = `translate(${x}px, ${y}px)`;

      const aboutDistance = Math.hypot(x - size.width + 100, y - 50);
      const contactDistance = Math.hypot(x - size.width + 100, y - 100);
      const privacyDistance = Math.hypot(x - size.width + 100, y - 150);

      setPositions({
        about: { ...positions.about, opacity: aboutDistance < 150 ? 1 : 0 },
        contact: { ...positions.contact, opacity: contactDistance < 150 ? 1 : 0 },
        privacy: { ...positions.privacy, opacity: privacyDistance < 150 ? 1 : 0 }
      });
    }
  });

  return <div ref={torchRef} className="torch"></div>;
};

const Scene = ({ rotateText, setPositions, positions }) => {
  return (
    <>
      <TorchEffect positions={positions} setPositions={setPositions} />
      <RotatingText rotate={rotateText} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

const ThreeScene = () => {
  const [rotateText, setRotateText] = useState(false);
  const [positions, setPositions] = useState({
    about: { opacity: 0 },
    contact: { opacity: 0 },
    privacy: { opacity: 0 }
  });

  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh', background: '#000000', cursor: 'none' }}>
        <Scene rotateText={rotateText} setPositions={setPositions} positions={positions} />
      </Canvas>
      <button
        onClick={() => setRotateText(!rotateText)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px',
          background: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Rotate Text
      </button>
      <InteractiveLinks positions={positions} />
    </>
  );
};

export default ThreeScene;
