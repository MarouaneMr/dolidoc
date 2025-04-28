import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RegAsStyles } from "@/Styles/RegAsStyles"; // Replace with your styles
import TopContainer from "@/components/TopContainer";
import { ThemedLabelText } from "@/components/ThemedLabelText";
import InputComp from "@/components/InputComp";
import { SubscriptionStyles } from "@/Styles/SubscriptionStyles";
import CustomButton from "@/components/CustomButton";
import { RegisterScreenStyles } from "@/Styles/RegisterScreenStyles";

export default function BankTransferScreen() {
  const [transactionId, setTransactionId] = useState("");
  const navigation = useNavigation<any>();
  const backPress = () => {
    navigation.goBack();
  };
  const route = useRoute<any>();

  const { amount, currency, referenceNumber } = route.params;

  const confirmTransfer = async () => {
    if (!transactionId) {
      Alert.alert("Error", "Please provide the transaction ID.");
      return;
    }

    try {
      const response = await fetch(
        "YOUR_BACKEND_API/createBankTransferPayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId,
            amount,
            currency,
            referenceNumber,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Your payment is being processed.");
        navigation.navigate("subscription/PaymentSuccessScreen");
      } else {
        Alert.alert("Error", data.message || "Payment processing failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while processing your payment.");
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={RegAsStyles.Maincontainer}>
            <TopContainer title="Payment Method" onPress={backPress} />
            <View style={SubscriptionStyles.container}>
              <Text>
                Amount: {currency} {amount / 100}
              </Text>
              <Text>Reference Number: {referenceNumber}</Text>
              <ThemedLabelText type="primary"> Transaction Id</ThemedLabelText>
              <InputComp
                placeholder="ID"
                placeHolderColor="#C2C2C2"
                keyboardType="email-address"
                value={transactionId}
                onChangeText={setTransactionId}
              />
              {/* <ThemedLabelText type="primary"> Card Numbers</ThemedLabelText>
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
            </View> */}
            </View>
          </View>
        </ScrollView>
        <CustomButton
          style={RegisterScreenStyles.nextbtn}
          onPress={confirmTransfer}
        >
          <Text style={RegAsStyles.text}>Pay</Text>
        </CustomButton>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}></ScrollView>
      </View>
    </View>
  );
}
