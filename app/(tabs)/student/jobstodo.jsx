import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons"; // Your custom button
import JobCard from "@/components/ui/jobcard"; // Your custom job card component
import { Link } from "expo-router"; // Expo Router's Link

const JobsToDo = () => {
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    const fetchedJobs = [
      {
        title: "Video Editing Job",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        title: "Graphic Design Job",
        description: "Cras placerat arcu nunc.",
      },
      // More jobs here...
    ];

    setMyJobs(fetchedJobs);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button title="To Do" type="dark" size="small" />
        <Link href="/student-screens/jobscompleted" asChild>
          <Button title="Completed" type="light" size="small" />
        </Link>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.jobList}>
        {myJobs.length > 0 ? (
          myJobs.map((job, index) => (
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});

export default JobsToDo;
