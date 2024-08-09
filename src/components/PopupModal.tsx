import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Constant } from "./Constants";
import AntDesign from "@expo/vector-icons/AntDesign";

export const PopupModal = ({ visible, onClose, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onDismiss={() => {
        onClose();
      }}
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableOpacity
        style={styles.touchableOpacity}
        activeOpacity={1}
        onPressOut={() => {
          onClose();
        }}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.filterModal}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  onClose();
                }}>
                <View>
                <AntDesign name="close" size={24} color={Constant.ACCENT_COLOR} />
                </View>
              </TouchableOpacity>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  filterModal: {
    backgroundColor: Constant.TINT_COLOR,
    opacity: 0.97,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "80%",
    height: 400,
    borderRadius: 15,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  touchableOpacity: {
    height: "100%",
    width: "100%",
  },
  closeButton: {
    backgroundColor: Constant.TINT_COLOR,
    margin: 5,
    top: 5,
    right: 5,
    position: "absolute",
  },
});
