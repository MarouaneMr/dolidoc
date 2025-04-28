import { View, Text, ScrollView } from "react-native";
import React from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { NotificationStyles } from "@/Styles/NotificationStyles";
import { ThemedText } from "@/components/ThemedText";
import NotificationConatiner from "@/components/NotificationConatiner";

export default function notifications() {
  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={NotificationStyles.Maincontainer}>
            <TopContainer title="Notification" onPress={handleBackPress}>
              <CustomButton style={NotificationStyles.notificationbtn}>
                <Text style={NotificationStyles.btntext}>2 New</Text>
              </CustomButton>
            </TopContainer>
            <View style={NotificationStyles.container}>
              <View style={NotificationStyles.Dateconatiner}>
                <ThemedText type="bluetext" style={{color:"#9E9E9E"}}>Today</ThemedText>
                <ThemedText type="bluetext" >Mark all as read</ThemedText>
              </View>
            </View>
          </View>
              <NotificationConatiner/>
        </ScrollView>
      </View>
    </View>
  );
}
