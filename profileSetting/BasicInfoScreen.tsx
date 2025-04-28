import { View } from "react-native";
import React from "react";
import DoctorProfile from "../doctorProfileView/DoctorProfile/DoctorProfile";
export default function BasicInfoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <DoctorProfile />
    </View>
  );
}
