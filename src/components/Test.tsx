import { Canvas } from '@react-three/fiber/native';
import React from 'react';

export const Test = () => {
    return (
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <mesh >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="hotpink" transparent />
        </mesh>
    </Canvas>
    );
};
