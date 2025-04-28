import React, { useState } from "react";
import {
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import DoctorCard from "@/components/DoctorCard";
import SearchInputComp from "@/components/SearchInputComp";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import TopContainer from "@/components/TopContainer";
import DoctorInfoFilterStyles from "@/Styles/DoctorInfoFilterStyles";
import { doctorData } from "@/Data/AboutData";
import { DoctorsData } from "@/Data/DoctorsData";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import GetDoctorInfo from "@/hooks/GetDoctorInfo";
import { useRoute } from "@react-navigation/native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import CustomButton from "@/components/CustomButton";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  qualifications: string;
  rating: string;
  time: string;
  availability: string;
  status: string;
  image: string;
}
export default function DoctorInfoFilter() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { Data } = DoctorsData();
  const [activeTab, setActiveTab] = useState("doctors");
  const { doctors, loading } = GetDoctorInfo();

  const handleBackPress = () => {
    navigation.goBack();
  };
  const route = useRoute();
  const atom = route.params as any;
  console.log("info: ", atom);

  // const renderItem = ({ item }: { item: Doctor }) => (
  //   <DoctorCard doctor={item} />
  // );

  return (
    <ScrollView>
      <View style={DoctorInfoFilterStyles.container}>
        <TopContainer title={t("Doctor")} onPress={handleBackPress} />
        <View style={DoctorInfoFilterStyles.searchView}>
          <SearchInputComp
            placeholder={t("search")}
            onPress={() => navigation.navigate("SearchScreen",{doctors})}
            style={DoctorInfoFilterStyles.searchInput} // Added styling for the search input
          />
        </View>
        <View style={DocterDashboardStyles.container}>
          <CustomButton
            style={[
              DocterDashboardStyles.button,
              activeTab === "doctors" && DocterDashboardStyles.activeButton,
            ]}
            onPress={() => setActiveTab("doctors")}
          >
            <Text
              style={
                activeTab === "doctors"
                  ? DocterDashboardStyles.activeText
                  : DocterDashboardStyles.text
              }
            >
              {t("doctors")}
            </Text>
          </CustomButton>
          <CustomButton
            style={[
              DocterDashboardStyles.button,
              activeTab === "clinics" && DocterDashboardStyles.activeButton,
            ]}
            onPress={() => setActiveTab("clinics")}
          >
            <Text
              style={
                activeTab === "clinics"
                  ? DocterDashboardStyles.activeText
                  : DocterDashboardStyles.text
              }
            >
              {t("clinic")}
            </Text>
          </CustomButton>
        </View>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#107ACA"
            style={{ height: responsiveHeight(20) }}
          />
        )}
        <FlatList
          data={
            atom
              ? doctors.filter((item) => item.specialization[0] === atom.item)
              : doctors
          }
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
              location={item.address}
              specialization={item.specialization}
              onPress={() =>
                navigation.navigate("patient/doctorDetail/index", {doctor: item })
              }
              show={false}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}
