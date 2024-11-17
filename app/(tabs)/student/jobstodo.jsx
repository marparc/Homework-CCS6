import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons"; // Your custom button
import JobCard from "@/components/ui/jobcard"; // Your custom job card component

const JobsToDo = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [isToDoActive, setIsToDoActive] = useState(true); // Track the active button

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

  // Function to handle button press and deactivate other button
  const handleToDoClick = () => {
    setIsToDoActive(true); // Activate "To Do" button
  };

  const handleCompletedClick = () => {
    setIsToDoActive(false); // Deactivate "To Do" button
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button
          title="To Do"
          type={isToDoActive ? "dark" : "light"} // Toggle button type based on state
          size="small"
          disabled={!isToDoActive} // Disable "To Do" button if not active
          onPress={handleToDoClick}
        />
        <Button
          title="Completed"
          type={isToDoActive ? "light" : "dark"} // Toggle button type based on state
          size="small"
          onPress={handleCompletedClick}
        />
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
