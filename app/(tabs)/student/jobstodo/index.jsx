import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const fetchFilteredJobs = async (inputid, jobStatus) => {
    try {
      console.log("Fetching jobs with inputid:", inputid);

      const { data: jobData, error: jobError } = await supabase
        .from("job_listing")
        .select("*, requestid")
        .eq("jobstatus", jobStatus);

      if (jobError) {
        console.error("Error fetching job data:", jobError);
        return;
      }

      const { data: applicationData, error: applicationError } = await supabase
        .from("application")
        .select("applicationmessage, applicationstatus, studentid, jobid");

      if (applicationError) {
        console.error("Error fetching application data:", applicationError);
        return;
      }

      const { data: serviceRequestData, error: serviceRequestError } =
        await supabase.from("service_request").select("serviceid, requestid");

      if (serviceRequestError) {
        console.error(
          "Error fetching service request data:",
          serviceRequestError
        );
        return;
      }

      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("serviceid, studentid");

      if (serviceError) {
        console.error("Error fetching service data:", serviceError);
        return;
      }

      const filteredJobs = jobData.filter((job) => {
        if (job.requestid) {
          const serviceRequest = serviceRequestData.find(
            (sr) => sr.requestid === job.requestid
          );
          if (serviceRequest) {
            const service = serviceData.find(
              (s) => s.serviceid === serviceRequest.serviceid
            );
            if (service && service.studentid === inputid) {
              return true;
            }
          }
        }
        return applicationData.some(
          (app) => app.studentid === inputid && app.jobid === job.jobid
        );
      });

      setMyJobs(filteredJobs);
      console.log("filteredJobs:", filteredJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (accountId) {
      const parsedAccountId = parseInt(accountId, 10);
      fetchFilteredJobs(
        parsedAccountId,
        isToDoActive ? "In Progress" : "Completed"
      );
    }
  }, [accountId, isToDoActive]);

  const handleToDoClick = () => {
    setIsToDoActive(true);
  };

  const handleCompletedClick = () => {
    setIsToDoActive(false);
  };

  const JobListingDetails = (jobid, jobStatus) => {
    console.log("Navigating with jobid:", jobid, "and jobStatus:", jobStatus);
    router.push(`/screens/todo?selectedjobid=${jobid}&jobstatus=${jobStatus}`);
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

      <ScrollView
        contentContainerStyle={styles.jobList}
        showsVerticalScrollIndicator={false}
      >
        {myJobs.length > 0 ? (
          myJobs.map((job) => (
            <JobCard
              key={job.jobid}
              title={job.jobtitle}
              description={job.jobdescription}
              onPress={() => {
                JobListingDetails(job.jobid, job.jobstatus);
              }}
            />
          ))
        ) : (
          <Text>{error || "No job listings available."}</Text>
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
