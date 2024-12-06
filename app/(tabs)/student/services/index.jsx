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
        // Step 1: Fetch the user ID from the user_account table
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

        // Step 2: Fetch the student ID from the student table
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("studentid")
          .eq("userid", userId)
          .single();

        if (studentError)
          throw new Error(`Student Error: ${studentError.message}`);

        const studentId = studentData?.studentid;
        if (!studentId) throw new Error("Student ID not found");

        // Step 3: Fetch services associated with the student ID
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("serviceid, serviceTitle, servicedesc")
          .eq("studentid", studentId);

        if (servicesError)
          throw new Error(`Services Error: ${servicesError.message}`);

        const servicesMap = servicesData.reduce((map, service) => {
          map[service.serviceid] = {
            serviceTitle: service.serviceTitle,
            servicedesc: service.servicedesc,
          };
          return map;
        }, {});

        const serviceIds = servicesData.map((item) => item.serviceid);
        if (serviceIds.length === 0)
          throw new Error("No services found for this student");

        // Step 4: Fetch service requests associated with the service IDs
        const { data: serviceRequestData, error: serviceRequestError } =
          await supabase
            .from("service_request")
            .select("requestid, requeststatus, clientid, serviceid") // Include serviceid for mapping
            .in("serviceid", serviceIds)
            .eq("requeststatus", "Pending");

        if (serviceRequestError)
          throw new Error(
            `Service Request Error: ${serviceRequestError.message}`
          );

        // Step 5: Combine service requests with service details
        const enrichedRequests = serviceRequestData.map((request) => ({
          ...request,
          serviceTitle:
            servicesMap[request.serviceid]?.serviceTitle || "No Title",
          servicedesc:
            servicesMap[request.serviceid]?.servicedesc || "No Description",
        }));

        // Set the enriched service requests in the state
        setServiceRequests(enrichedRequests);
        console.log("Enriched Service Requests:", enrichedRequests);
      } catch (error) {
        console.error("Error fetching account data:", error.message);
      }
    };

    // Only fetch data when accountId is available
    if (accountId) {
      fetchAccountData();
    }
  }, [accountId]);

  const renderJobCards = () => {
    return serviceRequests.map((request) => (
      <JobCard
        key={request.requestid}
        title={request.serviceTitle || "No Title Available"}
        description={request.servicedesc || "No Description Available"}
        onPress={() => {
          router.push({
            pathname: "/screens/viewrequest",
            query: { requestId: request.requestid }, // Pass the request ID to the next screen
          });
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
