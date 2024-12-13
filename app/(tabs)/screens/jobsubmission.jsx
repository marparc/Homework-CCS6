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
  const [StudentBankDetails, setStudentBankDetails] = useState(null);

  const [jobStatus, setJobStatus] = useState(null);

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
        const { data: jobData, error: jobError } = await supabase
          .from("job_listing")
          .select("*")
          .eq("jobid", selectedjobid)
          .single();

        if (jobError) {
          console.error("Error fetching job data:", jobError.message);
          return;
        }

        const clientid = jobData?.clientid;
        if (!clientid) {
          console.error("Client ID not found in job data.");
          return;
        }

        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("client_organization, userid")
          .eq("clientid", clientid)
          .single();

        if (clientError) {
          console.error("Error fetching client data:", clientError.message);
          return;
        }

        const userid = clientData?.userid;
        if (!userid) {
          console.error("User ID not found in client data.");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname")
          .eq("userid", userid)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        const fullClientData = {
          jobData,
          clientOrganization: clientData?.client_organization,
          clientName: `${userData?.firstname} ${userData?.lastname}`,
        };

        setJobData(fullClientData);
      } catch (err) {
        console.error("Failed to fetch job data:", err.message);
      }
    };

    getJobData();
  }, [selectedjobid]);

  useEffect(() => {
    const getJobStatus = async () => {
      if (!selectedjobid) return;

      try {
        const { data, error } = await supabase
          .from("job_listing")
          .select("jobstatus")
          .eq("jobid", selectedjobid)
          .single();

        if (error) {
          console.error("Error fetching job status:", error.message);
          return;
        }

        setJobStatus(data?.jobstatus); // Correct usage
      } catch (err) {
        console.error("Error during job status fetch:", err.message);
      }
    };

    getJobStatus();
  }, [selectedjobid]);

  const updateJobStatus = async (status) => {
    try {
      const { error } = await supabase
        .from("job_listing")
        .update({ jobstatus: status })
        .eq("jobid", selectedjobid);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Error updating job status:", err.message);
    }
  };

  useEffect(() => {
    const getStudentBankDetails = async () => {
      if (!selectedjobid) return;

      try {
        const { data: chatData, error: chatError } = await supabase
          .from("chat")
          .select("studentid")
          .eq("jobid", selectedjobid)
          .single();
        console.log("chatDatachatData:", chatData);
        if (chatError) {
          console.error("Error fetching chat data:", chatError.message);
          return;
        }

        if (!chatData || !chatData.studentid) {
          console.error("Student ID not found in chat data.");
          return;
        }

        const studentid = chatData.studentid;

        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("studentid, bankname, accountnumber, userid")
          .eq("studentid", studentid)
          .single();

        if (studentError) {
          console.error("Error fetching student data:", studentError.message);
          return;
        }

        if (!studentData) {
          console.error("Student data not found.");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname")
          .eq("userid", studentData.userid)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        if (userData) {
          setStudentBankDetails({
            studentid: studentData.studentid,
            bankname: studentData.bankname,
            accountnumber: studentData.accountnumber,
            studentName: `${userData.firstname} ${userData.lastname}`,
          });
        }
      } catch (err) {
        console.error("Error fetching student bank details:", err.message);
      }
    };

    getStudentBankDetails();
  }, [selectedjobid]);

  console.log("User Typesssss:", userType);
  console.log("Job Data:", jobData);
  console.log("Account Type (myAccType):", myAccType);
  console.log("StudentBankDetails:", StudentBankDetails);
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
      {!isSubmitted && jobStatus == "In Progress" ? (
        <>
          <JobDetails
            title={jobData?.jobData?.jobtitle || "N/A"}
            jobType={jobData?.jobData?.jobtype || "N/A"}
            posted={
              jobData?.jobData?.dateposted
                ? new Date(jobData.jobData.dateposted).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }
                  )
                : "N/A"
            }
            status={jobData?.jobData?.jobstatus || "N/A"}
            location={
              `${jobData?.jobData?.locationlat}, ${jobData?.jobData?.locationlong}` ||
              "Location not available"
            }
            pay={
              jobData?.jobData?.jobpay ? `$${jobData.jobData.jobpay}` : "N/A"
            }
            deadline={
              jobData?.jobData?.duedate
                ? new Date(jobData.jobData.duedate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }
                  )
                : "N/A"
            }
            description={
              jobData?.jobData?.jobdescription || "No description available."
            }
          />
          <ProfileCard
            profiletype="C"
            name={jobData?.clientName || "N/A"}
            company={jobData?.clientOrganization || "N/A"}
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
            onPress={() => {
              setIsSubmitted(true);
              updateJobStatus("Submitted");
            }}
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
            onPress={() => {
              updateJobStatus("Completed");
              router.push(
                `/screens/review?selectedstudentid=${StudentBankDetails.studentid}&selectedclientid=${jobData.jobData.clientid}`
              );
            }}
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
            title={jobData?.jobData?.jobtitle || "N/A"}
            jobType={jobData?.jobData?.jobtype || "N/A"}
            posted={
              jobData?.jobData?.dateposted
                ? new Date(jobData.jobData.dateposted).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }
                  )
                : "N/A"
            }
            status={jobData?.jobData?.jobstatus || "N/A"}
            location={
              `${jobData?.jobData?.locationlat}, ${jobData?.jobData?.locationlong}` ||
              "Location not available"
            }
            pay={
              jobData?.jobData?.jobpay ? `$${jobData.jobData.jobpay}` : "N/A"
            }
            deadline={
              jobData?.jobData?.duedate
                ? new Date(jobData.jobData.duedate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }
                  )
                : "N/A"
            }
            description={
              jobData?.jobData?.jobdescription || "No description available."
            }
          />
          <ProfileCard
            profiletype="C"
            name={jobData?.clientName || "N/A"} // Dynamically set client name
            company={jobData?.clientOrganization || "N/A"} // Dynamically set client organization
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
            onPress={() => {
              setIsSubmitted(true);
            }}
          />
        </>
      ) : (
        <View style={styles.paymentReceivedContainer}>
          <View style={styles.bankInfoContainer}>
            <Text style={styles.header}>Bank Details</Text>
            <Text style={styles.successText}>
              Bank Name: {StudentBankDetails.bankname}
            </Text>
            <Text style={styles.successText}>
              Account Name: {StudentBankDetails.accountnumber}
            </Text>
            <Text style={styles.successText}>
              Account Number: {StudentBankDetails.studentName}
            </Text>
          </View>
          <Text style={styles.successText}>
            After sending the payment to the student freelancer, please enter
            the receipt and confirm that the payment has been sent.
          </Text>
          <InputField
            title="Bank Receipt"
            size="medium"
            value={receiptNo}
            onChangeText={setReceiptNo}
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
            onPress={async () => {
              try {
                router.push(
                  `/screens/review?selectedstudentid=${StudentBankDetails.studentid}&selectedclientid=${jobData.jobData.clientid}`
                );
              } catch (error) {
                console.error("Error during job status update:", error.message);
              }
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
