import { Line, Preload } from '@react-three/drei/native';
import { useLoader } from '@react-three/fiber/native';
import React, { Suspense, useMemo } from 'react';
import { BufferAttribute, Texture, TextureLoader, Vector3 } from 'three';
import * as THREE from 'three';
import countriesJson from '../data/low-res.geo.json';

export const Globe = () => {
    const radiusGlobe = 4;

    const earthTexture = useLoader(
        TextureLoader,
        require('../../assets/earth3.jpg')
    );

    const convertCartesian = (point) => {
        const lambda = (point[0] * Math.PI) / 180;
        const phi = (point[1] * Math.PI) / 180;
        const cosPhi = Math.cos(phi);
        return new Vector3(
            radiusGlobe * cosPhi * Math.cos(lambda),
            radiusGlobe * Math.sin(phi),
            -radiusGlobe * cosPhi * Math.sin(lambda),
        );
    };

    const countries = useMemo(() => countriesJson.features.map((country) => {
        if (country.geometry.type === 'Polygon') {
            return country.geometry.coordinates[0].map(convertCartesian);
        } else if (country.geometry.type === 'MultiPolygon') {
            return country.geometry.coordinates.flatMap(coordinates =>
                coordinates.map(polygon => polygon.map(convertCartesian))
            );
        }
        return [];
    }), []);

    const geometry = new THREE.ShapeGeometry(new THREE.Shape(countries[0]));
    const shape = new THREE.Mesh(geometry);

    return (
            <Suspense fallback={null}>
                <mesh>
                    <hemisphereLight intensity={2} />
                </mesh>
                <mesh
                    visible
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                >
                    <sphereGeometry args={[4, 64, 64]} />
                    <meshStandardMaterial map={earthTexture as Texture} opacity={1}/>
                </mesh>
                <mesh
                    visible
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                >
                    <sphereGeometry args={[4.2, 64, 64]} />
                    <meshStandardMaterial color={"blue"} opacity={0.1} transparent/>
                </mesh>
            
                <mesh key={"jaskdjasd"} geometry={geometry} >
                    <meshBasicMaterial color={"red"} />
                </mesh>
                {/* <mesh>
                    {countries.map((country, countryIndex) => (
                        <mesh key={countryIndex} onClick={() => { console.log('click country'); }}>
                             {Array.isArray(country[0]) ? country.map((polygon, polyIndex) => (
                                 <Line key={polyIndex} points={polygon} color={0x00ff00} opacity={1} />
                             )) : (
                                 <Line points={country} color={0x00ff00} opacity={1} />
                            )}
                        </mesh>

                       
                    ))}
                </mesh> */}
                <Preload all />
            </Suspense>
    );
};

