import { View, ScrollView, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ListingDetails from "@/components/ui/jobdetailsexpanded";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns"; // For formatting the date

const ManageJobListing = () => {
  const { selectedjoblisting } = useLocalSearchParams(); // Get jobid from route params
  const router = useRouter();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("FROM THE ROUTER:", selectedjoblisting);

  const fetchJobDetails = async () => {
    try {
      //console.log("Fetching job details for jobid:", selectedjobid);

      // Fetch job details from job_listing
      const { data: jobData, error: jobError } = await supabase
        .from("job_listing")
        .select("*")
        .eq("jobid", selectedjoblisting) // Fetch job details by jobid
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

  useEffect(() => {
    if (selectedjoblisting) {
      fetchJobDetails();
    }
  }, [selectedjoblisting]);
  return (
    <View>
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
          location={
            jobData.job.locationlat && jobData.job.locationlong
              ? `${jobData.job.locationlat}, ${jobData.job.locationlong}`
              : "Not available"
          }
          description={
            jobData.job.jobdescription || "No description available."
          }
          pay={jobData.job.jobpay || "Not available"}
        />
      ) : (
        <Text>Loading job details...</Text>
      )}
      <Button
        title="Edit Listing"
        type="light"
        size="medium"
        onPress={() => {
          router.push("/screens/editjoblisting");
        }}
      />
      <Button title="Delete Listing" type="dark" size="medium" />
    </View>
  );
};

export default ManageJobListing;
