import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import PortfolioCard from "@/components/ui/portfoliocard";
import PopUp from "@/components/ui/popup";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";

const DeletePortfolio = () => {
  const router = useRouter();
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const { selectedportfolio } = useLocalSearchParams();
  const [portfolioData, setPortfolioData] = useState(null);

  console.log("DELETE PORTFOLIO RECEIVE ROUTER: ", selectedportfolio);

  useEffect(() => {
    if (!selectedportfolio) return;

    const fetchPortfolioData = async () => {
      const { data, error } = await supabase
        .from("portfolio")
        .select("portfolioid, portfolioname, portfoliodesc, link, studentid")
        .eq("portfolioid", selectedportfolio);

      if (error) {
        console.error("Error fetching portfolio data:", error.message);
        return;
      }

      console.log("Fetched Portfolio Data:", data);
      setPortfolioData(data);
    };

    fetchPortfolioData();
  }, [selectedportfolio]);

  const deletePortfolio = async () => {
    if (!selectedportfolio) return;

    const { data, error } = await supabase
      .from("portfolio")
      .delete()
      .eq("portfolioid", selectedportfolio);

    if (error) {
      console.error("Error deleting portfolio:", error.message);
      return;
    }

    console.log("Portfolio deleted successfully:", data);

    setPopUpVisible(true);
  };

  return (
    <>
      <View style={styles.centeredContainer}>
        <View style={styles.cardContainer}>
          <PortfolioCard
            title={
              portfolioData && portfolioData.length > 0
                ? portfolioData[0].portfolioname
                : "Loading..."
            }
            description={
              portfolioData && portfolioData.length > 0
                ? portfolioData[0].portfoliodesc
                : "Loading..."
            }
            link={
              portfolioData && portfolioData.length > 0
                ? portfolioData[0].link
                : "#"
            }
          />

          <Text style={styles.text}>
            Are you sure you want to delete this portfolio?
          </Text>
          <Button
            title="Delete"
            type="dark"
            size="medium"
            onPress={deletePortfolio}
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
