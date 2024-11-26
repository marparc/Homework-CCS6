import React, { useState, useEffect } from "react"; // Import useEffect here
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { supabase } from "../../../../lib/supabase";
import { Link } from "expo-router";

const ProfileHeader = () => {
  const [firstLetter, setFirstLetter] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [ratings, setRatings] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const router = useRouter();
  const [accountId, setAccountId] = useState(null);
  const [password, setPassword] = useState(null); //later to use

  const { push } = useRouter();

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    birthdate: "",
  });
  const [userEducation, setUserEducation] = useState({
    educationlevel: "",
    degree: "",
    currentschool: "",
    yearlevel: "",
  });
  const [userBio, setuserBio] = useState({
    bio: "",
  });

  // to get account id
  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        const storedPassword = await AsyncStorage.getItem("password");
        setAccountId(storedAccountId);
        setPassword(storedPassword);
        //console.log("Stored accountId:", storedAccountId); // Check the value
        //console.log("Stored password:", storedPassword); // Check the password value
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  //to get student details
  useEffect(() => {
    const fetchAccountData = async () => {
      const { data: studentData, error: studentError } = await supabase
        .from("student")
        .select("educationlevel, degree, currentschool, yearlevel, userid")
        .eq("studentid", accountId)
        .single();

      if (studentError) {
        console.log(inputData);
        console.log(accountId);
        console.log("error1");
        console.error("Error fetching student data:", studentError.message);
        return;
      }
      if (studentData) {
        setUserEducation({
          educationlevel: studentData.educationlevel,
          degree: studentData.degree,
          currentschool: studentData.currentschool,
          yearlevel: studentData.yearlevel,
        });

        const { userid } = studentData;

        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname, birthdate")
          .eq("userid", userid)
          .single();

        if (userError) {
          console.log("error2");
          console.error("Error fetching user data:", userError.message);
        } else {
          setUserData({
            firstname: userData.firstname,
            lastname: userData.lastname,
            birthdate: userData.birthdate,
          });
          const firstLetter = userData.firstname.charAt(0).toUpperCase();
          setFirstLetter(firstLetter);

          const { data: userBio, error: bioError } = await supabase
            .from("user_account")
            .select("bio")
            .eq("accountid", accountId)
            .single();
          setuserBio({
            bio: userBio.bio,
          });
        }
      } else {
        console.log("No student found with the given student ID.");
      }
    };

    fetchAccountData();
  }, [accountId]);

  //for reviews
  useEffect(() => {
    const fetchEvaluationData = async () => {
      const { data: evaluationData, error: evaluationError } = await supabase
        .from("stud_evaluation")
        .select("rating, usercomment, clientid, studentid")
        .eq("studentid", accountId);

      //console.log("Fetched Evaluation Data:", evaluationData);

      const transformedRatings = evaluationData.map((evaluation) => ({
        id: evaluation.clientid, // Assuming clientid is unique
        stars: evaluation.rating,
        comment: evaluation.usercomment,
        rateFrom: evaluation.clientid,
      }));

      setRatings(transformedRatings);
    };

    fetchEvaluationData();
  }, [accountId]);

  //for services
  useEffect(() => {
    const fetchServicesData = async () => {
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("serviceid, servicedesc, studentid, serviceTitle") // Adjust columns as per your table structure
        .eq("studentid", accountId);

      if (servicesError) {
        //console.error("Error fetching services:", servicesError);
        return;
      }
      //console.log("Fetched services data:", servicesData); // Log the fetched data
      // Store the fetched services in the state
      setServices(servicesData);
    };

    fetchServicesData();
  }, [accountId]);

  //for portfolio
  useEffect(() => {
    const fetchPortfolioData = async () => {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio")
        .select("portfolioid, portfolioname, portfoliodesc, link, studentid")
        .eq("studentid", accountId);

      if (portfolioError) {
        //console.error("Error fetching portfolio:", portfolioError);
        return;
      }

      // Store the fetched portfolio data in the state
      setPortfolio(portfolioData);
    };

    fetchPortfolioData();
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

  const handlePress = () => {
    //console.log("THIS IS THE ID: ", selectedPortfolioId); // Log before navigation
    //console.log("Navigating with query: ", {
    //  portfolioId: selectedPortfolioId,
    //});
    //push({
    //  pathname: "./editportfolio",
    ///  query: { portfolioId: selectedPortfolioId }, // Pass the query parameter
    //});
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>{firstLetter}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {userData.firstname} {userData.lastname}
          </Text>
          <Text style={styles.type}>Student Freelancer</Text>
          <Text style={styles.id}>Account ID: {accountId}</Text>
          <Text style={styles.bio}>{userBio.bio}</Text>
        </View>
      </View>
      <View
        style={{
          marginBottom: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          title="Edit Bio"
          type="light"
          size="small"
          onPress={() => {
            router.push("/screens/editbio");
          }}
        ></Button>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.detailsHeader}>About Me:</Text>

        <Text style={styles.details}>Birthdate: {userData.birthdate}</Text>
        <Text style={styles.detailsHeader}>Education:</Text>
        <Text style={styles.details}>
          {userEducation.educationlevel} ({userEducation.yearlevel})
        </Text>
        <Text style={styles.details}>{userEducation.degree}</Text>
        <Text style={styles.details}>
          Studies at {userEducation.currentschool}
        </Text>
      </View>

      {/* Buttons for Services and Portfolios */}
      <View style={styles.tabsContainer}>
        <Button
          title="Services"
          type={activeTab === "services" ? "dark" : "light"}
          size="small"
          onPress={() => toggleTab("services")}
        />
        <Button
          title="Portfolios"
          type={activeTab === "portfolios" ? "dark" : "light"}
          size="small"
          onPress={() => toggleTab("portfolios")}
        />
      </View>

      {/* Icons for Services */}
      {activeTab === "services" && (
        <>
          <View style={styles.iconsContainer}>
            {/* Add Button */}
            <Pressable
              onPress={() => {
                // Only allow navigation when no service is selected
                if (!selectedServiceId) {
                  router.push("/screens/addservice");
                }
              }}
              disabled={selectedServiceId !== null} // Disable if a service is selected
            >
              <Ionicons
                name="add-circle"
                size={30}
                color="black"
                style={{ opacity: selectedServiceId ? 0.5 : 1 }} // Reduce opacity when disabled
              />
            </Pressable>

            {/* Edit and Delete Buttons */}
            <View style={styles.rightIcons}>
              <Pressable
                onPress={() => {
                  //if (selectedServiceId) {
                  //  router.push(`/screens/editservice`);
                  //}
                  console.log("EDIT ROUTER:", selectedServiceId);
                  router.push(
                    `/screens/editservice?selectedservice=${selectedServiceId}`
                  );
                }}
                disabled={!selectedServiceId}
              >
                <Ionicons
                  name="create-outline"
                  size={30}
                  color={selectedServiceId ? "black" : "#aaa"} // Enable only if a service is selected
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  console.log("DELETE FROM ROUTER:", selectedServiceId);
                  router.push(
                    `/screens/deleteservice?selectedservice=${selectedServiceId}`
                  );
                }}
                disabled={!selectedServiceId}
              >
                <Ionicons
                  name="trash-outline"
                  size={30}
                  color={selectedServiceId ? "black" : "#aaa"} // Enable only if a service is selected
                />
              </Pressable>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            {/* Service Cards */}
            <View style={styles.container}>
              {services.length > 0 ? (
                services.map((service) => (
                  <Pressable
                    key={service.serviceid} // Ensure each service has a unique key
                    onPress={() => handleServicePress(service.serviceid)}
                    onLongPress={() =>
                      handleServiceLongPress(service.serviceid)
                    }
                    style={[
                      styles.serviceCard,
                      isServiceSelected(service.serviceid) &&
                        styles.selectedCard,
                    ]}
                  >
                    <ServiceCard
                      title={service.serviceTitle}
                      description={service.servicedesc}
                    />
                  </Pressable>
                ))
              ) : (
                <Text>No services available for this account.</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </>
      )}

      {activeTab === "portfolios" && (
        <>
          <View style={styles.iconsContainer}>
            {/* Add Button */}
            <Pressable
              onPress={() => {
                //Only allow navigation when no service is selected
                if (!selectedPortfolioId) {
                  router.push("/screens/addportfolio");
                }
              }}
              disabled={selectedPortfolioId !== null} // Disable if a service is selected
            >
              <Ionicons
                name="add-circle"
                size={30}
                color="black"
                style={{ opacity: selectedPortfolioId ? 0.5 : 1 }}
              />
            </Pressable>

            {/* Edit and Delete Buttons */}
            <View style={styles.rightIcons}>
              <Pressable onPress={handlePress} disabled={!selectedPortfolioId}>
                <Ionicons
                  name="create-outline"
                  size={30}
                  color={selectedPortfolioId ? "black" : "#aaa"} // Change color based on selection
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  console.log(
                    "DELETE PORTFOLIO FROM ROUTER:",
                    selectedPortfolioId
                  );
                  router.push(
                    `/screens/deleteportfolio?selectedportfolio=${selectedPortfolioId}`
                  );
                }}
                disabled={!selectedPortfolioId}
              >
                <Ionicons
                  name="trash-outline"
                  size={30}
                  color={selectedPortfolioId ? "black" : "#aaa"} // Enable only if a portfolio is selected
                />
              </Pressable>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            {/* Portfolio Cards */}
            <View style={styles.container}>
              {portfolio.length > 0 ? (
                portfolio.map((portfolioItem) => (
                  <Pressable
                    key={portfolioItem.portfolioid} // Ensure each portfolio has a unique key
                    onPress={() =>
                      handlePortfolioPress(portfolioItem.portfolioid)
                    }
                    onLongPress={() =>
                      handlePortfolioLongPress(portfolioItem.portfolioid)
                    }
                    style={[
                      styles.portfolioCard,
                      isPortfolioSelected(portfolioItem.portfolioid) &&
                        styles.selectedCard,
                    ]}
                  >
                    <PortfolioCard
                      title={portfolioItem.portfolioname}
                      description={portfolioItem.portfoliodesc}
                      link={portfolioItem.link}
                    />
                  </Pressable>
                ))
              ) : (
                <Text>No portfolios available for this account.</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </>
      )}

      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsHeader}>Reviews</Text>

        {/* Check if there are any ratings */}
        {ratings.length === 0 ? (
          <Text style={styles.noReviewsText}>No reviews made yet.</Text> // Show message if no reviews
        ) : (
          ratings.map((rating) => (
            <Rating
              key={rating.id}
              stars={rating.stars.toString()} // Ensure stars are passed as a string
              comment={rating.comment}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default ProfileHeader;

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
