import { useContext, useEffect, useState } from "react";
import { Button, Platform, ScrollView, Text, View } from "react-native";
import { CountryDataContext } from "../contexts/countryDataContext";
import { CountryListItem } from "./CountryListItem";
import { ICountryData } from "../interfaces/countryData";
import { Statusbar } from "./Statusbar";
import { Constant } from "./Constants";
import { SearchBar } from "react-native-screens";
import { Searchbar } from "./Searchbar";

export const CountryList = ({ navigation }) => {
  const { countryData, setCountryData, visitedCount, setVisitedCount } =
    useContext(CountryDataContext);

  console.log(countryData);

  const handleChange = (visited, key) => {
    console.log("test");

    visited
      ? setVisitedCount(visitedCount + 1)
      : setVisitedCount(visitedCount - 1);

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
      {countryData && (
        <Statusbar percentage={(visitedCount / countryData.size) * 100} />
      )}

      <Searchbar />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInset={{ bottom: 70, top: 10 }}
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{
          gap: 15,
          paddingLeft: 15,
          paddingRight: 15,
        }}
        style={{
          backgroundColor: "#ffffff",
        }}>
        {Array.from(countryData.entries()).map(([key, value]) => (
          <CountryListItem
            key={key}
            countryName={value.countryName}
            visited={value.visited}
            countryFlagIcon={getCountryFlagEmoji(value.iso_a2)}
            onChange={(value) => handleChange(value, key)}
          />
        ))}
      </ScrollView>
    </>
  );
};

export const getCountryFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};
