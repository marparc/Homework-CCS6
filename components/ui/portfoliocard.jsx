import { View, Text, StyleSheet, Linking } from "react-native";
import React from "react";
import Button from "./buttons";
import Ionicons from "react-native-vector-icons/Ionicons";

const PortfolioCard = ({ title, description, link }) => {
  const handlePress = () => {
    Linking.openURL(link);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>View </Text>
              <Ionicons name="open-outline" size={16} color="#fff" />
            </View>
          }
          type="dark"
          size="small"
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

export default PortfolioCard;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: "#FAF9F9",
    borderRadius: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 10,
  },
  buttonContainer: {
    alignSelf: "stretch", // Ensure the button container takes up the full width
    alignItems: "flex-end", // Align the button to the right
    marginTop: 10, // Optional: Add some space above the button
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginRight: 4,
    color: "#fff",
  },
});
