import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React from "react";
import TopContainer from "@/components/TopContainer";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import DoctorStyles from "@/Styles/DoctorStyles";
import DocTopContainer from "@/components/DocTopConat";
import SearchInputComp from "@/components/SearchInputComp";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import ClinicDoctorInfoContiner from "@/components/ClinicDocInfoContainer";
import { responsiveHeight } from "react-native-responsive-dimensions";
import useGetClinDocs from "@/hooks/useGetClinDocs";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import ClinicInfoContiner from "@/components/ClinicInfoContainer";
import GetDoctorInfo from "@/hooks/GetDoctorInfo";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import useAdmin from "@/hooks/useAdmin";

export default function Doctors() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const { doctors, loading, refreshingDocs, onRefreshDocs } = useAdmin();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshingDocs} onRefresh={onRefreshDocs} />
        }
      >
        <View style={DoctorStyles.Maincontainer}>
          <DocTopContainer
            title="Doctors"
            onPress={handleBackPress}
            add={t("add")}
            onPressAdd={() => navigation.navigate("addDoctor/index")}
          />
          <View style={DoctorStyles.serachView}>
            <SearchInputComp
              placeholder={t("search")}
              onPress={() => navigation.navigate("SearchScreen")}
            />
            <CustomButton
            //  onPress={() => setModalVisible(true)}
            >
              <Ionicons name="filter-outline" size={24} color="#242424" />
            </CustomButton>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#107ACA"
                style={{ height: responsiveHeight(20) }}
              />
            ) : doctors?.length === 0 ? (
              <Text style={MainScreenStyles.noData}>No doctors found.</Text>
            ) : (
              <FlatList
                data={doctors}
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
                      navigation.navigate("adminScreens/DoctorDetails", {
                        item,
                      })
                    }
                    show={false}
                  />
                )}
                extraData={doctors}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
