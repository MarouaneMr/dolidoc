import { Button, FlatList, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import TopContainer from '@/components/TopContainer';
import CustomButton from '@/components/CustomButton';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import PatientAppointConatiner from '@/components/PatientAppointConatiner';
import { PatientAppointConatinerStyles } from '@/Styles/PatientAppointConatinerStyles';
import { ThemedText } from '@/components/ThemedText';
import { MainScreenStyles } from '@/Styles/MainScreenStyles';
import { MyAppointmentsStyles } from '@/Styles/MyAppointmentsStyles';
import { LanguageScreenSttyles } from '@/Styles/LaguagesScreenStyles';
import { PatientData } from '@/Data/PatientData';

export default function MyAppointments() {
    const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();

  const { Data } = PatientData();
  const [activeTab, setActiveTab] = useState<string>("Upcoming");
  const filteredData = Data.filter((item) => {
    if (activeTab === "Upcoming") {
      return item.status === "Upcoming";
    } else if (activeTab === "Completed") {
      return item.status === "Completed";
    }else if (activeTab === "Cancelled") {
      return item.status === "Cancelled";
    }else if (activeTab === "Pending") {
      return item.status === "Pending";
    }
    return true;
  });
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
        <TopContainer title={t("my_appointment")} onPress={handleBackPress} />
        <View style={LanguageScreenSttyles.container}>
            {/* <SearchInputComp
                placeholder="Search"
                style={LanguageScreenSttyles.input}
              />
              */}
            <View style={MyAppointmentsStyles.conatiner}>
              <CustomButton
                onPress={() => setActiveTab("Upcoming")}
                style={[
                  MainScreenStyles.cont2,
                  activeTab === "Upcoming" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={activeTab === "Upcoming" ? "bluetext" : "primaryText"}
                >
                 {t("upcoming")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => setActiveTab("Completed")}
                style={[
                  MainScreenStyles.cont2,
                  activeTab === "Completed" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={activeTab === "Completed" ? "bluetext" : "primaryText"}
                >
                 {t("Completed")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => setActiveTab("Cancelled")}
                style={[
                  MainScreenStyles.cont2,
                  activeTab === "Cancelled" && MainScreenStyles.active,
                ]}
              >
                <ThemedText
                  type={activeTab === "Cancelled" ? "bluetext" : "primaryText"}
                >
                {t("cancelled")}
                </ThemedText>
              </CustomButton>
              
            </View>
            <FlatList
              data={filteredData}
              style={PatientAppointConatinerStyles.margin}
              renderItem={({ item, index }) => (
                <PatientAppointConatiner
                  imageSource={item.imageSource}
                  status={item.status}
                  name={item.name}
                  Time={item.Time}
                  Date={item.Date}
                  Age={item.Age}
                  Gender={item.Gender}
                  ProfilePress={() =>{ navigation.navigate("patientProfileView/index", {item})}}
                  // reschedulePress={open}
                />
              )}
              keyExtractor={(index) => index.toString()}
              numColumns={1}
              scrollEnabled={false}
            />
          </View>
        </View>
        <Button onPress={() => {navigation.navigate("patientside/patientProfile")} } title='Further Proceed'></Button>
      </ScrollView>
    </View>
  )
}

