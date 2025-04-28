import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { signInStyles } from "@/Styles/signInStyles";
import CustomButton from "@/components/CustomButton";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { useTranslation } from "react-i18next";
import UpdateProfile from "@/hooks/UpdateProfile";
import { useSelector } from "react-redux";
import { authSelector } from "@/Redux/Slices/auth";

export default function IntermediateInfoScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const { user } = useSelector(authSelector);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer
            title={t("Intermediate Info")}
            onPress={handleBackPress}
          />
          <View style={signInStyles.inputContainers}>
            <TextInput
              style={signInStyles.textArea}
              placeholder={t("Qualification")}
              placeholderTextColor="#C2C2C2"
              keyboardType="default"
              multiline={true}
              numberOfLines={6}
              value={user?.Qualification}
              // onChangeText={(text: string) =>
              //   handleChange("Qualification", text)
              // }
            />
            <TextInput
              style={signInStyles.textArea}
              placeholder={t("Where are you Practice these Days?")}
              placeholderTextColor="#C2C2C2"
              keyboardType="default"
              multiline={true}
              numberOfLines={6}
              value={user?.Practicing}
              // onChangeText={(text: string) => handleChange("Practicing", text)}
            />
            <TextInput
              style={signInStyles.textArea}
              placeholder={t("Your Goal")}
              placeholderTextColor="#C2C2C2"
              keyboardType="default"
              multiline={true}
              numberOfLines={6}
              value={user?.Goal}
              // onChangeText={(text: string) => handleChange("Goal", text)}
            />
            <TextInput
              style={[signInStyles.textArea]}
              placeholder={t("Write Your Introduction")}
              placeholderTextColor="#C2C2C2"
              keyboardType="default"
              multiline={true}
              numberOfLines={6}
              value={user?.Introduction}
              // onChangeText={(text: string) =>
              //   handleChange("Introduction", text)
              // }
            />
          </View>
        </View>
      </ScrollView>
      {/* <CustomButton
        style={RegisterScreenStyles.nextbtn}
        onPress={saveProfileData}
      >
        <Text style={RegAsStyles.text}>{t("Save")}</Text>
      </CustomButton> */}
    </View>
  );
}
