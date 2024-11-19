import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const JobCard = ({ title, description }) => {
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter(); // Initialize the router

  // Function to handle the card click and navigate
  const handlePress = () => {
    // Add any navigation logic or extra actions here
    router.push(`/screens/todo`);
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress} // Trigger navigation on press
    >
      <View style={[styles.card, isPressed && styles.cardPressed]}>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#f8f8f8",
    borderRadius: 16,
    marginVertical: 5,
    width: 300,
  },
  cardPressed: {
    borderWidth: 1,
    borderColor: "#000",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 12,
    color: "#434242",
  },
});
