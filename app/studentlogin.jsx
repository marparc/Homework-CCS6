import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { Link } from "expo-router";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginStudent = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const VerifyLogin = async () => {
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
    if (!contactNumber || !password) {
      console.log("Please enter both account ID and password.");
      return;
    }
    if (rpcData) {
      const userid = rpcData;
      console.log("rpcdata: ", rpcData);
      console.log("userid: ", userid);
      const { data, error } = await supabase
        .from("user_account")
        .select("accountid, account_password")
        .eq("userid", userid)
        .eq("account_password", password)
        .eq("account_status", "Verified");

      if (error) {
        console.error("Login failed:", error);
      } else if (data.length > 0) {
        const accountid = data[0].accountid;
        const account_password = data[0].account_password;

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
      } else {
        // ingna marc nga mo create ug ui for this
        if (data.length === 0) {
          console.log("Login failed. Please check the following:");

          if (data.some((item) => item.account_status !== "Verified")) {
            console.log("Account status is not Verified.");
          }
          if (data.some((item) => item.contactnumber !== contactNumber)) {
            console.log("Account ID does not match.");
          }
          if (data.some((item) => item.account_password !== inputtedpassword)) {
            console.log("Password does not match.");
          }
        }
        console.log("Invalid credentials or account not verified");
      }
    } else {
      console.log("User ID not found in rpcData.");
      return;
    }
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
        <InputField
          title="Password"
          size="medium"
          value={password}
          onChangeText={setPassword}
        />
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
});
