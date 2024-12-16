import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileCard = ({ profiletype, company, imageSrc, name, stars }) => {
  // Check profiletype and display appropriate text
  const profileTypeText = () => {
    if (profiletype === "S") {
      return "Student Freelancer";
    } else if (profiletype === "C") {
      return "Client";
    }
    return null;
  };

  const companyText = () => {
    if (profiletype === "S") {
      return `Studies at ${company}`;
    } else if (profiletype === "C") {
      return `Works at ${company}`;
    }
    console.log("No company text: ", company); // Debugging log
    return null;
  };

  // Render star icons based on the stars prop
  const renderStars = () => {
    if (!stars) return null; // Only render stars if 'stars' is provided
    return Array.from({ length: stars }).map((_, index) => (
      <Ionicons key={index} name="star" size={16} color="#FFCE1B" />
    ));
  };

  return (
    <View style={styles.profileCard}>
      <View style={styles.detailsContainer}>
        {imageSrc ? (
          <Image source={{ uri: imageSrc }} style={styles.image} />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.initial}>{name?.charAt(0)?.toUpperCase()}</Text>
          </View>
        )}
        <View>
          <Text style={styles.name}>{name}</Text>
          {/* Render Text component only if profileTypeText returns a valid string */}
          {profileTypeText() && (
            <Text style={styles.type}>{profileTypeText()}</Text>
          )}
          {/* Render Text component only if companyText returns a valid string */}
          {companyText() && <Text style={styles.company}>{companyText()}</Text>}
          {/* Render stars only if 'stars' prop is provided */}
          <View style={styles.starContainer}>{renderStars()}</View>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCard: {
    width: "100%",
    padding: 20,
    backgroundColor: "#FAF9F9",
    margin: 10,
    borderRadius: 16,
  },
  type: {
    fontSize: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  imageFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  company: {
    color: "#434242",
    fontSize: 16,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
