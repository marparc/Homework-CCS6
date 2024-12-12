import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import JobDetails from "@/components/ui/jobdetails";
import ProfileCard from "@/components/ui/profilecard";
import Button from "@/components/ui/buttons";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/ui/inputfield";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../lib/supabase";

const JobSubmission = () => {
  const [isHomeworkSubmitted, setIsHomeworkSubmitted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);
  const [receiptNo, setReceiptNo] = useState(null);
  const [selectedjobid, setselectedjobid] = useState();
  const [jobData, setJobData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [myAccType, setMyAccType] = useState(null);
  const router = useRouter();
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    const getJobId = async () => {
      try {
        const storedjobid = await AsyncStorage.getItem("jobid");
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
        setselectedjobid(storedjobid);
        console.log("storedjobidstoredjobid:", storedjobid);
        console.log("storedAccountIdstoredAccountId:", storedjobid);
      } catch (err) {
        console.error("Failed to retrieve job id from AsyncStorage:", err);
      }
    };

    getJobId();
  }, []);

  useEffect(() => {
    const getUserType = async () => {
      if (!accountId) return;
      try {
        const { data: userAccount, error: userAccountError } = await supabase
          .from("user_account")
          .select("userid")
          .eq("accountid", accountId)
          .single();

        if (userAccountError) {
          console.error(
            "Error fetching user account:",
            userAccountError.message
          );
          return;
        }

        if (userAccount) {
          const { data: user, error: userError } = await supabase
            .from("user_table")
            .select("usertype")
            .eq("userid", userAccount.userid)
            .single();

          if (userError) {
            console.error("Error fetching user type:", userError.message);
            return;
          }

          if (user) {
            setUserType(user.usertype);
            if (user.usertype === "Student") {
              setMyAccType("Student");
            } else if (user.usertype === "Client") {
              setMyAccType("Client");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user type:", err.message);
      }
    };

    getUserType();
  }, [accountId]);

  useEffect(() => {
    const getJobData = async () => {
      if (!selectedjobid) return;
      try {
        const { data, error } = await supabase
          .from("job_listing")
          .select("*")
          .eq("jobid", selectedjobid)
          .single();

        if (error) {
          console.error("Error fetching job data:", error.message);
          return;
        }

        setJobData(data);
      } catch (err) {
        console.error("Failed to fetch job data:", err.message);
      }
    };

    getJobData();
  }, [selectedjobid]);

  console.log("User Typesssss:", userType);
  console.log("Job Data:", jobData);
  console.log("Account Type (myAccType):", myAccType);

  if (!jobData) {
    return (
      <View style={styles.container}>
        <Text>Loading job data...</Text>
      </View>
    );
  }

  return myAccType === "Student" ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {!isSubmitted ? (
        <>
          <JobDetails
            title={jobData.jobtitle || "N/A"}
            jobType={jobData.jobtype || "N/A"}
            posted={
              jobData.dateposted
                ? new Date(jobData.dateposted).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : "N/A"
            }
            status={jobData.jobstatus || "N/A"}
            location={
              `${jobData.locationlat}, ${jobData.locationlong}` ||
              "Location not available"
            }
            pay={jobData.jobpay ? `$${jobData.jobpay}` : "N/A"}
            deadline={
              jobData.duedate
                ? new Date(jobData.duedate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : "N/A"
            }
            description={jobData.jobdescription || "No description available."}
          />
          <ProfileCard
            profiletype="C"
            name="Marc Partosa"
            company="Silliman University"
          />
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={isHomeworkSubmitted ? "checked" : "unchecked"}
              onPress={() => setIsHomeworkSubmitted(!isHomeworkSubmitted)}
              color="black"
            />
            <Text style={styles.checkboxLabel}>
              I have already finished my Homework
            </Text>
          </View>
          <Button
            title="Submit"
            type="dark"
            size="medium"
            onPress={() => setIsSubmitted(true)}
          />
        </>
      ) : (
        <View style={styles.paymentReceivedContainer}>
          <Text style={styles.header}>Homework Submitted Successfully!</Text>
          <Ionicons
            name="checkmark-circle"
            size={150}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.successText}>
            Please await client payment. Check your bank account, and once
            payment is received, check the box and click 'Confirm.' Once
            'Payment Received' is selected, the conversation will end, and you
            will be able to rate the client.
          </Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={isPaymentReceived ? "checked" : "unchecked"}
              onPress={() => setIsPaymentReceived(!isPaymentReceived)}
              color="black"
            />
            <Text style={styles.checkboxLabel}>
              I have received the payment from the client.
            </Text>
          </View>
          <Button
            title="Confirm"
            type="dark"
            size="medium"
            onPress={() => console.log("Payment confirmed")}
          />
        </View>
      )}
    </ScrollView>
  ) : (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {!isSubmitted ? (
        <>
          <JobDetails
            title={jobData.jobtitle || "N/A"}
            jobType={jobData.jobtype || "N/A"}
            posted={
              jobData.dateposted
                ? new Date(jobData.dateposted).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : "N/A"
            }
            status={jobData.jobstatus || "N/A"}
            location={
              `${jobData.locationlat}, ${jobData.locationlong}` ||
              "Location not available"
            }
            pay={jobData.jobpay ? `$${jobData.jobpay}` : "N/A"}
            deadline={
              jobData.duedate
                ? new Date(jobData.duedate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })
                : "N/A"
            }
            description={jobData.jobdescription || "No description available."}
          />
          <ProfileCard
            profiletype="S"
            name="Marc Partosa"
            company="Silliman University"
          />
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={isHomeworkSubmitted ? "checked" : "unchecked"}
              onPress={() => setIsHomeworkSubmitted(!isHomeworkSubmitted)}
              color="black"
            />
            <Text style={styles.checkboxLabel}>
              I have successfully received the project.
            </Text>
          </View>
          <Button
            title="Submit"
            type="dark"
            size="medium"
            onPress={() => setIsSubmitted(true)}
          />
        </>
      ) : (
        <View style={styles.paymentReceivedContainer}>
          <View style={styles.bankInfoContainer}>
            <Text style={styles.header}>Bank Details</Text>
            <Text style={styles.successText}>Bank Name: </Text>
            <Text style={styles.successText}>Account Name:</Text>
            <Text style={styles.successText}>Account Number:</Text>
          </View>
          <Text style={styles.successText}>
            After sending the payment to the student freelancer, please enter
            the receipt and confirm that the payment has been sent.
          </Text>
          <InputField
            title="Bank Receipt"
            size="medium"
            value={receiptNo}
            onChangeText={setReceiptNo} // Pass the function reference directly
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={isPaymentReceived ? "checked" : "unchecked"}
              onPress={() => setIsPaymentReceived(!isPaymentReceived)}
              color="black"
            />
            <Text style={styles.checkboxLabel}>
              I have successfully sent payment to the student freelancer's
              account and confirm that the bank receipt is valid.
            </Text>
          </View>
          <Button
            title="Confirm"
            type="dark"
            size="medium"
            onPress={() => {
              router.push("/screens/review");
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    width: 300,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  successText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
    textAlign: "justify",
  },
  paymentReceivedContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  bankInfoContainer: {
    width: 330,
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    borderRadius: 23,
  },
});

export default JobSubmission;
