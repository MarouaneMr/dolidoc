import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import GetDoctorInfo from "@/hooks/GetDoctorInfo";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import { useNavigation, useRoute } from "@react-navigation/native";
import ClinicInfoContiner from "@/components/ClinicInfoContainer";
import TopContainer from "@/components/TopContainer";

export default function index() {
  const { filteredDoctors, filteredClinics } = GetDoctorInfo();
  const navigation = useNavigation<any>();
  console.log("filtered here: ", filteredDoctors);
  const route = useRoute();
  const item = route.params as any;
  console.log("itemmm: ", item);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style= {style.topConatiner}>
    <TopContainer title={"Filtered"} onPress={()=>navigation.goBack()} />
    </View>
      <View style={style.container}>
        <FlatList
          data={item.filtered && item.filtered}
          keyExtractor={(item, index) =>
            item.uid ? item.uid.toString() : index.toString()
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
              clinicToken={item.clinicToken}
              token={item.token}
              review={item.review}
              gender={item.gender}
              location={item.placeName}
              specialization={item.specialization}
              onPress={() =>
                navigation.navigate(
                  "patient/doctorDetail/index",
                  {
                    doctor: item,
                  }
                )
              }
              show={false}
            />
          )}
          //   extraData={listKey}
        />
        <FlatList
          data={item.filteredClinic && item.filteredClinic}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ClinicInfoContiner
              imageSource={item.imageSource}
              status={item.status}
              name={item.name}
              startTime={item.startTime ? item.startTime : ""}
              endTime={item.endTime ? item.endTime : ""}
              token={item.token ? item.token : ""}
              review={item.review}
              location={item.placeName}
              discipline={item.clinic_disc ? item.clinic_disc : ""}
              days={item.days ? item.days : ""}
              onPress={() =>
                navigation.navigate("clinicDetail/index", { item })
              }
              show={false}
            />
          )}
          extraData={filteredClinics}
        />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(6),
    marginHorizontal: responsiveWidth(5),
    backgroundColor: "white",
  },
  topConatiner:{
    marginLeft:responsiveWidth(2)
  }
});
