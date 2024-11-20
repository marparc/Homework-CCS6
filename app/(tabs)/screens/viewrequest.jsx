import { View, Text, StyleSheet } from "react-native";
import React from "react";
import JobDetails from "@/components/ui/jobdetails";
import { useRouter } from "expo-router"; // Importing useRouter from expo-router

const ViewJobListing = () => {
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <JobDetails
          title="Video Editor"
          jobType="Onsite"
          posted="December 3, 2024"
          status="Open"
          location="Silliman University, Dumaguete City"
          pay="5500"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna. Sed sodales et nisl at ultrices. Sed nec ante ornare, tempor quam in, eleifend velit. Duis ut accumsan libero, a consectetur velit. Integer at tempor lectus, ut laoreet neque. "
        />
      </View>
    </>
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
