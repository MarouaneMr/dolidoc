import { View, Text, ScrollView, Image, Pressable, TextInput, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

import { signInStyles } from "@/Styles/signInStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import BackSvg from "@/Svg/BackSvg";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useRoute } from "@react-navigation/native";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import InputComp from "@/components/InputComp";
import { Specs } from "@/Data/Specs";
import { ProfileImageStyles } from "@/Styles/ProfileImageStyles";
import EditSvg from "@/Svg/EditSvg";
import MultiSelect from "react-native-multiple-select";
import RNPickerSelect from "react-native-picker-select";
import CheckboxComp from "@/components/CheckboxComp";
import { ActivityIndicator } from "react-native-paper";
import DynamicToast from "@/components/DynamicToast";
import { useToast } from "@/Context/ToastProvider";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";
import PassComp from "@/components/PassComp";
import useDoctorProfile from "@/hooks/useDoctorProfile";
import Progress from "@/utils/Functions/Progress Indicator/Progress";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export default function DoctorProfile() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { SpecData } = Specs();

  const {
    selectedItems,
    onSelectedItemsChange,
    languageItems,
    image,
    pickImage,
    backPress,
    currentStep,
    selectedCheckbox,
    isSyncing,
    account,
    promptAsync,
    handleCheckboxChange,
    location,
    formData,
    selectedSpecs,
    handleFormSubmit,
    handleSpecsChange,
    handleChangeGender,
    handleInfoSubmit,
    handleChange,
    isLoading,
    formErrors,
    setFormData,
  } = useDoctorProfile();
  const [searchText, setSearchText] = useState(formData?.address || "");
const [places, setPlaces] = useState([]);
const [selectedLocation, setSelectedLocation] = useState(formData?.location || null);

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
  if (text.length > 2) fetchPlaces(text);
};
const handlePlaceSelect = async (place:any) => {
  setSearchText(place.description);
  const location = await fetchPlaceDetails(place.place_id);
  setSelectedLocation(location);

  // Update formData
  setFormData((prevData:any) => ({
    ...prevData,
    location: { coords: { latitude: location.lat, longitude: location.lng } },
    address: place.description,
  }));
  setPlaces([]);
};
const { user, profile_completed, role } = useSelector(authSelector);
  const { toast } = useToast();
