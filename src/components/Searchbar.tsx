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
import AntDesign from "@expo/vector-icons/AntDesign";

export const Searchbar = ({onSearchList}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchbarValue, setSearchbarvalue] = useState<string>("");

  return (
    <View style={styles.searchbarContainer}>
      <View style={styles.searchbar}>
        <TextInput style={styles.textinput} placeholder="search" value={searchbarValue} onChangeText={setSearchbarvalue} onBlur={() => onSearchList(searchbarValue)}/>
        <TouchableOpacity onPress={() => setSearchbarvalue("")} style={styles.closeButton}>
          <AntDesign name="close" size={24} color={Constant.ACCENT_COLOR} />
        </TouchableOpacity>
      </View>

      <PopupModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text>Test</Text>
      </PopupModal>

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <View style={styles.filterButton}>
          <FontAwesome6 name="filter" size={16} color={Constant.ACCENT_COLOR} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchbarContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Constant.BACKGROUND_COLOR,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 5,
  },
  searchbar: {
    flex: 1,
    marginRight: 10,
    height: 44,
    backgroundColor: Constant.TINT_COLOR,
    borderRadius: 10,
    textAlign: "center",
    alignContent: "center",
    display: "flex",
    flexDirection: "row",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textinput: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    margin: 10,
  },
  filterButton: {
    backgroundColor: Constant.TINT_COLOR,
    borderRadius: 10,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  closeButton: {
    justifyContent: "center",
    marginRight: 10,
  }
});
