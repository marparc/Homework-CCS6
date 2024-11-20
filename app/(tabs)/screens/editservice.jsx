import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";

const EditService = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const router = useRouter();

  const handleEditService = () => {
    // Here, you would usually add the logic for editing the service
    // After editing the service, show the PopUp
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
          title="Edit Service"
          type="dark"
          size="small"
          onPress={handleEditService} // Call the handleEditService function on button press
        />
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Service Edited Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default EditService;

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
