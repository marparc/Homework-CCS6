import { SafeAreaView, ScrollView, Text, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import * as Location from "expo-location";
import InputField from "@/components/ui/inputfield";

const ManageAccount = () => {
  const { selectedAccount, accountStatus } = useLocalSearchParams();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  console.log("selected Account: ", selectedAccount);

  const fetchAccountDetails = async () => {
    try {
      const { data: accountData, error: accountError } = await supabase
        .from("user_account")
        .select("*")
        .eq("accountid", selectedAccount)
        .single();

      console.log("accountData: ", accountData);

      if (accountError) {
        throw accountError;
      }

      const { data: userData, error: userError } = await supabase
        .from("user_table")
        .select("firstname, lastname, contactnumber, birthdate, usertype")
        .eq("userid", accountData.userid)
        .single();

      console.log("userData", userData);

      if (userError) {
        throw userError;
      }

      setAccountDetails({
        account: accountData,
        user: userData,
      });
    } catch (e) {
      console.error("Error fetching details:", e);
      setError("Unable to fetch account details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchAccountDetails();
    }
  }, [selectedAccount]);

  // Handle navigation when "Back" button is clicked
  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
  };

  if (loading) {
    return <Text>Loading account details...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <Text>Account Details</Text>
        </View>
        <View>
          <Text>First Name:</Text>
          {accountDetails && accountDetails.user ? (
            <Text>{accountDetails.user.firstname}</Text>
          ) : (
            <Text>No account details available.</Text>
          )}
        </View>
        <View>
          <Text>Last Name:</Text>
          {accountDetails && accountDetails.user ? (
            <Text>{accountDetails.user.lastname}</Text>
          ) : (
            <Text>No account details available.</Text>
          )}
        </View>
        <View>
          <Text>Contact Number:</Text>
          <Text>{accountDetails.user.contactnumber}</Text>
        </View>
        <View>
          <Text>Birthdate:</Text>
          <Text>{accountDetails.user.birthdate}</Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default ManageAccount;
