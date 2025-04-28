import React from "react";
import { View, Text } from "react-native";
import RevenueStyles from "@/Styles/RevenueHistoryStyle";
import RevenuehistoryContiner from "@/components/RevenueHistoryCard";
import { ThemedText } from "../../components/ThemedText";
import { useNavigation } from "expo-router";
import TopContainer from "@/components/TopContainer";
import useRevenue from "@/hooks/useRevenue";
import DropdownComponent from "@/components/RevenueDropDown";
import LineChartComponent from "@/components/RevenueChart";

const Revenue: React.FC = () => {
  const navigation = useNavigation<any>();

  const { selectedValue, setSelectedValue, graphData, dropdownOptions } =
    useRevenue();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={RevenueStyles.Maincontainer}>
      {/* Top bar with back button and title */}
      <TopContainer title="Revenue" onPress={handleBackPress} />
      {/* Dropdown container */}
      <View style={RevenueStyles.dropdownContainer}>
        <DropdownComponent
          data={dropdownOptions}
          value={selectedValue}
          onChange={(item) => setSelectedValue(item.value)}
        />
        <LineChartComponent data={graphData} />
      </View>
      <View>
        <View style={RevenueStyles.historyContainer}>
          <View>
            <ThemedText type="primaryHeading">History</ThemedText>
          </View>
          <View>
            <Text style={RevenueStyles.statustext}>See All</Text>
          </View>
        </View>
        <RevenuehistoryContiner
          imageSource="https://fakeimg.pl/1280x720"
          name="Dr. Randy Williams"
          subscription="Subscription plan"
          plan="Per Year"
          credit="Credit Card"
          creditDate="30 June 2023"
          payment="$1200"
        />
      </View>
    </View>
  );
};

export default Revenue;