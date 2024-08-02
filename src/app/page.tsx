// pages/index.js
"use client";

import ThreeScene from "../three/ThreeScene"; // Updated path

export default function Home() {
  return (
    <div>
      <main style={{ margin: 0, padding: 0 }}>
        <ThreeScene />
      </main>
    </div>
  );
}
