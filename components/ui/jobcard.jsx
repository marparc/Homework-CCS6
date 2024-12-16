import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const JobCard = ({ title, description, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress} // Use the provided `onPress` prop for navigation
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
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
    width: "100%",
  },
  cardPressed: {
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    color: "#434242",
  },
});
