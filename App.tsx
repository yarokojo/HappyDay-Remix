/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Platform, Text, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, ActivityIndicator, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import LoginScreen from "./src/screens/LoginScreen";
import SetBirthdayScreen from "./src/screens/SetBirthdayScreen";
import SideNav from "./src/components/SideNav";
import { Post, Story, ReelItem } from "./src/types";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { ActivityProvider } from "./src/context/ActivityContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { supabase } from "./src/lib/supabase";

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
  const { user, signIn, loading: authLoading, isAdmin, isSigningIn, error: authError } = useAuth();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [webViewTitle, setWebViewTitle] = useState<string | null>(null);
  const [postMode, setPostMode] = useState<'post' | 'video'>('post');
  const [seenStoryIds, setSeenStoryIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
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
    }
  ]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Load local data for guests
    if (typeof localStorage !== 'undefined') {
      const localPosts = localStorage.getItem('guest_posts');
      if (localPosts) {
        try {
          const parsed = JSON.parse(localPosts);
          setPosts(prev => {
            // Merge avoiding duplicates
            const existingIds = new Set(prev.map(p => p.id));
            const newPosts = parsed.filter((p: any) => !existingIds.has(p.id));
            return [...newPosts, ...prev];
          });
        } catch (e) {
          console.error("Failed to parse guest posts", e);
        }
      }
    }

    if (!user) return;
    
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      if (data) {
        console.log(`Fetched ${data.length} posts from Supabase`);
        const fetchedPosts: Post[] = data.map(item => ({
          id: item.id,
          ...item,
          authorId: item.author_id,
          authorName: item.author_name,
          authorHandle: item.author_handle,
          authorImage: item.author_image,
          celebrationType: item.celebration_type,
          celebrantName: item.celebrant_name,
          commentsList: item.comments_list || [],
          timestamp: item.created_at ? new Date(item.created_at).toLocaleString() : "Just now",
        } as Post));
        setPosts(fetchedPosts);
      }
    };

    fetchPosts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Derived reels state from posts that have videos
  const reels = React.useMemo(() => {
    const videoPosts = posts.filter(p => !!p.video).map(p => {
      const authorName = p.authorName || "Unknown";
      const authorHandle = p.authorHandle || "@" + (authorName.toLowerCase().replace(/\s+/g, '_'));
      
      return {
        id: p.id,
        user: authorName,
        handle: authorHandle,
        avatar: p.authorImage,
        description: p.content,
        music: "Original Audio",
        likes: (p.likes || 0).toLocaleString(),
        comments: (p.comments || 0).toLocaleString(),
        videoUrl: p.video!,
        poster: p.image || "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800",
        isBirthday: p.celebrationType === 'birthday'
      };
    });

    const samples: ReelItem[] = [
      {
        id: "sample1",
        user: "Julia Mason",
        handle: "@julia_mason",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        description: "Getting ready for the big night! 🎉 #birthdaybash",
        music: "Birthday Anthem - Original",
        likes: "1.2k",
        comments: "142",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-blowing-out-birthday-candles-4437-large.mp4",
        poster: "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=800",
        isBirthday: true
      },
      {
        id: "sample2",
        user: "Kevin Hart",
        handle: "@kevin_hart",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
        description: "Surprise party success! 🎊✨",
        music: "Party Time - Vibe",
        likes: "856",
        comments: "94",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-party-confetti-falling-close-up-of-hands-throwing-427-large.mp4",
        poster: "https://images.unsplash.com/photo-1530103578275-21127a7c569a?w=800"
      }
    ];

    return [...videoPosts, ...samples];
  }, [posts]);


  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg, gap: 20 }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Loading Julia's Birthday Bash...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Handle birthday not set
  if (!user.birthDate) {
    return <SetBirthdayScreen />;
  }

  const userProfileImage = user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

  const handlePost = async (
    content: string, 
    image?: string, 
    video?: string, 
    location?: string,
    celebrationType?: 'birthday' | 'anniversary' | 'party' | 'general',
    celebrantName?: string,
    feeling?: string
  ) => {
    console.log("Creating new post with content:", content.substring(0, 20) + "...");
    
    // Optimistic Update / Guest Support
    const newOptimisticPost: Post = {
      id: 'opt_' + Date.now().toString(),
      authorId: user?.uid || 'guest',
      authorName: user?.displayName || "Test User",
      authorHandle: "@" + (user?.displayName?.toLowerCase().replace(/\s+/g, '_') || 'user'),
      authorImage: userProfileImage,
      content: content || "",
      image,
      video,
      location,
      celebrationType: celebrationType || 'general',
      celebrantName,
      feeling,
      likes: 0,
      comments: 0,
      reposts: 0,
      views: 0,
      timestamp: "Just now",
      commentsList: []
    };

    setPosts(prev => [newOptimisticPost, ...prev]);

    try {
      if (user?.uid && !user.uid.startsWith('guest_')) {
        const postData: any = {
          author_id: user.uid,
          author_name: user.displayName || "Unknown",
          author_handle: "@" + (user.displayName?.toLowerCase().replace(/\s+/g, '_') || 'user'),
          author_image: userProfileImage,
          content: content || "",
          likes: 0,
          comments: 0,
          reposts: 0,
          views: 0,
          created_at: new Date().toISOString()
        };

        if (image) postData.image = image;
        if (video) postData.video = video;
        if (location) postData.location = location;
        if (celebrationType) postData.celebration_type = celebrationType;
        if (celebrantName) postData.celebrant_name = celebrantName;
        if (feeling) postData.feeling = feeling;

        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single();

        if (error) throw error;
        
        console.log("Post created with ID:", data.id);
        
        // Replace optimistic post with actual one
        setPosts(prev => prev.map(p => p.id === newOptimisticPost.id ? {
          ...p,
          id: data.id,
          timestamp: data.created_at ? new Date(data.created_at).toLocaleString() : "Just now"
        } : p));
      } else {
        // For guest users, save to local storage
        const localPosts = localStorage.getItem('guest_posts');
        const updatedLocalPosts = [newOptimisticPost, ...(localPosts ? JSON.parse(localPosts) : [])];
        localStorage.setItem('guest_posts', JSON.stringify(updatedLocalPosts));
      }
      
      if (video) {
        setActiveTab("video");
      } else {
        setActiveTab("home");
      }
      setView(null);
    } catch (error) {
      console.error("handlePost detailed error:", error);
      // Revert optimistic update on error
      setPosts(prev => prev.filter(p => p.id !== newOptimisticPost.id));
      Alert.alert("Error", "Failed to share post. Please check your connection.");
    }
  };

  const handleEditPost = async (
    postId: string, 
    newContent: string, 
    newImage?: string, 
    newVideo?: string, 
    newLocation?: string,
    celebrationType?: 'birthday' | 'anniversary' | 'party' | 'general',
    celebrantName?: string,
    feeling?: string
  ) => {
    try {
      const updateData: any = {
        content: newContent || "",
      };

      if (newImage !== undefined) updateData.image = newImage || null;
      if (newVideo !== undefined) updateData.video = newVideo || null;
      if (newLocation !== undefined) updateData.location = newLocation || null;
      if (celebrationType !== undefined) updateData.celebration_type = celebrationType || null;
      if (celebrantName !== undefined) updateData.celebrant_name = celebrantName || null;
      if (feeling !== undefined) updateData.feeling = feeling || null;

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleRepost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const { error } = await supabase
          .from('posts')
          .update({ reposts: (post.reposts || 0) + 1 })
          .eq('id', postId);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error reposting:", error);
    }
  };

  const handleToggleBookmark = (postId: string) => {
    // local only or sync with user profile
  };

  const handleLikePost = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const { error } = await supabase
          .from('posts')
          .update({ likes: (post.likes || 0) + 1 })
          .eq('id', postId);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleEditComment = (postId: string, commentId: string, content: string) => {
    // stub
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post && user) {
        const newCommentObj = {
          id: Date.now().toString(),
          authorName: user.displayName || "Anonymous",
          authorImage: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          content,
          timestamp: "Just now",
          isOwn: true
        };

        const updatedCommentsList = [...(post.commentsList || []), newCommentObj];
        
        const { error } = await supabase
          .from('posts')
          .update({ 
            comments: (post.comments || 0) + 1,
            comments_list: updatedCommentsList
          })
          .eq('id', postId);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleIncrementViews = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const { error } = await supabase
          .from('posts')
          .update({ views: (post.views || 0) + 1 })
          .eq('id', postId);
        if (error) throw error;
      }
    } catch (error) {
      console.warn("View increment failed", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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
    if (screen === "gift_shop") {
      handleTabChange("gift_shop");
      return;
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
  const filteredPosts = posts.filter(post => {
    const s = searchQuery.toLowerCase();
    const content = (post.content || "").toLowerCase();
    const authorName = (post.authorName || "").toLowerCase();
    const authorHandle = (post.authorHandle || "").toLowerCase();
    return content.includes(s) || authorName.includes(s) || authorHandle.includes(s);
  });

    const homeProps = {
      onNavigate: navigateTo,
      posts: filteredPosts,
      stories,
      seenStoryIds,
      userProfileImage,
      onSeenStory: handleSeenStory,
      onAddStory: handleAddStory,
      onEditPost: handleEditPost,
      onLikePost: handleLikePost,
      onEditComment: handleEditComment,
      onAddComment: handleAddComment,
      onIncrementViews: handleIncrementViews,
      onDeletePost: handleDeletePost,
      onDeleteComment: handleDeleteComment,
      onToggleFollow: handleToggleFollow,
      onRepost: handleRepost,
      onToggleBookmark: handleToggleBookmark,
      searchQuery,
      onSearchChange: setSearchQuery
    };

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
    
    // Admin only screens
    if (view === "wallet") {
      if (isAdmin) return <WalletScreen onBack={() => setView(null)} />;
      return <HomeScreen {...homeProps} posts={filteredPosts} />; // Fallback
    }

    if (view === "notifications") return <NotificationScreen onBack={() => setView(null)} />;
    if (view === "group_gifts") return <GroupGiftScreen onBack={() => setView(null)} />;
    if (view === "post") return <PostScreen initialMode={postMode} onPost={handlePost} onBack={() => setView(null)} />;
    if (view === "video") return <VideoScreen reels={reels} onBack={() => setView(null)} onNavigate={navigateTo} />;

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
        return <CalendarScreen onNavigate={navigateTo} />;
      case "gift_shop":
        return <GiftShopScreen onBack={() => handleTabChange("home")} onNavigate={navigateTo} />;
      case "video":
        return <VideoScreen reels={reels} onBack={() => setActiveTab("home")} onNavigate={navigateTo} />;
      case "profile":
        return <ProfileScreen onNavigate={navigateTo} />;
      default:
        return <HomeScreen {...homeProps} posts={filteredPosts} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
          <StatusBar style={darkMode ? "light" : "dark"} />
          <View style={[
            styles.container, 
            { 
              backgroundColor: theme.bg, 
              borderColor: theme.border,
              maxWidth: isLargeScreen ? 1440 : (isTablet ? 1024 : '100%'),
              borderLeftWidth: (isLargeScreen || isTablet) ? 1 : 0,
              borderRightWidth: (isLargeScreen || isTablet) ? 1 : 0,
              flexDirection: (isLargeScreen || isTablet) ? 'row' : 'column',
            }
          ]}>
            {(isLargeScreen || isTablet) && (
              <SideNav 
                activeTab={activeTab} 
                setActiveTab={handleTabChange} 
                onNavigate={navigateTo} 
              />
            )}

            <View style={{ flex: 1, backgroundColor: theme.bg }}>
              {!view && activeTab !== "video" && activeTab !== "gift_shop" && (
                <Header 
                  onNavigate={navigateTo} 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  userProfileImage={userProfileImage}
                />
              )}
              
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.screenContent}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              >
                {renderScreen()}
              </KeyboardAvoidingView>
      
              {!(isLargeScreen || isTablet) && (
                <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
              )}
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ActivityProvider>
          <ErrorBoundary>
            <MainApp />
          </ErrorBoundary>
        </ActivityProvider>
      </AuthProvider>
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


