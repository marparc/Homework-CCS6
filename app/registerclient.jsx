import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

import { useRouter } from "expo-router";

const Register = () => {
  const router = useRouter();
  const [organization, setOrganization] = useState("");
  const params = useLocalSearchParams();

  const {
    firstName = "undefined",
    lastName = "undefined",
    contactNumber = "undefined",
    birthdate = "undefined",
    password = "undefined",
  } = params;

  console.log("params: ", params);
  console.log("REGISTER client");
  // Convert birthdate to a valid ISO string
  const formattedBirthdate = birthdate
    ? new Date(birthdate).toISOString()
    : null;

  const handleRegister = async () => {
    console.log("here");
    try {
      // 1. Get the next available user_id
      const { data: userData, error: userError } = await supabase
        .from("user_table")
        .select("userid")
        .order("userid", { ascending: false })
        .limit(1);

      if (userError) throw userError;

      const userId = userData && userData[0] ? userData[0].userid + 1 : 1;
      console.log("here1");

      // 2. Insert into user_table
      const { error: insertUserError } = await supabase
        .from("user_table")
        .insert([
          {
            userid: userId,
            firstname: firstName,
            lastname: lastName,
            contactnumber: contactNumber,
            birthdate: formattedBirthdate, // Store the formatted birthdate
            usertype: "Client", // Hardcoded usertype as Client
          },
        ]);
      console.log("here2");
      if (insertUserError) throw insertUserError;

      // 3. Get the next available account_id
      const { data: accountData, error: accountError } = await supabase
        .from("user_account")
        .select("accountid")
        .order("accountid", { ascending: false })
        .limit(1);

      if (accountError) throw accountError;
      console.log("here3");
      const accountId =
        accountData && accountData[0] ? accountData[0].accountid + 1 : 1;

      // 4. Insert into user_account table
      const { error: insertAccountError } = await supabase
        .from("user_account")
        .insert([
          {
            accountid: accountId,
            account_name: `${firstName} ${lastName}`,
            account_status: "Pending", // Default status as Pending
            account_password: password, // You should handle password securely
            bio: null,
            userid: userId,
          },
        ]);
      if (insertAccountError) throw insertAccountError;

      // 5. Get the next available client_id
      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("clientid")
        .order("clientid", { ascending: false })
        .limit(1);

      if (clientError) throw clientError;

      const clientId =
        clientData && clientData[0] ? clientData[0].clientid + 1 : 1;

      // 6. Insert into client_table
      const { error: insertClientError } = await supabase
        .from("client_table")
        .insert([
          {
            clientid: clientId,
            client_organization: organization,
            userid: userId,
          },
        ]);
      if (insertClientError) throw insertClientError;

      // You can navigate or show a success message after successful registration
      console.log("Registration successful!");
      router.push("/registersuccess");
    } catch (error) {
      console.error("Error during registration: ", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Organization Input */}
          <InputField
            title="Organization"
            size="medium"
            value={organization}
            onChangeText={setOrganization}
          />

          <Button
            title="Register"
            type="dark"
            size="medium"
            onPress={handleRegister}
          />
        </View>
      </ScrollView>
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
