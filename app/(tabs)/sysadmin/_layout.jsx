import { SafeAreaView, ScrollView, Text, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";

const AccountRequests = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [isApprovedActive, setIsApprovedActive] = useState(true);
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
    setIsApprovedActive(false);
  };

  // Handle "Approved" tab click
  const handleApprovedClick = () => {
    setFilter("Verified");
    setIsPendingActive(false); // Show "Completed" jobs
    setIsApprovedActive(true);
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
          type={isApprovedActive ? "light" : "dark"}
          size="small"
          onPress={handleApprovedClick}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.jobList}>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <View key={account.accountid} style={styles.accountItem}>
              <Text style={styles.accountName}>{account.account_name}</Text>
              <Text style={styles.accountStatus}>
                Status: {account.account_status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            {error || "No ${filter.toLowerCase()} accounts available."}
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
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});

export default AccountRequests;
