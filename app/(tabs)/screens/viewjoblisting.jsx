import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import TextCard from "@/components/ui/textcard";
import { useRouter } from "expo-router";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";

const ViewJobListing = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ListingDetails
          title="Video Editor"
          jobType="Onsite"
          posted="November 21, 2024"
          status="Open"
          client="Marc Warren"
          stars="5"
          location="Dumaguete City"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras placerat arcu nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
          pay="5000"
        />

        <TextCard
          type="light"
          text="All personal information in your profile will be shared with the client. Once you click 'Send Application,' the client will review your profile. 

You will receive a notification if your application is accepted, and you will then be directed to a private conversation with the client."
        />

        <InputField title="Enter message for Client" size="large" />

        <Button
          title="Send Application"
          type="dark"
          size="medium"
          onPress={() => {
            router.push("/(tabs)/screens/submittedapplication");
          }}
        />

        <Button title="Cancel" type="light" size="medium" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Set a background color for the screen
  },
  scrollContainer: {
    padding: 16, // Add padding for better spacing
    alignItems: "center", // Center child elements horizontally
  },
});

export default ViewJobListing;
