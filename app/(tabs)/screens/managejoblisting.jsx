import { View, Text } from "react-native";
import React from "react";
import ListingDetails from "@/components/ui/jobdetailsexpanded";

const ManageJobListing = () => {
  return (
    <View>
      <ListingDetails
        title="Video Editor"
        jobType="Onsite"
        posted="November 21, 2024"
        status="Open"
        location="Dumaguete City"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras placerat arcu nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
        pay="5000"
      />
    </View>
  );
};

export default ManageJobListing;
