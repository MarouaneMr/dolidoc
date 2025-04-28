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
import { responsiveHeight } from "react-native-responsive-dimensions";
import useGetClinDocs from "@/hooks/useGetClinDocs";
import RightArrowSvg from "@/Svg/RightArrowSvg";
import { authSelector } from "@/Redux/Slices/auth";
import Progress from "@/utils/Functions/Progress Indicator/Progress";

export default function index() {
  const {
    doctors,
    loading,
    t,
    // currentUser,
    handleLocation,
    navigation,
    isModalMapVisible,
    handleCloseModal,
    refreshing,
    onRefresh,
    user,
    appointments,
    pending,
    cancelled,
    completed,
    appLoading
  } = useGetClinDocs();

    // const { user, subscription } = useSelector(authSelector);
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appLoading && (
          <Progress loading={loading}/>
        )}
        <View style={ClinicHomeStyles.container}>
          <View style={ClinicHomeStyles.welcomecontainer}>
            <View>
              <ThemedText type="ThinTextGray" style={ClinicHomeStyles.name}>
                {user?.name}
              </ThemedText>

              <ThemedText type="ThinTextGray">{user?.email}</ThemedText>
            </View>
            <View style={ClinicHomeStyles.welcomebtncont}>
              <CustomButton
                style={ClinicHomeStyles.welcomebtn}
                onPress={handleLocation}
              >
                <LocationPinSvg />
              </CustomButton>
              <CustomButton
                style={ClinicHomeStyles.welcomebtn}
                onPress={() => navigation.navigate("LanguageScreen")}
              >
                <LangSvg />
              </CustomButton>
            </View>
          </View>
          <MapViewModal
            visible={isModalMapVisible}
            onClose={handleCloseModal} // Pass the close function to the modal
          />
          <View>
            <Pressable style={DoctorInfoContinerstyles.main}>
              {user?.image ?(
                <Image
                source={{ uri: user?.image }}
                style={ClinicHomeStyles.docImg}
              />
            )
              : (null)
              }
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <ThemedText style={ClinicHomeStyles.clinicName}>
                    {user?.name}
                  </ThemedText>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("clinicDetail/ClinicDetail",user)
                    }
                  >
                    <RightArrowSvg />
                  </Pressable>
                </View>
                {/* <Text style={DoctorInfoContinerstyles.Location}>{location}</Text> */}
                <View
                  style={[
                    DoctorInfoContinerstyles.status,
                    DoctorInfoContinerstyles.margin,
                  ]}
                >
                  <Text style={ClinicHomeStyles.statustext}>
                    {user?.discipline}
                  </Text>
                  <Text style={ClinicHomeStyles.statustext}> |</Text>
                  {/* <ThemedText type="secText">
                    {" "}
                    {user?.days}({user?.startTime}-
                    {user?.endTime})
                  </ThemedText> */}
                  <ThemedText type="secText">
                    {user?.availablility
                      // ?.split("-")
                      // .map((day: string) => day.slice(0, 3))
                      // .join("-")
                      }
                    ({user?.startTime}-{user?.endTime})
                  </ThemedText>
                </View>
                <ThemedText
                  type="secText"
                  style={DoctorInfoContinerstyles.margin}
                >
                  {user?.address}
                </ThemedText>
                <View style={ClinicHomeStyles.continer}>
                  <View style={DoctorInfoContinerstyles.status}>
                    <TelePhoneSvg />
                    <ThemedText
                      type="secText"
                      style={ClinicHomeStyles.statustext}
                    >
                      {user?.phone_number}
                    </ThemedText>
                  </View>
                  <View style={DoctorInfoContinerstyles.status}>
                    <MessageSvg />
                    <ThemedText
                      type="secText"
                      style={ClinicHomeStyles.statustext}
                    >
                      {user?.email}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </Pressable>
            {/* {show && (
        <CustomButton style={DoctorCardStyles.button} onPress={navigation}>
          <Text style={DoctorCardStyles.buttonText}>Book Appointment</Text>
        </CustomButton>
      )} */}
          </View>

          {/* Blue container  */}
          <ImageBackground
            source={require("../../assets/images/bg.png")}
            style={MainScreenStyles.registercontainer}
          >
            <View>
              <Text style={MainScreenStyles.registertxtheading}>
                {t("sub_status")}
              </Text>
              <Text style={MainScreenStyles.registertxt}>
                {t("sub_detail")}
              </Text>
            </View>
          </ImageBackground>

          <View style={ClinicHomeStyles.Booking}>
            <View style={ClinicHomeStyles.bookingCont}>
              <Text style={ClinicHomeStyles.bookingText}>{t("total")}</Text>
              <Text style={ClinicHomeStyles.bookingText}>{t("bookings")}</Text>
              <Text style={ClinicHomeStyles.bookingText2}>{appointments?.length}</Text>
            </View>
            <View style={ClinicHomeStyles.bookingCont}>
              <Text style={ClinicHomeStyles.bookingText}>{t("Completed")}</Text>
              <Text style={ClinicHomeStyles.bookingText}>{t("bookings")}</Text>
              <Text style={ClinicHomeStyles.bookingText2}>{completed?.length}</Text>
            </View>
          </View>

          <View style={ClinicHomeStyles.Booking}>
            <View style={ClinicHomeStyles.bookingCont}>
              <Text style={ClinicHomeStyles.bookingText}>{t("pending")}</Text>
              <Text style={ClinicHomeStyles.bookingText}>{t("bookings")}</Text>
              <Text style={ClinicHomeStyles.bookingText2}>{pending?.length}</Text>
            </View>
            <View style={ClinicHomeStyles.bookingCont}>
              <Text style={ClinicHomeStyles.bookingText}>{t("Cancelled")}</Text>
              <Text style={ClinicHomeStyles.bookingText}>{t("bookings")}</Text>
              <Text style={ClinicHomeStyles.bookingText2}>{cancelled?.length}</Text>
            </View>
          </View>

          <View style={ClinicHomeStyles.specContainer}>
            <ThemedText type="SecLightHeading">{t("Av_doc")}</ThemedText>
            <TouchableOpacity
            //   onPress={() => navigation.navigate("DoctorSpeciality")}
            >
              <ThemedText type="link"> {t("see_all")}</ThemedText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#107ACA"
                style={{ height: responsiveHeight(20) }}
              />
            ) : doctors?.length === 0 ? (
              <Text style={MainScreenStyles.noData}>No doctors found.</Text>
            ) : (
              <FlatList
                data={doctors}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <DoctorInfoContiner
                    imageSource={item.imageSource}
                    status={item.status}
                    name={item.name}
                    startTime={item.startTime}
                    endTime={item.endTime}
                    experience={item.experience}
                    qualifications={item.qualifications}
                    token={item.token}
                    review={item.review}
                    gender={item.gender}
                    location={item.placeName}
                    specialization={item.specialization}
                    // onPress={() =>
                    //   navigation.navigate("patient/detail/index", { item })
                    // }
                    show={false}
                  />
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