useEffect(()=>{
setSearchText(formData.address);

},[formData.address]);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {toast && (
        <DynamicToast
          text={toast.text}
          heading={toast.heading}
          // bgColor={toast.type === "success" ? "white" : "red"}
        />
      )}
      <Progress loading={isLoading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={signInStyles.Maincontainer}>
          <CustomButton
            style={RegisterScreenStyles.backbtn}
            onPress={backPress}
          >
            <BackSvg />
          </CustomButton>
          <ThemedText type="authHeading">
            {profile_completed || user?.profile_completed ? t("Profile") : t("Complete Profile and Add Availability Schedule to Join DoliDoc")}
          </ThemedText>
          {!profile_completed && (
            <Text style={signInStyles.grayText}>
              {t("complete_profile_now")}
            </Text>
          )}

          {currentStep === 1 && (
            <>
              <View style={signInStyles.inputContainers}>
                <View style={ProfileImageStyles.Container}>
                  <View style={ProfileImageStyles.profilecontainer}>
                    {formData?.image ? (
                      <Image
                        source={{ uri: formData?.image }}
                        style={ProfileImageStyles.profileimage}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/images/profile.png")}
                        style={ProfileImageStyles.emptyProfileImage}
                      />
                    )}
                    <Pressable
                      onPress={pickImage}
                      style={ProfileImageStyles.camera}
                    >
                      <EditSvg />
                    </Pressable>
                  </View>

                  {formErrors.image && (
                    <Text style={RegisterScreenStyles.errorimg}>
                      {formErrors.image}
                    </Text>
                  )}
                </View>
                <ThemedLabelText type="primary">
                  {t("Experience")}
                </ThemedLabelText>
                <InputComp
                  placeholder={t("Experience")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="default"
                  onChangeText={(text: string) =>
                    handleChange("experience", text)
                  }
                  value={formData.experience}
                />
                {formErrors.experience && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.experience}
                  </Text>
                )}

                <ThemedLabelText type="primary" style={{marginBottom:responsiveHeight(1)}}>{t("Gender")}</ThemedLabelText>
                <View style={RegisterScreenStyles.dropdown}>
                  <RNPickerSelect
                    onValueChange={(value) => handleChangeGender(value)}
                    items={[
                      { label: t("Female"), value: "Female" },
                      { label: t("Male"), value: "Male" },
                    ]}
                    placeholder={{ label: t("Gender"), value: null }}
                    style={{
                      inputIOS: RegisterScreenStyles.inputIOS,
                      inputAndroid: RegisterScreenStyles.inputAndroid,
                      iconContainer: RegisterScreenStyles.iconContainer,
                    }}
                    value={formData.gender}
                  />
                </View>
                {formErrors.gender && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.gender}
                  </Text>
                )}
                {/* {formErrors.gender && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.gender}
                  </Text>
                )} */}

                <ThemedLabelText type="primary">
                  {t("Select Location")}
                </ThemedLabelText>
                {/* <TextInput
                  placeholder={formData.address}
                  // placeHolderColor="#C2C2C2"
                  // keyboardType="default"
                  style={RegisterScreenStyles.locationinput}
                  value={formData.address}
                  editable={false}
                  // onChangeText={(text: string) =>
                  //   handleChange("location", text)
                  // }
                /> */}
         <InputComp
      value={searchText}
      onChangeText={handleSearch}
      placeholder={"Enter your location"}
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

                {formErrors.location && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.location}
                  </Text>
                )}

                <ThemedLabelText type="primary" style={{marginTop:responsiveHeight(2),marginBottom:responsiveHeight(1)}}>
                  {t("Spoken Languages")}
                </ThemedLabelText>
                <View>
                  <MultiSelect
    styleDropdownMenu={[RegisterScreenStyles.dropdown,{borderBottomWidth:0}]}
                    items={languageItems}
                    uniqueKey="id"
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={formData.language}
                    selectText={t("Spoken Languages")}
                    searchInputPlaceholderText={t("Search Languages")}
                    tagRemoveIconColor="#107ACA"
                    tagBorderColor="#107ACA"
                    tagTextColor="black"
                    selectedItemTextColor="#107ACA"
                    selectedItemIconColor="#107ACA"
                    itemTextColor="#000"
                    displayKey="name"
                    // searchInputStyle={{ color: "#CCC" }}
                    submitButtonColor="#107ACA"
                    submitButtonText={t("Submit")}
                    styleListContainer={{ maxHeight: responsiveHeight(30) }} 
                    // single={true}
                  />
                </View>
                {formErrors.language && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.language}
                  </Text>
                )}
                <ThemedLabelText type="primary" style={{marginBottom:responsiveHeight(1)}}>
                  {t("Doctor Specialization")}
                </ThemedLabelText>
                <View style={RegisterScreenStyles.dropdown}>
                  <RNPickerSelect
                    onValueChange={(value) => handleSpecsChange(value)}
                    items={SpecData}
                    placeholder={{
                      label: t("Doctor Specialization"),
                      value: null,
                    }}
                    style={{
                      inputIOS: RegisterScreenStyles.inputIOS,
                      inputAndroid: RegisterScreenStyles.inputAndroid,
                      iconContainer: RegisterScreenStyles.iconContainer,
                    }}
                    value={formData.specialization}
                  />
                </View>
                {formErrors.specialization && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.specialization}
                  </Text>
                )}
                <ThemedLabelText type="primary">
                  {t("Your Availability")}
                </ThemedLabelText>
                <View style={RegisterScreenStyles.checkboxContainer}>
                  <CheckboxComp
                    title={t("Full-Time")}
                    isChecked={formData.availability === t("Full-Time")}
                    onValueChange={() => handleCheckboxChange(t("Full-Time"))}
                  />
                  <CheckboxComp
                    title={t("Part-Time")}
                    isChecked={formData.availability === t("Part-Time")}
                    onValueChange={() => handleCheckboxChange(t("Part-Time"))}
                  />
                </View>
                {formErrors.availability && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.availability}
                  </Text>
                )}
                <CustomButton
                  style={RegisterScreenStyles.syncbtn}
                  onPress={() => promptAsync()}
                >
                  <Text style={RegisterScreenStyles.text}>
                    {isSyncing
                      ? "Syncing..."
                      : account
                      ? `Synced with ${account}`
                      : t("+Sync Your Google Calendar")}
                  </Text>
                </CustomButton>
              </View>
            </>
          )}
          {currentStep === 2 && (
            <>
              <View style={signInStyles.inputContainers}>
                <ThemedLabelText type="primary">
                  {t("License ID")}
                </ThemedLabelText>
                <InputComp
                  placeholder={t("Please write your License ID")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="number-pad"
                  value={formData.Liscence_ID}
                  onChangeText={(text: any) =>
                    handleChange("Liscence_ID", text)
                  }
                />
                {formErrors.Liscence_ID && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.Liscence_ID}
                  </Text>
                )}
                <ThemedLabelText type="primary">
                  {t("Qualification")}
                </ThemedLabelText>
                <InputComp
                  placeholder={t("What is your qualification?")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="default"
                  value={formData.Qualification}
                  onChangeText={(text: any) =>
                    handleChange("Qualification", text)
                  }
                />
                {formErrors.Qualification && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.Qualification}
                  </Text>
                )}

                <ThemedLabelText type="primary">
                  {t("Introduction")}
                </ThemedLabelText>
                <InputComp
                  placeholder={t("Please write your introduction")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="default"
                  value={formData.Introduction}
                  onChangeText={(text: any) =>
                    handleChange("Introduction", text)
                  }
                />
                {formErrors.Introduction && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.Introduction}
                  </Text>
                )}
                 <ThemedLabelText type="primary">
                  {t("Fee")}
                </ThemedLabelText>
                 <InputComp
                  placeholder={t("Enter your Fee")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="default"
                  value={formData.fee}
                  onChangeText={(text: any) =>
                    handleChange("fee", text)
                  }
                />
                {formErrors.fee && (
                  <Text style={RegisterScreenStyles.errorText}>
                    {formErrors.Introduction}
                  </Text>
                )}
                <ThemedLabelText type="primary">
                  {t("Where are you practicing?")}
                </ThemedLabelText>
                <InputComp
                  placeholder={t("Practicing")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="default"
                  value={formData.Practicing}
                  onChangeText={(text: any) => handleChange("Practicing", text)}
                />
                <ThemedLabelText type="primary">
                  {t("What is goal")}
                </ThemedLabelText>
                <InputComp
                  placeholder={t("Goal")}
                  placeHolderColor="#C2C2C2"
                  keyboardType="default"
                  value={formData.Goal}
                  onChangeText={(text: any) => handleChange("Goal", text)}
                />
              </View>
            </>
          )}
        </View>

        <View style={{ marginBottom: responsiveHeight(4) }}>
          {currentStep === 1 && (
            <>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#107ACA"
                  style={{ marginBottom: responsiveHeight(3) }}
                />
              ) : (
                <CustomButton
                  style={RegisterScreenStyles.nextbtn}
                  // onPress={handleNextStep}
                  onPress={() => {
                    handleFormSubmit();
                  }}
                >
                  <Text style={RegAsStyles.text}>{t("next")}</Text>
                </CustomButton>
              )}
            </>
          )}
          {currentStep === 2 && (
            <>
              <CustomButton
                style={RegisterScreenStyles.nextbtn}
                // onPress={() => navigation.navigate("auth/signup/SuccessScreen")}
                onPress={() => handleInfoSubmit()}
              >
                <Text style={RegAsStyles.text}>{t("submit")}</Text>
              </CustomButton>
            </>
          )}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View
              style={[
                RegisterScreenStyles.stepDot,
                currentStep === 1 && RegisterScreenStyles.activeDot,
              ]}
            />
            <View
              style={[
                RegisterScreenStyles.stepDot,
                currentStep === 2 && RegisterScreenStyles.activeDot,
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
