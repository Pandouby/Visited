import { Button, Platform, Text, View } from "react-native"

export const CountryList = ({navigation}) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", borderColor: "red", borderWidth: 1}}>
      <Text>Country List</Text>
      <Text>{Platform.OS}</Text>
      <Button title="Go to Globe" onPress={() => navigation.navigate("Globe")} />
    </View>
  );
};
