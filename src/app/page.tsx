// pages/index.js
"use client";

import Head from 'next/head';
import ThreeScene from '../components/ThreeScene'; // Updated path

export default function Home() {
  return (
    <div>
      <Head>
        <title>Yantra Inc</title>
        <meta name="description" content="A simple landing page with Next.js and Three.js of Yantra Inc, Software Company from Birtamode, Jhapa, Nepal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

  

      <main style={{ margin: 0, padding: 0 }}>
        <ThreeScene />
      </main>
    </div>
  );
}
