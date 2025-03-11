import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from "../../store/apiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [bio, setBio] = useState("");
  const [userType, setUserType] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // ✅ Get logged-in user's username from AsyncStorage
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };
    fetchUsername();
  }, []);

  // ✅ Fetch user data from API
  const { data: user, isLoading } = useGetUserProfileQuery(username, {
    skip: !username, // Prevents query from running when username is empty
  });

  useEffect(() => {
    if (user) {
      setNom(user.nom || "");
      setPrenom(user.prenom || "");
      setBio(user.bio || "");
      setUserType(user.user_type || "");
      setProfilePicture(user.profile_picture || null);
    }
  }, [user]);

  // ✅ Use update mutation
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // ✅ Handle Image Selection
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to enable permission to access photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // ✅ Handle Profile Update
  const handleSaveChanges = async () => {
    if (!nom.trim() || !prenom.trim() || !bio.trim()) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("bio", bio);

    if (profilePicture && profilePicture !== user.profile_picture) {
      const filename = profilePicture.split("/").pop();
      if (filename) {
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? `image/${match[1]}` : `image`;
        const response = await fetch(profilePicture);
        const blob = await response.blob();
        formData.append("profile_picture", blob, filename);
      }
    }

    try {
      await updateProfile(formData).unwrap();
      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/(tabs)/profile");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#817AD0" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Profile Picture Selection */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profilePicture
              ? { uri: profilePicture }
              : require("../../assets/images/profileplaceholder.jpg")
          }
          style={styles.profileImage}
        />
        <Text style={styles.changePictureText}>Change Profile Picture</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} value={username} editable={false} />

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TextInput style={styles.input} value={userType} editable={false} />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSaveChanges}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFFFFF" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  changePictureText: {
    textAlign: "center",
    color: "#817AD0",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#817AD0",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default EditProfile;
