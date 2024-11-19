import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/buttons";
import ServiceCard from "@/components/ui/servicecard";
import PortfolioCard from "@/components/ui/portfoliocard";

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

const ProfileHeader = () => {
  const firstLetter = user.firstName.charAt(0).toUpperCase();
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null); // Add state for selected portfolio
  const [activeTab, setActiveTab] = useState("services"); // Track which tab is active

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
        <Text style={styles.details}>Location: </Text>
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
            <Pressable>
              <Ionicons
                name="add-circle"
                size={36}
                color="black"
                style={{ opacity: selectedServiceId ? 0.5 : 1 }}
              />
            </Pressable>
            <Pressable>
              <Ionicons
                name="create-outline"
                size={36}
                color={selectedServiceId ? "black" : "#aaa"}
              />
            </Pressable>
            <Pressable>
              <Ionicons
                name="trash-outline"
                size={36}
                color={selectedServiceId ? "red" : "#aaa"}
              />
            </Pressable>
          </View>
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={{ flex: 1 }}>
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

      {/* Icons for Portfolios */}
      {activeTab === "portfolios" && (
        <>
          <View style={styles.iconsContainer}>
            <Pressable>
              <Ionicons
                name="add-circle"
                size={36}
                color="black"
                style={{ opacity: selectedPortfolioId ? 0.5 : 1 }}
              />
            </Pressable>
            <Pressable>
              <Ionicons
                name="create-outline"
                size={36}
                color={selectedPortfolioId ? "black" : "#aaa"}
              />
            </Pressable>
            <Pressable>
              <Ionicons
                name="trash-outline"
                size={36}
                color={selectedPortfolioId ? "red" : "#aaa"}
              />
            </Pressable>
          </View>
          {portfolios.map((portfolio) => (
            <Pressable
              key={portfolio.id}
              onPress={() => handlePortfolioPress(portfolio.id)} // Toggle selection
              onLongPress={() => handlePortfolioLongPress(portfolio.id)} // Select on long press
              style={[
                styles.serviceCard,
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
        </>
      )}
    </ScrollView>
  );
};

export default ProfileHeader;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  circleText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "black",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
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
    color: "white",
  },
  aboutContainer: {
    backgroundColor: "#FAF9F9",
    borderRadius: 12,
    padding: 16,
    margin: 10,
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginVertical: 5,
  },
  details: {
    fontSize: 14,
    color: "#212121",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  serviceCard: {
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: "#e0e0e0",
  },
});
