// components/ThreeScene.js
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const GlowingText = ({ children, position }) => {
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
      fontSize={1}
      color="white"
      position={position}
      anchorX="center"
      anchorY="middle">
      {children}
    </Text>
  );
};

const RotatingText = ({ onRotate }) => {
  const textRef = useRef();
  const { mouse } = useThree();
  const [fontSize, setFontSize] = useState(1);
  const [rotationMultiplier, setRotationMultiplier] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  // Adjust font size based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize(0.5); // Smaller font size for mobile
        setRotationMultiplier(1); // Less sensitive rotation for mobile
      } else {
        setFontSize(1); // Default font size for desktop
        setRotationMultiplier(2); // Default rotation sensitivity for desktop
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useFrame(() => {
    if (textRef.current && isHovered) {
      textRef.current.rotation.y = mouse.x * rotationMultiplier;
      textRef.current.rotation.x = -mouse.y * rotationMultiplier;
    }
  });

  return (
    <GlowingText
      ref={textRef}
      fontSize={fontSize}
      position={[0, 0, 0]}
      anchorX="center"
      anchorY="middle"
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}>
      Yantra Inc,{"\n"}
      Software company of{"\n"}
      Birtamode, Jhapa
    </GlowingText>
  );
};

const InteractiveText = ({ position, children, link, visible }) => {
  return (
    <group>
      {visible && (
        <Html>
          <a href={link} style={{ color: 'white', position: 'absolute' }}>
            {children}
          </a>
        </Html>
      )}
      <Text
        fontSize={1}
        color={visible ? "white" : "black"} // Hide text if not visible
        position={position}
        anchorX="center"
        anchorY="middle">
        {children}
      </Text>
    </group>
  );
};

const TorchEffect = () => {
  const torchRef = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (torchRef.current) {
      torchRef.current.position.x = mouse.x * 10;
      torchRef.current.position.y = -mouse.y * 10;
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

const Scene = ({ rotateText, setRotateText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { mouse } = useThree();

  useFrame(() => {
    const distance = Math.hypot(mouse.x * 10 - 5, mouse.y * 10 + 5);
    setIsVisible(distance < 2); // Adjust the radius of the torch effect
  });

  return (
    <>
      <TorchEffect />
      <RotatingText onRotate={rotateText} />
      <InteractiveText position={[4, 4, 0]} link="#about" visible={isVisible}>About</InteractiveText>
      <InteractiveText position={[4, 3, 0]} link="#contact" visible={isVisible}>Contact</InteractiveText>
      <InteractiveText position={[4, 2, 0]} link="#privacy" visible={isVisible}>Privacy Policy</InteractiveText>
    </>
  );
};

const ThreeScene = () => {
  const [rotateText, setRotateText] = useState(false);

  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene rotateText={rotateText} setRotateText={setRotateText} />
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
