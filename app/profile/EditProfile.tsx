import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  ImageStyle,
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
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        router.replace("/auth/login");
      }
    };
    fetchUsername();
  }, []);

  const { data: user, isLoading } = useGetUserProfileQuery(username, {
    skip: !username,
  });

  useEffect(() => {
    if (user) {
      setNom(user.nom);
      setPrenom(user.prenom);
      setBio(user.bio);
      setProfilePicture(user.profile_picture);
    }
  }, [user]);

  // Ensure your RTK Query mutation is configured to use the PUT method
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "You must enable gallery permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "Session expired. Please login again.");
      router.replace("/auth/login");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("bio", bio);

    // Append a new profile picture only if it has changed
    if (profilePicture && user && profilePicture !== user.profile_picture) {
      const filename = profilePicture.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const ext = match ? `image/${match[1]}` : "image/jpeg";
      formData.append("profile_picture", {
        uri: profilePicture,
        name: filename,
        type: ext,
      } as any);
    }

    try {
      await updateProfile(formData).unwrap();
      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profilePicture
              ? { uri: profilePicture }
              : require("../../assets/images/profileplaceholder.jpg")
          }
          style={styles.profileImage as ImageStyle}
        />
        <Text style={styles.changePictureText}>Change Picture</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        style={styles.input}
      />
      <TextInput
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        style={styles.input}
      />
      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSaveChanges}
        disabled={isUpdating}
        style={styles.button}
      >
        {isUpdating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  changePictureText: {
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditProfile;
