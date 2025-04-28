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
import useAdmin from "@/hooks/useAdmin";

export default function Clinics() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const { clinics, loading, onRefreshClinics, refreshingClinics } = useAdmin();
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshingClinics}
            onRefresh={onRefreshClinics}
          />
        }
      >
        <View style={DoctorStyles.Maincontainer}>
          <DocTopContainer
            title="Clinics"
            onPress={handleBackPress}
            add={t("add")}
            onPressAdd={() => navigation.navigate("addClinic/index")}
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
            ) : clinics?.length === 0 ? (
              <Text style={MainScreenStyles.noData}>No clinics found.</Text>
            ) : (
              <FlatList
                data={clinics}
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
                    days={
                      item.days
                        ? item?.days
                            ?.split("-")
                            .map((day: string) => day.slice(0, 3))
                            .join("-")
                        : ""
                    }
                    onPress={() =>
                      navigation.navigate("adminScreens/ClinicDetails", {
                        item,
                      })
                    }
                    show={false}
                  />
                )}
                extraData={clinics}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
