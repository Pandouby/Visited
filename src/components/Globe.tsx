import { Line, Preload } from "@react-three/drei/native";
import { Canvas, useLoader } from "@react-three/fiber/native";
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AdditiveBlending, Texture, TextureLoader } from "three";
import {
  GenerateCountryPolygon,
  convertCartesianPointArray,
} from "../calculations/GenerateCountryPolygon";
import countriesJsonData from "../data/low-low-res.geo.json";
import RNFS from "react-native-fs";
import { FeatureCollection } from "../interfaces/geoJson";
import { Platform, View, Text, Button } from "react-native";
import useControls from "r3f-native-orbitcontrols";
import { CountryDataContext } from "../contexts/countryDataContext";
import { CountryList } from "./CountryList";

export const Globe = ({ navigation }) => {
  // Constants for globe calculation
  const globeRadius = 4;
  const polygonResolution = 4; // In angular degrees
  const [OrbitControls, event] = useControls();

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

  const { countryData, setCountryData } = useContext(CountryDataContext);
  // Check why setCountryData dose not cause render when being called
  const [_, setRender] = useState(false); // Force re-render, needed because setCountryData rerender is not working

  const colorContinentMap: Map<string, string> = new Map<string, string>([
    ["Europe", "green"],
    ["Africa", "red"],
    ["Oceania", "yellow"],
    ["Antarctica", "white"],
    ["North America", "blue"],
    ["South America", "pink"],
    ["Asia", "#e89235"],
    ["Seven seas (open ocean)", "#09a1b9"],
  ]);

  const colorBorderContinentMap: Map<string, string> = new Map<string, string>([
    ["Europe", "#36b533"],
    ["Africa", "#cb1f1f"],
    ["Oceania", "#d2c91a"],
    ["Antarctica", "#b5b5b5"],
    ["North America", "#007aaa"],
    ["South America", "#d939dc"],
    ["Asia", "#c6731a"],
    ["Seven seas (open ocean)", "#087585"],
  ]);

  /*
  const test = countriesJson.features.map((country) => {
    if (country.geometry.type === "Polygon") {
      return {
        type: country.type,
        properties: country.properties,
        geometry: {
          type: country.geometry.type,
          coordinates: country.geometry.coordinates,
        },
      };
    } else if (country.geometry.type === "MultiPolygon") {
      return {
        type: country.type,
        properties: country.properties,
        geometry: {
          type: country.geometry.type,
          coordinates: country.geometry.coordinates[0].map((coord) => {
            if (coord.length > 40) {
              console.log("cord");
              return coord;
            }
          }),
        },
      };
    }
  });

  const cleanCountryJson = JSON.stringify(test);

  console.log(cleanCountryJson);
  */

  // Check how to save data of countries on device after loading once to reduce loading times
  const polygonCountries = useMemo(
    () =>
      countriesJson.features.map((country) => {
        console.log("generate countries");

        if (country.geometry.type === "Polygon") {
          return [
            GenerateCountryPolygon(
              country.geometry.coordinates,
              polygonResolution,
              globeRadius + 0.015 // + 0.015 to avoid clipping with globe texture
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
                  globeRadius + 0.015 // + 0.015 to avoid clipping with globe texture
                )
              );
            }
          });
          return multiPoly;
        }
        return [];
      }),
    [countriesJson]
  );

  const handleCountryClick = (index: number) => {
    setCountryData(
      countryData.set(countriesJson.features[index].properties.adm0_a3, {
        visited: !countryData.get(
          countriesJson.features[index].properties.adm0_a3
        ).visited,
        visitedDate: countryData.get(
          countriesJson.features[index].properties.adm0_a3
        ).visited
          ? null
          : Date.now(),
      })
    );
    setRender((prev) => !prev);

    console.log(
      countriesJson.features[index].properties.admin,
      countryData.get(countriesJson.features[index].properties.adm0_a3)
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "red",
        borderWidth: 1,
      }}
      {...event}>
      <Text>{Platform.OS}</Text>
      <Canvas
        shadows
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 50,
          near: 0.1,
          far: 400,
          position: [-15, 1, 1],
        }}>
        <Suspense fallback={null}>
          <OrbitControls
            enablePan={false}
            maxZoom={15}
            minZoom={4}
            zoomSpeed={1.2}
            rotateSpeed={1.5}
          />
          <mesh name="lighting">
            {/* <hemisphereLight intensity={10} /> */}
            <directionalLight
              color={"#ffffff"}
              intensity={10}
              position={[-2, -0.5, 1]}
            />
          </mesh>

          <mesh
            name="atmosphere"
            visible
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}>
            <sphereGeometry args={[4.2, 64, 64]} />
            <meshStandardMaterial color={"#349eeb"} opacity={0.3} transparent />
          </mesh>

          {/* <mesh name="clouds" visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[4.5, 64, 64]} />
            <meshStandardMaterial map={cloudTexture} opacity={1} transparent />
          </mesh> */}

          <mesh
            name="earth-day"
            visible
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}>
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
              name="country"
              onClick={() => handleCountryClick(countryIndex)}>
              {country.map((polygon) => {
                // Fix reloading of all the compinents when clicking a country
                // console.log("contour", polygon.contour);

                return (
                  <>
                    <mesh
                      name="country-polygon"
                      geometry={polygon.bufferGeometry}>
                      <meshBasicMaterial
                        color={
                          countryData.get(
                            countriesJson.features[countryIndex].properties
                              .adm0_a3
                          ).visited
                            ? colorContinentMap.get(
                                countriesJson.features[countryIndex].properties
                                  .continent
                              )
                            : "gray"
                        }
                        opacity={0.4}
                      />
                    </mesh>
                    <mesh name="country-border">
                      <Line
                        points={
                          convertCartesianPointArray(
                            polygon.contour,
                            globeRadius + 0.02
                          )[0]
                        }
                        color={
                          countryData.get(
                            countriesJson.features[countryIndex].properties
                              .adm0_a3
                          ).visited
                            ? colorBorderContinentMap.get(
                                countriesJson.features[countryIndex].properties
                                  .continent
                              )
                            : "#6d6d6d"
                        }
                        lineWidth={1}
                      />
                    </mesh>
                  </>
                );
              })}
            </mesh>
          ))}

          <Preload all />
        </Suspense>
      </Canvas>
      <Button title="Go to List" onPress={() => navigation.navigate("List")} />
    </View>
  );
};
