import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const Button = ({ title, type, size }) => {
  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { width: 120, height: 40 };
      case "medium":
        return { width: 300, height: 40 };
      default:
        return { width: 300, height: 40 }; // default size if none provided
    }
  };

  const isLight = type === "light";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        isLight ? styles.lightButton : styles.darkButton,
      ]}
    >
      <Text style={isLight ? styles.lightText : styles.darkText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    margin: 10,
  },
  lightButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "black",
    borderWidth: 1,
  },
  darkButton: {
    backgroundColor: "black",
  },
  lightText: {
    color: "black",
  },
  darkText: {
    color: "#FFFFFF",
  },
});
