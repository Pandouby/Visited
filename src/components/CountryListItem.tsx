import { Image, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { StyleSheet } from "react-native";
import { Constant } from "./Constants";

export const CountryListItem = ({
  svgPath,
  countryName,
  visited,
  onChange,
}) => {
  return (
    <View style={styles.countryListItem}>
      <Image source={svgPath} style={styles.flagImage}/>
      <Text>{countryName}</Text>
      <Checkbox
        value={visited}
        onValueChange={(value) => {
          onChange(value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  countryListItem: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "space-between",
    margin: 5,
    gap: 5,
    backgroundColor: Constant.TINT_COLOR,
    borderRadius: 100,
    shadowColor: "#8f8f8f",
    shadowRadius: 100,
  },

  flagImage: {
    width: 20,
    height: 20,
  }
});
