import { StyleSheet, ScrollView } from "react-native";
import React from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import { useRouter } from "expo-router";
import Button from "@/components/ui/buttons";
import ProfileCard from "@/components/ui/profilecard";
import TextCard from "@/components/ui/textcard";

const ViewRequest = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
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

      <ProfileCard
        profiletype="C"
        name="Marc Partosa"
        company="Silliman University"
      />

      <TextCard
        type="light"
        text="Once you click 'Accept,' a conversation will be created between you and the client to ensure the job goes smoothly."
      ></TextCard>

      <Button
        title="Approve"
        type="dark"
        size="medium"
        onPress={() => console.log("Confirmed")}
      />

      <Button
        title="Decline"
        type="light"
        size="medium"
        onPress={() => router.push("")}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
    elevation: 4, // Shadow for Android
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ViewRequest;
