import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

const InputField = ({ title, size }) => {
  // Determine the size based on the size prop
  const inputStyle = () => {
    switch (size) {
      case "small":
        return { width: 120, height: 40 };
      case "medium":
        return { width: 330, height: 40 };
      case "large":
        return { width: 330, height: 150, multiline: true }; // Add multiline for large size
      default:
        return { width: 330, height: 40 }; // Default to medium if no valid size is provided
    }
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <TextInput
          style={[styles.input, inputStyle()]} // Apply dynamic size based on size prop
          multiline={size === "large"} // Add multiline only if size is large
          textAlignVertical={size === "large" ? "top" : "center"} // Start cursor at the top for large inputs
          textAlign="left" // Ensure left-alignment of text
        />
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    color: "black",
  },
  titleContainer: {
    position: "relative",
    left: 15,
  },
  input: {
    borderWidth: 1, // Set the border width
    borderColor: "#C3C3C3", // Set the border color
    borderRadius: 16, // Set border radius for rounded corners
    paddingHorizontal: 10, // Padding inside the input
    margin: 10,
  },
});
