import { View, Text, StyleSheet } from "react-native";
import React from "react";

const TextCard = ({ text, type }) => {
  // Determine background and text color based on type
  const containerStyle = [
    styles.container,
    type === "light" && styles.lightBackground,
    type === "gray" && styles.grayBackground,
    type === "dark" && styles.darkBackground,
  ];

  const textStyle = [
    styles.text,
    type === "dark" && styles.darkText, // Make text white for dark background
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

export default TextCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    width: 320,
    borderRadius: 16,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "justify",
  },
  lightBackground: {
    backgroundColor: "white", // White background
  },
  grayBackground: {
    backgroundColor: "#D3D3D3", // Light gray background
  },
  darkBackground: {
    backgroundColor: "#000", // Black background
  },
  darkText: {
    color: "#FFF", // White text on dark background
  },
});
