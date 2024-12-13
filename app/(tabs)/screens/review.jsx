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

const Review = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [studentName, setStudentName] = useState("");
  const [currentSchool, setCurrentSchool] = useState("");
  const { selectedstudentid, selectedclientid } = useLocalSearchParams();
  const [myAccType, setMyAccType] = useState();

  console.log("selectedclientid: ", selectedclientid);

  useEffect(() => {
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
          }
        }
      } catch (error) {
        console.error("Error in fetchStudentData:", error.message);
      }
    };

    fetchStudentData();
  }, [selectedstudentid]);

  const handleSubmitRating = async () => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);

    try {
      const { error: insertError } = await supabase
        .from("stud_evaluation")
        .insert([
          {
            rating: rating,
            usercomment: comment,
            clientid: selectedclientid,
            studentid: selectedstudentid,
          },
        ]);

      if (insertError) {
        console.error(
          "Error inserting into stud_evaluation:",
          insertError.message
        );
        return;
      }

      console.log("Rating and comment successfully inserted.");
      router.push("/(tabs)/student/jobstodo");
    } catch (error) {
      console.error("Error during rating submission:", error.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Deal Done!</Text>
        <Ionicons name="happy-outline" size={150} color="black" />

        <ProfileCard
          profiletype={myAccType === "Client" ? "S" : "C"} // Dynamically set profile type
          name={studentName || "N/A"}
          company={currentSchool || "N/A"}
        />

        <Text>
          {myAccType === "Client"
            ? "Rate the student freelancer and share your experience working together."
            : "Rate your client and share your experience working together."}
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
