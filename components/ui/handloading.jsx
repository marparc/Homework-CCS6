import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const HandLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Show loading for 3 seconds
    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/images/handloading.json")} // Ensure path is correct
          autoPlay
          loop
          style={styles.lottie} // Style for the LottieView
        />
      </View>
    );
  }
};

export default HandLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  lottie: {
    width: 350, // Set a width to constrain the size of the animation
    height: 350, // Set a height to constrain the size of the animation
  },
  text: {
    fontSize: 20,
    color: "black",
  },
});
