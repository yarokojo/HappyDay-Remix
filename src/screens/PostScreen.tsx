import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image as RNImage, Platform, Alert } from "react-native";
import { Camera, Image, Video, MapPin, AtSign, X, ArrowLeft } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { useTheme } from "../context/ThemeContext";
import { useActivity } from "../context/ActivityContext";
import { useAuth } from "../context/AuthContext";
import * as Haptics from 'expo-haptics';

type CelebrationType = 'birthday' | 'anniversary' | 'party' | 'general';

interface PostScreenProps {
  initialMode?: 'post' | 'video';
  onPost: (
    content: string, 
    image?: string, 
    video?: string, 
    location?: string,
    celebrationType?: CelebrationType,
    celebrantName?: string,
    feeling?: string
  ) => void;
  onBack: () => void;
}

export default function PostScreen({ initialMode = 'post', onPost, onBack }: PostScreenProps) {
  const { theme, darkMode } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useActivity();
  
  const userProfileImage = user?.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop";
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [celebrationType, setCelebrationType] = useState<CelebrationType>('general');
  const [celebrantName, setCelebrantName] = useState("");
  const [feeling, setFeeling] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>();

  React.useEffect(() => {
    if (initialMode === 'video' && !selectedVideo) {
      pickVideo();
    }
  }, [initialMode]);

  const handleShare = () => {
    if (!content.trim() && !selectedImage && !selectedVideo) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (celebrationType === 'birthday' || celebrationType === 'anniversary') {
      addNotification({
        type: 'wish',
        user: 'You',
        avatar: userProfileImage,
        message: `sent a ${celebrationType} wish to ${celebrantName || 'them'}! 🎂`
      });
    }

    onPost(content, selectedImage, selectedVideo, location, celebrationType, celebrantName, feeling);
    onBack();
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Media library permission is needed to select a photo.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setSelectedVideo(undefined);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const pickVideo = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Media library permission is needed to select a video.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false, 
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedVideo(result.assets[0].uri);
        setSelectedImage(undefined);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video. Please try again.");
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setSelectedVideo(undefined);
      }
    } else {
      Alert.alert("Permission required", "Camera permission is needed to take a photo.");
    }
  };

  const shareDisabled = !content.trim() && !selectedImage && !selectedVideo;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Post</Text>
        </View>
        <TouchableOpacity 
          onPress={handleShare}
          disabled={shareDisabled}
          style={[
            styles.shareBtn, 
            { backgroundColor: theme.primary },
            shareDisabled && { backgroundColor: theme.itemBg }
          ]}
        >
          <Text style={[styles.shareBtnText, { color: shareDisabled ? theme.subText : '#fff' }]}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.userSection, { borderBottomColor: theme.bg }]}>
            <RNImage source={{ uri: userProfileImage }} style={[styles.userAvatar, { backgroundColor: theme.itemBg }]} />
            <View>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.displayName || "Alex Johnson"}</Text>
              <View style={styles.typeSelector}>
                {['general', 'birthday', 'anniversary', 'party'].map((type) => (
                  <TouchableOpacity 
                    key={type}
                    onPress={() => setCelebrationType(type as CelebrationType)}
                    style={[
                        styles.typeChip, 
                        { backgroundColor: theme.itemBg },
                        celebrationType === type && { backgroundColor: darkMode ? theme.primary + '30' : theme.primary + '10' }
                    ]}
                  >
                    <Text style={[
                        styles.typeText, 
                        { color: theme.subText },
                        celebrationType === type && { color: theme.primary }
                    ]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {celebrationType !== 'general' && (
            <View style={styles.celebrationForm}>
              <TextInput 
                placeholder="Who are we celebrating?" 
                value={celebrantName}
                onChangeText={setCelebrantName}
                style={[styles.subInput, { backgroundColor: theme.bg, color: theme.text }]}
                placeholderTextColor={theme.subText}
              />
              <TextInput 
                placeholder="How are you feeling?" 
                value={feeling}
                onChangeText={setFeeling}
                style={[styles.subInput, { backgroundColor: theme.bg, color: theme.text }]}
                placeholderTextColor={theme.subText}
              />
            </View>
          )}

          <TextInput 
            placeholder={celebrationType === 'birthday' ? "Write a birthday wish..." : "Share your celebration..."} 
            value={content}
            onChangeText={setContent}
            multiline
            style={[styles.mainInput, { color: theme.text }]}
            placeholderTextColor={theme.subText}
            textAlignVertical="top"
          />

          {selectedImage && (
            <View style={styles.mediaContainer}>
              <RNImage source={{ uri: selectedImage }} style={styles.mediaPreview} />
              <TouchableOpacity onPress={() => setSelectedImage(undefined)} style={styles.mediaDelete}>
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {selectedVideo && (
            <View style={styles.mediaContainer}>
              <ExpoVideo 
                source={{ uri: selectedVideo }} 
                style={styles.mediaPreview} 
                useNativeControls 
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isMuted
              />
              <TouchableOpacity onPress={() => setSelectedVideo(undefined)} style={styles.mediaDelete}>
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {showLocationInput && (
            <View style={[styles.locationContainer, { backgroundColor: darkMode ? theme.itemBg : theme.primary + '05', borderColor: theme.border }]}>
              <MapPin size={18} color={theme.primary} />
              <TextInput 
                placeholder="Where are you celebrating?" 
                value={location}
                onChangeText={setLocation}
                style={[styles.locationInput, { color: theme.primary }]}
                placeholderTextColor={theme.subText}
                autoFocus
              />
              <TouchableOpacity onPress={() => { setLocation(""); setShowLocationInput(false); }}>
                <X size={14} color={theme.subText} />
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.mediaActions, { borderTopColor: theme.bg }]}>
            <TouchableOpacity onPress={takePhoto} style={[styles.mediaActionBtn, { backgroundColor: darkMode ? theme.itemBg : theme.primary + '05' }]}>
              <Camera size={18} color={theme.primary} />
              <Text style={[styles.mediaActionText, { color: theme.primary }]}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={[styles.mediaActionBtn, { backgroundColor: darkMode ? theme.itemBg : theme.secondary + '05' }]}>
              <Image size={18} color={theme.secondary} />
              <Text style={[styles.mediaActionText, { color: theme.secondary }]}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickVideo} style={[styles.mediaActionBtn, { backgroundColor: darkMode ? theme.itemBg : theme.accent + '05' }]}>
              <Video size={18} color={theme.accent} />
              <Text style={[styles.mediaActionText, { color: theme.accent }]}>Video</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.extraActions, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity 
            onPress={() => setShowLocationInput(!showLocationInput)}
            style={styles.extraBtn}
          >
            <MapPin size={20} color={location ? theme.primary : theme.subText} />
            <Text style={[styles.extraText, { color: theme.subText }, location && { color: theme.primary }]}>{location ? location : 'Add Location'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.extraBtn}>
            <AtSign size={20} color={theme.subText} />
            <Text style={[styles.extraText, { color: theme.subText }]}>Tag Friends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 64,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  shareBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  shareBtnDisabled: {
    backgroundColor: '#e2e8f0',
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    marginBottom: 16,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
  },
  userName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1e293b',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  typeChipActive: {
    backgroundColor: '#eff6ff',
  },
  typeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#94a3b8',
  },
  typeTextActive: {
    color: '#4f46e5',
  },
  celebrationForm: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  subInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  mainInput: {
    height: 120,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 16,
  },
  mediaContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  mediaPreview: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  mediaDelete: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f7ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
    padding: 0,
  },
  mediaActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  mediaActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f5f7ff',
    paddingVertical: 10,
    borderRadius: 12,
  },
  mediaActionText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4f46e5',
    textTransform: 'uppercase',
  },
  extraActions: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  extraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
  },
  extraText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94a3b8',
  },
});
