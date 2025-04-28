import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import RegisterAs from "@/app/RegisterAs";
import { useNavigation } from "expo-router";
import TopContainer from "@/components/TopContainer";

export default function PaymentSuccessScreen() {
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={RegAsStyles.Maincontainer}>
          {/* <TopContainer onPress={backPress} /> */}
        </View>
        <View style={RegisterScreenStyles.container}>
          <Image
            style={RegisterScreenStyles.successimg}
            source={require("../../assets/images/success.png")}
          />
          <Text style={RegisterScreenStyles.successtxt}>
            Payment Successfully Done!
          </Text>
        </View>
      </ScrollView>
      <CustomButton
        style={RegisterScreenStyles.nextbtn}
        onPress={() => navigation.navigate("doctor")}
      >
        <Text style={RegAsStyles.text}>Go to Home</Text>
      </CustomButton>
    </View>
  );
}
