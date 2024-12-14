import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import Button from "@/components/ui/buttons";
import ServiceCard from "@/components/ui/servicecard";
import PortfolioCard from "@/components/ui/portfoliocard";

import Rating from "@/components/ui/ratings";
const ViewStudentProfile = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [userData, setUserData] = useState(null);
  const [userEducation, setUserEducation] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const { selectedrequest } = useLocalSearchParams();
  const [ratings, setRatings] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the service using selectedrequest
        const { data: serviceData, error: serviceError } = await supabase
          .from("services")
          .select("studentid")
          .eq("serviceid", selectedrequest)
          .single();

        if (serviceError) throw serviceError;

        const studentId = serviceData.studentid;

        // Fetch student details using studentid
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("educationlevel, degree, currentschool, yearlevel, userid")
          .eq("studentid", studentId)
          .single();

        if (studentError) throw studentError;

        setUserEducation(studentData);

        const userId = studentData.userid;

        // Fetch user details using userid
        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("firstname, lastname, birthdate")
          .eq("userid", userId)
          .single();

        if (userError) throw userError;

        setUserData(userData);

        // Fetch all services for the student
        const { data: studentServices, error: servicesError } = await supabase
          .from("services")
          .select("serviceid, serviceTitle, servicedesc")
          .eq("studentid", studentId);

        if (servicesError) throw servicesError;

        setServices(studentServices);

        // Fetch all portfolios for the student
        const { data: studentPortfolios, error: portfoliosError } =
          await supabase
            .from("portfolio")
            .select("portfolioid, portfolioname, portfoliodesc, link")
            .eq("studentid", studentId);

        if (portfoliosError) throw portfoliosError;

        setPortfolios(studentPortfolios);

        // Fetch evaluations for the student
        const { data: evaluations, error: evaluationsError } = await supabase
          .from("stud_evaluation")
          .select("usercomment, rating, studentevalid, clientid")
          .eq("studentid", studentId);

        if (evaluationsError) throw evaluationsError;

        // Fetch client information for each evaluation
        const reviews = await Promise.all(
          evaluations.map(async (evaluation) => {
            const { data: clientData, error: clientError } = await supabase
              .from("client_table")
              .select("userid")
              .eq("clientid", evaluation.clientid)
              .single();

            if (clientError) throw clientError;

            const { data: userData, error: userError } = await supabase
              .from("user_table")
              .select("firstname, lastname")
              .eq("userid", clientData.userid)
              .single();

            if (userError) throw userError;

            return {
              id: evaluation.studentevalid,
              stars: evaluation.rating,
              comment: evaluation.usercomment,
              rateFrom: `${userData.firstname} ${userData.lastname}`,
            };
          })
        );

        setRatings(reviews); // Save the reviews in state
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [selectedrequest]);

  const handleServicePress = (serviceId) => {
    setSelectedServiceId((prev) => (prev === serviceId ? null : serviceId));
  };

  const handlePortfolioPress = (portfolioId) => {
    setSelectedPortfolioId((prev) =>
      prev === portfolioId ? null : portfolioId
    );
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
    setSelectedServiceId(null);
    setSelectedPortfolioId(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>
            {userData ? userData.firstname.charAt(0) : "?"}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {userData
              ? `${userData.firstname} ${userData.lastname}`
              : "Loading..."}
          </Text>
          <Text style={styles.type}>Student Freelancer</Text>
        </View>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.detailsHeader}>About Me:</Text>
        <Text style={styles.details}>
          Birthdate: {userData ? formatDate(userData.birthdate) : "Loading..."}
        </Text>
        <Text style={styles.detailsHeader}>Education:</Text>
        {userEducation ? (
          <>
            <Text style={styles.details}>
              {userEducation.educationlevel} ({userEducation.yearlevel})
            </Text>
            <Text style={styles.details}>{userEducation.degree}</Text>
            <Text style={styles.details}>
              Studies at {userEducation.currentschool}
            </Text>
          </>
        ) : (
          <Text style={styles.details}>Loading...</Text>
        )}
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
      {activeTab === "services" && (
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.container,
              services.length === 1 && styles.singleServiceContainer,
            ]}
          >
            {services.map((service) => (
              <Pressable
                key={service.serviceid}
                onPress={() => handleServicePress(service.serviceid)}
                style={[
                  styles.serviceCard,
                  selectedServiceId === service.serviceid &&
                    styles.selectedCard,
                ]}
              >
                <ServiceCard
                  title={service.serviceTitle}
                  description={service.servicedesc}
                />
              </Pressable>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}
      {activeTab === "portfolios" && (
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            {portfolios.map((portfolio) => (
              <Pressable
                key={portfolio.portfolioid}
                onPress={() => handlePortfolioPress(portfolio.portfolioid)}
                style={[
                  styles.portfolioCard,
                  selectedPortfolioId === portfolio.portfolioid &&
                    styles.selectedCard,
                ]}
              >
                <PortfolioCard
                  title={portfolio.portfolioname}
                  description={portfolio.portfoliodesc}
                  link={portfolio.link}
                />
              </Pressable>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* Reviews Section */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsHeader}>Reviews</Text>
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <Rating
              key={rating.id}
              stars={rating.stars.toString()} // Ensure stars are passed as a string
              comment={rating.comment}
              rateFrom={rating.rateFrom} // The client's name
            />
          ))
        ) : (
          <Text style={styles.noReviewsText}>No reviews available</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ViewStudentProfile;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  header: {
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
    textAlign: "center", // Center-align header text
  },
  details: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
    textAlign: "center", // Center-align details text
  },
  aboutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    alignItems: "center", // Center align container content
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  serviceCard: {
    maxWidth: 350,
    margin: 10,
    borderRadius: 16,
    padding: 10,
  },
  portfolioCard: {
    maxWidth: 350,
    margin: 10,
    borderRadius: 16,
    padding: 10,
  },
  singleServiceContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10, // Bring it closer to the tabs
  },
  serviceCard: {
    maxWidth: 350,
    margin: 10,
    borderRadius: 16,
    padding: 10,
    alignSelf: "center",
  },
  selectedCard: {
    borderWidth: 0,
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
