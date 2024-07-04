import { Canvas } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import React, { Suspense, createContext, useEffect, useState } from "react";
import { Platform, SafeAreaView, StatusBar, Text, View } from "react-native";
import { Globe } from "./src/components/Globe";
import { CountryDataContext } from "./src/contexts/countryDataContext";
import { ICountryData } from "./src/interfaces/countryData";
import countriesJsonData from "./src/data/low-low-res.geo.json";
import { FeatureCollection } from "geojson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobeMap } from "./src/components/2dGlobe";

export default function App() {
  const countriesJson = countriesJsonData as FeatureCollection;
  const [countryData, setCountryData] = useState<Map<string, ICountryData>>(
    new Map()
  );

  const loadLocalData = async () => {
    const localCountryData = await AsyncStorage.getItem("countryData");
    console.log("logMap", localCountryData);
    
    
    if (localCountryData === "{}") {
      console.log("data is null");

      const countryDataMap = new Map<string, ICountryData>();
      countriesJson.features.map((country) => {
        console.log("adm", country.properties.adm0_a3);
        
        countryDataMap.set(country.properties.adm0_a3, {
          visited: false,
        });
      });

      await AsyncStorage.setItem("countryData", JSON.stringify(countryData));

      setCountryData(countryDataMap);
    } else {
      console.log("data is filled");
      const saveLocalData = async () => {
        console.log("befor save", countryData);
        
        await AsyncStorage.mergeItem("countryData", JSON.stringify(countryData));
      };

      saveLocalData();
      setCountryData(JSON.parse(localCountryData) as Map<string, ICountryData>);
    }
  };

  useEffect(() => {
    loadLocalData();
  }, [])

  useEffect(() => {
    console.log("stuff", countryData);
  })

  useEffect(() => {
    const saveLocalData = async () => {
      console.log("saving data", countryData);
      
      await AsyncStorage.setItem("countryData", JSON.stringify(countryData));

      console.log(await AsyncStorage.getItem("countryData"));
      console.log(await AsyncStorage.getAllKeys());
      
      
    };

    saveLocalData();
  }, [countryData]);

  return (
    <CountryDataContext.Provider value={{ countryData, setCountryData }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
        <Suspense>
          <Text style={{color: "white"}} >{Platform.OS}</Text>
          <GlobeMap />
        </Suspense>
      </SafeAreaView>
    </CountryDataContext.Provider>
  );
}
