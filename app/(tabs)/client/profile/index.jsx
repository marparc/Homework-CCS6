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
// Sample user data
const user = {
  firstName: "John",
  lastName: "Doe",
  bio: "I am not slow, I am fast.",
  id: "1234",
  type: "Student Freelancer",
};
// Sample services data
const services = [
  {
    id: 1,
    title: "Graphic Design",
    description: "Creating logos, banners, and flyers.",
  },
  {
    id: 2,
    title: "Video Editing",
    description: "Editing short films and advertisements.",
  },
  {
    id: 3,
    title: "Web Development",
    description: "Building responsive websites.",
  },
];

// Sample portfolios data
const portfolios = [
  {
    id: 1,
    title: "Portfolio 1",
    description: "Portfolio showcasing graphic design work.",
    link: "https://youtube.com",
  },
  {
    id: 2,
    title: "Portfolio 2",
    description: "Portfolio featuring video editing projects.",
    link: "https://youtube.com",
  },
  {
    id: 3,
    title: "Portfolio 3",
    description: "Portfolio displaying web development projects.",
    link: "https://youtube.com",
  },
];
// Sample ratings data
const ratings = [
  {
    id: 1,
    stars: 5,
    comment: "Excellent work! Highly recommended.",
    rateFrom: "Alice Johnson",
  },
  {
    id: 2,
    stars: 4,
    comment: "Great service but there’s room for improvement.",
    rateFrom: "Bob Smith",
  },
  {
    id: 3,
    stars: 3,
    comment: "Average experience. Could be better.",
    rateFrom: "Chris Lee",
  },
];

const MyClientProfile = () => {
  const firstLetter = userData?.firstname
    ? userData.firstname.charAt(0).toUpperCase()
    : "";

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

  //to get client personal details
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const accountIdInt = parseInt(accountId, 10);

        // Fetch client data from client_table
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("client_organization, clientid, userid")
          .eq("userid", accountIdInt)
          .single();

        if (clientData) {
          setClientInfo(clientData); // Set client data

          // Fetch reviews from client_evaluation table based on clientid
          const { data: evaluationData, error: evaluationError } =
            await supabase
              .from("client_evaluation")
              .select("clientevalid, rating, usercomment, studentid, clientid")
              .eq("clientid", clientData.clientid);

          if (evaluationError) {
            console.error(
              "Error fetching evaluations:",
              evaluationError.message
            );
          } else {
            // Map the evaluation data and ensure unique keys
            const transformedRatings = evaluationData.map((evaluation) => ({
              id: `${evaluation.clientevalid}_${evaluation.studentid}`, // Ensure unique key
              stars: evaluation.rating,
              comment: evaluation.usercomment,
            }));

            setRatings(transformedRatings); // Set the ratings data
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  //for reviews
  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);

      try {
        const accountIdInt = parseInt(accountId, 10);

        // Fetch client data from client_table
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("client_organization, clientid, userid")
          .eq("userid", accountIdInt)
          .single();

        if (clientData) {
          setClientInfo(clientData); // Set client data

          // Fetch user data from user_table using clientData.userid
          const { data: userData, error: userError } = await supabase
            .from("user_table")
            .select("firstname, lastname, birthdate, usertype")
            .eq("userid", clientData.userid)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError.message);
          } else {
            setUserData(userData); // Set user data
          }

          // Fetch reviews from client_evaluation table based on clientid
          const { data: evaluationData, error: evaluationError } =
            await supabase
              .from("client_evaluation")
              .select("clientevalid, rating, usercomment, studentid, clientid")
              .eq("clientid", clientData.clientid);

          if (evaluationError) {
            console.error(
              "Error fetching evaluations:",
              evaluationError.message
            );
          } else {
            // Map the evaluation data to match your desired format
            const transformedRatings = evaluationData.map((evaluation) => {
              const id = evaluation.clientevalid; // Access clientevalid from each evaluation
              //console.log("Generated ID:", id); // Log the id
              return {
                id,
                stars: evaluation.rating,
                comment: evaluation.usercomment,
              };
            });

            //console.log("Final Transformed Ratings:", transformedRatings); // Log the entire array for verification
            setRatings(transformedRatings); // Set the ratings data
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchAccountData();
  }, [accountId]);

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
            Account ID: {clientInfo?.clientid || "Not Available"}
          </Text>
          <Text style={styles.bio}>{userData?.bio || ""}</Text>
        </View>
      </View>

      <View style={styles.editContainer}>
        <Button title="Edit Profile" type="light" size="small" />
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
              key={rating.id} // Ensure unique key
              stars={rating.stars.toString()} // Ensure stars is a string
              comment={rating.comment}
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
