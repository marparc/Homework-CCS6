import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { Link } from "expo-router";

const LoginStudent = () => {
  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.formContainer}>
        <InputField title="Account ID" size="medium" />
        <InputField title="Password" size="medium" />
      </View>

      <View style={styles.buttonContainer}>
        {/* Handle the press and then navigate */}
        <Link href="/(tabs)/student/jobstodo" asChild>
          <Button title="Login" type="dark" size="medium" />
        </Link>
      </View>

      <View style={styles.footerContainer}>
        <Text>Not a Student?</Text>
        <Button title="Client Login" type="light" size="medium" />
      </View>

      <View style={styles.footerContainer}>
        <Text>No Account? Create one.</Text>
        <Button title="Register" type="light" size="medium" />
      </View>
    </SafeAreaView>
  );
};

export default LoginStudent;

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: 20, // Optional padding to prevent content from touching edges
  },
  formContainer: {
    width: "100%", // Take up the full width available
    justifyContent: "center",
    alignItems: "center", // Centering form elements horizontally
    marginTop: 50,
  },
  buttonContainer: {
    marginVertical: 15, // Space between buttons
  },
  footerContainer: {
    marginTop: 20, // Space between footer items
    alignItems: "center", // Center footer elements horizontally
  },
});
