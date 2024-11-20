import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";

const RegisterSuccess = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Your account is currently under verification.
      </Text>
      <Ionicons
        name="checkmark-circle"
        size={150}
        color="black"
        style={styles.icon}
      />
      <Text style={styles.content}>
        Your registration has been submitted and is currently under
        verification.
      </Text>

      <Button
        title="Back to Login"
        type="light"
        size="medium"
        onPress={() => {
          router.push("/studentlogin");
        }}
      />
    </View>
  );
};

export default RegisterSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    padding: 16,
    backgroundColor: "white", // Background for the screen
  },
  header: {
    fontSize: 24,
    width: 300,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center", // Center-align header text
    color: "#333",
  },
  icon: {
    marginVertical: 30,
  },
  content: {
    width: 300,
    fontSize: 12,
    textAlign: "center",
    color: "#555",
    lineHeight: 24, // Improve readability
    marginVertical: 20,
  },
});
