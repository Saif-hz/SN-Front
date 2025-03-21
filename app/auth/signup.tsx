import React, { useState, useEffect, useRef } from "react";
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
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import GoogleButton from "../../components/GoogleButton";

const GOOGLE_CLIENT_ID =
  "512283829471-bus6l7tli88omj54f8g9rng491t6upe6.apps.googleusercontent.com"; // 🔹 Replace with your actual Client ID

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

  // 🔹 Google Authentication Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleSignIn(authentication.accessToken);
      } else {
        Alert.alert("Google Sign-In Error", "Failed to retrieve access token.");
      }
    }
  }, [response]);

  // 🔹 Handle Google Sign-In
  const handleGoogleSignIn = async (accessToken: string) => {
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();

      // 🔹 Store credentials securely
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("username", userInfo.name);
      await SecureStore.setItemAsync("email", userInfo.email);

      // 🔹 Navigate to profile
      router.replace({
        pathname: "/profile",
        params: { username: userInfo.name },
      });
    } catch (error) {
      Alert.alert("Google Sign-In Error", "Failed to sign in with Google.");
    }
  };

  // 🔹 Handle Manual Signup
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

    // 🔹 Navigate to Next Step
    router.push({
      pathname: "/auth/SignupDetails",
      params: { email, nom, prenom, username, password, userType },
    });
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/flouu.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#D1C4E9"
        />
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
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#D1C4E9"
        />

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

        <View style={styles.buttonRow}>
          <View style={styles.equalButton}>
            <GoogleButton onPress={() => promptAsync()} />
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
