import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(
    "https://via.placeholder.com/150"
  );
  const [username, setUsername] = useState("Saif hz");
  const [role, setRole] = useState("Producer");
  const [following, setFollowing] = useState(125);
  const [followers, setFollowers] = useState("3k");
  const [posts, setPosts] = useState(100);

  // Handle Image Upload
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <FontAwesome name="angle-left" size={28} color="#6A0DAD" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="settings" size={28} color="#6A0DAD" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={handlePickImage}
          style={styles.profilePicContainer}
        >
          <Image source={{ uri: profilePicture }} style={styles.profilePic} />
        </TouchableOpacity>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.role}>@{role}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Follow Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      {/* Story Highlights */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.highlightsContainer}
      ></ScrollView>

      {/* Gallery Grid */}
      <View style={styles.galleryContainer}></View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp("5%"),
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("3%"),
  },
  profileSection: {
    alignItems: "center",
  },
  profilePicContainer: {
    borderWidth: 3,
    borderColor: "#6A0DAD",
    borderRadius: 60,
    padding: 5,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: hp("1%"),
  },
  role: {
    fontSize: 16,
    color: "gray",
  },
  editButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: hp("1.5%"),
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp("3%"),
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    color: "gray",
    fontSize: 14,
  },
  highlightsContainer: {
    marginTop: hp("3%"),
    flexDirection: "row",
  },
  highlightImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: hp("3%"),
  },
  galleryImage: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: 10,
    marginBottom: 10,
  },
});
