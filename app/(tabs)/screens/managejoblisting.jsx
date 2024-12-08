import { View, Text, Alert } from "react-native"; // Import Alert for the confirmation message
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

  const fetchJobDetails = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from("job_listing")
        .select("*")
        .eq("jobid", selectedjoblisting)
        .single();

      if (jobError) {
        throw jobError;
      }
      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("client_organization, userid")
        .eq("clientid", jobData.clientid)
        .single();

      if (clientError) {
        throw clientError;
      }

      const { data: userData, error: userError } = await supabase
        .from("user_table")
        .select("firstname, lastname")
        .eq("userid", clientData.userid)
        .single();

      if (userError) {
        throw userError;
      }

      setJobData({
        job: jobData,
        client: clientData,
        user: userData,
      });
    } catch (err) {
      console.error("Error fetching details:", err);
      setError("Unable to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedjoblisting) {
      fetchJobDetails();
    }
  }, [selectedjoblisting]);

  const handleDeleteListing = async () => {
    try {
      const { data: job, error: fetchError } = await supabase
        .from("job_listing")
        .select("*")
        .eq("jobid", selectedjoblisting)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (job.jobstatus === "In Progress") {
        Alert.alert(
          "Deletion Not Allowed",
          "This job listing cannot be deleted because its status is 'In Progress'.",
          [{ text: "OK" }]
        );
      } else {
        // Prompt the user for confirmation before proceeding with deletion
        Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete this job listing?",
          [
            {
              text: "Cancel",
              style: "cancel", // Cancel button to close the dialog
            },
            {
              text: "Delete",
              style: "destructive", // Red color for destructive action
              onPress: async () => {
                // Proceed with deletion
                const { error: deleteError } = await supabase
                  .from("job_listing")
                  .delete()
                  .eq("jobid", selectedjoblisting);

                if (deleteError) {
                  throw deleteError;
                }

                Alert.alert(
                  "Listing Deleted",
                  "The job listing has been successfully deleted.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        router.push("/(tabs)/client/myjoblistings");
                      },
                    },
                  ]
                );
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Error deleting job listing:", err);
      Alert.alert(
        "Error",
        "An error occurred while trying to delete the listing."
      );
    }
  };

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
          router.push(
            `/screens/editjoblisting?selectedjoblisting=${selectedjoblisting}`
          );
        }}
      />

      <Button
        title="Delete Listing"
        type="dark"
        size="medium"
        onPress={handleDeleteListing}
      />
    </View>
  );
};

export default ManageJobListing;
