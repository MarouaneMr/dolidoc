import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { MainScreenStyles } from "@/Styles/MainScreenStyles";
import DoctorInfoContiner from "@/components/DoctorInfoContiner";
import { DoctorsData } from "@/Data/DoctorsData";
import { DoctorsSpecs } from "@/Data/DoctorsSpecs";
import LocationPinSvg from "@/Svg/LocationPinSvg";
import LangSvg from "@/Svg/LangSvg";
import SearchInputComp from "@/components/SearchInputComp";
import { Entypo, Ionicons } from "@expo/vector-icons";
import NextarrowSvg from "@/Svg/NextarrowSvg";
import ListSvg from "@/Svg/ListSvg";
import MapSvg from "@/Svg/MapSvg";
import { useTranslation } from "react-i18next";
import useLocation from "@/hooks/useLocation";
import FilterModal from "@/Modal/FilterModal";
import MapViewModal from "@/Modal/MapViewModal";
import useChangeMapLoc from "@/hooks/useChangeMapLoc";
import GetDoctorInfo from "@/hooks/GetDoctorInfo";
import { responsiveHeight } from "react-native-responsive-dimensions";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import SearchSvg from "@/Svg/SearchSvg";
import { DeltaValues } from "../../constants/MapDeltaValues";
import { useDispatch, useSelector } from "react-redux";
import { languageSelector } from "@/Redux/Slices/language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userService } from "../services/currentUserService";
import useRegisterForPushNotifications from "@/hooks/useGetToken";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import ClinicInfoContiner from "@/components/ClinicInfoContainer";
import {
  authSelector,
  setAuth,
  setRole,
  setSubscription,
} from "@/Redux/Slices/auth";
import { getAuth, signOut } from "firebase/auth";
import * as Location from "expo-location";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import { locationSelector } from "@/Redux/Slices/location";
import nearByDoctors from "@/hooks/nearByDoctors";

const GOOGLE_PLACES_API_KEY = "AIzaSyDIS9SbMQGMt01Gw9th8nKMmfKpK2kbZx4";

interface FilterState {
  status: "available" | "notAvailable" | "";
  gender: "Male" | "Female" | "";
  startTime: string;
  endTime: string;
  specialtiy: string;
  onApply: () => void;
  token: string;
}

export default function Index() {
  // useEffect(() => {
  //   navigate(email);
  // }, [email]);
  const { Data } = DoctorsData();
  const { Spec } = DoctorsSpecs();
  const navigation = useNavigation<any>();
  const [activeView, setActiveView] = useState("list");
  // const { changeCurrenLocation } = useChangeMapLoc();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalMapVisible, setModaMaplVisible] = useState(false);
  const { tokenLoading } = useRegisterForPushNotifications();
  const [filters, setFilters] = useState<any>({
    status: "",
    gender: "",
    specialtiy: "",
    startTime: "",
    endTime: "",
  }); // Initial filters state
  const [filteredData, setFilteredData] = useState(Data); // State for filtered data
  useEffect(() => {
    // Apply filters to data when filters change
    const applyFilters = () => {
      let filtered = Data;
      // Filter by Gender
      if (filters.gender) {
        filtered = filtered.filter(
          (item) => item.gender.toLowerCase() === filters.gender.toLowerCase()
        );
      }
      // Filter by Specialty
      if (filters.specialtiy) {
        filtered = filtered.filter(
          (item) =>
            item.specialization.toLowerCase() ===
            filters.specialtiy.toLowerCase()
        );
      }
      // Filter by Status
      if (filters.status) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === filters.status.toLowerCase()
        );
      }
      // Filter by Time
      if (filters.startTime) {
        filtered = filtered.filter((item) => {
          const itemStartTime = new Date(
            `1970-01-01T${item.startTime}`
          ).getTime();
          const filterStartTime = new Date(
            `1970-01-01T${filters.startTime}`
          ).getTime();
          return itemStartTime >= filterStartTime;
        });
      }

      if (filters.endTime) {
        filtered = filtered.filter((item) => {
          const itemEndTime = new Date(`1970-01-01T${item.endTime}`).getTime();
          const filterEndTime = new Date(
            `1970-01-01T${filters.endTime}`
          ).getTime();
          return itemEndTime <= filterEndTime;
        });
      }

      setFilteredData(filtered);
    };
    applyFilters();
  }, [filters, Data]);

  const handleReset = () => {
    // Reset the filter to initial state
    setFilters({
      status: "",
      gender: "",
      startTime: "",
      endTime: "",
      specialtiy: "",
    });
  };

  const handleLocation = () => {
    setModaMaplVisible(true); // Open the modal when NotificationConatiner is clicked
  };

  const handleCloseModal = () => {
    setModaMaplVisible(false); // Close the modal
  };

  const handleFilterApply = (filter: FilterState) => {
    setFilters(filter);
    setModalVisible(false); // Close the filter modal after applying
  };

  const { t } = useTranslation();

  const {
    doctors,
    loading,
    latitudes,
    longitudes,
    selectedDoctor,
    markerCounts,
    handleMarkerPress,
    refreshing,
    onRefresh,
    clinics,
    filteredDoctors,
    // filterDoctors,
    filterState,
    // akOrState,
    listKey,
    // searchDoctors,
    nearbyDoctors,
    setSelectedDoctor
  } = GetDoctorInfo();

  const { token } = useRegisterForPushNotifications();
  const [akOrState, setAkOrState] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("doctors");

  const dispatch = useDispatch();
  const auth = getAuth();
  // console.log("Doctors: ",doctors);
