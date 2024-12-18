import { View, StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";
import { supabase } from "@/lib/supabase"; // Ensure you import your Supabase client
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddPortfolio = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const router = useRouter();
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [insertError, setInsertError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  const handleAddPortfolio = async () => {
    // Trigger portfolio insertion logic
    const isSuccess = await insertPortfolioData();

    if (isSuccess) {
      // Show the popup
      setPopUpVisible(true);
    }
    router.push("/student/profile");
  };

  const insertPortfolioData = async () => {
    if (!accountId) {
      console.log("ACCOUNTID NOT FOUND: ", accountId);
      return;
    }
    setIsSubmitting(true);
    setInsertError(null);

    try {
      const { data: userAccountData, error: userAccountError } = await supabase
        .from("user_account")
        .select("userid")
        .eq("accountid", accountId)
        .single();

      if (userAccountError) {
        throw new Error("Failed to fetch userid: " + userAccountError.message);
      }

      const userId = userAccountData.userid;

      console.log("userID:", userId);

      const { data: studentData, error: studentError } = await supabase
        .from("student")
        .select("studentid")
        .eq("userid", userId);

      const studentId = studentData[0].studentid;

      console.log("studentId:", studentId);

      const { data: latestPortfolioData, error: latestPortfolioError } =
        await supabase
          .from("portfolio")
          .select("*")
          .order("portfolioid", { ascending: false })
          .limit(1);

      if (latestPortfolioError) {
        throw new Error(
          "Failed to fetch the latest portfolio: " +
            latestPortfolioError.message
        );
      }
      console.log("latestPortfolioData: ", latestPortfolioData[0]);
      let sequenceNumber = 1;
      if (latestPortfolioData && latestPortfolioData.length > 0) {
        sequenceNumber = latestPortfolioData[0].portfolioid + 1;
      }

      console.log("Sqequence number: ", sequenceNumber);
      console.log("student id: ", studentId);
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio")
        .insert([
          {
            portfolioname: portfolioName,
            portfoliodesc: portfolioDesc,
            link: portfolioLink,
            studentid: studentId,
            portfolioid: sequenceNumber,
          },
        ]);

      if (portfolioError) {
        throw new Error(
          "Failed to insert portfolio: " + portfolioError.message
        );
      }

      console.log("Portfolio added successfully:", portfolioData);

      setPortfolioName("");
      setPortfolioDesc("");
      setPortfolioLink("");

      return true;
    } catch (error) {
      setInsertError(error.message);
      console.error("Error:", error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
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
        </View>

        <InputField
          title="External Link"
          size="medium"
          value={portfolioLink}
          onChangeText={setPortfolioLink}
        />

        {insertError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{insertError}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={isSubmitting ? "Submitting..." : "Add Portfolio"}
            type="dark"
            size="small"
            onPress={handleAddPortfolio}
            disabled={isSubmitting} // Disable button while submitting
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Portfolio Added Successfully!"
          onClose={() => {
            setPopUpVisible(false);
            router.push("/student/profile"); // marc
          }}
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
