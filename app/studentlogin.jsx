import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { Link } from "expo-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
//09876352671
const LoginStudent = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const VerifyLogin = async () => {
    console.log("triggered verifylogin");
    setContactNumberError("");
    setPasswordError("");

    if (!contactNumber || !password) {
      // Validate input fields
      if (!contactNumber) setContactNumberError("Contact number is required.");
      if (!password) setPasswordError("Password is required.");
      return;
    }

    if (contactNumber === "aapadmin" && password === "aapadmin") {
      console.log("Login successful. ADMIN");
      // You can store admin data if needed, then navigate to the admin page
      await AsyncStorage.setItem("accountId", "aapadmin");
      await AsyncStorage.setItem("password", "aapadmin");
      router.push("/(tabs)/sysadmin"); // Change this to your actual admin page
      return; // Exit the function early to avoid further database checks
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_userid",
      {
        provided_contactnumber: contactNumber,
      }
    );

    if (rpcError) {
      console.error("Failed to retrieve user ID:", rpcError);
      return;
    }
    if (!rpcData) {
      console.log("User ID not found.");
      setContactNumberError("Contact Number does not exist.");
      return;
    }

    const userid = rpcData;

    console.log("rpcdata: ", rpcData);
    console.log("userid: ", userid);
    const { data, error } = await supabase
      .from("user_account")
      .select("accountid, account_password, account_status")
      .eq("userid", userid)
      .eq("account_password", password)
      .eq("account_status", "Verified");

    if (error) {
      console.error("Login failed:", error);
    }

    console.log("Fetched user account data:", data); // Log the fetched data

    if (data && data.length > 0) {
      const user = data[0];
      console.log("account_status:", user.account_status);
      if (user.account_status !== "Verified") {
        console.log("Account status is not Verified.");
        setContactNumberError("Account status is not Verified.");
      } else if (user.account_password !== password) {
        console.log("Password does not match.");
        setPasswordError("Password does not match.");
      } else {
        const accountid = data[0].accountid;

        const { data: userTypeData, error: userTypeError } = await supabase
          .from("user_table")
          .select("usertype")
          .eq("userid", userid)
          .single();

        if (userTypeData) {
          const userType = userTypeData.usertype;
          if (userType === "Student") {
            console.log("Login successful. STUDENT");
            await AsyncStorage.setItem("accountId", String(accountid));
            await AsyncStorage.setItem("password", String(password));
            router.push("/(tabs)/student/jobstodo");
          } else {
            console.log("Login successful. CLIENT");
            await AsyncStorage.setItem("accountId", String(accountid));
            await AsyncStorage.setItem("password", String(password));
            router.push("/(tabs)/client/myjoblistings");
          }
        }
      }
    } else {
      // ingna marc nga mo create ug ui for this
      console.log("Login failed. Please check the following:");
      setContactNumber("");
      setPassword("");

      console.log("Invalid credentials or account not verified");
      setContactNumberError("Invalid credentials or account not verified");
    }
    //} else if (contactNumber === "aapadmin" && password === "aapadmin") {
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.formContainer}>
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
          secureTextEntry={true}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Login" type="dark" size="medium" onPress={VerifyLogin} />
      </View>

      <View style={styles.footerContainer}>
        <Text>No Account? Create one.</Text>
        <Link href="register" asChild>
          <Button title="Register" type="light" size="medium" />
        </Link>
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
  errorText: {
    color: "red",
  },
});
