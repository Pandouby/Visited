import { Pressable, View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Constant } from "./Constants";

export const Tabbar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable id={label} onPress={onPress} style={styles.tab}>
            {options.tabBarIcon}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    height: 50,
    padding: 5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Constant.ACCENT_COLOR,
  },
  tab: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

/*
<TouchableOpacity
accessibilityRole="button"
accessibilityState={isFocused ? { selected: true } : {}}
accessibilityLabel={options.tabBarAccessibilityLabel}
testID={options.tabBarTestID}
onPress={onPress}
onLongPress={onLongPress}
style={{ flex: 1 }}
>
<Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
  {label}
</Text>
</TouchableOpacity>
*/
