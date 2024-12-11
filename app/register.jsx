import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { supabase } from "../lib/supabase";
import { Link, useRouter } from "expo-router";
import DatePick from "@/components/ui/pickdate";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");

  const router = useRouter();

  const checkContactNum = async (contactNumber) => {
    try {
      // Query the database for the contact number
      const { data, error } = await supabase
        .from("user_table") // Replace with your table name
        .select("contactnumber")
        .eq("contactnumber", contactNumber)
        .single(); // Use `.single()` if you expect only one result

      // Handle errors
      if (error && error.code !== "PGRST116") {
        // PGRST116 is "No rows found"
        throw error;
      }

      // Check if the contact number exists
      return !!data; // Return true if data exists, false otherwise
    } catch (error) {
      console.error("Error checking contact number:", error);
      return null; // Handle unexpected errors gracefully
    }
  };

  // Pass the state via router.push()
  const handleRegisterStudent = async () => {
    setContactNumberError("");
    const exists = await checkContactNum(contactNumber);
    if (exists) {
      setContactNumberError("Contact number is already in use.");
    } else if (exists === false) {
      router.push({
        pathname: "/registerstudent",
        params: {
          firstName,
          lastName,
          contactNumber,
          birthdate,
          password,
        },
      });
    } else {
      console.error("An error occurred during the contact number check.");
    }
  };

  const handleRegisterClient = async () => {
    setContactNumberError("");
    const exists = await checkContactNum(contactNumber);
    if (exists) {
      setContactNumberError("Contact number is already in use.");
    } else if (exists === false) {
      router.push({
        pathname: "/registerclient",
        params: {
          firstName,
          lastName,
          contactNumber,
          birthdate,
          password,
        },
      });
    } else {
      console.error("An error occurred during the contact number check.");
    }
  };

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
          {contactNumberError ? (
            <Text style={styles.errorText}>{contactNumberError}</Text>
          ) : null}

          <InputField
            title="Password"
            size="medium"
            value={password}
            onChangeText={setPassword}
          />

          {/* Birthdate Selector */}
          <Text style={styles.labelText}>Select Birthdate</Text>
          <DatePick
            label="MM/DD/YY"
            mode="date"
            maxDate={new Date()} // Ensure dates are only in the past
            onDateChange={(date) => setBirthdate(date)}
          />

          <View style={styles.btnContainer}>
            <Button
              title="I'm a Student Freelancer"
              type="dark"
              size="medium"
              onPress={handleRegisterStudent}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              title="I'm a Client"
              type="dark"
              size="medium"
              onPress={handleRegisterClient}
            />
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
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
    marginLeft: 15,
  },
});
