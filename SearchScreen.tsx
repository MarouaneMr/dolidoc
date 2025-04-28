import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import TopContainer from "@/components/TopContainer";
import { useNavigation } from "expo-router";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import SearchInputComp from "@/components/SearchInputComp";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { SearchScreenStyles } from "@/Styles/SearchScreenStyles";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import CustomButton from "@/components/CustomButton";
import CrossSvg from "@/Svg/CrossSvg";
import ClockSvg from "@/Svg/ClockSvg";
import GetDoctorInfo from "@/hooks/GetDoctorInfo";
import { useRoute } from "@react-navigation/native";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { useTranslation } from "react-i18next";
import ClinicInfoContiner from "@/components/ClinicInfoContainer";

interface Doctor {
  imageSource: any;
  status: string;
  name: string;
  email: string;
  startTime: string;
  endTime: string;
  experience: string;
  qualifications: string;
  review: string;
  gender: string;
  specialization: any;
  Introduction?: any;
  Liscence_ID?: any;
  Location?: { latitude: number; longitude: number };
  placeName?: any;
  availabilitySchedule?: any;
  availability?: string;
  uid?: any;
  languages?: string;
  token?: string;
  clinicId: string;
  clinicToken: string;
}
export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const { clinics } = GetDoctorInfo();
  const route = useRoute();
  const doctor : any = route.params;
  // console.log("params: ", doctor);
  console.log("clinics: ", clinics);

    const { t } = useTranslation();
  const [activeTab,setActiveTab] = useState("doctors");
  const [filteredDocs, setFilteredDocs] = useState<Doctor[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<any>([]);

  const searchClinics = (query:string) => {
    setFilteredDocs([]);
    if (!query) {
      return;
    }
  
    const lowerCaseQuery = query.toLowerCase();
  
    const filtered = clinics.filter((clinic :any) =>
      clinic.name.toLowerCase().includes(lowerCaseQuery)
    );
  
    setFilteredClinics(filtered);
  };
  console.log("searchjed:", filteredDocs);
  const handleBackPress = () => {
    navigation.goBack();
  };
  const searchDoctors = (query: string) => {
    setFilteredClinics([]);
    const lowerCaseQuery = query.toLowerCase();
    const results = doctor?.doctors.filter((doctor : any) => {
      console.log(
        "result: ",
        doctor.name.toLowerCase().includes(lowerCaseQuery)
      );
      return (
        doctor.name.toLowerCase().includes(lowerCaseQuery) ||
        doctor.specialization.some((spec: string) =>
         spec?  spec.toLowerCase().includes(lowerCaseQuery) : null
        )
      );
    });
    setFilteredDocs(results);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={RegAsStyles.Maincontainer}>
            <TopContainer title="Search" onPress={handleBackPress} />
            <View style={RegAsStyles.container}>
              <View style={MainScreenStyles.serachView}>
                <SearchInputComp
                  placeholder="Search"
                  onChangeText={(text: string) =>activeTab == "doctors" ? searchDoctors(text):searchClinics(text)}
                />
                <Ionicons name="filter-outline" size={24} color="#242424" />
              </View>
            </View>
            {/* <View style={SearchScreenStyles.container}>
              <ThemedText type="SecLightHeading">Recent Search</ThemedText>
              <ThemedText type="bluetext">Clear All History</ThemedText>
            </View>
            <View style={SearchScreenStyles.searchtextconatiner}>
              <View style={SearchScreenStyles.textconatiner}>
                <ClockSvg />
                <Text style={SearchScreenStyles.text}>
                  General Medical Check{" "}
                </Text>
              </View>
              <CustomButton>
                <CrossSvg />
              </CustomButton>
            </View>
            <View style={SearchScreenStyles.searchtextconatiner}>
              <View style={SearchScreenStyles.textconatiner}>
                <ClockSvg />
                <Text style={SearchScreenStyles.text}>
                  General Medical Check{" "}
                </Text>
              </View>
              <CustomButton>
                <CrossSvg />
              </CustomButton>
            </View> */}


             <View style={DocterDashboardStyles.container}>
                          <CustomButton
                            style={[
                              DocterDashboardStyles.button,
                              activeTab === "doctors" && DocterDashboardStyles.activeButton,
                            ]}
                            onPress={() => {
                              setFilteredClinics([]);
                              setActiveTab("doctors");
                            }}
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
                            onPress={() => {
                              setFilteredDocs([]);
                              setActiveTab("clinics");}}
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
            {filteredDocs && filteredDocs.length > 0 && (
              <FlatList
                data={filteredDocs}
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
                      navigation.navigate("patient/doctorDetail/index", {
                      doctor:item,
                      })
                    }
                    show={false}
                  />
                )}
                extraData={filteredDocs}
              />
            )}
            {
              filteredClinics?.length > 0 && (
                                      <FlatList
                                        data={filteredClinics}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                          
                                          <ClinicInfoContiner
                                            imageSource={item.image}
                                            status={item.status}
                                            name={item.name}
                                            startTime={item.startTime ? item.startTime : ""}
                                            endTime={item.endTime ? item.endTime : ""}
                                            token={item.token ? item.token : ""}
                                            review={item.review}
                                            location={item.placeName}
                                            discipline={item.discipline ? item.discipline : ""}
                                            availablility={item.availablility}
                                            onPress={() =>
                                              navigation.navigate("clinicDetail/index", {
                                                item,
                                              })
                                            }
                                            show={false}
                                          />
                                        )}
                                        extraData={clinics}
                                      />
              )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
