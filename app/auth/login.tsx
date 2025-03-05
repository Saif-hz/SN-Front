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
import { useLoginUserMutation } from "../../store/apiSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Gradient for buttons
import GoogleButton from "../../components/GoogleButton";
import * as Font from "expo-font";
import { useState as useFontState } from "react";
import { useRouter } from "expo-router"; // Import router

const Login = () => {
  const router = useRouter(); // Initialize router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const userType = "defaultUserType"; // Define userType with a default value
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load Font
  const [fontLoaded, setFontLoaded] = useFontState(false);
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Hubballi: require("../../assets/fonts/Hubballi-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      console.log("Sending login request:", { email, password });
      const response = await loginUser({ email, password }).unwrap();
      console.log("Login successful:", response);
      Alert.alert("Success", "Login successful!");
      router.replace({
        pathname: "/auth/profile",
        params: { email: email, userType: userType },
      });
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(
        "Error",
        (error as any)?.data?.error || "Login failed. Try again."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Implement Google login logic here
      console.log("Google login initiated");
      // Example: const response = await googleLogin();
      // Handle successful login
      Alert.alert("Success", "Google login successful!");
    } catch (error) {
      console.error("Google Login Error:", error);
      Alert.alert("Error", "Google login failed. Try again.");
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require("../../assets/images/darkmodebg.png")}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Page Title */}
        {fontLoaded && <Text style={styles.title}>Welcome Back</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#D1C4E9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              style={styles.passwordInput}
              placeholderTextColor="#D1C4E9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={24}
                color="#D1C4E9"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Me Checkbox */}
        <Pressable
          onPress={() => setIsRememberChecked(!isRememberChecked)}
          style={styles.rememberMeContainer}
        >
          <View
            style={[
              styles.checkbox,
              isRememberChecked && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.rememberMeText}>Remember me</Text>
        </Pressable>

        <View style={styles.buttonContainer}>
          {/* Login Button with Gradient */}
          <Pressable onPress={handleLogin} disabled={isLoading}>
            <LinearGradient
              colors={["#B89EFF", "#A971B3"]} // Gradient (Dark to Light)
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.loginButton, { opacity: isLoading ? 0.5 : 1 }]}
            >
              <Text style={styles.loginText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={() => router.push("/auth/signup")}>
            <LinearGradient
              colors={["#EDE7F6", "#A971B3"]} // Reverse Gradient (Light to Dark)
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.signupButton}
            >
              <Text style={styles.signupText}>Signup</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <GoogleButton onPress={handleGoogleLogin} />
      </Animated.View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  container: {
    width: wp("85%"),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#ffe3ff", // Light lavender instead of white
    fontSize: hp("4%"),
    textAlign: "center",
    fontFamily: "poppinsSemiBold",
    marginBottom: hp("10%"),
  },
  inputContainer: {
    width: "100%",
    gap: hp("2%"),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Clearer glassmorphism effect
    width: "100%",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 2,
    color: "white",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: wp("5%"),
    borderColor: "#F2E3F4",
    borderWidth: 2,
    width: "100%",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    color: "white",
    fontSize: 16,
  },
  eyeIcon: {
    paddingRight: wp("5%"),
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: hp("2%"),
  },
  checkbox: {
    width: wp("4%"),
    height: wp("4%"),
    borderWidth: 2,
    borderColor: "#A971B3",
    marginRight: wp("2%"),
  },
  checkboxChecked: {
    backgroundColor: "#A971B3",
  },
  rememberMeText: {
    color: "#A971B3",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: hp("3%"),
  },
  loginButton: {
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    marginBottom: hp("2%"),
    width: "100%",
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    width: "100%",
  },
  signupText: {
    color: "#5B2788",
    fontSize: 18,
    fontWeight: "bold",
  },
});
