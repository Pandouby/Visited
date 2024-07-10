import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { CountryDataContext } from "../contexts/countryDataContext";
import { Constant } from "./Constants";

export const Statusbar = ({ percentage }) => {
  return (
    <View style={styles.statusbarContainer}>
      <View style={styles.statusbarWrapper}>
        <View
          style={{
            width: `${percentage}%`,
            backgroundColor: Constant.ACCENT_COLOR,
            height: 15,
            zIndex: 2,
            borderRadius: 100
          }}></View>
        <View style={styles.statusbarBackground}></View>
        <Text style={styles.percentage}>{Math.round(percentage * 100) / 100}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusbarContainer: {
    width: "100%",
    height: 50,
    padding: 10,
    backgroundColor: Constant.PRIMARY_COLOR,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  statusbarWrapper: {
    position: "relative",
    width: "100%",
    height: 15,
    display: "flex",
    marginLeft: 2,
    userSelect: "none",
  },
  statusbarBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: Constant.TINT_COLOR,
    zIndex: 1,
  },
  percentage: {
    color: Constant.PRIMARY_COLOR,
    position: "absolute",
    width: "100%",
	display: "flex",
	textAlign: "center",
	justifyContent: "center",
	alignItems: "center",
	zIndex: 50,
	fontWeight: 700,
  }
});
