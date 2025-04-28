import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TopContainer from "@/components/TopContainer";
import { LanguageScreenSttyles } from "@/Styles/LaguagesScreenStyles";
import { useNavigation } from "expo-router";
import { MyAppointmentsStyles } from "@/Styles/MyAppointmentsStyles";
import ProfileSettingcontainer from "@/components/ProfileSettingcontainer";
import { UseSettingData } from "@/Data/UseSettingData";
import { UseProfileSettingData } from "@/Data/UseProfileSettingData";
import ProfileSettingNav from "@/Navigation/ProfileSettingNav";
import { HistoryStyles } from "@/Styles/HistoryStyles";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
export default function History() {
  const navigation = useNavigation<any>();
  const handleBackPress = () => {
    navigation.goBack();
  };
  const {t} = useTranslation();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={LanguageScreenSttyles.Maincontainer}>
          <TopContainer title={t('Subscription History')} onPress={handleBackPress} />
          <View style={LanguageScreenSttyles.container}>
            <View style={HistoryStyles.conatiner}>
              <View style={HistoryStyles.textconatiner}>
                <ThemedText type="bluetext">{t('Payment Methods')}</ThemedText>
                <ThemedText type="default" style={{ fontWeight: "700" }}>
                  $9.99
                </ThemedText>
              </View>
              <View style={HistoryStyles.textconatiner}>
                <ThemedText type="default" style={{ fontWeight: "700" }}>
                {t('Visa Card***2334')}
                </ThemedText>
                <ThemedText type="bluetext" style={{ color: "#939393" }}>
                {t('12 April 2025')}
                </ThemedText>
              </View>
              <View style={HistoryStyles.textconatiner}>
                <CustomButton style={HistoryStyles.upgradebtn} onPress={() => navigation.navigate("subscription/index")}>
                <ThemedText type="default" style={{ color:"#fff" }}>{t('Upgrade')}</ThemedText>
                </CustomButton>
                <ThemedText type="default" style={{ fontWeight: "700" }}>
                {t('Basic')}
                </ThemedText>
                
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
