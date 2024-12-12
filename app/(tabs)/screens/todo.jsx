import { StyleSheet, ScrollView, Text, Button as RNButton } from "react-native";
import React, { useEffect, useState } from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import Button from "@/components/ui/buttons";
import ProfileCard from "@/components/ui/profilecard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import * as Location from "expo-location";

const ToDoDetails = () => {
  const { selectedjobid, jobstatus } = useLocalSearchParams();

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const router = useRouter();

  console.log("selectedjobid: ", selectedjobid);
  console.log("jobstatus: ", jobstatus);

  const fetchJobDetails = async () => {
    try {
      // Fetch job details from job_listing
      const { data: jobData, error: jobError } = await supabase
        .from("job_listing")
        .select("*")
        .eq("jobid", selectedjobid) // Fetch job details by jobid
        .single(); // We are expecting a single row

      if (jobError) {
        throw jobError; // Handle job fetching error
      }

      // Now, fetch client details using clientid from the job_data
      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("client_organization, userid") // Get the relevant client info
        .eq("clientid", jobData.clientid) // Get client info based on clientid from the job data
        .single();

      if (clientError) {
        throw clientError; // Handle client fetching error
      }

      // Now, fetch user details using the userid from the client_data
      const { data: userData, error: userError } = await supabase
        .from("user_table")
        .select("firstname, lastname") // Get the relevant user info
        .eq("userid", clientData.userid) // Get user info based on userid from client data
        .single();

      if (userError) {
        throw userError; // Handle user fetching error
      }

      // Combine all fetched data into one object and set state
      setJobData({
        job: jobData,
        client: clientData,
        user: userData,
      });
    } catch (err) {
      console.error("Error fetching details:", err);
      setError("Unable to fetch job details.");
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    if (selectedjobid) {
      fetchJobDetails();
    }
  }, [selectedjobid]);

  const getJobLocationDetails = async () => {
    try {
      if (jobData?.job?.locationlat && jobData?.job?.locationlong) {
        const latitude = jobData.job.locationlat;
        const longitude = jobData.job.locationlong;

        let geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        console.log("Geocode:", geocode);

        let address = geocode[0];
        let formattedAddress = address
          ? `${address.city || "Unknown city"}, ${
              address.country || "Unknown country"
            }`
          : "Address not available";

        setLocation(formattedAddress);
        console.log("Formatted Location:", formattedAddress);
      } else {
        setLocation("Location not available");
      }
    } catch (error) {
      console.error("Error retrieving location or geocode:", error);
      setErrorMsg("Failed to retrieve job location details");
    }
  };

  useEffect(() => {
    if (jobData) {
      getJobLocationDetails();
    }
  }, [jobData]);

  // Handle navigation when "Back" button is clicked
  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
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

      <ProfileCard
        profiletype="C"
        name={
          jobData?.user
            ? `${jobData.user.firstname} ${jobData.user.lastname}`
            : "Not available"
        } // Client organization name from clientData
        company={
          jobData?.client ? jobData.client.client_organization : "Not available"
        } // Client user (name) from userData
      />

      {/* Conditionally render buttons based on jobstatus */}
      {jobstatus === "In Progress" ? (
        <>
          {/* 
          <Button
            title="Confirm"
            type="dark"
            size="medium"
            onPress={() => console.log("Confirmed")}
          />
          */}
          <Button
            title="Go to Messages"
            type="dark"
            size="medium"
            onPress={() => router.push("/(tabs)/student/chat")}
          />
        </>
      ) : jobstatus === "Completed" ? (
        <Button
          title="Back"
          type="light"
          size="medium"
          onPress={handleBackClick} // Navigate back to previous screen
        />
      ) : null}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    elevation: 4, // Shadow for Android
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ToDoDetails;
