import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Wall = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        height: hp("50%"),
        width: wp("100%"),
      }}
    >
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        obcaecati consequuntur dicta quam quos aperiam repellendus et, pariatur
        error nisi, alias labore optio corrupti tenetur cum, sequi deserunt sint
        quas?
      </Text>
    </View>
  );
};

export default Wall;

const styles = StyleSheet.create({});
