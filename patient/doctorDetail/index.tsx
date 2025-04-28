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
import React, { useLayoutEffect, useState } from "react";
import TopContainer from "@/components/TopContainer";
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
import About from "./About";
import { IndexStyles } from "@/Styles/AboutIndexStyles";
import { useRoute } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AboutMeCardStyles from "@/Styles/AboutMeCardStyles";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import useReviews from "@/hooks/useReviews";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";
import { doc } from "firebase/firestore";

export default function Index() {
  const [activeView, setActiveView] = useState("about");
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const { reviewData } = ReviewCardsData();
  const route = useRoute();
  const item = route.params as any;
  const { toast,showToast } = useToast();

  const { doctor } = item || { doctor: {} };
  const { fetchReviews, reviews, loading } = useReviews();
  console.log("Doc: ",doctor);
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
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
              <TopContainer title={"Doctor"} onPress={backPress} />
              <View style={AboutMeCardStyles.main}>
                <Image
                  source={doctor?.imageSource ?{ uri:  doctor?.imageSource} : doctor?.gender === "Male" ? require("../../../assets/images/doc.png") :require("../../../assets/images/doctor.png") }
                  style={AboutMeCardStyles.docImg}
                />
                <View>
                  <ThemedText type="primaryHeading">
                    {doctor?.name}
                  </ThemedText>
                  <View
                    style={[AboutMeCardStyles.status, AboutMeCardStyles.margin]}
                  >
                    <ThemedText type="secText">
                      {doctor?.specialization}
                    </ThemedText>
                    <ThemedText type="secText"> |</ThemedText>
                    <ThemedText type="secText">
                      {" "}
                      {doctor?.experience} {t("year_of_experience")}
                    </ThemedText>
                  </View>

                  <View style={AboutMeCardStyles.continer}>
                    <View style={AboutMeCardStyles.status}>
                      <AntDesign name="star" size={18} color="#107ACA" />
                      <ThemedText
                        type="secText"
                        style={AboutMeCardStyles.statustext}
                      >
                        // {item?.item?.review} ({item?.item?.review} //{" "}
                        {t("reviews")})
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
                    {t("about_me")}
                  </ThemedText>
                </CustomButton>
                <CustomButton
                  onPress={() => {
                    setActiveView("review");
                    fetchReviews(doctor?.user_id);
                  }}
                  style={[
                    IndexStyles.tabButton,
                    activeView === "review" && MainScreenStyles.active,
                  ]}
                >
                  <ThemedText
                    type={activeView === "review" ? "bluetext" : "primaryText"}
                  >
                    {t("review")}
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
              {activeView === "about" ? (
                <About doctor={doctor} />
              ) : 
              (
                reviews.length > 0 && (
                  <>
                    <FlatList
                      data={reviews}
                      // data={reviews.filter(
                      //   (itemm:any) => itemm.docUid === item?.item?.uid
                      // )}
                      renderItem={({ item }: any) => (
                        <ReviewCard
                          heading={item?.name}
                          iconSource={item?.image} // Replace with your icon
                          date={new Date(
                            item?.createdAt.seconds * 1000
                          ).toLocaleDateString("en-US")} // Formatting Firestore timestamp
                          description={item?.review}
                          rating={item?.rating}
                        />
                      )}
                      keyExtractor={(item) => item?.id.toString()}
                      numColumns={1}
                      scrollEnabled={false}
                    />
                  </>
                )
              )
              }

              <View style={IndexStyles.buttonContainer}>
                <CustomButton
                  style={RegAsStyles.continuebtn}
                  onPress={() =>{
                    if (doctor?.availablility_schedule) {
                      navigation.navigate("patient/CalendarForAppointment", {
                        doctor: doctor,
                      });
                    } else {
                      showToast("Doctor's schedule is not available", "error", "Error");
                    }
                  }
                  }
                >
                  <Text style={RegAsStyles.text}>
                    {t("make_an_appointment")}
                  </Text>
                </CustomButton>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}
