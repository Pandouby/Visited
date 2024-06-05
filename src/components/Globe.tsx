import { Line, OrbitControls, Preload } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import countriesJson from '../data/custom.geo.json';

export const Globe = () => {
    const earthTexture = useLoader(
        THREE.TextureLoader,
        'earth_map_10k.jpg',
    );

    const radiusGlobe: number = 4;

    function convertCartesian(point: any) {
        const lambda = (point[0] * Math.PI) / 180,
            phi = (point[1] * Math.PI) / 180,
            cosPhi = Math.cos(phi);
        return new THREE.Vector3(
            radiusGlobe * cosPhi * Math.cos(lambda),
            radiusGlobe * Math.sin(phi),
            -radiusGlobe * cosPhi * Math.sin(lambda),
        );
    }

    const countries: any = countriesJson;

    const verteciesAllCountries: any = [];

    countries.features.forEach((country: any) => {
        if(country.geometry.type === 'Polygon') {    
            const vert: any = [];      
            country.geometry.coordinates[0].forEach((coordinate: any) => {
                vert.push(convertCartesian(coordinate));                
            });
            verteciesAllCountries.push(vert);
        } else if(country.geometry.type === "MultiPolygon") {
            country.geometry.coordinates.forEach((coordinates: any) => {   
                coordinates.forEach((element: any) => {
                    const vert2: any = [];
                    element.forEach((e: any) => {
                        vert2.push(convertCartesian(e));
                    });
                    verteciesAllCountries.push(vert2);
                    // need to clear vert array otherwise there are still all entrys in it
                });
            });
        }
    });

    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.7,
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(verteciesAllCountries[0]);
    const testMat = new THREE.PointsMaterial({ color: 'blue', size: 0.05 });

    return (
        <Canvas
            className="canvas"
            shadows
            frameloop="demand"
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true }}
            camera={{
                fov: 50,
                near: 0.1,
                far: 400,
                position: [-15, 1, 1],
            }}
        >
            <mesh>
                <hemisphereLight intensity={30} groundColor="white" />
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
            <Suspense fallback={null}>
                <OrbitControls
                    enableZoom={true}
                    target={[0, 0, 0]}
                    autoRotate
                    autoRotateSpeed={1}
                    minDistance={5}
                    maxDistance={20}
                    zoomSpeed={0.5}
                    rotateSpeed={0.5}
                />
                <mesh
                    visible
                    userData={{ hello: 'world' }}
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                >
                    <sphereGeometry args={[4, 64, 64]} />
                    <meshStandardMaterial map={earthTexture} transparent />
                    <mesh>
                        <points geometry={geometry} material={testMat} />
                    </mesh>
                   
                    {verteciesAllCountries.map(
                        (countryVert: number[], index: number) => (
                            <Line
                                key={index}
                                points={countryVert}
                                color={0xff0000}
                                opacity={0.7}
                                onClick={() => {
                                    console.log('yessss');
                                }}
                            />
                        ),
                    )}
                </mesh>
                <Preload all />
            </Suspense>
        </Canvas>
    );
};
