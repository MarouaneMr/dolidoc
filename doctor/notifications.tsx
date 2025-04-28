import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { NotificationStyles } from "@/Styles/NotificationStyles";
import { ThemedText } from "@/components/ThemedText";
import NotificationConatiner from "@/components/NotificationConatiner";
import GetReivewModal from "@/Modal/GetReivewModal";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store/store";
import useNotification from "@/hooks/useNotification";
import useUploadNotif from "@/hooks/useUploadNotif";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { authSelector } from "@/Redux/Slices/auth";

export default function Notifications({}) {
  const navigation = useNavigation<any>();
  const {
    isModalOpen,
    setIsModalOpen,
    handleNotificationPress,
    handleBackPress,
  } = useNotification();
  const {
    updateAllNotificationsToRead,
    updateSpecificNotification,
    isLoading,
  } = useUploadNotif();

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const notifications = useSelector(
    (state: RootState) => state.notification.list
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="#107ACA"
              style={{ height: responsiveHeight(20) }}
            />
          )}
          <View style={NotificationStyles.Maincontainer}>
            <TopContainer title="Notification" onPress={handleBackPress}>
              <CustomButton style={NotificationStyles.notificationbtn}>
                <Text style={NotificationStyles.btntext}>2 New</Text>
              </CustomButton>
            </TopContainer>
            <View style={NotificationStyles.container}>
              <View style={NotificationStyles.Dateconatiner}>
                <ThemedText type="bluetext" style={{ color: "#9E9E9E" }}>
                  Today
                </ThemedText>
                <TouchableOpacity onPress={updateAllNotificationsToRead}>
                  <ThemedText type="bluetext">Mark all as read</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {notifications.map((item: any) => {
            return (
              <TouchableOpacity
                onPress={() => handleNotificationPress(item.status, item.id)}
              >
                <NotificationConatiner
                  status={item.status}
                  title={item.title}
                  desc={item.description}
                  time={item.timestamp}
                  notifStatus={item.notifStatus}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* Conditionally render the modal */}
        {isModalOpen && (
          <GetReivewModal
            visible={isModalOpen}
            onClose={handleCloseModal} // Pass the close function to the modal
          />
        )}
      </View>
    </View>
  );
}
