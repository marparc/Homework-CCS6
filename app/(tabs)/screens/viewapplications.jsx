import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import PortfolioCard from "@/components/ui/portfoliocard";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams } from "expo-router";
import PopUp from "@/components/ui/popup";

const ViewApplication = () => {
  const { studentid, jobid } = useLocalSearchParams();
  const [studentData, setStudentData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [popUpRoute, setPopUpRoute] = useState("");

  console.log("JOBID: ", jobid);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data: student, error: studentError } = await supabase
          .from("student")
          .select("*")
          .eq("studentid", studentid)
          .single();

        if (studentError) throw studentError;

        const { data: user, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname, birthdate")
          .eq("userid", student.userid)
          .single();

        if (userError) throw userError;
        const { data: job, error: jobError } = await supabase
          .from("job_listing")
          .select("*")
          .eq("jobid", jobid)
          .single();

        if (jobError) throw jobError;

        const { data: application, error: applicationError } = await supabase
          .from("application")
          .select("applicationmessage, applicationstatus")
          .eq("studentid", studentid)
          .eq("jobid", jobid)
          .single();

        if (applicationError) throw applicationError;

        const { data: portfolios, error: portfolioError } = await supabase
          .from("portfolio")
          .select("portfolioname, portfoliodesc")
          .eq("studentid", studentid);

        if (portfolioError) throw portfolioError;

        setStudentData({
          ...student,
          firstname: user.firstname,
          lastname: user.lastname,
          birthdate: user.birthdate,
        });
        setJobData(job);
        setApplicationData(application);
        setPortfolios(portfolios);

        console.log("student: ", student);
        console.log("user: ", user);
        console.log("job: ", job);
        console.log("application: ", application);
        console.log("portfolios: ", portfolios);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentid, jobid]);

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from("application")
        .update({ applicationstatus: "Rejected" })
        .eq("studentid", studentid)
        .eq("jobid", jobid);

      if (error) {
        console.error("Error rejecting application:", error.message);
        return;
      }

      setApplicationData((prevData) => ({
        ...prevData,
        applicationstatus: "Rejected",
      }));

      setPopUpMessage("Job Application Rejected!");
      setPopUpRoute("/(tabs)/client/myjoblistings");
      setPopUpVisible(true);
    } catch (error) {
      console.error("Error rejecting application:", error.message);
      alert("Failed to reject the application.");
    }
  };

  const handleAccept = async () => {
    try {
      // Update application status to "Approved"
      const { error: applicationError } = await supabase
        .from("application")
        .update({ applicationstatus: "Approved" })
        .eq("studentid", studentid)
        .eq("jobid", jobid);

      if (applicationError) {
        console.error("Error updating application:", applicationError.message);
        return;
      }

      // Update job status to "In Progress"
      const { error: jobError } = await supabase
        .from("job_listing")
        .update({ jobstatus: "In Progress" })
        .eq("jobid", jobid);

      if (jobError) {
        console.error("Error updating job:", jobError.message);
        return;
      }

      // Fetch client ID for the job
      const { data: jobData, error: jobDataError } = await supabase
        .from("job_listing")
        .select("clientid")
        .eq("jobid", jobid)
        .single();

      if (jobDataError) {
        console.error("Error fetching job client:", jobDataError.message);
        return;
      }

      const clientid = jobData.clientid;

      const { data: chats, error: chatError } = await supabase
        .from("chat")
        .select("chatid");

      if (chatError) {
        console.error("Error fetching chats:", chatError.message);
        return;
      }

      const nextChatid =
        chats.length > 0
          ? Math.max(...chats.map((chat) => chat.chatid)) + 1
          : 1;

      const { error: chatInsertError } = await supabase.from("chat").insert([
        {
          chatid: nextChatid,
          clientid: clientid,
          studentid: studentid,
          jobid: jobid,
        },
      ]);

      if (chatInsertError) {
        console.error("Error inserting chat:", chatInsertError.message);
        return;
      }

      setPopUpMessage(
        "Job Application Accepted! You can now start messaging the student."
      );
      setPopUpRoute("/(tabs)/client/chat");
      setPopUpVisible(true);
    } catch (error) {
      console.error("Error processing accept action:", error.message);
      alert("Failed to accept the application.");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!studentData || !jobData) {
    return <Text>No data available</Text>;
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>
              {studentData?.firstname ? studentData.firstname[0] : ""}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>
              {studentData?.firstname} {studentData?.lastname}
            </Text>
            <Text style={styles.type}>Student</Text>
            <Text style={styles.id}>Student ID: {studentData?.studentid}</Text>
          </View>
        </View>

        <View style={styles.aboutContainer}>
          <Text style={styles.detailsHeader}>About Me:</Text>
          <Text style={styles.details}>
            Birthdate: {studentData.birthdate || "Not available"}
          </Text>
          <Text style={styles.detailsHeader}>Education:</Text>
          <Text style={styles.details}>
            {studentData.educationlevel} ({studentData.yearlevel})
          </Text>
          <Text style={styles.details}>{studentData.degree}</Text>
          <Text style={styles.details}>
            Studies at {studentData.currentschool}
          </Text>
        </View>

        <View style={styles.applicationContainer}>
          <Text style={styles.detailsHeader}>Application Message:</Text>
          <Text style={styles.details}>
            {applicationData?.applicationmessage || "No message provided"}
          </Text>
        </View>

        <View style={styles.portfolioContainer}>
          <Text style={styles.detailsHeader}>Samples of My Work</Text>
          {portfolios && portfolios.length > 0 ? (
            portfolios.map((portfolioItem, index) => (
              <View
                key={index}
                style={[
                  styles.portfolioCardContainer,
                  index < portfolios.length - 1
                    ? styles.portfolioCardSpacing
                    : null,
                ]}
              >
                <PortfolioCard
                  title={portfolioItem.portfolioname}
                  description={portfolioItem.portfoliodesc}
                  link={portfolioItem.link}
                />
              </View>
            ))
          ) : (
            <Text>No portfolios available for this account.</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Accept"
            type="dark"
            size="small"
            onPress={handleAccept}
          />

          <Button
            title="Reject"
            type="light"
            size="small"
            onPress={handleReject}
          />
        </View>
      </ScrollView>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text={popUpMessage}
          route={popUpRoute}
        />
      )}
    </>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    backgroundColor: "black",
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "absolute",
    zIndex: 2,
    top: 40, // Adjust this value to control the space between the circle and the top of the screen
  },
  circleText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "black",
  },
  infoContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 160,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  type: {
    fontSize: 16,
    color: "#ccc",
  },
  id: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  aboutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    alignItems: "center", // Centers the content horizontally
    justifyContent: "center", // Centers the content vertically (if there is enough space)
  },
  detailsHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 6,
    textAlign: "center", // Centers the text horizontally
  },
  details: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
    textAlign: "center", // Centers the text horizontally
  },
  applicationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  portfolioContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20, // Ensures sufficient margin from the above section
  },
  portfolioCardContainer: {
    marginBottom: 10, // Space between each PortfolioCard
  },
  portfolioCardSpacing: {
    marginBottom: 16, // Space after each portfolio card (add margin only between the cards)
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "center", // Center buttons horizontally
    alignItems: "center", // Align buttons vertically if needed
    marginTop: 20, // Add margin top to provide space from the previous section
    gap: 16, // Adds space between the buttons
    marginBottom: 100,
  },
});

export default ViewApplication;
