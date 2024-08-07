import { Canvas } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import React, { Suspense, createContext, useEffect, useState } from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  Text,
  View,
  Appearance,
} from "react-native";
import { CountryDataContext } from "./src/contexts/countryDataContext";
import { ICountryData } from "./src/interfaces/countryData";
import countriesJsonData from "./src/data/low-res.geo.json";
import { FeatureCollection } from "geojson";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Globe } from "./src/components/Globe";
import { CountryList } from "./src/components/CountryList";
import { Settings } from "./src/components/Settings";
import { NavigationContainer, TabRouter } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Tabbar } from "./src/components/Tabbar";
import { FaGlobeEurope } from "react-icons/fa";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Constant } from "./src/components/Constants";

export default function App() {
  const countriesJson = countriesJsonData as FeatureCollection;
  const [countryData, setCountryData] = useState<Map<string, ICountryData>>(
    new Map()
  );

  const [visitedCount, setVisitedCount] = useState<number>(0);

  const loadLocalData = async () => {
    const localCountryData = await AsyncStorage.getItem('countryData');
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

      await AsyncStorage.setItem('countryData', JSON.stringify(countryData));

      setCountryData(countryDataMap);
    } else {
      console.log("data is filled");
      const saveLocalData = async () => {
        console.log("befor save", countryData);

        await AsyncStorage.mergeItem(
          'countryData',
          JSON.stringify(countryData)
        );
      };

      saveLocalData();
      setCountryData(JSON.parse(localCountryData) as Map<string, ICountryData>);
    }
  };

  useEffect(() => {
    loadLocalData();

    // Appearance.setColorScheme("dark");
  }, []);

  useEffect(() => {
    const saveLocalData = async () => {
      console.log("saving data");

      await AsyncStorage.setItem("countryData", JSON.stringify(countryData));
    };

    saveLocalData();
  }, [countryData]);

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <CountryDataContext.Provider
        value={{ countryData, setCountryData, visitedCount, setVisitedCount }}>
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            backgroundColor: Constant.PRIMARY_COLOR,
          }}>
          <StatusBar barStyle="dark-content" translucent={true} />
          <Tab.Navigator
            initialRouteName="List"
            screenOptions={{ tabBarShowLabel: false }}
            tabBar={(props) => <Tabbar {...props} />}>
            <Tab.Screen
              name="List"
              component={CountryList}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <Entypo
                    name="list"
                    size={30}
                    color={Constant.TAB_ICON_COLOR}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Globe"
              component={Globe}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <Entypo
                    name="globe"
                    size={30}
                    color={Constant.TAB_ICON_COLOR}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={Settings}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name="settings-outline"
                    size={30}
                    color={Constant.TAB_ICON_COLOR}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
        <View
          style={{
            backgroundColor: Constant.ACCENT_COLOR,
            height: 35,
            width: "100%",
          }}></View>
      </CountryDataContext.Provider>
    </NavigationContainer>
  );
}
