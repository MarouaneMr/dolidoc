import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React, { useState } from "react";
import TopContainer from "@/components/TopContainer";
import CustomButton from "@/components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { AppointmentStyles } from "@/Styles/AppointmentStyles";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import useProfileImage from "@/hooks/ProfileImage";
import { ProfileImageStyles } from "@/Styles/ProfileImageStyles";
import EditSvg from "@/Svg/EditSvg";
import { Calendar } from "react-native-calendars";
import CrossSvg from "@/Svg/CrossSvg";
import PersonalInfoHook from "@/hooks/PersonalInfoHook";
import MainModal from "@/Modal/MainModal";
import { DocterDashboardStyles } from "@/Styles/DocterDashboardStyles";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import useGoogleCalendar from "@/hooks/useGoogleCalendar";
import { useCheckUser } from "@/hooks/checkUser";
import useGetAppointments from "@/hooks/useGetAppointments";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import useUpdateUser from "@/hooks/useUpdateUser";
import useUpdateClinic from "@/hooks/useUpdateClinic";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import InputComp from "@/components/InputComp";
import { InputCompStyles } from "@/Styles/InputCompStyles";
import { Specs } from "@/Data/Specs";
import { AvailabilityScheduleStyles } from "@/Styles/AvailabilityScheduleStyles";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import Checkbox from "expo-checkbox";
interface DayObject {
  day: number;
  month: number;
  year: number;
  timestamp: number;
  dateString: string;
}
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const parseTime = (timeStr :any) => {
  // Assumes format like "9:00 AM" or "5:00 PM"
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};
export default function ClinicProfile() {
  
  const days = [
    { name: 'Mon', key: 'Mon' },
    { name: 'Tue', key: 'Tue' },
    { name: 'Wed', key: 'Wed' },
    { name: 'Thu', key: 'Thu' },
    { name: 'Fri', key: 'Fri' },
    { name: 'Sat', key: 'Sat' },
    { name: 'Sun', key: 'Sun' },
  ];
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const { onGoogleButtonPress, signOut } = useGoogleCalendar();
  const { t } = useTranslation();
  const {
    selectedDate,
    handleDateSelect,
    isCalendarVisible,
    setCalendarVisible,
    image,
    pickImage,
    formData,
    handleInputChange,
    uploadImageAndSaveFormData,
    isLoading,
    errors,
    location,
    showCustomTimePicker,
    onTimeChange,
    isTimePickerVisible,
    setFormData,
  } = useUpdateClinic();
    const [searchText, setSearchText] = useState(formData?.address || "");
  const [places, setPlaces] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(formData?.location || null);
  const handleCheckBoxChange = (value: boolean, day: string) => {
    let updatedAvailability;
    if (value) {
      updatedAvailability = [...formData.availability, day]; // Add the day to the array
    } else {
      updatedAvailability = formData.availability.filter((d :any) => d !== day); // Remove the day from the array
    }
    
    // Use handleInputChange to update the formData's availability array
    handleInputChange("availability", updatedAvailability);
  };
  
  const fetchPlaces = async (inputText :string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputText}&key=${GOOGLE_API_KEY}&types=geocode`,
        { cache: "no-cache" }
      );
      const data = await response.json();
      setPlaces(data.predictions || []);
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };
  
  const fetchPlaceDetails = async (placeId:any) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      return data.result.geometry.location; // { lat, lng }
    } catch (error) {
      console.error("Error fetching place details: ", error);
    }
  };
  const handleSearch = (text:string) => {
    setSearchText(text);
    if(text.length<1 ){
      setFormData((prevData:any) => ({
        ...prevData,
        address:null,
      }));
    }
    if (text.length > 2) fetchPlaces(text);

  };
  const handlePlaceSelect = async (place:any) => {
    setSearchText(place.description);
    const location = await fetchPlaceDetails(place.place_id);
    setSelectedLocation(location);
    setPlaces([]);
  
    // Update formData
    setFormData((prevData:any) => ({
      ...prevData,
      location: { coords: { latitude: location.lat, longitude: location.lng } },
      address: place.description,
    }));
  };
  const { SpecData, ClinicSpec } = Specs();
  const { toast } = useToast();
 
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {toast && (
          <DynamicToast
            text={toast.text}
            heading={toast.heading}
            type={toast.type}
          />
        )}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={AppointmentStyles.Maincontainer}>
            <TopContainer title={t("title")} onPress={backPress} />

            <View style={ProfileImageStyles.profilecontainer}>
              {formData?.image ? (
                <Image
                  source={{ uri: formData?.image }}
                  style={ProfileImageStyles.profileimage}
                />
              ) : (
                <Image
                  source={
                    formData?.image
                      ? { uri: formData?.image }
                      : require("../assets/images/profile.png")
                  }
                  style={ProfileImageStyles.emptyProfileImage}
                />
              )}
              <Pressable onPress={pickImage} style={ProfileImageStyles.camera}>
                <EditSvg />
              </Pressable>
            </View>
{errors.image && (
                    <Text style={RegisterScreenStyles.errorimg}>
                      {errors.image}
                    </Text>
                  )}
            <ThemedLabelText type="primary">{t("clinic_name")}</ThemedLabelText>
            <InputComp
              placeholder={t("clinic_name")}
              placeHolderColor="#C2C2C2"
              keyboardType="default"
              value={formData?.name}
              onChangeText={(text: string) =>
                handleInputChange("name", text)
              }
            />
            {errors.name && (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.name}
                                </Text>
                              )}
            <ThemedLabelText type="primary">{t("Email")}</ThemedLabelText>
            <InputComp
              placeholder={t("Email")}
              placeHolderColor="#C2C2C2"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text: string) => handleInputChange("email", text)}
            />
            {errors.email && (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.email}
                                </Text>
                              )}
            <ThemedLabelText type="primary">{t("ph_num")}</ThemedLabelText>
            <InputComp
              placeholder={t("ph_num")}
              placeHolderColor="#C2C2C2"
              keyboardType="phone-pad"
              onChangeText={(text: string) =>
                handleInputChange("phone_number", text)
              }
              value={formData.phone_number}
            />
            {errors.phone_number &&  (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.phone_number}
                                </Text>
                              )}
            <ThemedLabelText type="primary">{t("clinic_disc")}</ThemedLabelText>
            <View style={RegisterScreenStyles.dropdown}>
              <RNPickerSelect
                onValueChange={(value) =>
                  handleInputChange("discipline", value)
                }
                items={ClinicSpec}
                placeholder={{
                  label: t("clinic_disc"),
                  value: null,
                }}
                style={{
                  inputIOS: RegisterScreenStyles.inputIOS,
                  inputAndroid: RegisterScreenStyles.inputAndroid,
                  iconContainer: RegisterScreenStyles.iconContainer,
                }}
                value={formData.discipline}
              />
            </View>
            {errors.discipline && (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.discipline}
                                </Text>
                              )}
            <ThemedLabelText type="primary">
              {t("Select Location")}
            </ThemedLabelText>
                <InputComp
      value={searchText}
      onChangeText={handleSearch}
      placeholder={"Enter location"}
      style={RegisterScreenStyles.locationinput}
    />
    {places.length > 0 && searchText.length > 0 && (
      <FlatList
        data={places}
        keyExtractor={(item:any) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePlaceSelect(item)}>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />)
}
{errors.address && (
                     <Text style={RegisterScreenStyles.errorimg}>
                         {errors.address}
                        </Text>
                      )}

            {/* <ThemedLabelText type="primary">
              {t("Your Availability")}
            </ThemedLabelText> */}
            <ThemedLabelText type="primary">{t("days")}</ThemedLabelText>
            {/* <InputComp
              placeholder={t("days")}
              placeHolderColor="#C2C2C2"
              keyboardType="default"
              value={formData.availablility}
              onChangeText={(text: string) =>
                handleInputChange("availablility", text)
              }
            /> */}
             <View style={{ flexDirection: 'row',
    flexWrap: 'wrap',}}>
     {days.map((day) => (
        <View key={day.key} style={RegisterScreenStyles.dayContainer}>
          <Checkbox
            value={formData?.availability.includes(day.key)} // Check if day is in the availability array
            onValueChange={(newValue) => handleCheckBoxChange(newValue, day.key)}
            color="#107ACA"
          />
          <Text style={RegisterScreenStyles.dayText}>{day.name}</Text>

        </View>
      ))}
    </View>
                {errors.availablility && (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.availablility}
                                </Text>
                              )}
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <Pressable
                style={RegisterScreenStyles.pressableButton}
                onPress={() => showCustomTimePicker(true)}
              >
                <Text>{formData.startTime || "Start"}</Text>
              </Pressable>
              {errors.startTime && (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.startTime}
                                </Text>
                              )}

              <Text style={AvailabilityScheduleStyles.timeSeparator}>-</Text>

              <Pressable
                style={RegisterScreenStyles.pressableButton}
                onPress={() => showCustomTimePicker(false)}
              >
                <Text>{formData.endTime || "End"}</Text>
              </Pressable>
              {errors.endTime && (
                                <Text style={RegisterScreenStyles.errorimg}>
                                  {errors.endTime}
                                </Text>
                              )}
            </View>
            {isTimePickerVisible ? (
              <DateTimePicker
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                value={new Date()}
                onChange={onTimeChange}
              />
            ) : (
              <></>
            )}
          </View>
          <MainModal
            open={isCalendarVisible}
            close={() => setCalendarVisible(false)}
          >
            <View style={DocterDashboardStyles.modal}>
              <CustomButton
                onPress={() => setCalendarVisible(false)}
                style={AppointmentStyles.calBtn}
              >
                <CrossSvg />
              </CustomButton>
              <Calendar
                onDayPress={(day: DayObject) =>
                  handleDateSelect(day.dateString)
                }
                markedDates={{ [selectedDate || ""]: { selected: true } }}
              />
            </View>
          </MainModal>
          <View style={{ marginBottom: responsiveHeight(4) }}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#107ACA"
                style={{ marginBottom: responsiveHeight(3) }}
              />
            ) : (
              <CustomButton
                style={RegisterScreenStyles.nextbtn}
                // onPress={() => navigation.navigate("auth/signup/SuccessScreen")}
                onPress={() => {
                  const start = parseTime(formData.startTime);
                  const end = parseTime(formData.endTime);
                if(start> end){
                  Alert.alert("End time should be greater than start time.")
                }
                else{
                  uploadImageAndSaveFormData()

                }
                }}
              >
                <Text style={RegAsStyles.text}>{t("submit")}</Text>
              </CustomButton>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
