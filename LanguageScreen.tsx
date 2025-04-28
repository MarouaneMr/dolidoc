import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';
import { setLanguage } from '../Redux/Slices/language';
import TopContainer from '@/components/TopContainer';
import SearchInputComp from '@/components/SearchInputComp';
import RadioButtonComp from '@/components/RadioButtonComp';
import CustomButton from '@/components/CustomButton';
import { LanguageScreenSttyles } from '@/Styles/LaguagesScreenStyles';
import { RegAsStyles } from '@/Styles/RegAsStyles';
import { useTranslation } from 'react-i18next';

export default function LanguageScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentLanguage = useSelector((state:any) => state.language.lang);

  const [selectedValue, setSelectedValue] = useState(currentLanguage);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    dispatch(setLanguage(selectedValue));
    navigation.goBack(); // Go back after saving the language
  };
  const {t} = useTranslation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={LanguageScreenSttyles.Maincontainer}>
            <TopContainer title={t("language")} onPress={handleBackPress} />
            <View style={LanguageScreenSttyles.container}>
              <SearchInputComp
                placeholder={t("searchonly")}
                style={LanguageScreenSttyles.input}
              />
              <View style={LanguageScreenSttyles.radiobtn}>
                <RadioButtonComp
                  value="en"
                  label={t("english")}
                  selectedValue={selectedValue}
                  onValueChange={(value) => setSelectedValue(value)}
                  style={LanguageScreenSttyles.radiobtntxt}
                />
                <RadioButtonComp
                  value="fr"
                  label={t("french")}
                  selectedValue={selectedValue}
                  onValueChange={(value) => setSelectedValue(value)}
                  style={LanguageScreenSttyles.radiobtntxt}
                />
                <RadioButtonComp
                  value="ar"
                  label={t("arabic")}
                  selectedValue={selectedValue}
                  onValueChange={(value) => setSelectedValue(value)}
                  style={LanguageScreenSttyles.radiobtntxt}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={LanguageScreenSttyles.bottomContainer}>
          <View style={LanguageScreenSttyles.btn}>
            <CustomButton style={LanguageScreenSttyles.savebtn} onPress={handleSave}>
              <Text style={RegAsStyles.text}>{t("Save")}</Text>
            </CustomButton>
          </View>
        </View>
      </View>
    </View>
  );
}
