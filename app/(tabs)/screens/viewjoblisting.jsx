import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import TextCard from "@/components/ui/textcard";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileCard from "@/components/ui/profilecard";

const ViewJobListing = () => {
  const router = useRouter();
  const { selectedJobListing } = useLocalSearchParams();
  const [accountId, setAccountId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [userAccountName, setUserAccountName] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  //console.log("selectedJobListing: ", selectedJobListing);

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve account ID from AsyncStorage:", err);
      }
    };

    fetchAccountId();
  }, []);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!selectedJobListing) {
        console.log("Selected Job Listing ID is not provided.");
        return;
      }

      try {
        const { data: jobData, error: jobError } = await supabase
          .from("job_listing")
          .select("*")
          .eq("jobid", selectedJobListing);

        if (jobError) {
          throw new Error(jobError.message);
        }

        if (jobData && jobData.length > 0) {
          const job = jobData[0];
          setJobDetails(job);
          console.log("Job data fetched:", job);

          const clientId = job.clientid;

          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("client_organization, userid")
            .eq("clientid", clientId)
            .single();
          console.log("clientData: ", clientData);
          if (clientError) {
            throw new Error(clientError.message);
          }

          if (clientData) {
            console.log("Client data fetched:", clientData);

            const userId = clientData.userid;

            const { data: userData, error: userError } = await supabase
              .from("user_account")
              .select("account_name")
              .eq("userid", userId)
              .single();

            if (userError) {
              throw new Error(userError.message);
            }

            if (userData) {
              setUserAccountName(userData.account_name);
              console.log("User account name fetched:", userData.account_name);
            } else {
              console.log("No user account found for the given userid.");
            }

            const { data: evaluations, error: evalError } = await supabase
              .from("client_evaluation")
              .select("rating")
              .eq("clientid", clientId);
            console.log("evaluations: ", evaluations);
            if (evalError) {
              throw new Error(evalError.message);
            }

            if (evaluations && evaluations.length > 0) {
              const averageRating =
                evaluations.reduce(
                  (sum, evaluation) => sum + evaluation.rating,
                  0
                ) / evaluations.length;

              console.log("Average rating:", averageRating);

              setJobDetails((prevJobDetails) => ({
                ...prevJobDetails,
                clientOrganization: clientData.client_organization,
                averageRating: averageRating.toFixed(1),
              }));
            } else {
              console.log("No evaluations found for the given clientid.");
            }
          } else {
            console.log("No client data found for the given clientid.");
          }
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

  const handleSendApplication = async () => {
    try {
      const { count, error: countError } = await supabase
        .from("application")
        .select("applicationid", { count: "exact" });

      if (countError) {
        throw new Error(countError.message);
      }

      const newApplicationId = count + 1;

      const { data: accountData, error: accountError } = await supabase
        .from("user_account")
        .select("userid")
        .eq("accountid", accountId)
        .single();

      if (accountError) {
        throw new Error(accountError.message);
      }

      const userId = accountData?.userid;
      if (!userId) {
        throw new Error("User not found with the provided accountId.");
      }

      const { data: studentData, error: studentError } = await supabase
        .from("student")
        .select("studentid")
        .eq("userid", userId)
        .single();

      if (studentError) {
        throw new Error(studentError.message);
      }

      const studentId = studentData?.studentid;
      if (!studentId) {
        throw new Error("Student not found for the given userId.");
      }

      const { data, error } = await supabase.from("application").insert([
        {
          applicationid: newApplicationId,
          applicationmessage: message,
          applicationstatus: "Pending",
          studentid: studentId,
          jobid: selectedJobListing,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Application submitted successfully:", data);

      // Redirect to the submitted application page
      router.push("/(tabs)/screens/submittedapplication");
    } catch (err) {
      console.error("Error submitting application:", err.message);
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {jobDetails ? (
          <ListingDetails
            title={jobDetails.jobtitle}
            jobType={jobDetails.jobtype}
            posted={jobDetails.dateposted}
            status={jobDetails.jobstatus}
            location="Dumaguete City"
            description={jobDetails.jobdescription}
            pay={jobDetails.jobpay}
          />
        ) : (
          <Text>Loading job details...</Text>
        )}

        <ProfileCard
          profiletype="C"
          name={userAccountName || "Client Not Available"}
          stars={jobDetails?.averageRating || 0} // Pass average rating here
          company={
            jobDetails?.clientOrganization || "No Organization Available"
          }
        />

        <TextCard
          type="light"
          text="All personal information in your profile will be shared with the client."
        />
        <TextCard
          type="light"
          text="Once you click 'Send Application,' the client will review your profile."
        />
        <TextCard
          type="light"
          text="You will receive a notification if your application is accepted, and you will then be directed to a private conversation with the client."
        />

        <InputField
          title="Enter message for Client"
          size="large"
          value={message}
          onChangeText={(text) => setMessage(text)} // Update the message state
        />

        <Button
          title="Send Application"
          type="dark"
          size="medium"
          onPress={handleSendApplication} // Call the function to submit the application
        />

        <Button
          title="Cancel"
          type="light"
          size="medium"
          onPress={() => router.push("/(tabs)/student/findjob")} // Navigate to the "Find Jobs" screen
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default ViewJobListing;
