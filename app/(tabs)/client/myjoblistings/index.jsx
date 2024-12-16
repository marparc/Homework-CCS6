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
  const [activeTab, setActiveTab] = useState("My Listings");

  const router = useRouter();

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        if (storedAccountId) setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve account ID:", err);
      }
    };

    fetchAccountId();
  }, []);

  useEffect(() => {
    if (accountId) {
      if (activeTab === "My Listings") {
        fetchJobsByClient(accountId);
      } else if (activeTab === "Applications") {
        fetchJobDetailsWithApplicationCount(accountId);
      }
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
        .eq("clientid", clientId)
        .neq("jobstatus", "Completed");

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

  const fetchJobDetailsWithApplicationCount = async (accountId) => {
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

      const { data: jobData, error: jobError } = await supabase
        .from("job_listing")
        .select("jobid, jobtitle")
        .eq("clientid", clientId)
        .eq("jobstatus", "Open");

      if (jobError || !jobData) {
        console.error(
          "Error fetching job listings:",
          jobError?.message || "No jobs found"
        );
        setJobListings([]);
        return;
      }

      const jobDetailsWithCounts = await Promise.all(
        jobData.map(async (job) => {
          const { count: applicationCount, error: applicationError } =
            await supabase
              .from("application")
              .select("*", { count: "exact" })
              .eq("jobid", job.jobid)
              .eq("applicationstatus", "Pending");

          if (applicationError) {
            console.error(
              `Error counting applications for jobid ${job.jobid}:`,
              applicationError.message
            );
            return { ...job, applicationCount: 0 };
          }

          return { ...job, applicationCount };
        })
      );

      setJobListings(jobDetailsWithCounts);
    } catch (error) {
      console.error("Unexpected error:", error);
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
          onPress={() => setActiveTab("Applications")}
        />
      </SafeAreaView>

      {activeTab === "My Listings" && (
        <View style={{ marginLeft: 20, marginBottom: 10 }}>
          <Button
            title="Create +"
            type="light"
            size="small"
            onPress={() => router.push("/screens/postjoblisting")}
          />
        </View>
      )}

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.jobList}
          showsVerticalScrollIndicator={false}
        >
          {jobListings.length > 0 ? (
            jobListings.map((job) => (
              <JobCard
                key={job.jobid}
                title={job.jobtitle}
                description={
                  activeTab === "My Listings"
                    ? job.jobdescription
                    : `Applications: ${job.applicationCount}`
                }
                onPress={() => {
                  if (activeTab === "My Listings") {
                    router.push(
                      `/screens/managejoblisting?selectedjoblisting=${job.jobid}`
                    );
                  } else if (activeTab === "Applications") {
                    router.push(
                      `/screens/manageapplications?selectedjobid=${job.jobid}`
                    );
                  }
                }}
              />
            ))
          ) : (
            <Text style={styles.noJobsText}>No job listings available.</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default MyListings;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
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
