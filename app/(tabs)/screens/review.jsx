import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import ProfileCard from "@/components/ui/profilecard";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [myAccType, setMyAccType] = useState(null);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Deal Done!</Text>
        <Ionicons name="happy-outline" size={150} color="black" />

        <ProfileCard
          profiletype="S"
          name="Marc Partosa"
          company="Silliman University"
        />

        <Text>
          Rate the student freelancer and share your experience working
          together.
        </Text>
        <Rating
          onFinishRating={setRating}
          startingValue={rating}
          imageSize={30} // Size of stars
          style={styles.rating}
        />

        <InputField
          title={null}
          size="large"
          value={comment}
          onChangeText={setComment}
        />

        <Button title="Submit Rating" type="dark" size="medium" />
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
