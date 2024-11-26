import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import ToDoDetails from "../../screens/todo"
const JobsToDo = () => {
  const [isToDoActive, setIsToDoActive] = useState(true);
  const router = useRouter();

  const [myJobs, setMyJobs] = useState([]);
  const [error, setError] = useState(null);

  const [accountId, setAccountId] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        const storedPassword = await AsyncStorage.getItem("password");
        setAccountId(storedAccountId);
        setPassword(storedPassword);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  const fetchFilteredJobs = async (inputid) => {
    try {
      console.log("Fetching jobs with inputid:", inputid);

      const { data, error } = await supabase
        .from("job_listing")
        .select(
          `
          *,
          application (
            applicationmessage,
            applicationstatus,
            studentid
          )
        `
        )
        .eq("jobstatus", "In Progress");

      if (error) {
        console.error("Error fetching data:", error);
        return null;
      }
      const filteredJobs = data.filter((job) =>
        job.application.some((app) => app.studentid === inputid)
      );

      //console.log("Filtered Jobs:", filteredJobs);
      setMyJobs(filteredJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (accountId) {
      //console.log("accountId from AsyncStorage:", accountId);
      const parsedAccountId = parseInt(accountId, 10);
      fetchFilteredJobs(parsedAccountId);
    }
  }, [accountId]);

  const handleToDoClick = () => {
    setIsToDoActive(true);
    const inputid = 2;
    fetchFilteredJobs(inputid);
  };

  const handleCompletedClick = () => {
    setIsToDoActive(false);
  };

  const JobListingDetails = (jobid) => {
    console.log("Navigating with jobtitle:", jobid); // Log the jobtitle
    //router.push({
    //  pathname: "/screens/todo", // Ensure the correct path
    //  state: { jobtitle }, // Pass jobtitle in the state object
    //});

    router.push(`/screens/todo?selectedjobid=${jobid}`);
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button
          title="To Do"
          type={isToDoActive ? "dark" : "light"}
          size="small"
          disabled={!isToDoActive}
          onPress={handleToDoClick}
        />
        <Button
          title="Completed"
          type={isToDoActive ? "light" : "dark"}
          size="small"
          onPress={handleCompletedClick}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.jobList}>
        {myJobs.length > 0 ? (
          myJobs.map((job, index) => (
            <JobCard
              key={job.jobid}
              title={job.jobtitle} // Access job title from the job object
              description={job.jobdescription} // Access job description from the job object
              onPress={() => {
                // Navigate to JobListingDetails screen and pass the job title as a parameter
                JobListingDetails(job.jobid); // Pass job.title to navigate
              }}
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
