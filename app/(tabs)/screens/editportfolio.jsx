import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import PopUp from "@/components/ui/popup";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";

const EditPorfolio = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const { query } = useRouter();
  const { selectedportfolio } = useLocalSearchParams();
  const portfolioId = query?.portfolioId;
  const [portfolioData, setPortfolioData] = useState(null);
  // State for form fields
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  //console.log("EDIT PORTFOLIO RECEIVE ROUTER: ", selectedportfolio);

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
      if (data && data.length > 0) {
        setPortfolioName(data[0].portfolioname);
        setPortfolioDesc(data[0].portfoliodesc);
        setPortfolioLink(data[0].link);
      }
    };

    fetchPortfolioData();
  }, [selectedportfolio]);

  const handleEditPortfolio = async () => {
    if (!portfolioName || !portfolioDesc || !portfolioLink) {
      console.error("All fields must be filled out");
      return;
    }

    const { data, error } = await supabase
      .from("portfolio")
      .update({
        portfolioname: portfolioName,
        portfoliodesc: portfolioDesc,
        link: portfolioLink,
      })
      .eq("portfolioid", selectedportfolio);

    if (error) {
      console.error("Error updating portfolio:", error.message);
      return;
    }

    console.log("Portfolio updated successfully:", data);
    setPopUpVisible(true);
  };

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
            onPress={handleEditPortfolio}
          />
        </View>

        {isPopUpVisible && (
          <PopUp
            text="Portfolio Updated Successfully!"
            route="/(tabs)/student/profile"
            icon="checkmark-circle-outline"
          />
        )}
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
