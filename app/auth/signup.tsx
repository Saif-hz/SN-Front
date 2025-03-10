import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import GoogleButton from "../../components/GoogleButton";

const Signup = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("artist");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNextStep = () => {
    if (
      !nom.trim() ||
      !prenom.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    // ✅ Navigate to Step 2 based on userType
    router.push({
      pathname: "/auth/SignupDetails",
      params: { email, nom, prenom, username, password, userType },
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/flouu.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Create an Account</Text>

        {/* Username */}
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#D1C4E9"
        />

        {/* Nom & Prénom on the Same Line */}
        <View style={styles.rowContainer}>
          <TextInput
            placeholder="Nom"
            style={[styles.input, styles.halfInput]}
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
            placeholderTextColor="#D1C4E9"
          />
          <TextInput
            placeholder="Prénom"
            style={[styles.input, styles.halfInput]}
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
            placeholderTextColor="#D1C4E9"
          />
        </View>

        {/* Email */}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#D1C4E9"
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="#D1C4E9"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="#D1C4E9"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            placeholderTextColor="#D1C4E9"
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            <MaterialIcons
              name={isConfirmPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="#D1C4E9"
            />
          </TouchableOpacity>
        </View>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          <Pressable
            style={[
              styles.userTypeButton,
              userType === "artist" && styles.selectedUserType,
            ]}
            onPress={() => setUserType("artist")}
          >
            <Text style={styles.userTypeText}>Artist</Text>
          </Pressable>
          <Pressable
            style={[
              styles.userTypeButton,
              userType === "producer" && styles.selectedUserType,
            ]}
            onPress={() => setUserType("producer")}
          >
            <Text style={styles.userTypeText}>Producer</Text>
          </Pressable>
        </View>

        {/* Google Signup & Next Button on Same Line */}
        <View style={styles.buttonRow}>
          <View style={styles.equalButton}>
            <GoogleButton
              onPress={() => {
                /* handle Google signup */
              }}
            />
          </View>
          <Pressable style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp("85%"),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("5%"),
    paddingBottom: hp("5%"),
  },
  title: {
    color: "#ffe3ff",
    fontSize: hp("4%"),
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: hp("3%"),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: "100%",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 1.5,
    color: "white",
    fontSize: 16,
    marginBottom: hp("2%"),
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    width: "48%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 1.5,
    width: "100%",
    marginBottom: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  passwordInput: {
    flex: 1,
    color: "white",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: hp("2%"),
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: hp("2%"),
  },
  userTypeButton: {
    width: "48%", // ✅ Equal width for Artist & Producer
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: hp("1.5%"),
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 1.5,
    alignItems: "center",
  },
  selectedUserType: {
    backgroundColor: "#817AD0",
    borderColor: "#817AD0",
  },
  equalButton: {
    width: "48%", // ✅ Equal width for Google & Next buttons
  },
  userTypeText: {
    color: "white",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
  nextButton: {
    width: "48%",
    height: hp("7%"),
    backgroundColor: "#817AD0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp("2.5%"),
  },
  nextButtonText: {
    color: "white",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
});
