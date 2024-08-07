import { Image, Pressable, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { StyleSheet } from "react-native";
import { Constant } from "./Constants";

export const CountryListItem = ({
  countryFlagIcon,
  countryName,
  visited,
  onChange,
}) => {
  return (
    <View style={[styles.countryListItem, styles.shadowProp]}>
      <Pressable onPress={() => onChange(!visited)} style={styles.pressable}>
        <Text style={styles.flagIcon}>{countryFlagIcon}</Text>
        <Text>{countryName}</Text>
        <Checkbox onValueChange={(value) => onChange(value)} value={visited} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  countryListItem: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    backgroundColor: Constant.TINT_COLOR,
    borderRadius: 10,
    // shadow not working
    shadowColor: "#000000",
    shadowRadius: 100,
    textAlign: "center",
  },

  flagIcon: {
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center"
  },

  pressable: {
    padding: 10,
    display: "flex",
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
