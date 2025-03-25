import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useGetUserProfileQuery, apiSlice } from "../../store/apiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Settings,
  Share2,
  Users as Users2,
  Grid2x2 as Grid,
} from "lucide-react-native";

const PLACEHOLDER_AVATAR = "https://via.placeholder.com/120";
const PLACEHOLDER_COVER = "https://via.placeholder.com/600x200";
const API_BASE_URL = "http://192.168.1.47:8000"; // Match the URL from apiSlice

interface UserProfile {
  profile_picture?: string;
  cover_photo?: string;
  nom?: string;
  prenom?: string;
  user_type?: string;
  bio?: string;
  location?: string;
  posts?: { id: number; image: string }[];
  followers?: number;
  following?: number;
}

const Profile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // ✅ Load Username from AsyncStorage
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (!storedUsername) {
          console.warn("❌ No username found in AsyncStorage. Redirecting...");
          router.replace("/auth/login");
          return;
        }

        console.log("✅ Loaded Username from Storage:", storedUsername);
        setUsername(storedUsername);
      } catch (error) {
        console.error("❌ Error loading username:", error);
        router.replace("/auth/login");
      }
    };

    fetchUsername();
  }, []);

  // ✅ Fetch User Profile Data
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserProfileQuery(username || "", { 
    skip: !username,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });

  // ✅ Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // ✅ Logout Handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "username",
        "accessToken",
        "refreshToken",
        "user"
      ]);
      console.log("✅ Successfully logged out.");
      router.replace("/auth/login");
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  // ✅ Handle profile picture display
  const getProfilePictureUrl = (url: string | null | undefined) => {
    if (!url) return PLACEHOLDER_AVATAR;
  
    // If already a full URL, return it
    if (url.startsWith('http')) return url;
  
    // Ensure the URL is absolute
    return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  };
  

  // ✅ Debugging API Responses
  useEffect(() => {
    console.log("🔄 Fetching User Profile...");
    console.log("👤 Username:", username);

    if (user) {
      console.log("✅ User Profile Data:", user);
      // Log profile picture URL specifically
      const profilePicUrl = getProfilePictureUrl(user.profile_picture);
      console.log("📸 Profile Picture URL:", profilePicUrl);
    }

    if (error) {
      console.error("❌ Error Fetching User Profile:", error);
    }
  }, [user, error, username]);

  if (!username) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* ✅ Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B46C1" />
        </View>
      )}

      {/* ❌ Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error fetching profile data. Try again later.
          </Text>
        </View>
      )}

      {/* ✅ Profile Data */}
      {!isLoading && !error && user && (
        <>
          {/* 🖼️ Cover Section */}
          <View style={styles.coverContainer}>
            <Image
              source={{ uri: user?.cover_photo || PLACEHOLDER_COVER }}
              style={styles.coverPhoto}
            />
            <TouchableOpacity
              style={styles.settingsIcon}
              onPress={() => router.push("/profile/EditProfile")}
            >
              <Settings size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* 🧑 Profile Info */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: getProfilePictureUrl(user?.profile_picture) }}
              style={styles.profilePic}
              onError={(e) => console.error("Error loading profile picture:", e.nativeEvent.error)}
            />
            <Text style={styles.username}>
              {user?.nom || "First Name"} {user?.prenom || "Last Name"}
            </Text>
            <Text style={styles.userType}>
              {user?.user_type || "User"}
            </Text>
            <Text style={styles.bio}>
              {user?.bio || "Music Enthusiast"}
            </Text>

            {/* 📍 Location */}
            {user?.location && (
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={16} color="#6B46C1" />
                <Text style={styles.location}>
                  {user.location}
                </Text>
              </View>
            )}

            {/* 📊 Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {user?.posts?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {user?.followers || 0}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {user?.following || 0}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>

            {/* 🎛️ Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/profile/EditProfile")}
              >
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Share2 size={20} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 📸 Posts Section */}
          <View style={styles.contentSection}>
            <View style={styles.contentHeader}>
              <TouchableOpacity style={styles.contentTab}>
                <Grid size={24} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contentTab}>
                <Users2 size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {user?.posts?.length > 0 ? (
                user.posts.map((post: { id: number; image: string }) => (
                  <Image
                    key={post.id}
                    source={{ uri: post.image }}
                    style={styles.gridItem}
                  />
                ))
              ) : (
                <Text style={styles.noPostsText}>No posts yet.</Text>
              )}
            </View>
          </View>

          {/* 🚪 Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },

  /* 🖼️ Cover & Profile */
  coverContainer: {
    width: "100%",
    height: 200,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  settingsIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  profileSection: {
    alignItems: "center",
    marginTop: -60,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  userType: {
    fontSize: 16,
    color: "#6B46C1",
    fontWeight: "500",
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },

  /* 📍 Location */
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    color: "#6B46C1",
    fontSize: 14,
    marginLeft: 5,
  },

  /* 📊 Stats */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  /* 🎛️ Buttons */
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 6,
  },

  /* 📸 Posts */
  contentSection: {
    backgroundColor: "white",
    marginTop: 8,
  },
  contentHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    justifyContent: "center",
  },
  contentTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  gridItem: {
    width: "32%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "white",
    margin: 2,
    borderRadius: 10,
  },
  noPostsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginVertical: 10,
  },

  /* 🚪 Logout Button */
  logoutButton: {
    backgroundColor: "#FF4B5C",
    padding: 12,
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* 🆕 Post Section (Text and Image) */
  postsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  postItem: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  postTextContainer: {
    padding: 12,
  },
  postText: {
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 8,
  },

  /* 📌 Footer Navigation */
  footerNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "white",
    paddingVertical: 12,
  },
  footerNavItem: {
    alignItems: "center",
  },
  footerNavText: {
    fontSize: 12,
    color: "#64748b",
  },
});
