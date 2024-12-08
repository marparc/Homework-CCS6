import { ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";

import { supabase } from "../../../../lib/supabase";
// Sample data
const jobData = [
  {
    id: 1,
    title: "aa Editing Job",
    description:
      "Edit a 10-minute video for a YouTube channel, ensuring transitions and effects are smooth.",
  },
  {
    id: 2,
    title: "Graphic Design Work",
    description:
      "Create a promotional poster for a local event, using provided brand guidelines.",
  },
  {
    id: 3,
    title: "Content Writing Task",
    description:
      "Write a 500-word blog post about sustainable energy trends in 2024.",
  },
  {
    id: 4,
    title: "Social Media Management",
    description:
      "Schedule and post content for a week, ensuring captions match the brand voice.",
  },
  {
    id: 5,
    title: "Photography Session",
    description: "Capture headshots for a company’s team members in Dumaguete.",
  },
];

const RequestLists = () => {
  const router = useRouter();
  const [accountId, setAccountId] = useState(null);

  const [serviceRequests, setServiceRequests] = useState([]);

  // to get account id
  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
        console.log(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const { data: userAccountData, error: userAccountError } =
          await supabase
            .from("user_account")
            .select("userid")
            .eq("accountid", accountId)
            .single();

        if (userAccountError)
          throw new Error(`User Account Error: ${userAccountError.message}`);

        const userId = userAccountData?.userid;
        if (!userId) throw new Error("User ID not found");

        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("studentid")
          .eq("userid", userId)
          .single();

        if (studentError)
          throw new Error(`Student Error: ${studentError.message}`);

        const studentId = studentData?.studentid;
        if (!studentId) throw new Error("Student ID not found");

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("serviceid")
          .eq("studentid", studentId);
        console.log("servicesData: ", servicesData);
        if (servicesError)
          throw new Error(`Services Error: ${servicesError.message}`);

        if (servicesData.length === 0)
          throw new Error("No services found for this student");

        const serviceIds = servicesData.map((service) => service.serviceid);
        const { data: serviceRequestData, error: serviceRequestError } =
          await supabase
            .from("service_request")
            .select("requestid, clientid, serviceid, requeststatus")
            .in("serviceid", serviceIds)
            .eq("requeststatus", "Pending");

        if (serviceRequestError)
          throw new Error(
            `Service Request Error: ${serviceRequestError.message}`
          );
        console.log("serviceRequestData:", serviceRequestData);
        const enrichedRequests = await Promise.all(
          serviceRequestData.map(async (request) => {
            const { data: jobListingData, error: jobListingError } =
              await supabase
                .from("job_listing")
                .select("jobid, jobtitle, jobdescription")
                .eq("requestid", request.requestid)
                .single();
            console.log("jobListingData:", jobListingData);
            console.log("request.requestid:", request.requestid);
            if (jobListingError)
              throw new Error(`Job Listing Error: ${jobListingError.message}`);

            const service = servicesData.find(
              (s) => s.serviceid === request.serviceid
            );

            return {
              ...request,
              serviceTitle: service?.serviceTitle || "No Title",
              servicedesc: service?.servicedesc || "No Description",
              jobid: jobListingData?.jobid || "No Job ID",
              jobtitle: jobListingData?.jobtitle || "No Job Title",
              jobdescription:
                jobListingData?.jobdescription || "No Job Description",
            };
          })
        );

        setServiceRequests(enrichedRequests);
        console.log(
          "Enriched Service Requests with Job Listings:",
          enrichedRequests
        );
      } catch (error) {
        console.error("Error fetching account data:", error.message);
      }
    };

    if (accountId) {
      fetchAccountData();
    }
  }, [accountId]);

  const renderJobCards = () => {
    return serviceRequests.map((request) => (
      <JobCard
        key={request.requestid}
        title={request.jobtitle || request.serviceTitle || "No Title Available"}
        description={
          request.jobdescription ||
          request.servicedesc ||
          "No Description Available"
        }
        onPress={() => {
          router.push(`/screens/viewrequest?requestid=${request.requestid}`);
          /*
          router.push({
            pathname: "/screens/viewrequest",
            query: { requestId: request.requestid },
          });*/
        }}
      />
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderJobCards(jobData)}
    </ScrollView>
  );
};

export default RequestLists;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center", // Center align the content inside the ScrollView
  },
});
