import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";

const MyListings = () => {
  // Simulate fetching job listings from a database
  const [jobListings, setJobListings] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // Simulate fetching jobs from an API or database
    const fetchedJobs = [
      {
        title: "Video Editing Job",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna.",
      },
      {
        title: "Graphic Design Job",
        description:
          "Cras placerat arcu nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      },
      {
        title: "Web Development Job",
        description:
          "Integer at tempor lectus, ut laoreet neque. Duis ut accumsan libero, a consectetur velit.",
      },

      {
        title: "Video Editing Job",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna.",
      },
      {
        title: "Graphic Design Job",
        description:
          "Cras placerat arcu nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      },
      {
        title: "Web Development Job",
        description:
          "Integer at tempor lectus, ut laoreet neque. Duis ut accumsan libero, a consectetur velit.",
      },

      {
        title: "Video Editing Job",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna.",
      },
      {
        title: "Graphic Design Job",
        description:
          "Cras placerat arcu nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
      },
      {
        title: "Web Development Job",
        description:
          "Integer at tempor lectus, ut laoreet neque. Duis ut accumsan libero, a consectetur velit.",
      },
    ];

    // Update the state with fetched job listings
    setJobListings(fetchedJobs);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button title="My Listings" type="dark" size="small" />
        <Button title="Applications" type="light" size="small" />
      </SafeAreaView>
      <View style={{ marginLeft: 20 }}>
        <Button
          title="Create +"
          type="light"
          size="small"
          onPress={() => router.push("/screens/postjoblisting")}
        />
      </View>
      {/* Make the job listings scrollable */}
      <ScrollView contentContainerStyle={styles.jobList}>
        {jobListings.length > 0 ? (
          jobListings.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              description={job.description}
            />
          ))
        ) : (
          <Text>No job listings available.</Text>
        )}
      </ScrollView>
    </>
  );
};

export default MyListings;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});
