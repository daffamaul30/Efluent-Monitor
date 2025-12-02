import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const LineChartCustom = ({
  data,
  label,
  color,
  noOfSections,
  maxValue,
}: {
  data: { value: number; label: string }[];
  label: string;
  color: string;
  noOfSections?: number;
  maxValue?: number;
}) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        paddingHorizontal: 10,
        marginTop: 20,
        marginBottom: label === "Gas Amonia (NH3)" ? 30 : 0,
      }}
    >
      <Text style={{ textAlign: "center", marginBottom: 5, color: "#808080" }}>
        {label}
      </Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LineChart
          data={data}
          // isAnimated
          spacing={5}
          maxValue={maxValue}
          width={screenWidth - 100}
          noOfSections={noOfSections || 4}
          color={color}
          height={150}
          yAxisTextStyle={{ fontSize: 12 }}
          xAxisLabelTextStyle={{ fontSize: 12, width: 50 }}
          yAxisColor="lightgray"
          xAxisColor="lightgray"
          hideDataPoints
          adjustToWidth
          scrollToEnd
        />
      </View>
    </View>
  );
};

export default LineChartCustom;
