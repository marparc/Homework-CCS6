import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import TextCard from "@/components/ui/textcard";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";

const ViewJobListing = () => {
  const router = useRouter();
  const { selectedJobListing } = useLocalSearchParams(); // The id comes from the router params

  // Initial state for job details
  const [jobDetails, setJobDetails] = useState([]);
  const [error, setError] = useState(null); // State for the selected job ID

  // Fetch job data when selectedJobListing changes
  useEffect(() => {
    const fetchJobData = async () => {
      if (!selectedJobListing) {
        console.log("Selected Job Listing ID is not provided.");
        return;
      }

      try {
        // Query the `job_listing` table for details matching the `selectedJobListing`
        const { data: jobData, error: jobError } = await supabase
          .from("job_listing")
          .select("*")
          .eq("jobid", selectedJobListing); // Match job ID

        if (jobError) {
          throw new Error(jobError.message);
        }

        if (jobData && jobData.length > 0) {
          // Set job details state with fetched data
          setJobDetails(jobData[0]); // Assuming the data array contains the job object
          console.log("Job data fetched:", jobData[0]);
        } else {
          console.log("No job listings found for the given ID.");
          setJobDetails(null);
        }
      } catch (err) {
        console.error("Error fetching job data:", err.message);
        setError(err.message);
      }
    };

    fetchJobData();
  }, [selectedJobListing]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ListingDetails
          title={jobDetails.jobtitle}
          jobType={jobDetails.jobtype}
          posted={jobDetails.dateposted}
          status={jobDetails.jobstatus}
          client="Marc Warren" //to be updated
          stars="5"
          location="Dumaguete City"
          description={jobDetails.jobdescription}
          pay={jobDetails.jobpay}
        />

        <TextCard
          type="light"
          text="All personal information in your profile will be shared with the client. Once you click 'Send Application,' the client will review your profile. 

You will receive a notification if your application is accepted, and you will then be directed to a private conversation with the client."
        />

        <InputField title="Enter message for Client" size="large" />

        <Button
          title="Send Application"
          type="dark"
          size="medium"
          onPress={() => {
            router.push("/(tabs)/screens/submittedapplication");
          }}
        />

        <Button title="Cancel" type="light" size="medium" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Set a background color for the screen
  },
  scrollContainer: {
    padding: 16, // Add padding for better spacing
    alignItems: "center", // Center child elements horizontally
  },
});

export default ViewJobListing;
