import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import PopUp from "@/components/ui/popup";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

const DeleteService = ({ id }) => {
  const router = useRouter();
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const { selectedservice } = useLocalSearchParams();

  console.log("DELETE RECEIVE ROUTER: ", selectedservice);

  const delService = () => {
    setPopUpVisible(true);
  };

  const deleteService = async (selectedservice) => {
    const { data, error } = await supabase
      .from("services")
      .delete()
      .eq("serviceid", selectedservice);

    if (error) {
      console.error("Error deleting service:", error);
    } else {
      console.log("Service deleted successfully:", data);
      router.push("/(tabs)/student/profile");
    }
  };
  const handleCancel = () => {
    router.push("/(tabs)/student/profile"); // Navigate back to profile
  };
  return (
    <>
      <View style={styles.centeredContainer}>
        <View style={styles.cardContainer}>
          <JobCard
            title="Video Editing Job"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna, a finibus magna. Sed sodales et nisl at ultrices. Sed nec ante ornare, tempor quam in, eleifend velit. Duis ut accumsan libero, a consectetur velit. Integer at tempor lectus, ut laoreet neque. "
          />

          <Text style={styles.text}>
            Are you sure you want to delete this service?
          </Text>
          <Button
            title="Delete"
            type="dark"
            size="medium"
            onPress={() => deleteService(selectedservice)} // Confirm deletion
          />
          <Button
            title="Cancel"
            type="light"
            size="medium"
            onPress={handleCancel} // Go back to profile without deleting
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          text="Service Deleted Successfully!"
          route="/(tabs)/student/profile"
          icon="checkmark-circle-outline"
        />
      )}
    </>
  );
};

// Styles to center the content
const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%", // You can adjust this if you want to set a max width
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    marginVertical: 10, // Optional: Adds spacing between the text and buttons
  },
});

export default DeleteService;
