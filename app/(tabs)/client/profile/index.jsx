import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/buttons";
import ServiceCard from "@/components/ui/servicecard";
import PortfolioCard from "@/components/ui/portfoliocard";
import Rating from "@/components/ui/ratings";
import { useRouter } from "expo-router";
import DeleteService from "../../screens/deleteservice";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../../../../lib/supabase";

const MyClientProfile = () => {
  const [firstLetter, setFirstLetter] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null); // Add state for selected portfolio
  const [activeTab, setActiveTab] = useState("services"); // Track which tab is active
  const router = useRouter();

  const [accountId, setAccountId] = useState(null);
  const [password, setPassword] = useState(null);

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");

  // to get account id
  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        const storedPassword = await AsyncStorage.getItem("password");
        setAccountId(storedAccountId);
        setPassword(storedPassword);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);

      try {
        console.log("accountId here: ", accountId);

        // First, fetch user account data to get the bio and userid
        const { data: userAccountData, error: userAccountError } =
          await supabase
            .from("user_account")
            .select("bio, userid")
            .eq("accountid", accountId)
            .single();

        // Set bio from the user account data
        setBio(userAccountData?.bio || "");

        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname, birthdate, usertype")
          .eq("userid", userAccountData.userid)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        // Set the user data state
        setUserData(userData);
        const firstLetter = userData.firstname.charAt(0).toUpperCase();
        setFirstLetter(firstLetter);

        // Now fetch client data using the userid from user_account data
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("client_organization, clientid")
          .eq("userid", userAccountData.userid)
          .single();

        if (clientError) {
          console.error("Error fetching client data:", clientError.message);
          return; // Exit early if client data fetch fails
        }

        // Set client information state
        setClientInfo(clientData);

        // Fetch evaluations and update the ratings state
        const evaluations = await fetchEvaluations(clientData.clientid);
        setRatings(evaluations);
      } catch (error) {
        //console.error("Error fetching account data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  //reviews
  const fetchEvaluations = async (clientid) => {
    try {
      const { data: evaluationData, error: evaluationError } = await supabase
        .from("client_evaluation")
        .select("clientevalid, rating, usercomment, studentid, clientid")
        .eq("clientid", clientid);

      if (evaluationError) {
        console.error("Error fetching evaluations:", evaluationError.message);
        return []; // Return an empty array in case of error
      }

      // Transform the evaluation data
      const transformedRatings = await Promise.all(
        evaluationData.map(async (evaluation) => {
          // Fetch the student details using studentid
          const { data: studentData, error: studentError } = await supabase
            .from("student")
            .select("userid")
            .eq("studentid", evaluation.studentid)
            .single(); // Assuming studentid is unique

          if (studentError) {
            console.error("Error fetching student data:", studentError.message);
            return null; // Skip this evaluation if student fetch fails
          }

          // Fetch user details using userid from studentData
          const { data: userData, error: userError } = await supabase
            .from("user_table")
            .select("firstname, lastname")
            .eq("userid", studentData.userid)
            .single(); // Assuming userid is unique

          if (userError) {
            console.error("Error fetching user data:", userError.message);
            return null; // Skip this evaluation if user fetch fails
          }

          // Return the transformed rating
          return {
            id: evaluation.clientevalid,
            stars: evaluation.rating,
            comment: evaluation.usercomment,
            rateFrom: `${userData.firstname} ${userData.lastname}`, // Add student name
          };
        })
      );

      // Filter out any null values resulting from failed transformations
      return transformedRatings.filter((rating) => rating !== null);
    } catch (error) {
      console.error("Error fetching evaluations:", error.message);
      return [];
    }
  };

  // Handle service selection
  const handleServicePress = (serviceId) => {
    setSelectedServiceId((prev) => (prev === serviceId ? null : serviceId));
  };

  const handleServiceLongPress = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  const isServiceSelected = (serviceId) => selectedServiceId === serviceId;

  // Handle portfolio selection
  const handlePortfolioPress = (portfolioId) => {
    setSelectedPortfolioId((prev) =>
      prev === portfolioId ? null : portfolioId
    );
  };

  const handlePortfolioLongPress = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
  };

  const isPortfolioSelected = (portfolioId) =>
    selectedPortfolioId === portfolioId;

  // Handle press outside to deselect
  const handleOutsidePress = () => {
    setSelectedServiceId(null);
    setSelectedPortfolioId(null);
  };

  // Toggle between Services and Portfolios views
  const toggleTab = (tab) => {
    setActiveTab(tab);

    // Reset selection when switching tabs
    setSelectedServiceId(null);
    setSelectedPortfolioId(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>{firstLetter}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {userData
              ? `${userData.firstname} ${userData.lastname}`
              : "Name not available"}
          </Text>
          <Text style={styles.type}>
            {userData?.usertype || "User type not available"}
          </Text>
          <Text style={styles.id}>
            Account ID: {accountId || "Not Available"}
          </Text>
          <Text style={styles.bio}>{bio || ""}</Text>
        </View>
      </View>

      <View style={styles.editContainer}>
        <Button
          title="Edit Bio"
          type="light"
          size="small"
          onPress={() => {
            router.push("/screens/editbioclient");
          }}
        ></Button>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.detailsHeader}>About Me:</Text>
        <Text style={styles.details}>
          Birthdate: {userData?.birthdate ? userData.birthdate : "N/A"}
        </Text>

        <Text style={styles.detailsHeader}>Company/Organization:</Text>
        <Text style={styles.details}>
          {clientInfo?.client_organization || "None"}
        </Text>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsHeader}>Reviews</Text>
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <Rating
              key={rating.id}
              stars={rating.stars.toString()} // Ensure stars are passed as a string
              comment={rating.comment}
              rateFrom={rating.rateFrom} // Match the prop name used in the Rating component
            />
          ))
        ) : (
          <Text style={styles.noReviewsText}>No reviews available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default MyClientProfile;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollContainer: {
    //container for whole page
    flexGrow: 1,
    backgroundColor: "white",
  },
  header: {
    //main container for circle down to bio
    alignItems: "center",
    backgroundColor: "black",
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "absolute",
    zIndex: 2,
  },
  circleText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "black",
  },
  infoContainer: {
    //container
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 120,
  },

  editContainer: {
    //container
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    marginBottom: 7,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  type: {
    fontSize: 16,
    color: "#ccc",
  },
  id: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  bio: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
  detailsHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 6,
  },
  details: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
  },
  aboutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F7F7F7",
    display: "flex",
    alignItems: "center", // Centers horizontally
    justifyContent: "center", // Centers vertically
    borderRadius: 12, // Optional: Add a nice rounded border effect
    width: "90%", // Optional: Make the width responsive
    alignSelf: "center", // Center the container within its parent
  },
  tabsContainer: {
    flexDirection: "row", // Arrange items in a row
    justifyContent: "center", // Center items horizontally
    alignItems: "center", // Align items vertically
    gap: 10, // Adds space between button
    marginVertical: 10, // Space above and below the container
  },
  iconsContainer: {
    flexDirection: "row", // Arrange items in a row
    justifyContent: "space-between", // Space between Add and the other buttons
    alignItems: "center", // Align items vertically
    marginVertical: 10, // Add vertical spacing
    paddingHorizontal: 70, // Add space on the left and right
  },
  rightIcons: {
    flexDirection: "row", // Arrange Edit and Delete side by side
    gap: 15, // Add spacing between the Edit and Delete buttons
  },
  container: {
    flex: 1,
    justifyContent: "center", // Vertically center content
    alignItems: "center", // Horizontally center content
    paddingHorizontal: 20, // Add horizontal padding for spacing from screen edges
  },
  serviceCard: {
    maxWidth: 350, // Set a max width for the cards to avoid stretching too much on large screen
    backgroundColor: "red", // Card background color
    margin: 10,
    borderRadius: 16, // Rounded corners
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Subtle shadow
    shadowRadius: 4,
  },

  portfolioCard: {
    maxWidth: 350, // Set a max width for the cards to avoid stretching too much on large screen
    backgroundColor: "red", // Card background color
    margin: 10,
    borderRadius: 16, // Rounded corners
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Subtle shadow
    shadowRadius: 4,
  },
  selectedCard: {
    borderWidth: 2, // Highlight the card when selected
    borderColor: "black", // Blue color for selected state
  },
  reviewsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center", // Centers the child components (ratings) horizontally
  },
  reviewsHeader: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
