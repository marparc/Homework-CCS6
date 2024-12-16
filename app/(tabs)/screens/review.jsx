import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import ProfileCard from "@/components/ui/profilecard";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUp from "@/components/ui/popup";
import HandLoading from "@/components/ui/handloading";

const Review = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [studentName, setStudentName] = useState("");
  const [currentSchool, setCurrentSchool] = useState("");
  const [clientName, setClientName] = useState("");
  const [organization, setOrganization] = useState("");
  const { selectedstudentid, selectedclientid } = useLocalSearchParams();
  const [myAccType, setMyAccType] = useState("");
  const [accountId, setAccountId] = useState(null);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [reviewUploadedPopUp, setReviewUploadedPopUp] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("selectedclientid: ", selectedclientid);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchAccountType = async () => {
      if (!accountId) return;

      try {
        const { data: accountData, error: accountError } = await supabase
          .from("user_account")
          .select("userid")
          .eq("accountid", accountId)
          .single();

        if (accountError) {
          console.error("Error fetching account data:", accountError.message);
          return;
        }

        if (accountData) {
          const { userid } = accountData;

          const { data: userData, error: userError } = await supabase
            .from("user_table")
            .select("usertype")
            .eq("userid", userid)
            .single();

          if (userError) {
            console.error("Error fetching user type:", userError.message);
            return;
          }

          if (userData) {
            setMyAccType(userData.usertype);
          }
        }
      } catch (error) {
        console.error("Error fetching account type:", error.message);
      }
    };

    fetchAccountType();
  }, [accountId]);

  const fetchStudentData = async () => {
    if (!selectedstudentid) return;

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("student")
        .select("currentschool, userid")
        .eq("studentid", selectedstudentid)
        .single();

      if (studentError) {
        console.error("Error fetching student data:", studentError.message);
        return;
      }

      if (studentData) {
        setCurrentSchool(studentData.currentschool);

        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname")
          .eq("userid", studentData.userid)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        if (userData) {
          setStudentName(`${userData.firstname} ${userData.lastname}`);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error in fetchStudentData:", error.message);
    }
  };

  const fetchClientData = async () => {
    if (!selectedclientid) return;

    try {
      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("client_organization, userid")
        .eq("clientid", selectedclientid)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError.message);
        return;
      }

      if (clientData) {
        setOrganization(clientData.client_organization);

        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname")
          .eq("userid", clientData.userid)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        if (userData) {
          setClientName(`${userData.firstname} ${userData.lastname}`);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error in fetchClientData:", error.message);
    }
  };

  useEffect(() => {
    if (myAccType === "Student") {
      fetchClientData();
    } else if (myAccType === "Client") {
      fetchStudentData();
    }
  }, [myAccType, selectedstudentid, selectedclientid]);

  const handleSubmitRating = async () => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);

    if (rating == 0 || comment == "") {
      setIsPopUpVisible(true);

      // Hide the popup after 3 seconds
      setTimeout(() => {
        setIsPopUpVisible(false);
      }, 3000); // Popup stays visible for 3 seconds
    } else {
      try {
        let insertError;

        if (myAccType === "Client") {
          const { error } = await supabase.from("stud_evaluation").insert([
            {
              rating: rating,
              usercomment: comment,
              clientid: selectedclientid,
              studentid: selectedstudentid,
            },
          ]);
          insertError = error;
        } else {
          const { error } = await supabase.from("client_evaluation").insert([
            {
              rating: rating,
              usercomment: comment,
              clientid: selectedclientid,
              studentid: selectedstudentid,
            },
          ]);
          insertError = error;
        }

        if (insertError) {
          console.error(
            `Error inserting into ${
              myAccType === "Client" ? "stud_evaluation" : "client_evaluation"
            }:`,
            insertError.message
          );
          return;
        }
      } catch (error) {
        console.error("Error during rating submission:", error.message);
      }

      setReviewUploadedPopUp(true);
    }
  };

  if (loading) {
    return <HandLoading></HandLoading>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Deal Done!</Text>
        <Ionicons name="happy-outline" size={150} color="black" />

        <ProfileCard
          profiletype={myAccType === "Student" ? "C" : "S"} // Dynamically set profile type
          name={myAccType === "Student" ? clientName : studentName}
          company={myAccType === "Student" ? organization : currentSchool}
        />

        <Text>
          {myAccType === "Student"
            ? "Rate your client and share your experience working together."
            : "Rate the student freelancer and share your experience working together."}
        </Text>

        <Rating
          onFinishRating={setRating}
          startingValue={rating}
          imageSize={30}
          style={styles.rating}
        />

        <InputField
          title={null}
          size="large"
          value={comment}
          onChangeText={setComment}
        />

        {isPopUpVisible && (
          <PopUp
            icon="alert-outline"
            text="Please double-check all fields to ensure none are empty."
          />
        )}

        {reviewUploadedPopUp && (
          <PopUp
            icon="checkmark-outline"
            text="Review was uploaded successfully!"
            route={
              myAccType === "Student"
                ? "/(tabs)/student/chat"
                : "/(tabs)/client/chat"
            }
          />
        )}

        <Button
          title="Submit Rating"
          type="dark"
          size="medium"
          onPress={handleSubmitRating}
        />
      </View>
    </ScrollView>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  icon: {
    marginVertical: 20,
  },
  rating: {
    marginTop: 20,
  },
});
