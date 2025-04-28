import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import { IndexStyles } from "@/Styles/AboutIndexStyles";
import { useRoute } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AboutMeCardStyles from "@/Styles/AboutMeCardStyles";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import useReviews from "@/hooks/useReviews";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useToast } from "@/Context/ToastProvider";
import DynamicToast from "@/components/DynamicToast";
import useGetDocsClinic from "@/hooks/useGetDocsClinic";
import * as Location from "expo-location";
import Progress from "@/utils/Functions/Progress Indicator/Progress";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const route = useRoute();
  const item = route.params as any;
  const { toast } = useToast();
  const { loading, getClinicDoctors, clinicDoctors } = useGetDocsClinic();
  const [address, setAddress] = useState("");

  useEffect(() => {
    // const executeGetClinicDoctors = async () => {
    //   for (let i = 0; i < 3; i++) {
    //     setTimeout(() => {
    //       getClinicDoctors(item?.item?.uid && item?.item?.uid);
    //     }, i * 3000); // Delay of 3 seconds for each iteration
    //   }
    // };
  // if(item?.item?.location.coords){ 
  //    reverseGeocodeLocation(
  //     item?.item?.location.coords.latitude,
  //     item?.item?.location.coords.longitude
  //   );}
    // executeGetClinicDoctors();
    getClinicDoctors(item?.item.user_id);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getClinicDoctors(item?.item?.uid);
    // reverseGeocodeLocation(
    //   item?.item?.location.coords.latitude,
    //   item?.item?.location.coords.longitude
    // );
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

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
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {loading && (
              <Progress loading={loading}/>
            )}
            <View style={LanguageScreenSttyles.Maincontainer}>
              <TopContainer title={item?.item?.name} onPress={backPress} />
              <View style={AboutMeCardStyles.main}>
                <Image
                  source={{ uri: item?.item?.image }}
                  style={AboutMeCardStyles.docImg}
                />
                <View>
                  <ThemedText type="primaryHeading">
                    {item?.item?.name}
                  </ThemedText>
                  <View
                    style={[AboutMeCardStyles.status, AboutMeCardStyles.margin]}
                  >
                    <ThemedText type="secText">
                      {item?.item?.discipline}
                    </ThemedText>
                    <ThemedText type="secText"> |</ThemedText>
                    <ThemedText type="secText">
                      {" "}
                      {Array.isArray(item?.item.availability) && item?.item.availability.length > 0 ?
           item?.item.availability.length == 7 ? 
  "Everyday" : (item?.item.availability.map((day: string, index: number) =>
      index === item?.item.availability.length - 1 ? day : `${day} -`
    ))
  : "No availability"}
                    </ThemedText>
                  </View>

                  <View style={AboutMeCardStyles.continer}>
                    <View style={AboutMeCardStyles.status}>
                      <AntDesign name="star" size={18} color="#107ACA" />
                      <ThemedText
                        type="secText"
                        style={AboutMeCardStyles.statustext}
                      >
                        {item?.item?.review} ({item?.item?.review}{" "}
                        {t("reviews")})
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
              <ThemedText
                type="primaryHeading"
                style={{ marginTop: responsiveHeight(1) }}
              >
                Address
              </ThemedText>
              <ThemedText
                type="secText"
                style={{ marginTop: responsiveHeight(1) }}
              >
                {item?.item.address}
              </ThemedText>
              <ThemedText
                type="primaryHeading"
                style={{ marginTop: responsiveHeight(3) }}
              >
                Clinic Timings
              </ThemedText>
              <ThemedText
                type="secText"
                style={{ marginTop: responsiveHeight(1) }}
              >
                ({item?.item?.startTime}-
                {item?.item?.endTime})
              </ThemedText>

              <View style={{ marginTop: responsiveHeight(3) }}>
                <ThemedText type="primaryHeading">Available Doctors</ThemedText>
              </View>
              {/* {loading && (
                <ActivityIndicator
                  size="small"
                  color="#107ACA"
                  style={{ height: responsiveHeight(20) }}
                />
              )} */}

              <FlatList
                data={clinicDoctors}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <DoctorInfoContiner
                    imageSource={item?.imageSource}
                    status={item?.status}
                    name={item?.name}
                    startTime={item?.startTime}
                    endTime={item?.endTime}
                    experience={item?.experience}
                    qualifications={item?.qualifications}
                    clinicToken={item?.clinicToken}
                    token={item?.token || ""}
                    review={item?.review}
                    gender={item?.gender}
                    location={item?.address}
                    specialization={item?.specialization}
                    onPress={() =>
                      navigation.navigate("patient/doctorDetail/index", { doctor:item })
                    }
                    show={false}
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}
