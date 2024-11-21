import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";

const AddPortfolio = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const router = useRouter();

  const handleAddPortfolio = () => {
    // Here, you would usually add the logic for adding the Portfolio
    // After adding the Portfolio, show the PopUp
    setPopUpVisible(true);
  };

  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField
            title="Portfolio Name"
            size="medium"
            value={portfolioName}
            onChangeText={setPortfolioName}
          />
          <InputField
            title="Description"
            size="large"
            value={portfolioDesc}
            onChangeText={setPortfolioDesc}
          />
        </View>

        <InputField
          title="External Link"
          size="medium"
          value={portfolioLink}
          onChangeText={setPortfolioLink}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Add Porfolio"
            type="dark"
            size="small"
            onPress={handleAddPortfolio}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Porfolio Added Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default AddPortfolio;

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
