import { StyleSheet, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/buttons";
import ProfileCard from "@/components/ui/profilecard";
import TextCard from "@/components/ui/textcard";
import { supabase } from "../../../lib/supabase";
import * as Location from "expo-location"; // Import Location from expo-location

const ViewRequest = () => {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState(null); // State to store job details
  const [clientDetails, setClientDetails] = useState(null); // State to store client details
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null); // State to store location (city)
  const { requestid } = useLocalSearchParams();
  console.log("HERE IN VIEW REQUEST: ", requestid);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Step 1: Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from("job_listing")
          .select(
            "jobid, jobtitle, jobdescription, jobpay, jobtype, locationlat, locationlong, duedate, dateposted, jobstatus, clientid"
          )
          .eq("requestid", requestid)
          .single();

        if (jobError) {
          throw new Error(`Error fetching job details: ${jobError.message}`);
        }

        setJobDetails(jobData);

        // Step 2: Fetch client details using clientid
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("client_organization, userid")
          .eq("clientid", jobData.clientid)
          .single();

        if (clientError) {
          throw new Error(
            `Error fetching client details: ${clientError.message}`
          );
        }

        setClientDetails(clientData);

        // Step 3: Fetch account name using userid
        const { data: accountData, error: accountError } = await supabase
          .from("user_account")
          .select("account_name")
          .eq("userid", clientData.userid)
          .single();

        if (accountError) {
          throw new Error(
            `Error fetching account name: ${accountError.message}`
          );
        }

        // Step 4: Combine the job, client, and account data as needed
        setJobDetails((prevData) => ({
          ...prevData,
          clientOrganization: clientData.client_organization,
          accountName: accountData.account_name,
        }));

        // Step 5: Fetch job location details (city name from latitude and longitude)
        getJobLocationDetails(jobData.locationlat, jobData.locationlong);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch job details:", error.message);
        setLoading(false);
      }
    };

    if (requestid) {
      fetchJobDetails();
    }
  }, [requestid]);

  // Function to fetch the city based on latitude and longitude
  const getJobLocationDetails = async (latitude, longitude) => {
    try {
      if (latitude && longitude) {
        const geocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        console.log("Geocode:", geocode);

        const address = geocode[0];
        const formattedAddress = address
          ? `${address.city || "Unknown city"}, ${
              address.country || "Unknown country"
            }`
          : "Address not available";

        setLocation(formattedAddress); // Store formatted location in state
        console.log("Formatted Location:", formattedAddress);
      } else {
        setLocation("Location not available");
      }
    } catch (error) {
      console.error("Error retrieving location or geocode:", error);
      setLocation("Failed to retrieve job location details");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Show loading state until data is fetched
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {jobDetails && (
        <ListingDetails
          title={jobDetails.jobtitle.toUpperCase()}
          jobType={jobDetails.jobtype}
          posted={jobDetails.dateposted}
          status={jobDetails.jobstatus}
          client={jobDetails.accountName}
          stars="5"
          location={location || "Location not available"} // Display the formatted city or location
          description={jobDetails.jobdescription}
          pay={jobDetails.jobpay}
        />
      )}

      <ProfileCard
        profiletype="C"
        name={jobDetails.accountName || "No Name Available"}
        company={jobDetails.clientOrganization || "No Organization Available"}
      />

      <TextCard
        type="light"
        text="Once you click 'Accept,' a conversation will be created between you and the client to ensure the job goes smoothly."
      ></TextCard>

      <Button
        title="Approve"
        type="dark"
        size="medium"
        onPress={() => console.log("Confirmed")}
      />

      <Button
        title="Decline"
        type="light"
        size="medium"
        onPress={() => router.push("")}
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
});

export default ViewRequest;
