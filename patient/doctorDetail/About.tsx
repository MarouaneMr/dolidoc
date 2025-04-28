import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AboutMeCard from "@/components/AboutMeCard";
import { FlatList } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { AboutMeData, doctorInfo } from "@/Data/AboutData";
import { AboutStyles } from "@/Styles/AboutStyles"; // Import the styles
import ISO6391 from "iso-639-1";
// Define the type for the props
interface AboutProps {
  aboutMeData: {
    id: number;
    title: string;
    imageSource: any;
    details: string;
  }[];
  doctorInfo: {
    about: string;
    qualifications: string;
    gender: string;
    spokenLanguages: string;
    city: string;
    doctorAcupuncture: string;
    availability: string;
    practicing: string;
    goals: string;
  };
}

export default function About({ doctor }: any) {
  const { t } = useTranslation();
  const { Data } = AboutMeData(doctor);
  const { doctInf } = doctorInfo();

  return (
    <View style={AboutStyles.container}>
      <FlatList
        data={Data}
        renderItem={({ item }) => (
          <View style={AboutStyles.cardContainer}>
            <AboutMeCard
              key={item?.title} // Assuming title is unique
              title={item?.title}
              imageSource={item?.imageSource}
              details={item?.details}
              item={item}
            />
          </View>
        )}
        keyExtractor={(item) => doctor?.title} // Use title as the unique key
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View style={AboutStyles.infoContainer}>
        <Text style={AboutStyles.heading}>{t("about")}</Text>
        <Text style={AboutStyles.description}>{doctor?.Introduction}</Text>

        <View style={AboutStyles.rowContainer}>
          <View style={AboutStyles.column}>
            <Text style={AboutStyles.heading}>{t("qualifications")}</Text>
            <Text style={AboutStyles.description}>
              {doctor?.qualifications}
            </Text>
          </View>
          <View style={AboutStyles.column}>
            <Text style={AboutStyles.heading}>{t("Gender")}</Text>
            <Text style={AboutStyles.description}>{doctor?.gender}</Text>
          </View>
        </View>

        <View style={AboutStyles.rowContainer}>
          <View style={AboutStyles.column}>
            <Text style={AboutStyles.heading} numberOfLines={1}>
              {t("Spoken Languages")}
            </Text>
            {doctor?.languages?.length > 0 &&
              doctor?.languages[0]?.map((item: any) => {
                return (
                  <Text
                    style={AboutStyles.description}
                    // numberOfLines={3}
                    key={item}
                  >
                    {ISO6391.getName(item)}
                  </Text>
                );
              })}
            {/* <Text style={AboutStyles.description} numberOfLines={3}> */}
            {/* </Text> */}
          </View>
          <View style={AboutStyles.column}>
            <Text style={AboutStyles.heading}>{t("city")}</Text>
            <Text style={AboutStyles.description}>{doctor?.address}</Text>
          </View>
        </View>

        <View style={AboutStyles.rowContainer}>
          <View style={AboutStyles.column}>
            <Text style={AboutStyles.heading} numberOfLines={1}>
              {t("doctor_acupuncture")}
            </Text>
            <Text style={AboutStyles.description}>
              {doctor?.specialization}
            </Text>
          </View>
          <View style={AboutStyles.column}>
            <Text style={AboutStyles.heading}>{t("availability")}</Text>
            <Text style={AboutStyles.description}>{doctor?.availability}</Text>
          </View>
        </View>

        {doctor?.Practicing && (
          <View style={AboutStyles.singleItem}>
            <Text style={AboutStyles.heading}>{t("practicing")}</Text>
            <Text style={AboutStyles.description}>{doctor?.Practicing}</Text>
          </View>
        )}

        {doctor?.Goal && (
          <View style={AboutStyles.singleItem}>
            <Text style={AboutStyles.heading}>{t("goals")}</Text>
            <Text style={AboutStyles.description}>{doctor?.Goal}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
