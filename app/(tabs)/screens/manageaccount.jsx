import { ScrollView, Text, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import Button from "@/components/ui/buttons";
import HandLoading from "@/components/ui/handloading";

const ManageAccount = () => {
  const { selectedAccount, accountStatus } = useLocalSearchParams();
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  console.log("selected Account: ", selectedAccount);

  const fetchAccountDetails = async () => {
    try {
      const { data: accountData, error: accountError } = await supabase
        .from("user_account")
        .select("*")
        .eq("accountid", selectedAccount)
        .single();

      console.log("accountData: ", accountData);

      if (accountError) {
        throw accountError;
      }

      const { data: userData, error: userError } = await supabase
        .from("user_table")
        .select("firstname, lastname, contactnumber, birthdate, usertype")
        .eq("userid", accountData.userid)
        .single();

      console.log("userData", userData);

      if (userError) {
        throw userError;
      }

      let additionalData = null;
      if (userData.usertype === "Student") {
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("*")
          .eq("userid", accountData.userid)
          .single();

        console.log("studentData", studentData);

        if (studentError) {
          throw studentError;
        }

        additionalData = { student: studentData };
      } else if (userData.usertype === "Client") {
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("*")
          .eq("userid", accountData.userid)
          .single();

        console.log("clientData", clientData);

        if (clientError) {
          throw clientError;
        }

        additionalData = { client: clientData };
      }

      setAccountDetails({
        account: accountData,
        user: userData,
        ...additionalData,
      });
    } catch (e) {
      console.error("Error fetching details:", e);
      setError("Unable to fetch account details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedAccount) {
      setError("No account selected.");
      setLoading(false);
      return;
    }

    if (selectedAccount) {
      fetchAccountDetails();
    }
  }, [selectedAccount]);

  // Handle navigation when "Back" button is clicked
  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
  };

  const handleApproveAccount = async () => {
    setUpdateLoading(true);
    try {
      console.log("Trying to approve account with details:", accountDetails);
      const { data, error } = await supabase
        .from("user_account")
        .update({ account_status: "Verified" })
        .eq("userid", accountDetails?.account?.userid);

      if (error) {
        console.error("Error updating row:", error);
      } else {
        console.log("Updated row:", data);
      }
    } catch (error) {
      console.error("Error approving account:", error);
    } finally {
      setUpdateLoading(false);
    }
    router.back();
  };

  const handleRejectAccount = async () => {
    setUpdateLoading(true);
    try {
      console.log("Trying to reject account with details:", accountDetails);
      const { data, error } = await supabase
        .from("user_account")
        .update({ account_status: "Rejected" })
        .eq("userid", accountDetails?.account?.userid);

      if (error) {
        console.error("Error updating row:", error);
      } else {
        console.log("Updated row:", data);
      }
    } catch (error) {
      console.error("Error approving account:", error);
    } finally {
      setUpdateLoading(false);
    }
    router.back();
  };

  if (loading) {
    return <HandLoading />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.detailTitle}>First Name:</Text>
          {accountDetails && accountDetails.user ? (
            <Text style={styles.accountDetail}>
              {accountDetails.user.firstname}
            </Text>
          ) : (
            <Text style={styles.accountDetail}>
              No account details available.
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.detailTitle}>Last Name:</Text>
          {accountDetails && accountDetails.user ? (
            <Text style={styles.accountDetail}>
              {accountDetails.user.lastname}
            </Text>
          ) : (
            <Text style={styles.accountDetail}>
              No account details available.
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.detailTitle}>Contact Number:</Text>
          <Text style={styles.accountDetail}>
            {accountDetails.user.contactnumber}
          </Text>
        </View>
        <View>
          <Text style={styles.detailTitle}>Birthdate:</Text>
          <Text style={styles.accountDetail}>
            {accountDetails.user.birthdate}
          </Text>
        </View>

        {accountDetails?.user?.usertype === "Student" && (
          <View>
            <View>
              <Text style={styles.sectionTitle}>Account Type:</Text>
              <Text style={styles.accountDetail}>Student</Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Current School: </Text>
              <Text style={styles.accountDetail}>
                {" "}
                {accountDetails?.student?.currentschool || "N/A"}
              </Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Education Level: </Text>
              <Text style={styles.accountDetail}>
                {" "}
                {accountDetails?.student?.educationlevel || "N/A"}
              </Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Degree: </Text>
              <Text style={styles.accountDetail}>
                {" "}
                {accountDetails?.student?.degree || "N/A"}
              </Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Year Level: </Text>
              <Text style={styles.accountDetail}>
                {" "}
                {accountDetails?.student?.yearlevel || "N/A"}
              </Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Bank: </Text>
              <Text style={styles.accountDetail}>
                {" "}
                {accountDetails?.student?.bankname || "N/A"}
              </Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Bank Account: </Text>
              <Text style={styles.accountDetail}>
                {" "}
                {accountDetails?.student?.accountnumber || "N/A"}
              </Text>
            </View>
          </View>
        )}

        {accountDetails?.user?.usertype === "Client" && (
          <View>
            <View>
              <Text style={styles.sectionTitle}>Account Type:</Text>
              <Text style={styles.accountDetail}>Client</Text>
            </View>
            <View>
              <Text style={styles.detailTitle}>Organization: </Text>
              <Text style={styles.accountDetail}>
                {accountDetails?.client?.client_organization || "N/A"}
              </Text>
            </View>
          </View>
        )}

        {accountDetails && accountDetails.account && (
          <>
            {accountDetails?.account?.account_status === "Pending" ? (
              <View style={styles.buttonRow}>
                <Button
                  title="Approve"
                  type="dark"
                  size="small"
                  onPress={handleApproveAccount}
                  disabled={updateLoading}
                />
                <Button
                  title="Reject"
                  type="light"
                  size="small"
                  onPress={handleRejectAccount}
                  disabled={updateLoading}
                />
              </View>
            ) : accountDetails?.account?.account_status === "Verified" ? (
              <Button
                title="Back"
                type="dark"
                size="small"
                onPress={handleBackClick}
              />
            ) : null}
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    margin: 10,
    flez: 1,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accountDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Space buttons evenly
    marginTop: 5, // Add margin to separate it from the title
  },
});

export default ManageAccount;