useEffect(()=>{
  setSelectedDoctor(null);
},[activeView,activeTab]);
  useLayoutEffect(() => {
    const getUserFromFirebaseAuth = async () => {
      const user = auth.currentUser;
      // await signOut(auth);

      if (user) {
        const profilesRef = collection(db, "profiles");
        const q = query(profilesRef, where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data(); 
          dispatch(
            setAuth({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                providerData: user.providerData,
                ...profileData,
              },
              profile_completed: profileData.profile_completed,
            })
          );
          dispatch(setRole(profileData.role));
        } else {
          dispatch(
            setAuth({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                providerData: user.providerData,
              },
              profile_completed: false,
            })
          );
        }
      } else {
        dispatch(
          setAuth({
            user: null,
            profile_completed: false,
            isInitialized: true,
          })
        );
      }
    };
    getUserFromFirebaseAuth();
  }, []);

  const { user, isInitialized, role, subscription } = useSelector(authSelector);
  useLayoutEffect(() => {
    if (isInitialized && user?.role == "doctor") {
      navigation.navigate("doctor");
    } else if (isInitialized && user?.role == "admin") {
      navigation.navigate("admin");
    } else if (isInitialized && user?.role == "clinic") {
      navigation.navigate("clinics");
    }
  }, [user]);

  //*****store location in redux*****//
  useLocation();
  const location = useSelector(locationSelector);
  if (!isInitialized && auth.currentUser) {
    return (
      <>
        <Progress loading={true} />
      </>
    );
  } else if (role == "patient") {
    return (
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {toast && (
            <DynamicToast
              text={toast.text}
              heading={toast.heading}
              bgColor={toast.type === "success" ? "white" : "red"}
            />
          )}
          <View style={MainScreenStyles.container}>
            <View style={MainScreenStyles.welcomecontainer}>
              <ThemedText type="ThinTextGray"> {t("welcome")}</ThemedText>
              <View style={MainScreenStyles.welcomebtncont}>
                <CustomButton
                  style={MainScreenStyles.welcomebtn}
                  onPress={handleLocation}
                >
                  <LocationPinSvg />
                </CustomButton>
                <CustomButton
                  style={MainScreenStyles.welcomebtn}
                  onPress={() => navigation.navigate("LanguageScreen")}
                >
                  <LangSvg />
                </CustomButton>
              </View>
            </View>
            <MapViewModal
              visible={isModalMapVisible}
              onClose={handleCloseModal} // Pass the close function to the modal
            />
            <ThemedText type="primaryHeading"> DoliDoc</ThemedText>
            <CustomButton style={MainScreenStyles.locationbtn}>
              <Entypo name="location-pin" size={18} color="#FFFFFF" />
              <Text style={MainScreenStyles.locationbtntxt}>
                {location?.location?.location || "relocate"}
              </Text>
            </CustomButton>
            <View style={MainScreenStyles.serachView}>
              <SearchInputComp
                placeholder={t("Search")}
                onPress={() => navigation.navigate("SearchScreen", { doctors })}
                // onChangeText={(text:string)=>searchDoctors(text)}
              />
              <CustomButton onPress={() => setModalVisible(true)}>
                <Ionicons name="filter-outline" size={24} color="#242424" />
              </CustomButton>
            </View>
            <ImageBackground
              source={require("../../assets/images/bg.png")}
              style={MainScreenStyles.registercontainer}
            >
              <FilterModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onApply={handleFilterApply}
                filters={filters}
                setFilters={setFilters}
                handleReset={handleReset}
              />
              <View style={MainScreenStyles.joinusConainer}>
                <Text style={MainScreenStyles.registertxtheading}>
                  {t("join_us")}
                </Text>
                <Text style={MainScreenStyles.registertxt}>
                  {t("join_us_description")}
                </Text>
              </View>
              <CustomButton
                style={MainScreenStyles.registerbtn}
                onPress={() => {
                  dispatch(setRole("doctor"));
                  navigation.navigate("auth/signup/index", {
                    info: "As Doctor",
                  });
                }}
              >
                <Text style={MainScreenStyles.registerbtntxt}>
                  {t("register_doctor")}
                </Text>
              </CustomButton>
            </ImageBackground>
            <View style={MainScreenStyles.specContainer}>
              <ThemedText type="SecLightHeading">
                {t("doctor_specialty")}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.navigate("DoctorSpeciality")}
              >
                <ThemedText type="link"> {t("see_all")}</ThemedText>
              </TouchableOpacity>
            </View>
            <FlatList
              data={Spec}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("DoctorInfoFilter", { item: item.spec })
                  }
                >
                  <View style={MainScreenStyles.spContainer}>
                    <item.svg />
                    <View>
                      <Text style={MainScreenStyles.specHeading}>
                        {t(`${item.spec}`)}
                      </Text>
                      <View style={MainScreenStyles.flex}>
                        <Text style={MainScreenStyles.spectxt}>
                          {item.total} {t("Doctor")}
                        </Text>
                        <NextarrowSvg />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            <View style={DocterDashboardStyles.container}>
              <CustomButton
                style={[
                  DocterDashboardStyles.button,
                  activeTab === "doctors" && DocterDashboardStyles.activeButton,
                ]}
                onPress={() => {
                  setAkOrState(true);
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
            <View style={MainScreenStyles.specContainer}>
              <ThemedText type="SecLightHeading">
                {t("doctors_near_you")}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.navigate("DoctorInfoFilter")}
              >
                <ThemedText type="link"> {t("see_all")}</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={MainScreenStyles.cont}>
              <CustomButton
                onPress={() => setActiveView("list")}
                style={[
                  MainScreenStyles.cont2,
                  activeView === "list" && MainScreenStyles.active,
                ]}
              >
                <ListSvg
                  color={activeView === "list" ? "#107ACA" : "#383838"}
                />
                <ThemedText
                  type={activeView === "list" ? "bluetext" : "primaryText"}
                >
                  {t("list")}
                </ThemedText>
              </CustomButton>
              <CustomButton
                onPress={() => setActiveView("map")}
                style={[
                  MainScreenStyles.cont2,
                  activeView === "map" && MainScreenStyles.active,
                ]}
              >
                <MapSvg color={activeView === "map" ? "#107ACA" : "#383838"} />
                <ThemedText
                  type={activeView === "map" ? "bluetext" : "primaryText"}
                >
                  {t("map")}
                </ThemedText>
              </CustomButton>
            </View>
            {(tokenLoading || !location?.location?.location) && (
              // <ActivityIndicator
              //   size="small"
              //   color="#107ACA"
              //   style={{ height: responsiveHeight(20) }}
              // />
              <Progress loading={tokenLoading ||!location?.location?.location}/>
            )}

            {activeTab === "doctors" && (
              <View>
                {activeView === "list" ? (
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
                     
                    ) :!nearbyDoctors || nearbyDoctors?.length < 1 ? (
                      <Text style={MainScreenStyles.noData}>
                        No doctors found near you.
                      </Text>
                    ) : (
                      <FlatList
                        data={nearbyDoctors}
                        keyExtractor={(item, index) => {
                          return item.user_id
                            ? item.user_id.toString()
                            : index.toString();
                        }}
                        renderItem={({ item }) => (
                          <DoctorInfoContiner
                            imageSource={item.imageSource}
                            status={item.status}
                            name={item.name}
                            startTime={item?.startTime}
                            endTime={item?.endTime}
                            experience={item.experience}
                            qualifications={item.qualifications}
                            clinicToken={item.clinicToken}
                            token={item.token}
                            review={item.review}
                            gender={item.gender}
                            location={item.address}
                            specialization={item.specialization}
                            onPress={() => {
                              const { Location, ...doctorWithoutLocation } =
                                item;
                              navigation.navigate(
                                "patient/doctorDetail/index",
                                {
                                  doctor: doctorWithoutLocation,
                                }
                              );
                            }}
                            show={false}
                          />
                        )}
                        extraData={listKey}
                      />
                    )}
                  </View>
                ) : (
                  <View>
                    {nearbyDoctors?.length === 0 ? (
                      <Text style={MainScreenStyles.noData}>
                        No doctors found near you.
                      </Text>
                    ) : (
                      <>
                        <MapView
                          style={{
                            width: "100%",
                            height: responsiveHeight(50),
                          }}
                          initialRegion={{
                            latitude: Number(
                              location.location.coordinate.latitude
                            ),
                            longitude: Number(
                              location.location.coordinate.longitude
                            ),
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                          }}
                          provider={PROVIDER_GOOGLE}
                        >
                          {doctors.map((doctor: any, index) =>
                            doctor.Location?.coords?.latitude !== undefined &&
                            doctor.Location?.coords?.longitude !== undefined ? (
                              <Marker
                                key={index}
                                coordinate={{
                                  latitude: doctor.Location?.coords?.latitude,
                                  longitude: doctor.Location?.coords?.longitude,
                                }}
                                title={doctor.name}
                                description={doctor.vicinity}
                                onPress={() => handleMarkerPress(doctor)}
                              >
                                <View style={MainScreenStyles.markerContainer}>
                                  <Image
                                    source={{ uri: doctor.imageSource }}
                                    style={MainScreenStyles.markerImage}
                                  />
                                </View>
                              </Marker>
                            ) : null
                          )}
                        </MapView>
                        <View style={MainScreenStyles.searchBar}>
                          <View style={MainScreenStyles.seacrIcon}>
                            <SearchSvg />
                          </View>
                          <TextInput
                            placeholder="search"
                            // style={[MainScreenStyles.searchBar]}
                          />
                        </View>
                        {selectedDoctor && (
                          <View style={MainScreenStyles.bottomCard}>
                            <Image
                              source={{ uri: selectedDoctor.imageSource }}
                              style={MainScreenStyles.bottomCardImage}
                            />
                            <View
                              style={MainScreenStyles.bottomCardTextContainer}
                            >
                              <ThemedText type="primaryHeading">
                                {selectedDoctor.name}
                              </ThemedText>
                              <ThemedText type="secText">
                                {selectedDoctor.specialization}
                              </ThemedText>
                            </View>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
            {activeTab === "clinics" && (
              <View>
                {activeView === "list" ? (
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
                      <Text style={MainScreenStyles.noData}>
                        No clinics found near you.
                      </Text>
                    ) : (
                      <FlatList
                        data={clinics}
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
                            address={item.address}
                            discipline={item.discipline ? item.discipline : ""}
                            availability={item.availability}
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
                    )}
                  </View>
                ) : (
                  <View>
                    {loading ? (
                      <ActivityIndicator
                        size="small"
                        color="#107ACA"
                        style={{ height: responsiveHeight(20) }}
                      />
                    ) : doctors?.length === 0 ? (
                      <Text style={MainScreenStyles.noData}>
                        No doctors found near you.
                      </Text>
                    ) : (
                      <>
                        <MapView
                          style={{
                            width: "100%",
                            height: responsiveHeight(50),
                          }}
                          initialRegion={{
                            latitude: Number(
                              location.location.coordinate.latitude
                            ),
                            longitude: Number(
                              location.location.coordinate.longitude
                            ),
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                          }}
                          provider={PROVIDER_GOOGLE}
                        >
                            {clinics.map((clinic: any, index) =>
                            clinic.location?.coords?.latitude !== undefined &&
                            clinic.location?.coords?.longitude !== undefined ? (
                              <Marker
                                key={index}
                                coordinate={{
                                  latitude: clinic.location?.coords?.latitude,
                                  longitude: clinic.location?.coords?.longitude,
                                }}
                                title={clinic.name}
                                description={clinic.vicinity}
                                onPress={() => handleMarkerPress(clinic)}
                              >
                                <View style={MainScreenStyles.markerContainer}>
                                  <Image
                                    source={{ uri: clinic.image }}
                                    style={MainScreenStyles.markerImage}
                                  />
                                </View>
                              </Marker>
                            ) : null
                          )}
                        
                        </MapView>

                        <View style={MainScreenStyles.searchBar}>
                          <View style={MainScreenStyles.seacrIcon}>
                            <SearchSvg />
                          </View>
                          <TextInput
                            placeholder="search"
                            // style={[MainScreenStyles.searchBar]}
                          />
                        </View>
                        {selectedDoctor && (
                          <View style={MainScreenStyles.bottomCard}>
                            <Image
                              source={{ uri: selectedDoctor.image }}
                              style={MainScreenStyles.bottomCardImage}
                            />
                            <View
                              style={MainScreenStyles.bottomCardTextContainer}
                            >
                              <ThemedText type="primaryHeading">
                                {selectedDoctor.name}
                              </ThemedText>
                              <ThemedText type="secText">
                                {selectedDoctor.discipline}
                              </ThemedText>
                            </View>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
