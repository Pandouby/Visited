import { Preload, Line } from "@react-three/drei/native";
import { useLoader } from "@react-three/fiber/native";
import React, { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Texture, TextureLoader, Vector2, Vector3 } from "three";
import countriesJson from "../data/low-res.geo.json";

interface ICountry {
  sovereignt: string;
  sovereigntShort: string;
  coordinates: Vector3[][];
}

export const Globe = () => {
  const radiusGlobe = 4;

  const earthTexture: Texture = useLoader(
    TextureLoader,
    require("../../assets/earth4.jpg")
  ) as Texture;

  const earthNightTexture: Texture = useLoader(
    TextureLoader,
    require("../../assets/earth-map-night-10k.jpg")
  ) as Texture;

  const cloudTexture: Texture = useLoader(
    TextureLoader,
    require("../../assets/cloud.jpeg")
  ) as Texture;

  const test: ICountry = {
    sovereignt: "test",
    sovereigntShort: "tes",
    coordinates: [[new Vector3(2, 2, 3)]],
  };
  console.log(test);

  const convertCartesian = (point) => {
    const lambda = (point[0] * Math.PI) / 180;
    const phi = (point[1] * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    return new Vector3(
      // Remove comment brackets to lift countries so they dont clip the earth
      radiusGlobe /*+ 0.051*/ * cosPhi * Math.cos(lambda),
      radiusGlobe /*+ 0.051*/ * Math.sin(phi),
      -(radiusGlobe /*+ 0.051*/) * cosPhi * Math.sin(lambda)
    );
  };

  const countries = useMemo(
    () =>
      countriesJson.features.map((country) => {
        if (country.geometry.type === "Polygon") {
          return country.geometry.coordinates[0].map(convertCartesian);
        } else if (country.geometry.type === "MultiPolygon") {
          return country.geometry.coordinates.flatMap((coordinates) =>
            coordinates.map((polygon) => polygon.map(convertCartesian))
          );
        }
        return [];
      }),
    []
  );

  const countriesFinal = [];
  countries.map((country) => {
    if (Array.isArray(country[0])) {
      country.map((test) => {
        if (test.length < 50) return;
        const polyShape = new THREE.Shape(
          test.map((coord) => new THREE.Vector2(coord.x, coord.y))
        );
        const polyGeometry = new THREE.ShapeGeometry(polyShape);
        polyGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(
            test.map((coord) => [coord.x, coord.y, coord.z]).flat(),
            3
          )
        );
        countriesFinal.push(polyGeometry);
      });
    } else {
      const polyShape = new THREE.Shape(
        country.map((coord) => new THREE.Vector2(coord.x, coord.y))
      );
      const polyGeometry = new THREE.ShapeGeometry(polyShape);
      polyGeometry.computeVertexNormals();
      polyGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          country.map((coord) => [coord.x, coord.y, coord.z]).flat(),
          3
        )
      );
      countriesFinal.push(polyGeometry);
    }
  });

  console.log(countriesFinal.length);

  return (
    <Suspense fallback={null}>
      <mesh name="lighting">
        {/* <hemisphereLight intensity={10} /> */}
        <directionalLight
          color={"#ffffff"}
          intensity={10}
          position={[-2, -0.5, 1]}
        />
      </mesh>
      {/* 
      <mesh name="atmosphere" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshStandardMaterial color={"#349eeb"} opacity={0.3} transparent />
      </mesh>
      <mesh name="clouds" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4.1, 64, 64]} />
        <meshStandardMaterial map={cloudTexture} opacity={1} transparent/>
      </mesh>
      <mesh name="earth-day" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial map={earthTexture} opacity={1} />
      </mesh> */}

      {/* <mesh name="earth-night">
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial map={earthNightTexture} color={"#ffffff"} blending={THREE.AdditiveBlending}/>
      </mesh> */}

      {countriesFinal.map((country, countryIndex) => (
        <mesh
          key={countryIndex}
          onClick={() => {
            console.log(
              "click" +
                countriesJson.features[countryIndex].properties.sovereignt
            );
          }}>
          {Array.isArray(country[0]) ? (
            country.map((polygon, polyIndex) => (
              <mesh key={polyIndex} geometry={polygon}>
                <meshBasicMaterial color={"red"} />
              </mesh>
            ))
          ) : (
            <mesh key={"asdas"} geometry={country}>
              <meshBasicMaterial color={"red"} />
            </mesh>
          )}
        </mesh>
      ))}

      {/* <mesh name="country-borders">
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
