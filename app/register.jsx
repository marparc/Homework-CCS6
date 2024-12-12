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
  const [ageCheckError, setAgeCheckError] = useState("");

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

  const validateFields = () => {
    if (!firstName || !lastName || !contactNumber || !birthdate || !password) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const ageCheck = () => {
    if (!birthdate) {
      return false;
    }

    const today = new Date();
    const birthDate = new Date(birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    return !(
      age < 16 ||
      (age === 16 && monthDifference < 0) ||
      (age === 16 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    );
  };

  // Pass the state via router.push()
  const handleRegisterStudent = async () => {
    setContactNumberError("");
    setAgeCheckError("");

    if (!validateFields()) return;

    const isValidAge = ageCheck();
    if (!isValidAge) {
      setAgeCheckError("You must be 16 years or older to register.");
      return;
    }

    const exists = await checkContactNum(contactNumber);
    if (exists) {
      setContactNumberError("Contact number is already in use.");
      console.log("Something went wrong during contactNumber checking");
      return;
    }

    router.push({
      pathname: "/registerstudent",
      params: { firstName, lastName, contactNumber, birthdate, password },
    });
  };

  const handleRegisterClient = async () => {
    setContactNumberError("");
    if (!validateFields()) return;

    const exists = await checkContactNum(contactNumber);

    if (exists) {
      setContactNumberError("Contact number is already in use.");
    }

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
          {ageCheckError ? (
            <Text style={styles.errorText}>{ageCheckError}</Text>
          ) : null}

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
