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
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const VerifyLogin = async () => {
    if (!accountId || !password) {
      console.log("Please enter both account ID and password.");
      return;
    }
    const { data, error } = await supabase
      .from("user_account")
      .select("accountid, account_password, account_status, userid")
      .eq("accountid", accountId)
      .eq("account_password", password)
      .eq("account_status", "Verified");

    if (error) {
      console.error("Login failed:", error);
    } else if (data.length > 0) {
      const userid = data[0].userid;

      const { data: userTypeData, error: userTypeError } = await supabase
        .from("user_table")
        .select("usertype")
        .eq("userid", userid)
        .single();
      if (userTypeData) {
        const userType = userTypeData.usertype;
        if (userType === "Student") {
          console.log("Login successful. STUDENT");
          await AsyncStorage.setItem("accountId", accountId);
          await AsyncStorage.setItem("password", password);
          router.push("/(tabs)/student/jobstodo");
        } else {
          console.log("Login successful. CLIENT");
          await AsyncStorage.setItem("accountId", accountId);
          await AsyncStorage.setItem("password", password);
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
        if (data.some((item) => item.accountid !== inputtedid)) {
          console.log("Account ID does not match.");
        }
        if (data.some((item) => item.account_password !== inputtedpassword)) {
          console.log("Password does not match.");
        }
      }
      console.log("Invalid credentials or account not verified");
    }
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.formContainer}>
        <InputField
          title="Account ID"
          size="medium"
          value={accountId}
          onChangeText={setAccountId}
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
        <Text>Not a Student?</Text>
        <Link href="clientlogin" asChild>
          <Button title="Client Login" type="light" size="medium" />
        </Link>
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
