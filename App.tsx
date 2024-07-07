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
import { NavigationContainer, TabRouter } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Tabbar } from "./src/components/Tabbar";
import { FaGlobeEurope } from "react-icons/fa";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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
          countryName: country.properties.admin,
          iso_a2: country.properties.iso_a2,
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
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <CountryDataContext.Provider value={{ countryData, setCountryData }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}>
            <Tab.Navigator
              initialRouteName="Globe"
              screenOptions={{ tabBarShowLabel: false }}>
              <Tab.Screen
                name="Globe"
                component={Globe}
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => (
                    <Entypo name="globe" size={24} color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="List"
                component={CountryList}
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => (
                    <Entypo name="list" size={24} color={color} />
                  ),
                }}
              />
              <Tab.Screen
                name="Settings"
                component={CountryList}
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="settings-outline" size={24} color={color} />
                  ),
                }}
              />
            </Tab.Navigator>
        </SafeAreaView>
      </CountryDataContext.Provider>
    </NavigationContainer>
  );
}
