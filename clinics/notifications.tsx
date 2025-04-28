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
  
  export default function Notifications() {
    const {
      handleClinicNotificationPress,
      isModalOpen,
      handleCloseModal,
      handleBackPress,
      docId,
      isLoading,
      updateAllNotificationsToRead,
    } = useNotification();
    const { t } = useTranslation();
    const { loading, currentUser } = useCheckUser();
    const { handelContinue, activeRole, setactiveRole } = ProfileHook();
    const notifications = useSelector(
      (state: RootState) => state.notification.list
    );
    const { toast } = useToast();
    return (
      <>
        {!currentUser ? (
          <View style={{ flex: 1 }}>
            {toast && (
              <DynamicToast
                text={toast.text}
                heading={toast.heading}
                bgColor={toast.type === "success" ? "white" : "red"}
              />
            )}
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#107ACA"
                style={{ height: responsiveHeight(20) }}
              />
            )}
            <View style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={RegAsStyles.Maincontainer}>
                  <TopContainer
                    title={t("login_register")}
                    onPress={handleBackPress}
                  />
                  <View style={RegAsStyles.container}>
                    <Image
                      source={require("../../assets/images/logo.png")}
                      style={RegAsStyles.logo}
                    />
                    <Text style={RegAsStyles.mainheading}>DoliDocs</Text>
                    <View>
                      <Text style={RegAsStyles.optText}>
                        {t("register_description")}
                      </Text>
                      <View style={RegAsStyles.buttonconatiner}>
                        <CustomButton
                          onPress={() => setactiveRole("doctor")}
                          style={[
                            RegAsStyles.btncont,
                            activeRole === "doctor" && RegAsStyles.activebtn,
                          ]}
                        >
                          <View
                            style={[
                              RegAsStyles.svg,
                              activeRole === "doctor" && RegAsStyles.activesvg,
                            ]}
                          >
                            <DoctorSvg />
                          </View>
                          <Text
                            style={[
                              RegAsStyles.bluetext,
                              activeRole === "doctor" && RegAsStyles.text,
                            ]}
                          >
                            {t("Doctor")}
                          </Text>
                        </CustomButton>
                        <CustomButton
                          onPress={() => setactiveRole("patient")}
                          style={[
                            RegAsStyles.btncont,
                            activeRole === "patient" && RegAsStyles.activebtn,
                          ]}
                        >
                          <View
                            style={[
                              RegAsStyles.svg,
                              activeRole === "patient" && RegAsStyles.activesvg,
                            ]}
                          >
                            <PatientSvg />
                          </View>
                          <Text
                            style={[
                              RegAsStyles.bluetext,
                              activeRole === "patient" && RegAsStyles.text,
                            ]}
                          >
                            {t("patient")}
                          </Text>
                        </CustomButton>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={RegAsStyles.bottomContainer}>
                <CustomButton
                  style={RegAsStyles.continuebtn}
                  onPress={handelContinue}
                >
                  <Text style={RegAsStyles.text}>{t("continue")}</Text>
                </CustomButton>
              </View>
            </View>
          </View>
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
                        handleClinicNotificationPress(item.status, item.id, item.docUid)
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
  