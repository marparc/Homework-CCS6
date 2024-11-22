import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";

const EditJobListing = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const router = useRouter();

  const handleEditJobListing = () => {
    // Here, you would usually add the logic for editing the service
    // After editing the service, show the PopUp
    setPopUpVisible(true);
  };

  const jobListing = {
    id: 1,
    title: "Graphic Design",
    description: "Creating logos, banners, and flyers.",
  };

  const [jobListingName, setJobListingName] = useState(jobListing.title);
  const [jobListingDesc, setJobListingDesc] = useState(jobListing.description);

  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField
            title="Job Listing Title"
            size="medium"
            value={jobListingName}
            onChangeText={setJobListingName}
          />
          <InputField
            title="Description"
            size="large"
            value={jobListingDesc}
            onChangeText={setJobListingDesc}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            type="dark"
            size="small"
            onPress={handleEditJobListing} // Call the handleEditJobListing function on button press
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Job Listing Edited Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default EditJobListing;

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
