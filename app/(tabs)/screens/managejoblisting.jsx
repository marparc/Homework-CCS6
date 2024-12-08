import { View, Text, Alert } from "react-native"; // Import Alert for the confirmation message
import React, { useEffect, useState } from "react";
import ListingDetails from "@/components/ui/jobdetailsexpanded";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns"; // For formatting the date
import * as Location from "expo-location"; // Import Location to use reverse geocode

const ManageJobListing = () => {
  const { selectedjoblisting } = useLocalSearchParams(); // Get jobid from route params
  const router = useRouter();
  const [jobData, setJobData] = useState(null);
  const [location, setLocation] = useState("Location not available"); // Location state
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

      console.log("Job Data:", jobData); // Check if jobData is correct

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
      console.log("HEREHRHEHR");
      setJobData({
        job: jobData,
        client: clientData,
        user: userData,
      });
      console.log("HEREHRHEHRHEREHRHEHR");
      // Log to confirm this line is being executed
      console.log(
        "Latitude and Longitude",
        jobData.locationlat,
        jobData.locationlong
      );

      // Get the location details after fetching job data
      if (jobData?.locationlat && jobData?.locationlong) {
        getJobLocationDetails(jobData.locationlat, jobData.locationlong);
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      setError("Unable to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get job location details based on latitude and longitude
  const getJobLocationDetails = async (latitude, longitude) => {
    try {
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      if (latitude && longitude) {
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
      setError("Failed to retrieve job location details");
    }
  };

  useEffect(() => {
    if (selectedjoblisting) {
      fetchJobDetails();
    }
  }, [selectedjoblisting]);

  // Function to handle deletion of the listing with user confirmation
  const handleDeleteListing = () => {
    // First, fetch the job details
    supabase
      .from("job_listing")
      .select("*")
      .eq("jobid", selectedjoblisting)
      .single()
      .then(async ({ data: job, error: fetchError }) => {
        if (fetchError) {
          console.error("Error fetching job details:", fetchError);
          return;
        }

        // Check if the job status is "In Progress" before confirming deletion
        if (job.jobstatus === "In Progress") {
          // Show an alert if deletion is not allowed due to job status
          Alert.alert(
            "Deletion Not Allowed",
            "This job listing cannot be deleted because its status is 'In Progress'.",
            [{ text: "OK" }]
          );
        } else {
          // Ask for confirmation before proceeding with the deletion
          Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this job listing?",
            [
              {
                text: "Cancel",
                style: "cancel", // Allows the user to cancel the operation
              },
              {
                text: "Delete",
                style: "destructive", // The destructive style to indicate a dangerous action
                onPress: async () => {
                  try {
                    const { error: deleteError } = await supabase
                      .from("job_listing")
                      .delete()
                      .eq("jobid", selectedjoblisting);

                    if (deleteError) {
                      throw deleteError;
                    }

                    // Success alert after deletion
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
                  } catch (err) {
                    console.error("Error deleting job listing:", err);
                    Alert.alert(
                      "Error",
                      "An error occurred while trying to delete the listing."
                    );
                  }
                },
              },
            ]
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching job listing:", err);
        Alert.alert(
          "Error",
          "An error occurred while trying to fetch the job listing."
        );
      });
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
          location={location || "Location not available"}
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
