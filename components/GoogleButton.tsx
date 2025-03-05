import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const GoogleButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.googleButton} onPress={onPress}>
      <Image
        source={require("../assets/images/google.png")} // ✅ Use your local SVG file
        style={styles.googleIcon}
      />
      <Text style={styles.googleButtonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: wp("5%"),
    height: hp("6.5%"),
    paddingHorizontal: wp("5%"),
    marginTop: hp("3%"),
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  googleIcon: {
    width: 24, // Adjust based on your image
    height: 24,
    resizeMode: "contain",
  },
  googleButtonText: {
    color: "#3C4043",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: wp("3%"),
  },
});
