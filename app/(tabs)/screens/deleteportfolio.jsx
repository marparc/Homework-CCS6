import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Button from "@/components/ui/buttons";
import PortfolioCard from "@/components/ui/portfoliocard";
import PopUp from "@/components/ui/popup";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";

const DeletePortfolio = ({ id }) => {
  const router = useRouter();
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp
  const { selectedportfolio } = useLocalSearchParams();

  console.log("DELETE PORTFOLIO RECEIVE ROUTER: ", selectedportfolio);

  const portfolio = {
    id: 1,
    title: "Portfolio 1",
    description: "Portfolio showcasing graphic design work.",
    link: "https://youtube.com",
  };

  const delService = () => {
    setPopUpVisible(true);
  };

  return (
    <>
      <View style={styles.centeredContainer}>
        <View style={styles.cardContainer}>
          <PortfolioCard
            title={portfolio.title}
            description={portfolio.description}
            link={portfolio.link}
          />

          <Text style={styles.text}>
            Are you sure you want to delete this portfolio?
          </Text>
          <Button
            title="Delete"
            type="dark"
            size="medium"
            onPress={delService}
          />
          <Button
            title="Cancel"
            type="light"
            size="medium"
            onPress={() => router.push("/(tabs)/student/profile")}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          text="Portfolio Deleted Successfully!"
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

export default DeletePortfolio;
