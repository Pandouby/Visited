import { Text,  } from "react-native";
import CheckBox from '@react-native-community/checkbox';

export const CountryListItem = ({ svgPath, countryName, visited }) => {
  return (
    <>
      {/* <svg path={svgPath} /> */}
      <Text>{countryName}</Text>
      <CheckBox
        value={visited}
        onValueChange={() => console.log("test")}
      />
    </>
  );
};
