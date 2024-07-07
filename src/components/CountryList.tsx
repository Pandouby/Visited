import { useContext } from "react";
import { Button, Platform, Text, View } from "react-native";
import { CountryDataContext } from "../contexts/countryDataContext";
import { CountryListItem } from "./CountryListItem";

export const CountryList = ({ navigation }) => {
  const { countryData, setCountryData } = useContext(CountryDataContext);

  console.log(countryData);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "red",
        borderWidth: 1,
      }}>
      <Text>Country List</Text>
      <Text>{Platform.OS}</Text>
      <Button
        title="Go to Globe"
        onPress={() => navigation.navigate("Globe")}
      />

      {Array.from(countryData.entries()).map(([key, value]) => (
        <CountryListItem
          key={key}
          countryName={value.countryName}
          visited={value.visited}
          svgPath={`../../assets/flags/${value.iso_a2}.svg`}
        />
      ))}
    </View>
  );
};
