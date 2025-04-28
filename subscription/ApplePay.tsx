import { View, Text, ScrollView } from "react-native";
import React from "react";
import TopContainer from "@/components/TopContainer";
import { RegAsStyles } from "@/Styles/RegAsStyles";
import { SubscriptionStyles } from "@/Styles/SubscriptionStyles";
import { useNavigation } from "expo-router";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import InputComp from "@/components/InputComp";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";
import CustomButton from "@/components/CustomButton";

export default function ApplePay() {
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1,backgroundColor:"white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={RegAsStyles.Maincontainer}>
            <TopContainer title="Payment Method" onPress={backPress} />
            <View style={SubscriptionStyles.container}>
              <ThemedLabelText type="primary"> Email</ThemedLabelText>
              <InputComp
                placeholder="Email"
                placeHolderColor="#C2C2C2"
                keyboardType="email-address"
              />
              <ThemedLabelText type="primary"> Card Numbers</ThemedLabelText>
              <InputComp
                placeholder="0000 0000 0000 0000"
                placeHolderColor="#C2C2C2"
                keyboardType="number-pad"
              />
              <View style={SubscriptionStyles.inputConatiner}>
                <View>
                <ThemedLabelText type="primary"> Expiry Date</ThemedLabelText>
              <InputComp
                placeholder="MM/YY"
                placeHolderColor="#C2C2C2"
                keyboardType="phone-pad"
                style={SubscriptionStyles.input}
              />
                </View>
                <View>
                <ThemedLabelText type="primary">CVC</ThemedLabelText>
              <InputComp
                placeholder="123"
                placeHolderColor="#C2C2C2"
                keyboardType="number-pad"
                style={SubscriptionStyles.input}
              />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <CustomButton style={RegisterScreenStyles.nextbtn}>
          <Text style={RegAsStyles.text}>Pay</Text>
        </CustomButton>
      </View>
    </View>
  );
}
