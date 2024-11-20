import React, { forwardRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const Button = forwardRef(({ title, type, size, onPress }, ref) => {
  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { width: 120, height: 40 };
      case "medium":
        return { width: 330, height: 40 };
      default:
        return { width: 330, height: 40 }; // Default size
    }
  };

  const isLight = type === "light";

  return (
    <Pressable
      ref={ref} // Forward the ref to Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        getSizeStyle(),
        isLight ? styles.lightButton : styles.darkButton,
        pressed && styles.pressedButton,
      ]}
    >
      <Text style={isLight ? styles.lightText : styles.darkText}>{title}</Text>
    </Pressable>
  );
});

// Export the component wrapped in React.forwardRef
export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    margin: 5,
  },
  lightButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "black",
    borderWidth: 1,
  },
  darkButton: {
    backgroundColor: "black",
  },
  pressedButton: {
    opacity: 0.8,
  },
  lightText: {
    color: "black",
  },
  darkText: {
    color: "#FFFFFF",
  },
});
