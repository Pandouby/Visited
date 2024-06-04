import { Canvas } from '@react-three/fiber';
import React from 'react';

export const Test = () => {
    return (
        <Canvas>
     <mesh>
                <hemisphereLight intensity={30} groundColor="black" />
                <spotLight
                    position={[-20, 50, 10]}
                    angle={0.12}
                    penumbra={1}
                    intensity={1}
                    castShadow
                    shadow-mapSize={1024}
                />
                <pointLight intensity={1} />
            </mesh>
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  </Canvas>
    );
};
