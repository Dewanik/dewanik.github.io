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

const InteractiveLinks = ({ visible }) => {
  return (
    <group position={[4, 3.5, 0]}>
      <Html position={[0, 0.5, 0]}>
        <a href="#about" style={{ color: 'white', fontSize: '20px', opacity: visible.about ? 1 : 0 }}>
          About
        </a>
      </Html>
      <Html position={[0, 0, 0]}>
        <a href="#contact" style={{ color: 'white', fontSize: '20px', opacity: visible.contact ? 1 : 0 }}>
          Contact
        </a>
      </Html>
      <Html position={[0, -0.5, 0]}>
        <a href="#privacy" style={{ color: 'white', fontSize: '20px', opacity: visible.privacy ? 1 : 0 }}>
          Privacy Policy
        </a>
      </Html>
    </group>
  );
};

const TorchEffect = ({ setVisible }) => {
  const torchRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (torchRef.current) {
      torchRef.current.position.x = mouse.x * 10;
      torchRef.current.position.y = -mouse.y * 10;

      const aboutDistance = Math.hypot(torchRef.current.position.x - 4, torchRef.current.position.y - 3.5);
      const contactDistance = Math.hypot(torchRef.current.position.x - 4, torchRef.current.position.y - 3);
      const privacyDistance = Math.hypot(torchRef.current.position.x - 4, torchRef.current.position.y - 2.5);

      setVisible({
        about: aboutDistance < 1.5,
        contact: contactDistance < 1.5,
        privacy: privacyDistance < 1.5
      });
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

const Scene = ({ rotateText, setVisible }) => {
  return (
    <>
      <TorchEffect setVisible={setVisible} />
      <RotatingText rotate={rotateText} />
      <InteractiveLinks visible={setVisible} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

const ThreeScene = () => {
  const [rotateText, setRotateText] = useState(false);
  const [visible, setVisible] = useState({ about: false, contact: false, privacy: false });
  const torchRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (torchRef.current) {
        torchRef.current.style.left = `${event.clientX}px`;
        torchRef.current.style.top = `${event.clientY}px`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh', background: '#000000', cursor: 'none' }}>
        <Scene rotateText={rotateText} setVisible={setVisible} />
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
      <div ref={torchRef} className="torch"></div>
    </>
  );
};

export default ThreeScene;
