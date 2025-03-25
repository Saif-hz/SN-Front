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
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "lucide-react-native";
import { useUpdateProfileMutation, useGetUserProfileQuery } from "../../store/apiSlice";

// ✅ Define UserProfile Type
interface UserProfile {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  profile_picture: string | null;
  bio: string;
  genres: string[];
  talents: string[];
  studio_name?: string | null;
}

// Use a more reliable placeholder image URL with the user's initials
const getPlaceholderAvatar = (name: string) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
};

const EditProfile = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const userQuery = useGetUserProfileQuery(username || "", { skip: !username });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        const storedToken = await AsyncStorage.getItem("accessToken");
        
        console.log("Checking stored data:", {
          username: storedUsername,
          hasToken: !!storedToken
        });

        if (!storedUsername || !storedToken) {
          console.log("Missing username or token, redirecting to login");
          router.replace("/auth/login");
          return;
        }

        console.log("✅ Loaded Username from Storage:", storedUsername);
        setUsername(storedUsername);
      } catch (error) {
        console.error("Error fetching username:", error);
        router.replace("/auth/login");
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (userQuery.error) {
      console.error("❌ Error Fetching User Profile:", userQuery.error);
      const error = userQuery.error as { status?: number };
      
      if (error.status === 401) {
        Alert.alert(
          "Session Error",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: async () => {
                // Clear stored data
                await AsyncStorage.multiRemove(["accessToken", "username"]);
                router.replace("/auth/login");
              }
            }
          ]
        );
      }
    }
  }, [userQuery.error]);

  useEffect(() => {
    if (userQuery.data) {
      setNom(userQuery.data.nom || "");
      setPrenom(userQuery.data.prenom || "");
      setBio(userQuery.data.bio || "");
      // Set profile picture or generate a placeholder with user's initials
      const fullName = `${userQuery.data.prenom || ''} ${userQuery.data.nom || ''}`.trim();
      const placeholderUrl = getPlaceholderAvatar(fullName || 'User');
      setProfilePicture(userQuery.data.profile_picture || placeholderUrl);
    }
  }, [userQuery.data]);

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
    try {
      // ✅ Check network connectivity
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "Session expired. Please login again.");
        router.replace("/auth/login");
        return;
      }

      const formData = new FormData();

      // ✅ Append only changed fields with validation
      if (nom && nom !== userQuery.data?.nom) {
        if (nom.length < 2) {
          Alert.alert("Error", "Last name must be at least 2 characters long.");
          return;
        }
        formData.append("nom", nom);
      }

      if (prenom && prenom !== userQuery.data?.prenom) {
        if (prenom.length < 2) {
          Alert.alert("Error", "First name must be at least 2 characters long.");
          return;
        }
        formData.append("prenom", prenom);
      }

      if (bio && bio !== userQuery.data?.bio) {
        if (bio.length > 500) {
          Alert.alert("Error", "Bio must be less than 500 characters.");
          return;
        }
        formData.append("bio", bio);
      }

      // ✅ Handle profile picture upload with better error handling
      if (profilePicture && !profilePicture.startsWith('http')) {
        try {
          const localUri = profilePicture;
          const filename = localUri.split('/').pop() || 'profile.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          // ✅ Validate file size (max 5MB)
          const response = await fetch(localUri);
          const blob = await response.blob();
          if (blob.size > 5 * 1024 * 1024) {
            Alert.alert("Error", "Image size must be less than 5MB.");
            return;
          }

          console.log('Preparing image upload:', {
            uri: localUri,
            name: filename,
            type: type,
            size: blob.size
          });

          // Create a new FormData entry for the profile picture
          formData.append('profile_picture', {
            uri: Platform.OS === 'android' ? localUri : localUri.replace('file://', ''),
            type: type,
            name: filename,
          } as any);
        } catch (error) {
          console.error("Error processing image:", error);
          Alert.alert("Error", "Failed to process image. Please try again.");
          return;
        }
      }

      // ✅ Log FormData contents safely
      const formDataObj: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'object' && value !== null) {
          // Type guard for file object
          if ('uri' in value && 'type' in value && 'name' in value) {
            const fileValue = value as { uri: string; type: string; name: string };
            formDataObj[key] = {
              type: fileValue.type,
              name: fileValue.name,
              uri: fileValue.uri
            };
          } else {
            formDataObj[key] = value;
          }
        } else {
          formDataObj[key] = value;
        }
      }
      console.log("Updating profile with formData:", formDataObj);
        
      const response = await updateProfile(formData).unwrap();
      console.log("Profile update response:", response);

      // ✅ Update local state with new profile picture if it was updated
      if (response.profile_picture) {
        setProfilePicture(response.profile_picture);
      }

      Alert.alert(
        "Success",
        "Profile updated successfully!",
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                // Force a refetch of the profile data
                await userQuery.refetch();
                // Navigate back to profile page
                router.replace("/(tabs)/profile");
              } catch (error) {
                console.error("Error refreshing profile:", error);
                Alert.alert("Warning", "Profile updated but there was an error refreshing the data.");
                router.replace("/(tabs)/profile");
              }
            }
          }
        ]
      );
    } catch (error: any) {
      console.error("Error updating profile:", {
        error,
        status: error?.status,
        data: error?.data,
        message: error?.message
      });

      // ✅ Handle specific error cases
      if (error?.status === 401) {
        Alert.alert("Session Expired", "Please login again to continue.");
        router.replace("/auth/login");
        return;
      }

      if (error?.status === 413) {
        Alert.alert("Error", "File size too large. Please choose a smaller image.");
        return;
      }

      const errorMessage = error?.data?.error || 
                          error?.data?.detail || 
                          error?.message ||
                          "Failed to update profile. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  // Show loading state while fetching profile
  if (userQuery.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  // Show error state if profile fetch failed
  if (userQuery.error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => userQuery.refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarSection}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.avatar}
          onError={() => {
            console.log("Error loading profile picture, using placeholder");
            const fullName = `${prenom || ''} ${nom || ''}`.trim();
            const placeholderUrl = getPlaceholderAvatar(fullName || 'User');
            setProfilePicture(placeholderUrl);
          }}
        />
        <TouchableOpacity style={styles.changeAvatarButton} onPress={pickImage}>
          <Camera size={20} color="#6366f1" />
          <Text style={styles.changeAvatarText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
            placeholder="Enter your last name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Enter your first name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          disabled={isUpdating}
        >
          <Text style={styles.saveButtonText}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changeAvatarButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  changeAvatarText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bioInput: {
    height: 120,
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B46C1",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6B46C1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditProfile;
