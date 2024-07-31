// pages/index.js
"use client";

import Head from 'next/head';
import ThreeScene from './components/ThreeScene';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next.js with Three.js</title>
        <meta name="description" content="A simple landing page with Next.js and Three.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={{ position: 'absolute', top: 0, width: '100%', padding: '10px 20px', background: 'rgba(255, 255, 255, 0.8)', zIndex: 10 }}>
        <h1>My 3D Landing Page</h1>
      </header>

      <main style={{ margin: 0, padding: 0 }}>
        <ThreeScene />
      </main>
    </div>
  );
}
