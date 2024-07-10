import { Button, View } from "react-native";
import { StyleSheet } from "react-native";

export const Settings = () => {
  return (
    <View style={styles.settings}>
      <Button title="Reset countries" />
    </View>
  );
};

const styles = StyleSheet.create({
  settings: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
});
