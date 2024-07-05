import { Canvas } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import React, { Suspense, createContext, useEffect, useState } from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { CountryDataContext } from "./src/contexts/countryDataContext";
import { ICountryData } from "./src/interfaces/countryData";
import countriesJsonData from "./src/data/low-low-res.geo.json";
import { FeatureCollection } from "geojson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Globe } from "./src/components/Globe";
import { CountryList } from "./src/components/CountryList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Tabbar } from "./src/components/Tabbar";

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

        await AsyncStorage.mergeItem(
          "countryData",
          JSON.stringify(countryData)
        );
      };

      saveLocalData();
      setCountryData(JSON.parse(localCountryData) as Map<string, ICountryData>);
    }
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  useEffect(() => {
    console.log("stuff", countryData);
  });

  useEffect(() => {
    const saveLocalData = async () => {
      console.log("saving data", countryData);

      await AsyncStorage.setItem("countryData", JSON.stringify(countryData));

      console.log(await AsyncStorage.getItem("countryData"));
      console.log(await AsyncStorage.getAllKeys());
    };

    saveLocalData();
  }, [countryData]);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <CountryDataContext.Provider value={{ countryData, setCountryData }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}>
          <Stack.Navigator>
            <Stack.Screen
              name="Globe"
              component={CountryList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="List"
              component={CountryList}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>

          <Tabbar></Tabbar>
        </SafeAreaView>
      </CountryDataContext.Provider>
    </NavigationContainer>
  );
}
