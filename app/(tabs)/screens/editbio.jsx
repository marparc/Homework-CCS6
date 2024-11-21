import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Button from "@/components/ui/buttons";
import InputField from "@/components/ui/inputfield";
import { useState } from "react";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";

const EditBio = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp

  const handleEditBio = () => {
    // add the logic for editing the Porfolio

    setPopUpVisible(true);
  };
  const [bio, setBio] = useState("Initial Bio");

  const router = useRouter();
  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField
            title="Bio"
            size="large"
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            type="dark"
            size="small"
            onPress={handleEditBio}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Bio Edited Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default EditBio;

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
