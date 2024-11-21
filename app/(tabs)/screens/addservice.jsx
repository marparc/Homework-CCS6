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

  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");

  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField
            title="Service Title"
            size="medium"
            value={serviceName}
            onChangeText={setServiceName}
          />
          <InputField
            title="Service Description"
            size="large"
            value={serviceDesc}
            onChangeText={setServiceDesc}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Add Service"
            type="dark"
            size="small"
            onPress={handleAddService} // Call the handleAddService function on button press
          />
        </View>
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
    flex: 1, // Makes the container take up the full screen height
    alignItems: "center", // Centers the content horizontally
    padding: 30,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
});
