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
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";
import About from "../patient/doctorDetail/About";
import ClinicDocAppCont from "@/components/ClinicDocAppCont";
import useClinicAppointments from "@/hooks/useClinicAppointments";
import useGetClinDocs from "@/hooks/useGetClinDocs";
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
  console.log("this is item: ",item)

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
              <View style={styles.available}> 
              <View style={styles.container}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    handleChangeStatus(value, item.item.uid);
                    setStatus(value);
                  }}
                  items={[
                    { label: "Available", value: "available" },
                    { label: "Unavailable", value: "unavailable" },
                  ]}
                  placeholder={{ label: item.item.status, value: item.item.status }}
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
                  onPress={() => setActiveView("about")}
                  style={[
                    IndexStyles.tabButton,
                    activeView === "about" && MainScreenStyles.active,
                  ]}
                >
                  <ThemedText
                    type={activeView === "about" ? "bluetext" : "primaryText"}
                  >
                    {t("prof_details")}
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
                    {t("appointments")}
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
                //   reviews.length > 0 && (
                <ClinicDocAppCont appointments={item.item.appointments} />
                // <FlatList
                //   data={reviews}
                //   // data={reviews.filter(
                //   //   (itemm:any) => itemm.docUid === item.item.uid
                //   // )}
                //   renderItem={({ item }: any) => (
                //     <ReviewCard
                //       heading={item.name}
                //       iconSource={item.image} // Replace with your icon
                //       date={new Date(
                //         item.createdAt.seconds * 1000
                //       ).toLocaleDateString("en-US")} // Formatting Firestore timestamp
                //       description={item.review}
                //       rating={item.rating}
                //     />
                //   )}
                //   keyExtractor={(item) => item.id.toString()}
                //   numColumns={1}
                //   scrollEnabled={false}
                // />
                //   )
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
    marginRight: responsiveWidth(1),
  },
  available: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidth(15),
    justifyContent: "space-between",
  },
});
