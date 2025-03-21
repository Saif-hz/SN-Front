import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetExploreFeedQuery,
  useCreatePostMutation,
} from "@/store/apiSlice";
import * as ImagePicker from "expo-image-picker";
import PostMedia from "../../components/PostMedia";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heart, MessageCircle, Share2, Music2 } from "lucide-react-native";
import * as FileSystem from "expo-file-system";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const { data: posts, isLoading, refetch } = useGetExploreFeedQuery({});
  const [createPost, { isLoading: isPosting }] = useCreatePostMutation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (posts) {
      console.log("Fetched posts:", posts);
    }
  }, [posts]);

  // ✅ Handle Media Upload
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedMedia) {
      console.error("⚠️ Post cannot be empty!");
      return;
    }

    try {
      await createPost({
        content: newPostContent.trim(),
        image: selectedMedia ? { uri: selectedMedia } : null,
      }).unwrap();
      console.log("✅ Post Created Successfully!");
    } catch (error) {
      console.error("❌ Post creation failed:", error);
    }
  };
  // ✅ Refresh Handler
  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/exploreBG.png")}
      style={styles.container}
    >
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/51.jpg" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color="#7E57C2" />
        <TextInput
          placeholder="Search artists, songs, or genres..."
          style={styles.searchInput}
          placeholderTextColor="#7E57C2"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 🔹 Create Post */}
      <View style={styles.createPostContainer}>
        <TextInput
          placeholder="What's on your mind?"
          style={styles.createPostInput}
          placeholderTextColor="#7E57C2"
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <View style={styles.createPostActions}>
          <TouchableOpacity onPress={pickMedia}>
            <Ionicons name="image-outline" size={24} color="#7E57C2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreatePost} disabled={isPosting}>
            <Ionicons
              name="send"
              size={24}
              color={isPosting ? "gray" : "#7E57C2"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Post Feed */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#7E57C2"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </ImageBackground>
  );
};

// ✅ PostCard Component
interface Post {
  id: number;
  user_avatar: string;
  username: string;
  user_type: string;
  content: string;
  media?: {
    type: string;
    url: string;
  };
  likes: number;
  comments: number;
}

const PostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  <Text style={styles.username}>{post.username || "Unknown User"}</Text>;
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.user_avatar || "default-avatar.png" }}
          style={styles.postAvatar}
        />
        <View>
          <Text style={styles.username}>
            {(post as any)?.username || "Unknown User"}
          </Text>
          <View style={styles.userTypeContainer}>
            <Music2 size={14} color="#6366f1" />
            <Text style={styles.userType}>{post.user_type || "User"}</Text>
          </View>
        </View>
      </View>

      {/* 🔹 Post Content */}
      <Text style={styles.postCaption}>{post.content || "No Content"}</Text>

      {/* 🔹 Post Media */}
      {post.media && ["audio", "image", "video"].includes(post.media.type) && (
        <PostMedia
          type={post.media.type as "audio" | "image" | "video"}
          url={post.media.url}
        />
      )}

      {/* 🔹 Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart
            size={20}
            color={isLiked ? "#ef4444" : "#6366f1"}
            fill={isLiked ? "#ef4444" : "transparent"}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color="#6366f1" />
          <Text style={styles.actionText}>{post.comments || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE7F6",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  createPostContainer: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  createPostInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  createPostActions: {
    flexDirection: "row",
    gap: 10,
  },

  // 🔹 Post Card Styles
  postCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  userTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userType: {
    fontSize: 14,
    color: "#6366f1",
    marginLeft: 4,
  },
  postCaption: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    marginBottom: 8,
  },

  // 🔹 Post Media (Image/Video)
  media: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 10,
  },
  audioContainer: {
    width: "100%",
    height: 80,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    marginVertical: 8,
    overflow: "hidden",
  },
  audio: {
    width: "100%",
    height: "100%",
  },

  // 🔹 Actions (Like, Comment, Share)
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: "#64748b",
    fontSize: 14,
  },
  likedText: {
    color: "#ef4444",
  },
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
});
