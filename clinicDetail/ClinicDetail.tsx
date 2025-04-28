import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import RNPickerSelect from "react-native-picker-select";
import CustomButton from "@/components/CustomButton";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import { ThemedText } from "@/components/ThemedText";
import ReviewCard from "@/components/ReviewCard";
import { FlatList } from "react-native-gesture-handler";
import { ReviewCardsData } from "@/Data/ReviewsData";
import { IndexStyles } from "@/Styles/AboutIndexStyles";
import { useRoute } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AboutMeCardStyles from "@/Styles/AboutMeCardStyles";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import useReviews from "@/hooks/useReviews";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";
import About from "../patient/doctorDetail/About";
import useGetClinDocs from "@/hooks/useGetClinDocs";
import { DoctorInfoContinerstyles } from "@/Styles/DoctorInfoContinerStyles";
import ClinicHomeStyles from "@/Styles/ClinicHomeStyles";
import TelePhoneSvg from "@/Svg/TelephoneSvg";
import MessageSvg from "@/Svg/MessageSvg";
import ContractDetails from "@/components/ContractDetails";

export const formatDateReadable = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long", // e.g., March
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // e.g., 7:27 AM
  };

  return date.toLocaleString("en-US", options);
};

export default function Index() {
  const [activeView, setActiveView] = useState("profile");

  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { reviewData } = ReviewCardsData();
  const route = useRoute();
  const item = route.params as any;
  const { toast } = useToast();

  //   const { fetchReviews, reviews, loading } = useReviews();
  const {
    doctors,
    currentUser,
    handleLocation,
    isModalMapVisible,
    handleCloseModal,
    refreshing,
    onRefresh,
    handleChangeStatus,
    selectedStatus,
    loading,
  } = useGetClinDocs();
  const [status, setStatus] = useState("");
  console.log("item ",item);
  return (
    <>
      <View style={{ flex: 1 }}>
        {toast && (
          <DynamicToast
            text={toast.text}
            heading={toast.heading}
            bgColor={toast.type === "success" ? "white" : "red"}
          />
        )}
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={LanguageScreenSttyles.Maincontainer}>
              <TopContainer
                title={item?.name}
                onPress={backPress}
              />
              <View style={AboutMeCardStyles.main}>
                <Image
                  source={{ uri: item?.image }}
                  style={AboutMeCardStyles.docImg2}
                />
                <View>
                  <ThemedText type="primaryHeading">
                    {item?.name}
                  </ThemedText>
                  <View
                    style={[AboutMeCardStyles.status, AboutMeCardStyles.margin]}
                  >
                    <ThemedText type="secText">
                      {item?.discipline}
                    </ThemedText>
                    <ThemedText type="secText"> |</ThemedText>
                    <ThemedText type="secText">
                      {item?.availablility}({item?.startTime}-
                      {item?.endTime})
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="secText"
                    style={DoctorInfoContinerstyles.margin}
                  >
                    {item?.address}
                  </ThemedText>
                  <View style={ClinicHomeStyles.continer}>
                    <View style={DoctorInfoContinerstyles.status}>
                      <TelePhoneSvg />
                      <ThemedText
                        type="secText"
                        style={ClinicHomeStyles.statustext}
                      >
                        {item?.phone_number}
                      </ThemedText>
                    </View>
                    <View style={DoctorInfoContinerstyles.status}>
                      <MessageSvg />
                      <ThemedText
                        type="secText"
                        style={ClinicHomeStyles.statustext}
                      >
                        {item?.email}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              <View style={DoctorInfoContinerstyles.available}>
                {/* <View style={DoctorInfoContinerstyles.dropdown2}>
                  <RNPickerSelect
                    onValueChange={(value) =>
                      handleChangeStatus(value, currentUser?.id)
                    }
                    items={[
                      { label: t("av"), value: "Available" },
                      { label: t("unav"), value: "Unavailable" },
                    ]}
                    placeholder={{
                      label: currentUser?.status,
                      value: currentUser?.status,
                    }}
                    style={{
                      inputIOS: DoctorInfoContinerstyles.inputIOS2,
                      inputAndroid: DoctorInfoContinerstyles.inputAndroid2,
                      iconContainer: DoctorInfoContinerstyles.iconContainer2,
                    }}
                    value={selectedStatus}
                  />
                </View> */}
                <View style={styles.container}>
                  <RNPickerSelect
                    onValueChange={(value) => setStatus(value)}
                    items={[
                      { label: "Available", value: "available" },
                      { label: "Unavailable", value: "unavailable" },
                    ]}
                    placeholder={{ label: "Select Status", value: null }}
                    style={{
                      inputIOS: styles.dropdown,
                      inputAndroid: styles.dropdown,
                      iconContainer: styles.iconContainer,
                    }}
                    value={status}
                    Icon={() => (
                      <Ionicons
                        name="chevron-down"
                        size={responsiveWidth(5)}
                        color="#000000"
                      />
                    )}
                  />
                </View>
              </View>
              <View style={MainScreenStyles.cont}>
                <CustomButton
                  onPress={() => setActiveView("profile")}
                  style={[
                    IndexStyles.tabButton,
                    activeView === "profile" && MainScreenStyles.active,
                  ]}
                >
                  <ThemedText
                    type={activeView === "profile" ? "bluetext" : "primaryText"}
                  >
                    {t("clin_prof")}
                  </ThemedText>
                </CustomButton>
                <CustomButton
                  onPress={() => {
                    setActiveView("contract");
                    //   fetchReviews(item.item.uid);
                  }}
                  style={[
                    IndexStyles.tabButton,
                    activeView === "contract" && MainScreenStyles.active,
                  ]}
                >
                  <ThemedText
                    type={
                      activeView === "revicontractew"
                        ? "bluetext"
                        : "primaryText"
                    }
                  >
                    {t("contract")}
                  </ThemedText>
                </CustomButton>
              </View>
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#107ACA"
                  style={{ height: responsiveHeight(20) }}
                />
              )}
              {activeView === "profile" ? (
                <View>
                  <ThemedText style={MainScreenStyles.proText}>
                    Date of Creation
                  </ThemedText>
                  <ThemedText style={MainScreenStyles.proText2}>
                    {formatDateReadable(item?.createdAt)}
                  </ThemedText>
                  <ThemedText style={MainScreenStyles.proText}>
                    Registered Doctors
                  </ThemedText>
                  <ThemedText style={MainScreenStyles.proText2}>
                    {doctors?.length} {t("doctors")}
                  </ThemedText>
                  <ThemedText style={MainScreenStyles.proText}>
                    Availability
                  </ThemedText>
                  <View style={MainScreenStyles.avCont}>
                    <View>
                      <ThemedText style={MainScreenStyles.proText}>
                        Days
                      </ThemedText>
                      <ThemedText style={MainScreenStyles.proText2}>
                        {currentUser?.days}
                      </ThemedText>
                    </View>
                    <View>
                      <ThemedText style={MainScreenStyles.proText}>
                        Timings
                      </ThemedText>
                      <ThemedText style={MainScreenStyles.proText2}>
                        {currentUser?.startTime}-{currentUser?.endTime}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <ContractDetails />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(4),
  },
  dropdown: {
    backgroundColor: "#107ACA1A", // Background color for dropdown
    borderRadius: responsiveWidth(6),
    color: "#107ACA", // Text color
    // padding: responsiveWidth(3),
    fontSize: responsiveWidth(4),
    paddingLeft: responsiveWidth(13),
    paddingRight: responsiveWidth(15),
    paddingTop: responsiveWidth(2),
    paddingBottom: responsiveWidth(2),
  },
  iconContainer: {
    right: responsiveWidth(2), // Adjust icon position
    top: responsiveWidth(2), // Center it vertically
    marginRight:responsiveWidth(1)
  },
  
});
