import { View, Image, StyleSheet, Dimensions, Platform } from "react-native";
import { Video, ResizeMode } from "expo-av";

const { width } = Dimensions.get("window");

interface PostMediaProps {
  type: "image" | "audio" | "video";
  url: string;
}

export default function PostMedia({ type, url }: PostMediaProps) {
  if (type === "image") {
    return (
      <Image
        source={{ uri: url }}
        style={styles.media}
        resizeMode={ResizeMode.COVER}
      />
    );
  }

  if (type === "video") {
    return (
      <Video
        source={{ uri: url }}
        style={styles.media}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping
      />
    );
  }

  // Audio player with custom controls
  return (
    <View style={styles.audioContainer}>
      <Video
        source={{ uri: url }}
        style={styles.audio}
        useNativeControls
        isLooping={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  media: {
    width: width - 32,
    height: width - 32,
    borderRadius: 12,
    marginVertical: 8,
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
});
