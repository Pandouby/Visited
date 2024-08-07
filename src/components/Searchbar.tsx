import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Constant } from "./Constants";
import { PopupModal } from "./PopupModal";

export const Searchbar = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.searchbarContainer}>
      <View style={styles.searchbar}>
        <TextInput style={styles.textinput} placeholder="test"></TextInput>
        <Button title="X" />
      </View>

      <PopupModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text>Test</Text>
      </PopupModal>

      <View style={styles.filterButton}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <FontAwesome6 name="filter" size={24} color={Constant.ACCENT_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchbarContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constant.BACKGROUND_COLOR,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
  searchbar: {
    width: "100%",
    backgroundColor: Constant.TINT_COLOR,
    borderRadius: 100,
    display: "flex",
    flexDirection: "row",
  },
  textinput: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    margin: 10,
  },
  filterButton: {
    padding: 5,
    backgroundColor: Constant.TINT_COLOR,
    borderRadius: 10,
  }
});
