import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Modal, Dimensions, Platform, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Pressable } from "react-native";
import { Plus, Cake, X, ChevronLeft, ChevronRight, Share2, Heart, MessageCircle, Send } from "lucide-react-native";
import { Story } from "../types";
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from "moti";
import { BlurView } from "expo-blur";
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useActivity } from "../context/ActivityContext";
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoriesProps {
  stories: Story[];
  seenStoryIds: Set<string>;
  onSeenStory: (id: string) => void;
  onAddStory: (imageUrl: string, contentUrl: string, isVideo?: boolean) => void;
  userProfileImage: string;
}

export default function Stories({ stories, seenStoryIds, onSeenStory, onAddStory, userProfileImage }: StoriesProps) {
  const { darkMode, theme } = useTheme();
  const { logView } = useActivity();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  const selectedStoryIndex = useMemo(() => {
    if (!selectedStoryId) return null;
    return stories.findIndex(s => s.id === selectedStoryId);
  }, [selectedStoryId, stories]);

  const activeStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;

  const startProgress = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(() => {
      if (!isPaused && !isVideoLoading) {
        setProgress((prev) => {
          if (prev >= 1) {
            handleNext();
            return 1;
          }
          return prev + 0.01;
        });
      }
    }, 50); // 5 seconds total (100 * 50ms)
  };

  useEffect(() => {
    if (selectedStoryId !== null) {
      setProgress(0);
      startProgress();
      if (selectedStoryId) {
        onSeenStory(selectedStoryId);
        
        // Log to history
        const story = stories.find(s => s.id === selectedStoryId);
        if (story) {
          logView({
            id: story.id,
            type: 'story',
            title: `${story.userName}'s Story`,
            imageUrl: story.imageUrl || story.contentUrl || ""
          });
        }
      }
    } else {
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgress(0);
    }
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [selectedStoryId]);

  useEffect(() => {
     // If stories change and we are viewing one, make sure we stay on it or exit if it's gone
     if (selectedStoryId && stories.findIndex(s => s.id === selectedStoryId) === -1) {
       setSelectedStoryId(null);
     }
  }, [stories]);

  const handleNext = () => {
    if (selectedStoryIndex !== null) {
      if (selectedStoryIndex < stories.length - 1) {
        setSelectedStoryId(stories[selectedStoryIndex + 1].id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        setSelectedStoryId(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handlePrev = () => {
    if (selectedStoryIndex !== null) {
      if (selectedStoryIndex > 0) {
        setSelectedStoryId(stories[selectedStoryIndex - 1].id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        setProgress(0);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleCreateStory = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Permission is needed to add a story.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const isVideo = asset.type === 'video';
        
        onAddStory(
          userProfileImage,
          asset.uri,
          isVideo
        );
      }
    } catch (error) {
      console.error("Error creating story:", error);
      Alert.alert("Error", "Failed to create story.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.storyItem}>
          <Pressable 
            style={({ pressed }) => [
              styles.addStoryButton, 
              { backgroundColor: theme.itemBg, borderColor: theme.border, opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={handleCreateStory}
          >
            <Plus size={24} color={theme.primary} />
          </Pressable>
          <Text style={[styles.storyLabel, { color: theme.subText }]}>Your Story</Text>
        </View>
        
        {stories.map((story, idx) => {
          const isLive = idx === 0 || idx === 1; // Simulation
          const hasBeenSeen = seenStoryIds.has(story.id);
          return (
            <Pressable 
              key={story.id} 
              style={({ pressed }) => [
                styles.storyItem,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => setSelectedStoryId(story.id)}
            >
              <View style={styles.avatarContainer}>
                {isLive && !hasBeenSeen ? (
                  <LinearGradient
                    colors={['#4f46e5', '#ec4899', '#f59e0b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientBorder, { transform: [{ rotate: '45deg' }] }]}
                  >
                    <View style={[styles.innerWhite, { transform: [{ rotate: '-45deg' }], backgroundColor: theme.bg }]}>
                      <Image source={{ uri: story.imageUrl }} style={styles.storyImage} />
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={[styles.gradientBorder, hasBeenSeen ? { backgroundColor: theme.border } : { backgroundColor: theme.border }]}>
                    <View style={[styles.innerWhite, { backgroundColor: theme.bg }]}>
                      <Image source={{ uri: story.imageUrl }} style={[styles.storyImage, hasBeenSeen && { opacity: 0.6 }]} />
                    </View>
                  </View>
                )}
                {isLive && (
                  <>
                    <MotiView 
                      from={{ opacity: 0.6, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ loop: true, duration: 1000, type: 'timing' }}
                      style={styles.liveBadge}
                    >
                      <Text style={styles.liveText}>LIVE</Text>
                    </MotiView>
                    <View style={[styles.cakeIcon, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                      <Cake size={10} color="#ec4899" />
                    </View>
                  </>
                )}
              </View>
              <Text style={[styles.storyLabel, { color: theme.subText }, hasBeenSeen && { color: theme.border }]} numberOfLines={1}>{story.userName}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Story Viewer Modal */}
      <Modal
        visible={selectedStoryId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedStoryId(null)}
      >
        {activeStory && (
          <View style={styles.viewerContainer}>
            <AnimatePresence>
              <MotiView
                key={activeStory.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ type: 'timing', duration: 400 }}
                style={StyleSheet.absoluteFill}
              >
                {activeStory.isVideo ? (
                  <View style={StyleSheet.absoluteFill}>
                    <Video
                      source={{ uri: activeStory.contentUrl }}
                      style={styles.viewerContent}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={!isPaused}
                      isLooping={false}
                      onLoadStart={() => setIsVideoLoading(true)}
                      onLoad={() => setIsVideoLoading(false)}
                      onPlaybackStatusUpdate={(status: any) => {
                        if (status.didJustFinish) {
                          handleNext();
                        }
                      }}
                    />
                    {isVideoLoading && (
                      <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                      </View>
                    )}
                  </View>
                ) : (
                  <Image 
                    source={{ uri: activeStory.contentUrl }} 
                    style={styles.viewerContent}
                    resizeMode="cover"
                  />
                )}
              </MotiView>
            </AnimatePresence>
            
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent']}
              style={styles.viewerTopGradient}
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.viewerBottomGradient}
            />

            {/* Tap areas for navigation */}
            <View style={styles.viewerControls}>
              <Pressable 
                style={styles.tapSide} 
                onPress={handlePrev}
              />
              <Pressable 
                style={styles.tapMiddle} 
                onLongPress={() => setIsPaused(true)}
                onPressOut={() => setIsPaused(false)}
              />
              <Pressable 
                style={styles.tapSide} 
                onPress={handleNext}
              />
            </View>

            {/* Header */}
            <SafeAreaView style={styles.viewerHeader} edges={['top']}>
              {/* Progress Bars */}
              <View style={styles.progressBarContainer}>
                {stories.map((_, idx) => (
                  <View key={idx} style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: idx === selectedStoryIndex ? `${progress * 100}%` : idx < (selectedStoryIndex ?? 0) ? '100%' : '0%' 
                        }
                      ]} 
                    />
                  </View>
                ))}
              </View>

              <View style={styles.viewerUserRow}>
                <Image source={{ uri: activeStory.imageUrl }} style={styles.viewerAvatar} />
                <View style={styles.viewerUserInfo}>
                  <Text style={styles.viewerUserName}>{activeStory.userName}</Text>
                  <Text style={styles.viewerTimestamp}>{activeStory.timestamp}</Text>
                </View>
                <Pressable onPress={() => setSelectedStoryId(null)} style={({ pressed }) => [styles.viewerCloseBtn, { opacity: pressed ? 0.7 : 1 }]}>
                  <X size={24} color="#fff" />
                </Pressable>
              </View>
            </SafeAreaView>

            {/* Footer */}
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
              style={styles.viewerFooter}
            >
              <View style={styles.viewerFooterContent}>
                <View style={styles.replyBox}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Send a birthday wish..."
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={replyMessage}
                    onChangeText={setReplyMessage}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => {
                      if (!replyMessage) {
                        setIsPaused(false);
                        startProgress();
                      }
                    }}
                    onSubmitEditing={() => {
                      if (replyMessage.trim()) {
                        setReplyMessage("");
                        setIsPaused(false);
                      }
                    }}
                  />
                  <AnimatePresence>
                    {replyMessage.length > 0 && (
                      <MotiView
                        from={{ opacity: 0, scale: 0.5, translateX: 10 }}
                        animate={{ opacity: 1, scale: 1, translateX: 0 }}
                        exit={{ opacity: 0, scale: 0.5, translateX: 10 }}
                        transition={{ type: 'spring', damping: 15 }}
                      >
                        <Pressable 
                          style={({ pressed }) => [styles.sendButton, { opacity: pressed ? 0.8 : 1 }]}
                          onPress={() => {
                            setReplyMessage("");
                            setIsPaused(false);
                          }}
                        >
                          <Send size={20} color="#fff" strokeWidth={2.5} />
                        </Pressable>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>
                
                <AnimatePresence>
                  {!replyMessage && (
                    <MotiView
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={styles.footerActions}
                    >
                      <Pressable 
                        style={({ pressed }) => [styles.footerActionBtn, { opacity: pressed ? 0.7 : 1 }]}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                      >
                        <Heart size={26} color="#fff" strokeWidth={2} />
                      </Pressable>
                      <Pressable 
                        style={({ pressed }) => [styles.footerActionBtn, { opacity: pressed ? 0.7 : 1 }]}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      >
                        <Share2 size={26} color="#fff" strokeWidth={2} />
                      </Pressable>
                    </MotiView>
                  )}
                </AnimatePresence>
              </View>
            </KeyboardAvoidingView>

            {/* Floating Cake (if birthday/live) */}
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ loop: true, duration: 2000 }}
              style={styles.floatingIndicator}
            >
              <Cake size={32} color="#f59e0b" />
            </MotiView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
    width: 72,
  },
  addStoryButton: {
    width: 64,
    height: 64,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#c7d2fe',
    borderStyle: 'dashed',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  gradientBorder: {
    width: 64,
    height: 64,
    borderRadius: 22,
    padding: 2,
  },
  grayBorder: {
    backgroundColor: '#e2e8f0',
  },
  seenBorder: {
    backgroundColor: '#cbd5e1',
    opacity: 0.5,
  },
  innerWhite: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 19,
    padding: 2,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    backgroundColor: '#f1f5f9',
  },
  storyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: -0.2,
  },
  liveBadge: {
    position: 'absolute',
    top: -6,
    left: '20%',
    backgroundColor: '#e11d48',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 10,
  },
  liveText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  cakeIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Viewer Styles
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerContent: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  viewerBottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  viewerControls: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tapSide: {
    flex: 1,
  },
  tapMiddle: {
    flex: 2,
  },
  viewerHeader: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  progressBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 4,
    marginTop: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  viewerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  viewerUserInfo: {
    flex: 1,
  },
  viewerUserName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  viewerTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  viewerCloseBtn: {
    padding: 8,
  },
  viewerFooter: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 0,
    right: 0,
  },
  viewerFooterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  replyBox: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingLeft: 4,
  },
  replyInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerActionBtn: {
    padding: 6,
  },
  floatingIndicator: {
    position: 'absolute',
    bottom: 120,
    right: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
