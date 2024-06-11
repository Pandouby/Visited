import { Line, Preload } from "@react-three/drei/native";
import { useLoader } from "@react-three/fiber/native";
import { FeatureCollection } from "geojson";
import React, { Suspense, useMemo } from "react";
import { AdditiveBlending, Texture, TextureLoader } from "three";
import { GenerateCountryPolygon } from "../GenerateCountryPolygon";
import countriesJsonData from "../data/low-res.geo.json";

export const GlobeMap = () => {
  // Constants for globe calculation
  const globeRadius = 4;
  const polygonResolution = 5; // In angular degrees

  // Data / Texture import
  const countriesJson = countriesJsonData as FeatureCollection;

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

  const polygonCountries = useMemo(
    () =>
      countriesJson.features.map((country) => {
        if (country.geometry.type === "Polygon") {
          return [
            GenerateCountryPolygon(
              country.geometry.coordinates,
              polygonResolution,
              globeRadius + 0.01 // + 0.01 to avoid clipping with globe texture
            ),
          ];
        } else if (country.geometry.type === "MultiPolygon") {
          const multiPoly = [];
          country.geometry.coordinates.map((coordinate) => {
            if (coordinate[0].length > 40) {
              multiPoly.push(
                GenerateCountryPolygon(
                  coordinate,
                  polygonResolution,
                  globeRadius + 0.01 // + 0.01 to avoid clipping with globe texture
                )
              );
            }
          });
          return multiPoly;
        }
        return [];
      }),
    []
  );

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

      <mesh name="atmosphere" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshStandardMaterial color={"#349eeb"} opacity={0.3} transparent />
      </mesh>
      <mesh name="clouds" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4.1, 64, 64]} />
        <meshStandardMaterial map={cloudTexture} opacity={1} transparent />
      </mesh>

      <mesh name="earth-day" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial map={earthTexture} opacity={1} />
      </mesh>
      <mesh name="earth-night">
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial
          map={earthNightTexture}
          color={"#ffffff"}
          blending={AdditiveBlending}
        />
      </mesh>

      {polygonCountries.map((country, countryIndex) => (
        <mesh
          onClick={() =>
            console.log(
              countriesJson.features[countryIndex].properties.sovereignt
            )
          }>
          {country.map(
            (polygon) => (
              console.log(polygon.contour),
              (
                <mesh geometry={polygon.bufferGeometry}>
                  <meshBasicMaterial color={"red"} opacity={0.4} />
                  {polygon.contour.map((contourPoint) => {
                    <Line points={contourPoint} />;
                  })}
                </mesh>
              )
            )
          )}
        </mesh>
      ))}

      {/* 
      <mesh name="country-borders">
        {countries.map((country, countryIndex) => (
            <mesh key={countryIndex} onClick={() => { console.log('click country'); }}>
                    {Array.isArray(country[0]) ? country.map((polygon, polyIndex) => (
                        <Line key={polyIndex} points={polygon} color={0x00ff00} opacity={1} />
                    )) : (
                        <Line points={country} color={0x00ff00} opacity={1} />
                )}
            </mesh>

            
        ))}
      </mesh> 
      */}

      <Preload all />
    </Suspense>
  );
};
