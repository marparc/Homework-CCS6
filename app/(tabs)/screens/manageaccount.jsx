import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import * as Location from "expo-location";

const ManageAccount = () => {
  const { selectedAccount } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  console.log("selected Account: ", selectedAccount);

  const fetchAccountDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("user_account")
        .select("*")
        .eq("accountid", selectedAccount)
        .single();

      if (error) {
        throw error;
      }
    } catch (e) {}
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Conditional Rendering: Only render ListingDetails if jobData is available */}
        {jobData ? (
          <ListingDetails
            title={jobData.job.jobtitle || "Not available"}
            jobType={jobData.job.jobtype || "Not available"}
            posted={
              jobData.job.dateposted
                ? format(new Date(jobData.job.dateposted), "MMMM dd, yyyy")
                : "Not available"
            }
            status={jobData.job.jobstatus || "Not available"}
            client={
              jobData?.client
                ? jobData.client.client_organization
                : "Not available"
            }
            location={location}
            description={
              jobData.job.jobdescription || "No description available."
            }
            pay={jobData.job.jobpay || "Not available"}
          />
        ) : (
          <Text>Loading job details...</Text>
        )}
      </ScrollView>
    </>
  );
};

export default ManageAccount;
