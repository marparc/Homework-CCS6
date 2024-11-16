import { View, Text, ScrollView } from "react-native";
import React from "react";
import InputField from "../components/ui/inputfield";
import Button from "../components/ui/buttons";
import ProfileCard from "../components/ui/profilecard";
import JobCard from "../components/ui/jobcard";
import AppCard from "../components/ui/applicationcard";
import JobDetails from "../components/ui/jobdetails";
import Rating from "../components/ui/ratings";
import SearchBox from "../components/ui/searchbox";
import ListingDetails from "../components/ui/jobdetailsexpanded";
import Chat from "../components/ui/chatcard";
import Message from "../components/ui/message";

const Index = () => {
  return (
    <>
      <ListingDetails
        title="Video Editor"
        jobType="Onsite"
        posted="November 21, 2024"
        status="Open"
        client="Marc Warren"
        stars="5"
        location="Dumaguete City"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras placerat arcu nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        pay="5000"
      />

      <Message
        role="sender"
        name="Marc"
        message="test test test"
        date="November 12"
        time="12:00PM"
      ></Message>

      <Message
        role="receiver"
        name="Phoebe"
        message="Hi there! Just wanted to check in and see how you're doing. Let me know if you need anything or if we can catch up soon. Take care and stay safe!"
        date="November 12"
        time="12:00PM"
      ></Message>
    </>
  );
};

export default Index;
