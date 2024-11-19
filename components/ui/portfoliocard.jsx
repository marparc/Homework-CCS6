import { View, Text, StyleSheet, Linking } from "react-native";
import React from "react";
import Button from "./buttons";

const PortfolioCard = ({ title, description, link }) => {
  // Function to handle the button press and open a link (e.g., YouTube)
  const handlePress = () => {
    Linking.openURL(link); // Use the link variable directly without quotes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
      <Button title="View" type="dark" size="small" onPress={handlePress} />
    </View>
  );
};

export default PortfolioCard;

const styles = StyleSheet.create({
  container: {
    width: 320,
    padding: 20,
    margin: 10,
    backgroundColor: "#FAF9F9",
    borderRadius: 16,
  },
  header: {
    fontSize: 24,
  },
  text: {
    fontSize: 14,
  },
});
