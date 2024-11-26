import { StyleSheet, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import Button from "@/components/ui/buttons";
import ProfileCard from "@/components/ui/profilecard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns"; // For formatting the date

const ToDoDetails = () => {
  const { selectedjobid } = useLocalSearchParams(); // Get jobid from route params

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState(null);

  console.log("FROM THE ROUTER:", selectedjobid);
  const fetchJobDetails = async () => {
    try {
      //console.log("Fetching job details for jobid:", selectedjobid);

      // Fetch job details from job_listing
      const { data: jobData, error: jobError } = await supabase
        .from("job_listing")
        .select("*")
        .eq("jobid", selectedjobid) // Fetch job details by jobid
        .single(); // We are expecting a single row

      if (jobError) {
        throw jobError; // Handle job fetching error
      }

      //console.log("Fetched job data:", jobData);

      // Now, fetch client details using clientid from the job_data
      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("client_organization, userid") // Get the relevant client info
        .eq("clientid", jobData.clientid) // Get client info based on clientid from the job data
        .single();

      if (clientError) {
        throw clientError; // Handle client fetching error
      }

      //console.log("Fetched client data:", clientData);

      // Now, fetch user details using the userid from the client_data
      const { data: userData, error: userError } = await supabase
        .from("user_table")
        .select("firstname, lastname") // Get the relevant user info
        .eq("userid", clientData.userid) // Get user info based on userid from client data
        .single();

      if (userError) {
        throw userError; // Handle user fetching error
      }

      //console.log("Fetched user data:", userData);

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

  // Automatically call fetchJobDetails when the component mounts or jobid changes
  useEffect(() => {
    if (selectedjobid) {
      fetchJobDetails();
    }
  }, [selectedjobid]);

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
          } // Safe access for date format
          status={jobData.job.jobstatus || "Not available"}
          client={
            jobData?.client
              ? jobData.client.client_organization
              : "Not available"
          } // Safe access for client data
          location={
            jobData.job.locationlat && jobData.job.locationlong
              ? `${jobData.job.locationlat}, ${jobData.job.locationlong}`
              : "Not available"
          } // Safe access for location data
          description={
            jobData.job.jobdescription || "No description available."
          }
          pay={jobData.job.jobpay || "Not available"} // Safe access for pay
        />
      ) : (
        <Text>Loading job details...</Text> // Show loading text or spinner while fetching
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

      <Button
        title="Confirm"
        type="dark"
        size="medium"
        onPress={() => console.log("Confirmed")}
      />
      <Button
        title="Go to Messages"
        type="light"
        size="medium"
        onPress={() => router.push("/screens/convo")}
      />
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
