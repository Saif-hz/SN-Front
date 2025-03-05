import React from "react";
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Google Icon
import { LinearGradient } from "expo-linear-gradient"; // Gradient
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const handleGoogleLogin = () => {
  Alert.alert("Google Login", "Google authentication will be implemented.");
};

const GoogleButton = () => {
  return (
    <TouchableOpacity
      onPress={handleGoogleLogin}
      style={styles.buttonContainer}
    >
      <LinearGradient
        colors={["#B89EFF", "#EDE7F6"]} // Gradient from purple to light purple/white
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.googleButton}
      >
        <AntDesign
          name="google"
          size={24}
          color="#e71f33"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "80%",
    alignSelf: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp("5%"),
    height: hp("6.5%"),
    paddingHorizontal: wp("5%"),
    marginTop: hp("3%"),
    justifyContent: "center",
    width: "100%",
  },
  icon: {
    marginRight: wp("2%"),
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GoogleButton;
