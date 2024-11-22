import { View, Text } from "react-native";
import React from "react";
import ListingDetails from "@/components/ui/jobdetailsexpanded";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";

const ManageJobListing = () => {
  const router = useRouter();
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
      <Button
        title="Edit Listing"
        type="light"
        size="medium"
        onPress={() => {
          router.push("/screens/editjoblisting");
        }}
      />
      <Button title="Delete Listing" type="dark" size="medium" />
    </View>
  );
};

export default ManageJobListing;
