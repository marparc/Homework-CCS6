import React, { useState } from "react";
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

const ProfileHeader = () => {
  const firstLetter = user.firstName.charAt(0).toUpperCase();
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null); // Add state for selected portfolio
  const [activeTab, setActiveTab] = useState("services"); // Track which tab is active
  const router = useRouter();
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
          <Text
            style={styles.name}
          >{`${user.firstName} ${user.lastName}`}</Text>
          <Text style={styles.type}>{user.type}</Text>
          <Text style={styles.id}>Account ID: {user.id}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.detailsHeader}>About Me:</Text>
        <Text style={styles.details}>Birthdate: </Text>
        <Text style={styles.detailsHeader}>Education:</Text>
        <Text style={styles.details}>First Year College Student</Text>
        <Text style={styles.details}>BS in Information Technology</Text>
        <Text style={styles.details}>Studies at Silliman University</Text>
      </View>
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
                  if (selectedServiceId) {
                    router.push(`/screens/editservice`);
                  }
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
                  if (selectedServiceId) {
                    router.push("/(tabs)/screens/deleteservice");
                  }
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
            <View style={styles.container}>
              {services.map((service) => (
                <Pressable
                  key={service.id}
                  onPress={() => handleServicePress(service.id)} // Toggle selection
                  onLongPress={() => handleServiceLongPress(service.id)} // Select on long press
                  style={[
                    styles.serviceCard,
                    isServiceSelected(service.id) && styles.selectedCard,
                  ]}
                >
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                  />
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </>
      )}

      {activeTab === "portfolios" && (
        <>
          <View style={styles.iconsContainer}>
            {/* Add Button */}
            <Pressable>
              <Ionicons
                name="add-circle"
                size={30}
                color="black"
                style={{ opacity: selectedPortfolioId ? 0.5 : 1 }}
              />
            </Pressable>

            {/* Edit and Delete Buttons */}
            <View style={styles.rightIcons}>
              <Pressable>
                <Ionicons
                  name="create-outline"
                  size={30}
                  color={selectedPortfolioId ? "black" : "#aaa"} // Enable only if a portfolio is selected
                />
              </Pressable>
              <Pressable>
                <Ionicons
                  name="trash-outline"
                  size={30}
                  color={selectedPortfolioId ? "black" : "#aaa"} // Enable only if a portfolio is selected
                />
              </Pressable>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.container}>
              {portfolios.map((portfolio) => (
                <Pressable
                  key={portfolio.id}
                  onPress={() => handlePortfolioPress(portfolio.id)} // Toggle selection
                  onLongPress={() => handlePortfolioLongPress(portfolio.id)} // Select on long press
                  style={[
                    styles.portfolioCard,
                    isPortfolioSelected(portfolio.id) && styles.selectedCard,
                  ]}
                >
                  <PortfolioCard
                    title={portfolio.title}
                    description={portfolio.description}
                    link={portfolio.link}
                  />
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </>
      )}

      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsHeader}>Reviews</Text>
        {ratings.map((rating) => (
          <Rating
            key={rating.id}
            stars={rating.stars.toString()}
            comment={rating.comment}
            rateFrom={rating.rateFrom}
          />
        ))}
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
