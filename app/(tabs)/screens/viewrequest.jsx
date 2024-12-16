import { StyleSheet, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/buttons";
import ProfileCard from "@/components/ui/profilecard";
import TextCard from "@/components/ui/textcard";
import { supabase } from "../../../lib/supabase";
import * as Location from "expo-location";
import { Alert } from "react-native";
import HandLoading from "@/components/ui/handloading";

const ViewRequest = () => {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const { requestid } = useLocalSearchParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
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

        const { data: evaluations, error: evaluationsError } = await supabase
          .from("client_evaluation")
          .select("rating")
          .eq("clientid", jobData.clientid);

        if (evaluationsError) {
          throw new Error(
            `Error fetching client evaluations: ${evaluationsError.message}`
          );
        }

        const averageRating = evaluations?.length
          ? evaluations.reduce((sum, evalData) => sum + evalData.rating, 0) /
            evaluations.length
          : 0;

        const combinedData = {
          ...jobData,
          clientOrganization: clientData.client_organization,
          accountName: accountData.account_name,
          averageRating: averageRating.toFixed(1),
        };

        setJobDetails(combinedData);

        getJobLocationDetails(jobData.locationlat, jobData.locationlong);

        setLoading(false);
        console.log("Job Details:", jobDetails);
      } catch (error) {
        console.error("Failed to fetch job details:", error.message);
        setLoading(false);
      }
    };

    if (requestid) {
      fetchJobDetails();
    }
  }, [requestid]);

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

        setLocation(formattedAddress);
        console.log("Formatted Location:", formattedAddress);
      } else {
        setLocation("Location not available");
      }
    } catch (error) {
      console.error("Error retrieving location or geocode:", error);
      setLocation("Failed to retrieve job location details");
    }
  };

  const handleDecline = async () => {
    Alert.alert(
      "Confirm Decline",
      "Are you sure you want to decline this job request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Decline Cancelled"),
          style: "cancel",
        },
        {
          text: "Decline",
          onPress: async () => {
            try {
              const { error: jobError } = await supabase
                .from("job_listing")
                .update({ jobstatus: "Declined" })
                .eq("requestid", requestid);

              if (jobError) {
                throw new Error(
                  `Error updating job status: ${jobError.message}`
                );
              }

              const { error: requestError } = await supabase
                .from("service_request")
                .update({ requeststatus: "Declined" })
                .eq("requestid", requestid);

              if (requestError) {
                throw new Error(
                  `Error updating request status: ${requestError.message}`
                );
              }

              console.log("Request and job status updated to 'Declined'");

              router.push("/student/services");
            } catch (error) {
              console.error("Error handling decline:", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleApprove = async () => {
    Alert.alert(
      "Confirm Approval",
      "Are you sure you want to accept this job request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Approval Cancelled"),
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: async () => {
            try {
              const { error: jobError } = await supabase
                .from("job_listing")
                .update({ jobstatus: "In Progress" })
                .eq("requestid", requestid);

              if (jobError) {
                throw new Error(
                  `Error updating job status: ${jobError.message}`
                );
              }

              const { error: requestError } = await supabase
                .from("service_request")
                .update({ requeststatus: "Accepted" })
                .eq("requestid", requestid);

              if (requestError) {
                throw new Error(
                  `Error updating request status: ${requestError.message}`
                );
              }

              const { data: serviceRequestData, error: serviceRequestError } =
                await supabase
                  .from("service_request")
                  .select("serviceid")
                  .eq("requestid", requestid)
                  .single();

              if (serviceRequestError) {
                throw new Error(
                  `Error fetching serviceid: ${serviceRequestError.message}`
                );
              }

              const serviceid = serviceRequestData?.serviceid;
              if (!serviceid) {
                throw new Error(
                  "Service ID not found in service_request table."
                );
              }

              const { data: serviceData, error: serviceError } = await supabase
                .from("services")
                .select("studentid")
                .eq("serviceid", serviceid)
                .single();

              if (serviceError) {
                throw new Error(
                  `Error fetching studentid: ${serviceError.message}`
                );
              }

              const studentid = serviceData?.studentid;
              if (!studentid) {
                throw new Error("Student ID not found in services table.");
              }

              const { data: jobData, error: jobDataError } = await supabase
                .from("job_listing")
                .select("jobid")
                .eq("requestid", requestid)
                .single();

              if (jobDataError) {
                throw new Error(
                  `Error fetching jobid: ${jobDataError.message}`
                );
              }

              const jobid = jobData?.jobid;
              if (!jobid) {
                throw new Error("Job ID not found in job_listing table.");
              }

              const { data: existingChats, error: chatError } = await supabase
                .from("chat")
                .select("chatid");

              if (chatError) {
                throw new Error(
                  `Error fetching chat data: ${chatError.message}`
                );
              }

              const nextChatId =
                existingChats.length > 0
                  ? Math.max(...existingChats.map((chat) => chat.chatid)) + 1
                  : 1;

              const { error: insertChatError } = await supabase
                .from("chat")
                .insert([
                  {
                    chatid: nextChatId,
                    clientid: jobDetails.clientid,
                    studentid: studentid,
                    jobid: jobid,
                  },
                ]);

              if (insertChatError) {
                throw new Error(
                  `Error inserting chat data: ${insertChatError.message}`
                );
              }

              console.log(
                "Request and job status updated, and new chat created."
              );

              router.push("/student/services");
            } catch (error) {
              console.error("Error handling approve:", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <HandLoading></HandLoading>;
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {jobDetails && (
        <ListingDetails
          title={jobDetails.jobtitle.toUpperCase()}
          jobType={jobDetails.jobtype}
          posted={jobDetails.dateposted}
          status={jobDetails.jobstatus}
          location={location || "Location not available"}
          description={jobDetails.jobdescription}
          pay={jobDetails.jobpay}
        />
      )}

      <ProfileCard
        profiletype="C"
        name={jobDetails?.accountName || "Client Not Available"}
        stars={jobDetails?.averageRating || 0} // Pass average rating here
        company={jobDetails?.clientOrganization || "No Organization Available"}
      />

      <TextCard
        type="light"
        text="Once you click 'Accept,' a conversation will be created between you and the client to ensure the job goes smoothly."
      ></TextCard>
      <Button
        title="Accept"
        type="dark"
        size="medium"
        onPress={handleApprove}
      />
      <Button
        title="Decline"
        type="light"
        size="medium"
        onPress={handleDecline}
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
