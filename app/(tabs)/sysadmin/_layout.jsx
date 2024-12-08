import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import JobCard from "@/components/ui/jobcard"; //reniel reniel

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
      router.replace("/login"); // Use replace to prevent going back to the current screen
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        {/* Tab buttons for "To Do" and "Completed" */}
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
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.jobList}>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <JobCard //reniel reniel
              key={account.accountid}
              title={account.account_name}
              description={`Status: ${account.account_status}`}
              /*onPress={() => {
                console.log("ROUTER:", account.accountid);
                router.push(
                  `/screens/manageaccount?selectedaccount=${account.accountid}`
                );
              }}*/
            />
          ))
        ) : (
          <Text style={styles.noDataText}>
            {error || `No ${filter.toLowerCase()} accounts available.`}
          </Text>
        )}
      </ScrollView>
      {/* headerRight: () => (
      <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
        <Ionicons name="log-out-outline" size={24} color="white" />
      </TouchableOpacity>
      ),*/}
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
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});

export default AccountRequests;
