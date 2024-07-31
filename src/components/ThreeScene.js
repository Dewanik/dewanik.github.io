// components/ThreeScene.js
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

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
  const positions = {
    about: [3, 4, 0],
    contact: [3, 3, 0],
    privacy: [3, 2, 0],
  };

  return (
    <>
      {visible && (
        <>
          <Text position={positions.about} fontSize={0.5} color="white">
            <a href="#about" style={{ color: 'white' }}>About</a>
          </Text>
          <Text position={positions.contact} fontSize={0.5} color="white">
            <a href="#contact" style={{ color: 'white' }}>Contact</a>
          </Text>
          <Text position={positions.privacy} fontSize={0.5} color="white">
            <a href="#privacy" style={{ color: 'white' }}>Privacy Policy</a>
          </Text>
        </>
      )}
    </>
  );
};

const TorchEffect = ({ setVisible }) => {
  const torchRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (torchRef.current) {
      torchRef.current.position.x = mouse.x * 10;
      torchRef.current.position.y = -mouse.y * 10;

      const distance = Math.hypot(torchRef.current.position.x - 5, torchRef.current.position.y + 5);
      setVisible(distance < 5);
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
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

const ThreeScene = () => {
  const [rotateText, setRotateText] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }}>
        <Scene rotateText={rotateText} setVisible={setVisible} />
        <InteractiveLinks visible={visible} />
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
    </>
  );
};

export default ThreeScene;
