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
import React, { useEffect, useState } from "react";
import TopContainer from "@/components/TopContainer";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import CustomButton from "@/components/CustomButton";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
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
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";
import About from "../patient/doctorDetail/About";
import ClinicDocAppCont from "@/components/ClinicDocAppCont";
import useClinicAppointments from "@/hooks/useClinicAppointments";
import useGetClinDocs from "@/hooks/useGetClinDocs";
import DownSvg from "@/Svg/DownSvg";
import PDFSvg from "@/Svg/PDFSg";
export default function DocProfile() {
  const [activeView, setActiveView] = useState("about");

  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { reviewData } = ReviewCardsData();
  const route = useRoute();
  const item = route.params as any;
  console.log("this is item: ", item);

  const { toast } = useToast();

  // useEffect(() => {
  //     const fetchAppointments = async () => {
  //       setLoadingAppointments(true);
  //       const data = await getDocAppointments();
  //       setAppointments(data);
  //       setLoadingAppointments(false);
  //     };

  //     fetchAppointments();
  //   }, [getDocAppointments]);
  const { handleChangeStatus } = useGetClinDocs();
  const [status, setStatus] = useState("");
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
              <TopContainer title={item.item.name} onPress={backPress} />
              <View style={AboutMeCardStyles.main}>
                <Image
                  source={{ uri: item.item.imageSource }}
                  style={AboutMeCardStyles.docImg}
                />
                <View>
                  <ThemedText type="primaryHeading">
                    {item.item.name}
                  </ThemedText>
                  <View
                    style={[AboutMeCardStyles.status, AboutMeCardStyles.margin]}
                  >
                    <ThemedText type="secText">
                      {item.item.specialization}
                    </ThemedText>
                    <ThemedText type="secText"> |</ThemedText>
                    <ThemedText type="secText">
                      {" "}
                      {item.item.experience} {t("year_of_experience")}
                    </ThemedText>
                  </View>

                  <View style={AboutMeCardStyles.continer}>
                    <View style={AboutMeCardStyles.status}>
                      <AntDesign name="star" size={18} color="#107ACA" />
                      <ThemedText
                        type="secText"
                        style={AboutMeCardStyles.statustext}
                      >
                        {item.item.review} ({item.item.review} {t("reviews")})
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              <View style={MainScreenStyles.cont}>
                <CustomButton
                  onPress={() => setActiveView("about")}
                  style={[
                    IndexStyles.tabButton,
                    activeView === "about" && MainScreenStyles.active,
                  ]}
                >
                  <ThemedText
                    type={activeView === "about" ? "bluetext" : "primaryText"}
                  >
                    Doctor's Profile
                  </ThemedText>
                </CustomButton>
                <CustomButton
                  onPress={() => {
                    setActiveView("review");
                  }}
                  style={[
                    IndexStyles.tabButton,
                    activeView === "review" && MainScreenStyles.active,
                  ]}
                >
                  <ThemedText
                    type={activeView === "review" ? "bluetext" : "primaryText"}
                  >
                    Admin Panel
                  </ThemedText>
                </CustomButton>
              </View>
              {/* {loadingAppointments && (
                    <ActivityIndicator
                      size="small"
                      color="#107ACA"
                      style={{ height: responsiveHeight(20) }}
                    />
                  )} */}
              {activeView === "about" ? (
                <About item={item} />
              ) : (
                <View>
                  <View style={styles.container}>
                    <View style={styles.row}>
                      <View style={styles.row2}>
                        <PDFSvg />
                        <View>
                          <Text style={styles.text}>PDF </Text>
                          <Text style={styles.text}>123 KBs • 1 item </Text>
                        </View>
                      </View>
                      <DownSvg />
                      {/* <Icon name="picture-as-pdf" size={responsiveFontSize(3)} color="#FF0000" /> */}
                      {/* <Icon name="cloud-download" size={responsiveFontSize(2.5)} color="#666" /> */}
                    </View>
                    <View style={styles.details}>
                      <View style={styles.detailRow}>
                        <Text style={styles.label}>Status</Text>
                        <Text style={styles.value}>Available</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.label}>Activation Date</Text>
                        <Text style={styles.value}>30 June, 2023</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.label}>Expiry Date</Text>
                        <Text style={styles.value}>30 August, 2023</Text>
                      </View>
                    </View>
                  </View>
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
    marginRight: responsiveWidth(1),
  },
  available: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidth(15),
    justifyContent: "space-between",
  },
  container: {
    backgroundColor: "#FDFDFF", // 100% fill of FDFDFF
    marginHorizontal: responsiveWidth(4),
    padding: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    elevation: 2,
    borderWidth: 1, // Add a border
    borderColor: "#EDEDED", // 100% stroke of EDEDED
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // gap:2,
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  row2: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: 'space-between',
    gap: 2,
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    marginHorizontal: responsiveWidth(2),
  },
  details: {
    marginTop: responsiveHeight(2),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsiveHeight(1),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: "#666",
  },
  value: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: "bold",
  },
});
