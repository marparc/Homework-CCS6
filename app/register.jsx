import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { Link } from "expo-router";
import DatePick from "@/components/ui/pickdate";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* First Name Input */}
          <InputField
            title="First Name"
            size="medium"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Last Name Input */}
          <InputField
            title="Last Name"
            size="medium"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Contact Number Input */}
          <InputField
            title="Contact Number"
            size="medium"
            value={contactNumber}
            onChangeText={setContactNumber}
          />

          {/* Birthdate Selector */}
          <Text style={styles.labelText}>Select Birthdate</Text>
          <DatePick
            label="MM/DD/YY"
            mode="date"
            maxDate={new Date()} // Ensure dates are only in the past
            onDateChange={(date) => setBirthdate(date)}
          />

          {/* "I am" Section */}
          <View style={styles.btnContainer}>
            <Link href="/registerstudent" asChild>
              <Button
                title="I'm a Student Freelancer"
                type="dark"
                size="medium"
              />
            </Link>

            <Link href="/registerclient" asChild>
              <Button title="I'm a Client" type="light" size="medium" />
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light background color for better readability
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center", // Center content horizontally
  },
  formContainer: {
    maxWidth: 400, // Optional: Limit form width for larger screens
    marginTop: 20,
  },
  labelText: {
    alignSelf: "flex-start", // Align the text to the left
    fontSize: 14,
    marginLeft: 15,
  },
  btnContainer: {
    marginVertical: 20,
  },
});
