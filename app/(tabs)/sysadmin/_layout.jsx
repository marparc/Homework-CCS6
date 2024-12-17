import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useRouter, useNavigation } from "expo-router";
import JobCard from "@/components/ui/jobcard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountRequests = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [isPendingActive, setIsPendingActive] = useState(true);
  const [error, setError] = useState(null);

  console.log("Displaying list");
  useEffect(() => {
    const grabAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("user_account")
          .select("accountid, account_name, account_status")
          .eq("account_status", filter);

        if (error) {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data.");
        } else {
          console.log("Fetched data:", data);
          setAccounts(data || []);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred."); // Set error state for unexpected errors
      }
    };

    grabAccounts();
  }, [filter]);

  // Handle "Pending" tab click
  const handlePendingClick = () => {
    setFilter("Pending");
    setIsPendingActive(true); // Show "To Do" jobs
  };

  // Handle "Approved" tab click
  const handleApprovedClick = () => {
    setFilter("Verified");
    setIsPendingActive(false); // Show "Completed" jobs
  };

  const handleLogout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.removeItem("accountId");
      await AsyncStorage.removeItem("password");

      // Log message for debugging
      console.log("User logged out.");

      // Navigate back to login screen
      router.replace("/studentlogin"); // Use replace to prevent going back to the current screen
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Navigate to the account details screen
  const AccountDetails = (accountid, accountName) => {
    console.log(
      "Navigating with accountid:",
      accountid,
      "and accountName:",
      accountName
    );
    router.push(
      `/screens/manageaccount?selectedAccount=${accountid}&accountName=${accountName}`
    ); // Navigate with both jobid and jobstatus
  };

  return (
    <>
      <SafeAreaView>
        <Text style={styles.title}>Applications</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={styles.header}>
        {/* Tab buttons for "To Do" and "Completed" */}
        <View style={styles.buttonContainer}>
          <Button
            title="Pending"
            type={isPendingActive ? "dark" : "light"}
            size="small"
            disabled={!isPendingActive}
            onPress={handlePendingClick}
          />
          <Button
            title="Approved"
            type={isPendingActive ? "light" : "dark"}
            size="small"
            onPress={handleApprovedClick}
          />
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.jobList}>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <JobCard
              key={account.accountid}
              title={account.account_name}
              description={`Status: ${account.account_status}`}
              onPress={() => {
                AccountDetails(account.accountid, account.account_status);
              }}
            />
          ))
        ) : (
          <Text style={styles.noDataText}>
            {error || `No ${filter.toLowerCase()} accounts available.`}
          </Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  logoutButton: {
    position: "absolute", // Position the button absolutely
    top: 10,
    right: 10, // Adjust to place it at the top-right corner
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 30,
    marginBottom: 5,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Space buttons evenly
    marginTop: 5, // Add margin to separate it from the title
  },
});

export default AccountRequests;
