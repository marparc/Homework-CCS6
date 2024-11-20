import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";

const AddService = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const router = useRouter();

  const handleAddService = () => {
    // Here, you would usually add the logic for adding the service
    // After adding the service, show the PopUp
    setPopUpVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField title="Service Title" size="medium" />
          <InputField title="Description" size="large" />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Add Service"
          type="dark"
          size="small"
          onPress={handleAddService} // Call the handleAddService function on button press
        />
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Service Added Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default AddService;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 30,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 30,
    flexDirection: "row", // Ensure the button is placed horizontally
    justifyContent: "flex-end", // Align the button to the right
  },
});
