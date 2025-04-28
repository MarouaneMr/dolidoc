import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopContainer from "@/components/TopContainer";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import CustomButton from "@/components/CustomButton";
import DoctorSvg from "@/Svg/DoctorSvg";
import PatientSvg from "@/Svg/PatientSvg";
import { useNavigation, useSegments } from "expo-router";
import { useTranslation } from "react-i18next";
import ProfileHook from "@/hooks/ProfileHook";
import { useCheckUser } from "@/hooks/checkUser";
import Logout from "@/hooks/Logout";
import { UseSettingData } from "@/Data/PatientProfileData";
import SettingNav from "@/Navigation/PatientProfileNav";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import ProfileSettingcontainer from "@/components/ProfileSettingcontainer";
import MainModal from "@/Modal/MainModal";
import { SettingStyles } from "@/Styles/SettingStyles";
import { ThemedText } from "@/components/ThemedText";
import { authSelector, setRole } from "@/Redux/Slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated } from "@/utils/authentication/authentication";
import SelectRole from "../auth/role/SelectRole";
import ProfileScreen from "../patient/profile/ProfileScreen";
import DoctorProfile from "../doctorProfileView/DoctorProfile/DoctorProfile";
import DocProfile from "../doctor/profile";

export default function Profile() {
  const { t } = useTranslation();
  const { navigation } = ProfileHook();
  const { user, role, profile_completed, isInitialized } =
    useSelector(authSelector);

  const { SettingData } = UseSettingData();
  const { handleSettingNavigation } = SettingNav();
  const { modal, openLogoutModal, closeLogoutModal, logout } = Logout();
  function handleBackPress() {
    navigation.goBack();
  }

  return (
    <>
      {!isAuthenticated() || !isInitialized ? (
        <SelectRole />
      ) : role === "doctor" && !profile_completed ? (
        <>
          <DoctorProfile />
        </>
      ) : role == "doctor" && profile_completed ? (
        <>
          <DocProfile />
        </>
      ) : role === "patient" && !profile_completed ? (
        <>
          <ProfileScreen />
        </>
      ) : (
        <>
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={LanguageScreenSttyles.Maincontainer}>
                <TopContainer title={t("setting")} onPress={handleBackPress} />
                <View style={LanguageScreenSttyles.container}>
                  <FlatList
                    data={SettingData}
                    renderItem={({ item, index }) => (
                      <ProfileSettingcontainer
                        text={item.text}
                        textStyle={
                          item.text === t("logout") ? { color: "#FF4C5E" } : {}
                        }
                        onPress={() => {
                          if (item.text === t("logout")) {
                            openLogoutModal();
                          } else {
                            handleSettingNavigation(item);
                          }
                        }}
                      >
                        <item.svg />
                      </ProfileSettingcontainer>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={false}
                    numColumns={1}
                    scrollEnabled={false}
                  />
                </View>
              </View>
            </ScrollView>
            <MainModal open={modal} close={closeLogoutModal}>
              <View style={SettingStyles.modal}>
                <View style={SettingStyles.container}>
                  <ThemedText type="SecLightHeading">
                    {t("logoutTitle")}
                  </ThemedText>
                  <Text style={SettingStyles.message}>
                    {t("logoutMessage")}
                  </Text>
                </View>
                <View style={SettingStyles.btnConatiner}>
                  <CustomButton
                    onPress={closeLogoutModal}
                    style={SettingStyles.cancelbtn}
                  >
                    <Text style={SettingStyles.canceltext}> {t("cancel")}</Text>
                  </CustomButton>
                  <CustomButton
                    style={SettingStyles.logouttext}
                    onPress={logout}
                  >
                    <Text style={SettingStyles.logouttext}> {t("logout")}</Text>
                  </CustomButton>
                </View>
              </View>
            </MainModal>
          </View>
        </>
      )}
    </>
  );
}
