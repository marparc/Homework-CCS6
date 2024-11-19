import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ListingDetails from "../../../components/ui/jobdetailsexpanded";
import { useRouter } from "expo-router"; // Importing useRouter from expo-router

const ViewJobListing = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    position: "absolute",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40, // For spacing if you have a status bar
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#f8f8f8",
    elevation: 4, // To give shadow for Android
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

export default ViewJobListing;
