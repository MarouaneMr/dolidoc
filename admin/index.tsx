import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import ClinicHomeStyles from "@/Styles/ClinicHomeStyles";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import LocationPinSvg from "@/Svg/LocationPinSvg";
import { useNavigation } from "@react-navigation/native";
import LangSvg from "@/Svg/LangSvg";
import MapViewModal from "@/Modal/MapViewModal";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { languageSelector } from "@/Redux/Slices/language";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { DoctorInfoContinerstyles } from "@/Styles/DoctorInfoContinerStyles";
import TelePhoneSvg from "@/Svg/TelephoneSvg";
import MessageSvg from "@/Svg/MessageSvg";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import useGetClinDocs from "@/hooks/useGetClinDocs";
import RightArrowSvg from "@/Svg/RightArrowSvg";
import RightBlueSvg from "@/Svg/RightBlueSvg";
import useAdmin from "@/hooks/useAdmin";

export default function index() {
  const {
    loading,
    t,
    currentUser,
    handleLocation,
    navigation,
    isModalMapVisible,
    handleCloseModal,
    refreshing,
    onRefresh,
  } = useGetClinDocs();
  const { doctors, clinics } = useAdmin();

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={ClinicHomeStyles.container}>
          <View style={ClinicHomeStyles.welcomecontainer}>
            <View>
              <ThemedText type="ThinTextGray" style={ClinicHomeStyles.name}>
                {currentUser?.name}
              </ThemedText>

              <ThemedText type="ThinTextGray">{currentUser?.email}</ThemedText>
            </View>
          </View>

          <View style={ClinicHomeStyles.Booking}>
            <View style={ClinicHomeStyles.bookingCont}>
              <Text style={ClinicHomeStyles.bookingText}>Total</Text>
              <Text style={ClinicHomeStyles.bookingText}>Doctors</Text>
              <Text style={ClinicHomeStyles.bookingText2}>
                {doctors?.length}
              </Text>

              <Pressable
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  marginTop: responsiveHeight(1),
                }}
                onPress={() => navigation.navigate("Doctors")}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    textDecorationLine: "underline",
                    color: "#247CFF",
                  }}
                >
                  View All
                </Text>
                <RightBlueSvg style={{ marginTop: responsiveHeight(1) }} />
              </Pressable>
            </View>
            <View style={ClinicHomeStyles.bookingCont}>
              <Text style={ClinicHomeStyles.bookingText}>Total</Text>
              <Text style={ClinicHomeStyles.bookingText}>Clinics</Text>
              <Text style={ClinicHomeStyles.bookingText2}>
                {clinics?.length}
              </Text>
              <Pressable
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  marginTop: responsiveHeight(1),
                }}
                onPress={() => navigation.navigate("Clinics")}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    textDecorationLine: "underline",
                    color: "#247CFF",
                  }}
                >
                  View All
                </Text>
                <RightBlueSvg style={{ marginTop: responsiveHeight(1) }} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
