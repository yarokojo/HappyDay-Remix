/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Platform, Text, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Header from "./src/components/Header";
import BottomNav from "./src/components/BottomNav";
import HomeScreen from "./src/screens/HomeScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import VideoScreen from "./src/screens/VideoScreen";
import PostScreen from "./src/screens/PostScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import GiftShopScreen from "./src/screens/GiftShopScreen";
import WalletScreen from "./src/screens/WalletScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import GroupGiftScreen from "./src/screens/GroupGiftScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import WebViewScreen from "./src/screens/WebViewScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import TermsAndConditionsScreen from "./src/screens/TermsAndConditionsScreen";
import { Post, Story, ReelItem } from "./src/types";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 24, fontWeight: '900', marginBottom: 12 }}>Wait, something's wrong.</Text>
          <Text style={{ fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>The app encountered an unexpected error.</Text>
          <TouchableOpacity 
            onPress={() => Platform.OS === 'web' ? window.location.reload() : null}
            style={{ backgroundColor: '#4f46e5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
          >
            <Text style={{ color: '#fff', fontWeight: '900' }}>RELOAD APP</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

function MainApp() {
  const { darkMode, theme } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [webViewTitle, setWebViewTitle] = useState<string | null>(null);
  const [userProfileImage, setUserProfileImage] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop");
  const [postMode, setPostMode] = useState<'post' | 'video'>('post');
  const [seenStoryIds, setSeenStoryIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [reels, setReels] = useState<ReelItem[]>([
    {
      id: "1",
      user: "Julia Mason",
      handle: "@julia_m",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      description: "Best surprise party ever! Thanks everyone for making my day so special 🎂✨ #birthday #party #vibes",
      music: "Original Audio - Birthday Beats",
      likes: "12.4k",
      comments: "428",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-blowing-out-candles-on-a-birthday-cake-1152-large.mp4",
      poster: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800",
      isBirthday: true
    },
    {
      id: "2",
      user: "Kevin Hart",
      handle: "@kev_hart",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
      description: "Unboxing the premium cake Julia sent! This is wild! 🍰🎁 #unboxing #gift #celebration",
      music: "Chill Party Mix - Vol 4",
      likes: "8.2k",
      comments: "156",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-celebrating-with-sparklers-at-a-party-1154-large.mp4",
      poster: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800"
    },
    {
      id: "3",
      user: "Sarah Jenkins",
      handle: "@sarah_j",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      description: "Check out this graduation party vibe! So proud of the class of 2024! 🎓✨ #graduation #party",
      music: "Success & Dreams - Instrumental",
      likes: "15.7k",
      comments: "892",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-people-celebrating-with-confetti-and-champagne-1156-large.mp4",
      poster: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800"
    },
    {
      id: "4",
      user: "Mike Ross",
      handle: "@mike_ross",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
      description: "Wedding season is here! Look at this beautiful ceremony 💍❤️ #wedding #love #celebration",
      music: "Wedding Vows - Slow Waltz",
      likes: "25.1k",
      comments: "1.2k",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-clinking-glasses-at-a-party-1153-large.mp4",
      poster: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
    }
  ]);
  const [stories, setStories] = useState<Story[]>([
    { 
      id: "1", 
      userName: "Sarah J.", 
      color: "border-indigo-500", 
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
      contentUrl: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=1080&h=1920&fit=crop",
      timestamp: "2h ago"
    },
    { 
      id: "2", 
      userName: "Marcus", 
      color: "border-pink-400", 
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop",
      contentUrl: "https://images.unsplash.com/photo-1530103578275-21127a7c569a?w=1080&h=1920&fit=crop",
      timestamp: "4h ago"
    },
    { 
      id: "3", 
      userName: "Elena R.", 
      color: "border-indigo-500", 
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
      contentUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1080&h=1920&fit=crop",
      timestamp: "1h ago"
    },
    { 
      id: "4", 
      userName: "David", 
      color: "border-slate-200", 
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
      contentUrl: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=1080&h=1920&fit=crop",
      timestamp: "6h ago"
    },
    { 
      id: "5", 
      userName: "Chloe", 
      color: "border-pink-400", 
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
      contentUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1080&h=1920&fit=crop",
      timestamp: "8h ago"
    },
  ]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "p1",
      authorName: "Sarah Jenkins",
      authorHandle: "@sarahj",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      content: "Counting down the days until Julia's big bash! Can't believe she's turning 24 soon. Time flies! 🎂✨",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      reposts: 2,
      views: 142,
      location: "Grand Ballroom, NYC",
      image: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800&h=400&fit=crop",
      isBookmarked: false,
      commentsList: [
        {
          id: "c1",
          authorName: "Alex Johnson",
          authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          content: "Can't wait for the party! I've got a surprise ready. 🎈",
          timestamp: "1 hour ago"
        },
        {
          id: "c2",
          authorName: "Marcus Thorne",
          authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
          content: "Me too! It's going to be epic.",
          timestamp: "45 mins ago"
        }
      ]
    },
    {
      id: "p2",
      authorName: "Marcus Thorne",
      authorHandle: "@marcus_t",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      content: "Just picked up the most amazing gift from the shop. Julia is going to love it! 🎁",
      timestamp: "5 hours ago",
      likes: 12,
      comments: 2,
      reposts: 0,
      views: 85,
      isBookmarked: true
    }
  ]);

  const handlePost = (
    content: string, 
    image?: string, 
    video?: string, 
    location?: string,
    celebrationType?: 'birthday' | 'anniversary' | 'party' | 'general',
    celebrantName?: string,
    feeling?: string
  ) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: "Alex Johnson",
      authorHandle: "@alex_j",
      authorImage: userProfileImage,
      content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      reposts: 0,
      views: 0,
      image,
      video,
      location,
      celebrationType,
      celebrantName,
      feeling,
      isBookmarked: false
    };
    if (video) {
      const newReel: ReelItem = {
        id: Date.now().toString(),
        user: "Alex Johnson",
        handle: "@alex_j",
        avatar: userProfileImage,
        description: content,
        music: "Original Audio",
        likes: "0",
        comments: "0",
        videoUrl: video,
        poster: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800", // Default poster
      };
      setReels([newReel, ...reels]);
      setActiveTab("video");
    } else {
      setActiveTab("home");
    }
    setSearchQuery(""); // Clear search so the new post is visible in the feed
    setPosts([newPost, ...posts]);
  };

  const handleEditPost = (
    postId: string, 
    newContent: string, 
    newImage?: string, 
    newVideo?: string, 
    newLocation?: string,
    celebrationType?: 'birthday' | 'anniversary' | 'party' | 'general',
    celebrantName?: string,
    feeling?: string
  ) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { 
        ...post, 
        content: newContent, 
        image: newImage, 
        video: newVideo, 
        location: newLocation,
        celebrationType,
        celebrantName,
        feeling,
        isEdited: true 
      } : post
    ));
  };

  const handleRepost = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, reposts: post.reposts + 1 };
      }
      return post;
    }));
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleEditComment = (postId: string, commentId: string, newContent: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId && post.commentsList) {
        return {
          ...post,
          commentsList: post.commentsList.map(comment => 
            comment.id === commentId ? { ...comment, content: newContent } : comment
          )
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          authorName: "Alex Johnson",
          authorImage: userProfileImage,
          content,
          timestamp: "Just now",
          isOwn: true
        };
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: post.commentsList ? [...post.commentsList, newComment] : [newComment]
        };
      }
      return post;
    }));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId && post.commentsList) {
        return {
          ...post,
          comments: Math.max(0, post.comments - 1),
          commentsList: post.commentsList.filter(c => c.id !== commentId)
        };
      }
      return post;
    }));
  };

  const handleToggleFollow = (authorHandle: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.authorHandle === authorHandle) {
        return { ...post, isFollowed: !post.isFollowed };
      }
      return post;
    }));
  };

  const handleAddStory = (imageUrl: string, contentUrl: string, isVideo?: boolean) => {
    const newStory: Story = {
      id: Date.now().toString(),
      userName: "You",
      imageUrl: userProfileImage,
      contentUrl,
      isVideo,
      timestamp: "Just now",
      isUser: true
    };
    setStories([newStory, ...stories]);
  };

  const handleSeenStory = (storyId: string) => {
    setSeenStoryIds(prev => new Set(prev).add(storyId));
  };

  const navigateTo = (screen: string, id?: string, mode?: 'post' | 'video', url?: string, title?: string) => {
    if (screen === "post_detail" && id) {
      setSelectedPostId(id);
    }
    if (screen === "post") {
      setPostMode(mode || 'post');
    }
    if (screen === "webview" && url) {
      setWebViewUrl(url);
      setWebViewTitle(title || null);
    }
    setView(screen);
  };

  const handleTabChange = (tab: string) => {
    setView(null);
    setSelectedPostId(null);
    setWebViewUrl(null);
    setActiveTab(tab);
  };

  const renderScreen = () => {
    if (view === "webview" && webViewUrl) {
      return (
        <WebViewScreen 
          url={webViewUrl} 
          title={webViewTitle || undefined} 
          onBack={() => setView(null)} 
        />
      );
    }
    if (view === "privacy_policy") return <PrivacyPolicyScreen onBack={() => setView(null)} />;
    if (view === "terms") return <TermsAndConditionsScreen onBack={() => setView(null)} />;
    if (view === "gift_shop") return <GiftShopScreen onBack={() => setView(null)} onNavigate={navigateTo} searchQuery={searchQuery} />;
    if (view === "wallet") return <WalletScreen onBack={() => setView(null)} />;
    if (view === "notifications") return <NotificationScreen onBack={() => setView(null)} />;
    if (view === "group_gifts") return <GroupGiftScreen onBack={() => setView(null)} />;
    if (view === "post") return <PostScreen userProfileImage={userProfileImage} initialMode={postMode} onPost={handlePost} onBack={() => setView(null)} />;
    if (view === "video") return <VideoScreen reels={reels} userProfileImage={userProfileImage} onBack={() => setView(null)} onNavigate={navigateTo} />;
    
    const homeProps = {
      onNavigate: navigateTo,
      posts,
      stories,
      seenStoryIds,
      userProfileImage,
      onSeenStory: handleSeenStory,
      onAddStory: handleAddStory,
      onEditPost: handleEditPost,
      onLikePost: handleLikePost,
      onEditComment: handleEditComment,
      onAddComment: handleAddComment,
      onDeletePost: handleDeletePost,
      onDeleteComment: handleDeleteComment,
      onToggleFollow: handleToggleFollow,
      onRepost: handleRepost,
      onToggleBookmark: handleToggleBookmark
    };

    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorHandle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (view === "post_detail" && selectedPostId) {
      const post = posts.find(p => p.id === selectedPostId);
      if (post) {
        return <PostDetailScreen post={post} onBack={() => setView(null)} {...homeProps} />;
      }
    }

    switch (activeTab) {
      case "home":
        return <HomeScreen {...homeProps} posts={filteredPosts} />;
      case "calendar":
        return <CalendarScreen searchQuery={searchQuery} />;
      case "gift_shop":
        return <GiftShopScreen onBack={() => handleTabChange("home")} onNavigate={navigateTo} searchQuery={searchQuery} />;
      case "video":
        return <VideoScreen reels={reels} userProfileImage={userProfileImage} onBack={() => setActiveTab("home")} onNavigate={navigateTo} />;
      case "profile":
        return <ProfileScreen searchQuery={searchQuery} userProfileImage={userProfileImage} onUpdateProfileImage={setUserProfileImage} onNavigate={navigateTo} />;
      default:
        return <HomeScreen {...homeProps} posts={filteredPosts} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          style={{ flex: 1 }}
        >
          <View style={[
            styles.container, 
            { 
              backgroundColor: theme.bg, 
              borderColor: theme.border,
              maxWidth: isLargeScreen ? 1200 : (isTablet ? 800 : '100%'),
              borderLeftWidth: (isLargeScreen || isTablet) ? 1 : 0,
              borderRightWidth: (isLargeScreen || isTablet) ? 1 : 0,
            }
          ]}>
            {!view && activeTab !== "video" && (
              <Header 
                onNavigate={navigateTo} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                userProfileImage={userProfileImage}
              />
            )}
            
            <View style={styles.screenContent}>
              {renderScreen()}
            </View>
    
            <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden',
    borderColor: '#f1f5f9',
  },
  screenContent: {
    flex: 1,
  },
});


