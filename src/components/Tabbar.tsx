import { View, Text, Button } from "react-native";

export const Tabbar = () => {
  return (
    <View
      style={{
        borderColor: "red",
        height: 50,
        justifyContent: "center",
        alignContent: "center",
      }}>
      <Button title="Go to List" onPress={() => navigation.navigate("List")} />
      <Button title="Go to List" onPress={() => navigation.navigate("List")} />
    </View>
  );
};
