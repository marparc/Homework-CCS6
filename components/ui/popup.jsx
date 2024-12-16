import { Modal, Text, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Button from "./buttons";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Accept text, route, and icon as props
const PopUp = ({ text, route, icon }) => {
  const [isVisible, setIsVisible] = useState(true); // State to control modal visibility
  const router = useRouter();

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <Text style={styles.text}>{text}</Text>
          {/* Conditionally render icon if provided */}
          {icon && (
            <Ionicons name={icon} size={50} color="black" style={styles.icon} />
          )}
          <Button
            title="Ok"
            type="dark"
            size="small"
            onPress={() => {
              setIsVisible(false); // Hide modal when button is pressed
              if (route) {
                router.push(route); // Navigate to the provided route, if it exists
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  container: {
    width: 330,
    height: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  icon: {
    marginBottom: 20,
  },
});
