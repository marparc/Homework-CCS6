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
import HandLoading from "@/components/ui/handloading";

const ViewJobListing = () => {
  const router = useRouter();
  const { selectedJobListing } = useLocalSearchParams();
  const [accountId, setAccountId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [userAccountName, setUserAccountName] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

          const clientId = job.clientid;

          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("client_organization, userid")
            .eq("clientid", clientId)
            .single();

          if (clientError) {
            throw new Error(clientError.message);
          }

          if (clientData) {
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
            }

            const { data: evaluations, error: evalError } = await supabase
              .from("client_evaluation")
              .select("rating")
              .eq("clientid", clientId);

            if (evalError) {
              throw new Error(evalError.message);
            }

            if (evaluations && evaluations.length > 0) {
              const averageRating =
                evaluations.reduce(
                  (sum, evaluation) => sum + evaluation.rating,
                  0
                ) / evaluations.length;

              setJobDetails((prevJobDetails) => ({
                ...prevJobDetails,
                clientOrganization: clientData.client_organization,
                averageRating: averageRating.toFixed(1),
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching job data:", err.message);
        setError(err.message);
      }
    };

    setLoading(false);
    fetchJobData();
  }, [selectedJobListing]);

  const handleSendApplication = async () => {
    if (message.trim() === "") {
      setError("Message is required.");
      return;
    }

    setError(null); // Clear previous error

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

      router.push("/(tabs)/screens/submittedapplication");
    } catch (err) {
      console.error("Error submitting application:", err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return <HandLoading></HandLoading>;
  }

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
        ) : null}

        <ProfileCard
          profiletype="C"
          name={userAccountName || "Client Not Available"}
          stars={jobDetails?.averageRating || 0}
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

        {/* Display error message if validation fails */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Send Application"
          type="dark"
          size="medium"
          onPress={handleSendApplication}
        />
        <Button
          title="Cancel"
          type="light"
          size="medium"
          onPress={() => router.push("/(tabs)/student/findjob")}
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
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});

export default ViewJobListing;
