import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyListings = () => {
  const [jobListings, setJobListings] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Listings"); // New state for tab tracking

  const router = useRouter();

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve account ID from AsyncStorage:", err);
      }
    };

    fetchAccountId();
  }, []);

  useEffect(() => {
    if (accountId && activeTab === "My Listings") {
      fetchJobsByClient(accountId);
    }
  }, [accountId, activeTab]);

  const fetchJobsByClient = async (accountId) => {
    setLoading(true);
    try {
      const { data: userAccountData, error: userAccountError } = await supabase
        .from("user_account")
        .select("userid")
        .eq("accountid", accountId)
        .single();
      if (userAccountError || !userAccountData) {
        console.error(
          "Error fetching user account:",
          userAccountError?.message || "No user found"
        );
        setJobListings([]);
        return;
      }

      const userId = userAccountData.userid;

      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("clientid")
        .eq("userid", userId)
        .single();
      if (clientError || !clientData) {
        console.error(
          "Error fetching client data:",
          clientError?.message || "No client found"
        );
        setJobListings([]);
        return;
      }

      const clientId = clientData.clientid;

      const { data: jobListingsData, error: jobListingsError } = await supabase
        .from("job_listing")
        .select("jobtitle, jobdescription, jobid")
        .eq("clientid", clientId);

      if (jobListingsError) {
        console.error("Error fetching job listings:", jobListingsError.message);
        setJobListings([]);
      } else {
        setJobListings(jobListingsData || []);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
      setJobListings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button
          title="My Listings"
          type={activeTab === "My Listings" ? "dark" : "light"}
          size="small"
          onPress={() => setActiveTab("My Listings")}
        />
        <Button
          title="Applications"
          type={activeTab === "Applications" ? "dark" : "light"}
          size="small"
          onPress={() => {
            setActiveTab("Applications");
            console.log("Applications");
          }}
        />
      </SafeAreaView>
      {activeTab === "My Listings" ? (
        <>
          <View style={{ marginLeft: 20, marginBottom: 10 }}>
            <Button
              title="Create +"
              type="light"
              size="small"
              onPress={() => router.push("/screens/postjoblisting")}
            />
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading job listings...</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.jobList}>
              {jobListings.length > 0 ? (
                jobListings.map((job) => (
                  <JobCard
                    key={job.jobid}
                    title={job.jobtitle}
                    description={job.jobdescription}
                    onPress={() => {
                      console.log("ROUTER:", job.jobid);
                      router.push(
                        `/screens/managejoblisting?selectedjoblisting=${job.jobid}`
                      );
                    }}
                  />
                ))
              ) : (
                <Text style={styles.noJobsText}>
                  No job listings available.
                </Text>
              )}
            </ScrollView>
          )}
        </>
      ) : (
        <View style={styles.noJobsText}>
          <Text>Applications view is not implemented yet.</Text>
        </View>
      )}
    </>
  );
};

export default MyListings;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  noJobsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
