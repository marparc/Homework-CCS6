import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import JobDetails from "@/components/ui/jobdetails";
import ProfileCard from "@/components/ui/profilecard";
import Button from "@/components/ui/buttons";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/ui/inputfield";

const JobSubmission = () => {
  const [isHomeworkSubmitted, setIsHomeworkSubmitted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);
  const [receiptNo, setReceiptNo] = useState(null);
  const myAccType = "Client"; // Example account type

  return myAccType === "Student" ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {!isSubmitted ? (
        <>
          <JobDetails
            title="Video Editor"
            jobType="Onsite"
            posted="December 3, 2024"
            status="Open"
            location="Silliman University, Dumaguete City"
            pay="5500"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna. Sed sodales et nisl at ultrices. Sed nec ante ornare, tempor quam in, eleifend velit. Duis ut accumsan libero, a consectetur velit. Integer at tempor lectus, ut laoreet neque."
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
            title="Video Editor"
            jobType="Onsite"
            posted="December 3, 2024"
            status="Open"
            location="Silliman University, Dumaguete City"
            pay="5500"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna. Sed sodales et nisl at ultrices. Sed nec ante ornare, tempor quam in, eleifend velit. Duis ut accumsan libero, a consectetur velit. Integer at tempor lectus, ut laoreet neque."
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
            onPress={() => console.log("Payment confirmed")}
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
