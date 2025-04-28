import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { NotificationStyles } from "@/Styles/NotificationStyles";
import { ThemedText } from "@/components/ThemedText";
import NotificationConatiner from "@/components/NotificationConatiner";
import GetReivewModal from "@/Modal/GetReivewModal";
import NotifiHook from "@/hooks/NotifiHook";
import { useCheckUser } from "@/hooks/checkUser";
import ProfileHook from "@/hooks/ProfileHook";
import { FlatList } from "react-native-gesture-handler";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useTranslation } from "react-i18next";
import DoctorSvg from "@/Svg/DoctorSvg";
import PatientSvg from "@/Svg/PatientSvg";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store/store";
import useNotification from "@/hooks/useNotification";
import useUploadNotif from "@/hooks/useUploadNotif";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { authSelector } from "@/Redux/Slices/auth";
import SelectRole from "../auth/role/SelectRole";
import { isAuthenticated } from "@/utils/authentication/authentication";

export default function Notifications() {
  const {
    handleNotificationPress,
    isModalOpen,
    handleCloseModal,
    handleBackPress,
    docId,
    isLoading,
    updateAllNotificationsToRead,
  } = useNotification();
  const { t } = useTranslation();
  const { user } = useSelector(authSelector);
  const notifications = useSelector(
    (state: RootState) => state.notification.list
  );
  const { toast } = useToast();
  return (
    <>
      {!user || !isAuthenticated() ? (
        <SelectRole />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={NotificationStyles.Maincontainer}>
                <TopContainer title="Notification" onPress={handleBackPress}>
                  <CustomButton style={NotificationStyles.notificationbtn}>
                    <Text style={NotificationStyles.btntext}>
                      {notifications.length > 0
                        ? notifications.filter(
                            (item) => item.notifStatus === "unread"
                          ).length
                        : 0}{" "}
                      New
                    </Text>
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
                    onPress={() =>
                      handleNotificationPress(item.status, item.id, item.docUid)
                    }
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
            {isModalOpen && (
              <GetReivewModal
                visible={isModalOpen}
                onClose={handleCloseModal}
                docid={docId}
              />
            )}
          </View>
        </View>
      )}
    </>
  );
}
