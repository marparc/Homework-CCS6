import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";

const EditPorfolio = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const router = useRouter();

  const handleEditPorfolio = () => {
    // Here, you would usually add the logic for editing the Porfolio
    // After editing the Porfolio, show the PopUp
    setPopUpVisible(true);
  };

  const portfolio = {
    id: 3,
    title: "Portfolio 3",
    description: "Portfolio displaying web development projects.",
    link: "https://youtube.com",
  };

  const [portfolioName, setPortfolioName] = useState(portfolio.title);
  const [portfolioDesc, setPortfolioDesc] = useState(portfolio.description);
  const [portfolioLink, setPortfolioLink] = useState(portfolio.link);

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
          <InputField
            title="External Link"
            size="medium"
            value={portfolioLink}
            onChangeText={setPortfolioLink}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            type="dark"
            size="small"
            onPress={handleEditPorfolio}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Portfolio Edited Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default EditPorfolio;

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
