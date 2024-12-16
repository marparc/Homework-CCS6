import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

const InputField = ({
  title,
  size,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  const inputStyle = () => {
    switch (size) {
      case "small":
        return { width: 120, height: 40 };
      case "medium":
        return { width: 330, height: 40 };
      case "large":
        return { width: 330, height: 150, multiline: true };
      default:
        return { width: 330, height: 40 };
    }
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <TextInput
          style={[styles.input, inputStyle()]}
          multiline={size === "large"}
          textAlignVertical={size === "large" ? "top" : "center"}
          textAlign="left"
          value={value} // Controlled by parent
          onChangeText={onChangeText} // Updates parent when changed
          secureTextEntry={secureTextEntry} // Make the text hidden for passwords
        />
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
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
