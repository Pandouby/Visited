import { useContext, useEffect, useState } from "react";
import { Button, Platform, ScrollView, Text, View } from "react-native";
import { CountryDataContext } from "../contexts/countryDataContext";
import { CountryListItem } from "./CountryListItem";
import { ICountryData } from "../interfaces/countryData";
import { Statusbar } from "./Statusbar";

export const CountryList = ({ navigation }) => {
  const { countryData, setCountryData, visitedCount, setVisitedCount } = useContext(CountryDataContext);

  console.log(countryData);

  const handleChange = (visited, key) => {
    console.log("test");
    console.log(key);
    console.log(visited);

    visited ? setVisitedCount(visitedCount + 1) : setVisitedCount(visitedCount - 1);

    const prevValue = countryData.get(key);
    const newCountryData = new Map<string, ICountryData>(countryData);

    setCountryData(
      newCountryData.set(key, {
        ...prevValue,
        visited,
        visitedDate: countryData.get(key).visited ? null : Date.now(),
      })
    );
  };

  return (
    <>
      <Statusbar percentage={(visitedCount/countryData.size) * 100} />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
        }}>
        {Array.from(countryData.entries()).map(([key, value]) => (
          <CountryListItem
            key={key}
            countryName={value.countryName}
            visited={value.visited}
            svgPath={`../../assets/flags/${value.iso_a2}.svg`}
            onChange={(value) => handleChange(value, key)}
          />
        ))}
      </ScrollView>
    </>
  );
};
