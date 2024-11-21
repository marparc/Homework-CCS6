import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { Link } from "expo-router";

const Register = () => {
  const [organization, setOrganization] = useState("");
  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.formContainer}>
        <InputField
          title="Organization"
          size="medium"
          value={organization}
          onChangeText={setOrganization}
        />

        <Link href="/registersuccess" asChild>
          <Button
            title="Register"
            type="dark"
            size="medium"
            onPress={() => {}}
          />
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    alignItems: "center", // Center content horizontally
    padding: 10, // Optional padding to prevent content from touching edges
  },
  formContainer: {
    width: "100%", // Take up the full width available
    justifyContent: "center",
    alignItems: "center", // Centering form elements horizontally
    marginTop: 50,
  },
  btnContainer: {
    flexDirection: "row", // Aligns buttons in a row (horizontal)
    justifyContent: "center", // Center buttons horizontally within the container
    gap: 10, // Adds space between buttons
    marginTop: 15, // Optional: Add some space above the buttons
  },
  footerContainer: {
    marginTop: 20, // Space between footer items
    alignItems: "center", // Center footer elements horizontally
  },
});
