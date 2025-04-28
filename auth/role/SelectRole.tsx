import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import CustomButton from "@/components/CustomButton";
import DoctorSvg from "@/Svg/DoctorSvg";
import PatientSvg from "@/Svg/PatientSvg";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { authSelector, setRole } from "@/Redux/Slices/auth";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated } from "@/utils/authentication/authentication";
import ProfileHook from "@/hooks/ProfileHook";
import ClinicSvg from "@/Svg/ClinicSvg";

export default function SelectRole() {
  const { t } = useTranslation();
  const { user, role, profile_completed } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const handelContinue = () => {
    // console.log("isAuthenticated() =>", isAuthenticated());
    if (!isAuthenticated()) {
      navigation.navigate("auth/signin/index");
      // switch (role) {
      //   case "clinic":
      //     navigation.navigate("auth/signup/ClinicRegister");
      //     break;
      //   default:
      //     navigation.navigate("auth/signin/index");
      //     break;
      // }
    } else {
      if (!user?.profile_completed) {
        if (role === "doctor") {
          navigation.navigate("doctor/profile/DoctorProfile");
        } else if (role == "patient") {
          navigation.navigate("patient/appntnt/index");
        }
      }
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={RegAsStyles.Maincontainer}>
              <TopContainer
                title={t("login_register")}
                onPress={() => navigation.goBack()}
              />
              <View style={RegAsStyles.container}>
                <Image
                  source={require("../../../assets/images/logo.png")}
                  style={RegAsStyles.logo}
                />
                <Text style={RegAsStyles.mainheading}>DoliDoc</Text>
                <View>
                  <Text style={RegAsStyles.optText}>
                    {t("register_description")}
                  </Text>
                  <View style={RegAsStyles.buttonconatiner}>
                    <CustomButton
                      onPress={() => {
                        dispatch(setRole("doctor"));
                      }}
                      style={[
                        RegAsStyles.btncont,
                        role === "doctor" && RegAsStyles.activebtn,
                      ]}
                    >
                      <View
                        style={[
                          RegAsStyles.svg,
                          role === "doctor" && RegAsStyles.activesvg,
                        ]}
                      >
                        <DoctorSvg />
                      </View>
                      <Text
                        style={[
                          RegAsStyles.bluetext,
                          role === "doctor" && RegAsStyles.text,
                        ]}
                      >
                        {t("Doctor")}
                      </Text>
                    </CustomButton>
                    <CustomButton
                      onPress={() => dispatch(setRole("patient"))}
                      style={[
                        RegAsStyles.btncont,
                        role === "patient" && RegAsStyles.activebtn,
                      ]}
                    >
                      <View
                        style={[
                          RegAsStyles.svg,
                          role === "patient" && RegAsStyles.activesvg,
                        ]}
                      >
                        <PatientSvg />
                      </View>
                      <Text
                        style={[
                          RegAsStyles.bluetext,
                          role === "patient" && RegAsStyles.text,
                        ]}
                      >
                        {t("patient")}
                      </Text>
                    </CustomButton>
                  </View>
                  <View style={{justifyContent: "center", // Centers vertically
    alignItems: "center",}}>
                  <CustomButton
                    onPress={() => {
                      dispatch(setRole("clinic"));
                    }}
                    style={[
                      RegAsStyles.btncont2,
                      role === "clinic" && RegAsStyles.activebtn,
                    ]}
                  >
                    <View
                      style={[
                        RegAsStyles.svg,
                        role === "clinic" && RegAsStyles.activesvg,
                      ]}
                    >
                      <ClinicSvg />
                    </View>
                    <Text
                      style={[
                        RegAsStyles.bluetext,
                        role === "clinic" && RegAsStyles.text,
                      ]}
                    >
                      {t("Clinic")}
                    </Text>
                  </CustomButton>
                  </View>
                </View>
              </View>
            </View>
            <View style={RegAsStyles.bottomContainer}>
              <CustomButton
                style={RegAsStyles.continuebtn}
                onPress={handelContinue}
              >
                <Text style={RegAsStyles.text}>{t("continue")}</Text>
              </CustomButton>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}
