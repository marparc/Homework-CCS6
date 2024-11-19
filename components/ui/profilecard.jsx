import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const ProfileCard = ({ profiletype, company, imageSrc, name }) => {
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
    return null;
  };

  return (
    <View style={styles.profileCard}>
      {/* Render Text component only if profileTypeText returns a valid string */}
      {profileTypeText() && <Text>{profileTypeText()}</Text>}

      <View style={styles.detailsContainer}>
        <Image
          source={{ uri: imageSrc || "https://via.placeholder.com/50" }}
          style={styles.image}
        />
        <View>
          <Text style={styles.name}>{name}</Text>
          {/* Render Text component only if companyText returns a valid string */}
          {companyText() && (
            <Text style={{ color: "#434242", fontSize: 10 }}>
              {companyText()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  profileCard: {
    width: 330,
    padding: 20,
    backgroundColor: "#FAF9F9",
    margin: 10,
    borderRadius: 16,
  },
  detailsContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
  },
});
