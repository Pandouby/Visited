import { Line, Preload, useTexture } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import React, {
  Suspense,
  useContext,
  useMemo,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { AdditiveBlending } from "three";
import {
  GenerateCountryPolygon,
  convertCartesianPointArray,
} from "../calculations/GenerateCountryPolygon";
import { CountryDataContext } from "../contexts/countryDataContext";
import countriesJsonData from "../data/low-low-res.geo.json";
import { ICountryData } from "../interfaces/countryData";
import { FeatureCollection } from "../interfaces/geoJson";
import { Constant } from "./Constants";

export const Globe = ({ navigation }) => {
  const [OrbitControls, event] = useControls();

  return (
    <View style={styles.globeView} {...event}>
      <Canvas
        style={styles.globeCanvas}
        shadows
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        camera={{
          fov: 50,
          near: 0.1,
          far: 400,
          position: [-15, 1, 1],
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enablePan={false}
            maxZoom={20}
            minZoom={5}
            zoomSpeed={1.2}
            rotateSpeed={1.5}
          />

          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
    </View>
  );
};

const Scene = () => {
  const globeRadius = 4;
  const polygonResolution = 4;

  const countriesJson = countriesJsonData as FeatureCollection;

  // ✅ R3F hooks MUST live inside Canvas
  const earthTexture = useTexture(require("../../assets/earth4.jpg"));
  const earthNightTexture = useTexture(
    require("../../assets/earth-map-night-10k.jpg")
  );
  const cloudTexture = useTexture(require("../../assets/cloud.jpeg"));

  const {
    countryData,
    setCountryData,
    visitedCount,
    setVisitedCount,
  } = useContext(CountryDataContext);

  const [_, setRender] = useState(false);

  const colorContinentMap = new Map<string, string>([
    ["Europe", "green"],
    ["Africa", "red"],
    ["Oceania", "yellow"],
    ["Antarctica", "white"],
    ["North America", "blue"],
    ["South America", "pink"],
    ["Asia", "#e89235"],
    ["Seven seas (open ocean)", "#09a1b9"],
  ]);

  const colorBorderContinentMap = new Map<string, string>([
    ["Europe", "#36b533"],
    ["Africa", "#cb1f1f"],
    ["Oceania", "#d2c91a"],
    ["Antarctica", "#b5b5b5"],
    ["North America", "#007aaa"],
    ["South America", "#d939dc"],
    ["Asia", "#c6731a"],
    ["Seven seas (open ocean)", "#087585"],
  ]);

  const polygonCountries = useMemo(
    () =>
      countriesJson.features.map((country) => {
        if (country.geometry.type === "Polygon") {
          return [
            GenerateCountryPolygon(
              country.geometry.coordinates,
              polygonResolution,
              globeRadius + 0.015
            ),
          ];
        } else if (country.geometry.type === "MultiPolygon") {
          const multiPoly = [];
          country.geometry.coordinates.forEach((coordinate) => {
            if (coordinate[0].length > 40) {
              multiPoly.push(
                GenerateCountryPolygon(
                  coordinate,
                  polygonResolution,
                  globeRadius + 0.015
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
    const key = countriesJson.features[index].properties.adm0_a3;
    const prevValue = countryData.get(key);
    const newCountryData = new Map<string, ICountryData>(countryData);

    !countryData.get(key).visited
      ? setVisitedCount(visitedCount + 1)
      : setVisitedCount(visitedCount - 1);

    setCountryData(
      newCountryData.set(key, {
        ...prevValue,
        visited: !countryData.get(key).visited,
        visitedDate: countryData.get(key).visited ? null : Date.now(),
      })
    );

    setRender((prev) => !prev);
  };

  return (
    <>
      {/* Lighting */}
      <mesh>
        <hemisphereLight intensity={10} />
      </mesh>

      {/* Base Globe */}
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial color={"#063b81"} />
      </mesh>

      {/* Optional textured globe */}
      {/*
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>
      */}

      {polygonCountries.map((country, countryIndex) => (
        <mesh
          key={countryIndex}
          onClick={() => handleCountryClick(countryIndex)}
        >
          {country.map((polygon) => (
            <React.Fragment key={polygon.bufferGeometry.uuid}>
              <mesh geometry={polygon.bufferGeometry}>
                <meshBasicMaterial
                  color={
                    countryData.get(
                      countriesJson.features[countryIndex].properties.adm0_a3
                    ).visited
                      ? colorContinentMap.get(
                          countriesJson.features[countryIndex].properties
                            .continent
                        )
                      : "#dedede"
                  }
                  opacity={0.4}
                  transparent
                />
              </mesh>

              <Line
                points={
                  convertCartesianPointArray(
                    polygon.contour,
                    globeRadius + 0.015
                  )[0]
                }
                color={
                  countryData.get(
                    countriesJson.features[countryIndex].properties.adm0_a3
                  ).visited
                    ? colorBorderContinentMap.get(
                        countriesJson.features[countryIndex].properties
                          .continent
                      )
                    : "#a4a4a4"
                }
                lineWidth={1}
              />
            </React.Fragment>
          ))}
        </mesh>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  globeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constant.BACKGROUND_COLOR,
  },
  globeCanvas: {
    width: "100%",
  },
});
