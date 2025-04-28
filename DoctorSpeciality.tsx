import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { DoctorsSpecs } from "@/Data/DoctorsSpecs";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import TopContainer from "@/components/TopContainer";
import DoctorSpecialityStyles from "@/Styles/DoctorSpecialityStyles";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import getDoctorCategory from "@/hooks/getDoctorCategory";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
export default function DoctorSpeciality() {
  const { Spec } = DoctorsSpecs();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  // const { categories } = getDoctorCategory();
  

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={LanguageScreenSttyles.Maincontainer}>
              <TopContainer
                title={t("Doctor Speciality")}
                onPress={() => navigation.goBack()}
              />
              <View style={LanguageScreenSttyles.container}>
                <FlatList
                  data={Spec}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                      style={DoctorSpecialityStyles.cardContainer}
                                        onPress={() =>
                                          navigation.navigate("DoctorInfoFilter", { item: item.spec })
                                        }
                                      >
                      <View style={DoctorSpecialityStyles.imageContainer}>
                        {/* <Image
                          source={{ uri: item.icon }}
                          style={DoctorSpecialityStyles.icon}
                        /> */}
                        <item.svg/>
                      </View>
                      <Text style={DoctorSpecialityStyles.specHeading}>
                        {item.spec}
                      </Text>
                      </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  numColumns={3}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}
