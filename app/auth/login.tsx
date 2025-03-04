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
import { MaterialIcons } from "@expo/vector-icons"; // For Eye Icon & Google Icon
import { FontAwesome } from "@expo/vector-icons"; // Import Google Icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  // Redux mutation hook for login
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Animation for entrance fade-in effect
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(
        "Error",
        (error as any)?.data?.error || "Login failed. Try again."
      );
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google authentication will be implemented.");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/welcomeBG.jpg")}
      style={styles.background}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>let’s connect {"\n"} through music</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#D1C4E9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input with Eye Icon */}
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
          <Pressable
            style={[styles.loginButton, { opacity: isLoading ? 0.5 : 1 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>

          <Pressable style={styles.signupButton}>
            <Text style={styles.signupText}>Signup</Text>
          </Pressable>
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <FontAwesome name="google" size={24} color="#DB4437" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
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
  },
  container: {
    width: wp("85%"),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: hp("4%"),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp("5%"),
    textTransform: "capitalize",
  },
  inputContainer: {
    width: "100%",
    gap: hp("2%"),
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Glassmorphism effect
    width: "100%",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: wp("5%"),
    borderColor: "#B89EFF",
    borderWidth: 1.5,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: wp("5%"),
    borderColor: "#B89EFF",
    borderWidth: 1.5,
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
    borderColor: "white",
    marginRight: wp("2%"),
  },
  checkboxChecked: {
    backgroundColor: "#B89EFF",
  },
  rememberMeText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: hp("3%"),
  },
  loginButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#B89EFF",
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    marginBottom: hp("2%"),
  },
  loginText: {
    color: "#B89EFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#B89EFF",
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    shadowColor: "#B89EFF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  signupText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: wp("5%"),
    height: hp("6.5%"),
    paddingHorizontal: wp("5%"),
    marginTop: hp("3%"),
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#3C4043",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: wp("3%"),
  },
});
