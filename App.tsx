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
import { View, StyleSheet, SafeAreaView, Platform, Text, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import AuthScreen from "./src/screens/AuthScreen";
import { Post, Story, ReelItem, Transaction, GroupGift, ActivityItem } from "./src/types";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

interface Notification {
  id: string;
  type: 'wish' | 'gift' | 'follow' | 'system';
  user: string;
  avatar: string;
  message: string;
  time: string;
  isRead: boolean;
}

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
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [webViewTitle, setWebViewTitle] = useState<string | null>(null);
  const [userProfileImage, setUserProfileImage] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop");
  const [postMode, setPostMode] = useState<'post' | 'video'>('post');
  const [seenStoryIds, setSeenStoryIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBalance, setCurrentBalance] = useState(325);
  const [groupGifts, setGroupGifts] = useState<GroupGift[]>([
    {
      id: "1",
      celebrantName: "Julia Mason",
      giftName: "Premium Velvet Cake",
      targetAmount: 150,
      currentAmount: 85,
      contributorsCount: 4,
      deadline: "5h left",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
    },
    {
      id: "2",
      celebrantName: "Kevin Hart",
      giftName: "Surprise Gift Box",
      targetAmount: 200,
      currentAmount: 45,
      contributorsCount: 2,
      deadline: "12h left",
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop"
    }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t1", type: "gift_received", amount: 2500, date: "Today, 10:45 AM", senderName: "Julia Mason", status: "completed" },
    { id: "t2", type: "gift_received", amount: 5000, date: "Yesterday, 08:20 PM", senderName: "Kevin Hart", status: "completed" },
    { id: "t3", type: "withdrawal", amount: 10000, date: "2 days ago", status: "completed" },
    { id: "t4", type: "gift_received", amount: 15000, date: "3 days ago", senderName: "Samantha Lee", status: "completed" },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "wish",
      user: "Julia Mason",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      message: "sent you a birthday wish! 🎂",
      time: "2m ago",
      isRead: false
    },
    {
      id: "2",
      type: "gift",
      user: "Kevin Hart",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
      message: "sent you a Surprise Gift! 🎁",
      time: "15m ago",
      isRead: false
    },
    {
      id: "3",
      type: "follow",
      user: "Samantha Lee",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      message: "started following you.",
      time: "1h ago",
      isRead: true
    },
    {
      id: "4",
      type: "system",
      user: "BirthDayApp",
      avatar: "",
      message: "Your virtual celebration starts in 1 hour! 🎊",
      time: "3h ago",
      isRead: true
    }
  ]);
  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    username: "@alex_bday_guru",
    bio: "Turning celebrations into legendary memories. 🎂 Birthday Guru & Party Architect.",
    location: "Manhattan, NY",
    website: "alexcelebrates.com",
  });
  const [accountData, setAccountData] = useState({
    email: "alex@example.com",
    phone: "+1 234 567 890",
    twoFactor: true,
    securityScore: 85,
    loginAlerts: true
  });
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "1", text: "Sent a Diamond Ring to Julia", time: "2 hours ago", type: "gift", iconName: "Package", color: "#f59e0b", bg: "#fef3c7" },
    { id: "2", text: "Updated current wallet balance by ₵100", time: "3 hours ago", type: "wallet", iconName: "Globe", color: "#10b981", bg: "#ecfdf5" },
    { id: "3", text: "Shared a new birthday reel: 'Dance Off'", time: "4 hours ago", type: "social", iconName: "Grid", color: "#8b5cf6", bg: "#f5f3ff" },
    { id: "4", text: "Started following Michael Scott", time: "5 hours ago", type: "social", iconName: "Users", color: "#6366f1", bg: "#eef2ff" },
    { id: "5", text: "Received a Gourmet Cake from Sarah", time: "Yesterday", type: "gift", iconName: "Heart", color: "#ec4899", bg: "#fdf2f8" },
    { id: "6", text: "Contributed ₵20 to Sam's Group Gift", time: "3 days ago", type: "gift", iconName: "Package", color: "#d97706", bg: "#fffbeb" },
  ]);
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

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("isAuthenticated");
        const storedPosts = await AsyncStorage.getItem("posts");
        const storedStories = await AsyncStorage.getItem("stories");
        const storedReels = await AsyncStorage.getItem("reels");
        const storedSeenStories = await AsyncStorage.getItem("seenStoryIds");
        const storedProfileImage = await AsyncStorage.getItem("userProfileImage");
        const storedBalance = await AsyncStorage.getItem("currentBalance");
        const storedTransactions = await AsyncStorage.getItem("transactions");
        const storedNotifications = await AsyncStorage.getItem("notifications");
        const storedGroupGifts = await AsyncStorage.getItem("groupGifts");
        const storedUserProfile = await AsyncStorage.getItem("userProfile");
        const storedAccountData = await AsyncStorage.getItem("accountData");
        const storedActivities = await AsyncStorage.getItem("activities");

        if (storedAuth) setIsAuthenticated(JSON.parse(storedAuth));
        if (storedPosts) setPosts(JSON.parse(storedPosts));
        if (storedStories) setStories(JSON.parse(storedStories));
        if (storedReels) setReels(JSON.parse(storedReels));
        if (storedSeenStories) setSeenStoryIds(new Set(JSON.parse(storedSeenStories)));
        if (storedProfileImage) setUserProfileImage(storedProfileImage);
        if (storedBalance) setCurrentBalance(JSON.parse(storedBalance));
        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
        if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
        if (storedGroupGifts) setGroupGifts(JSON.parse(storedGroupGifts));
        if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
        if (storedAccountData) setAccountData(JSON.parse(storedAccountData));
        if (storedActivities) setActivities(JSON.parse(storedActivities));
      } catch (error) {
        console.error("Failed to load activity from storage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Persist data to AsyncStorage
  useEffect(() => {
    if (!isLoaded) return;
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
        await AsyncStorage.setItem("posts", JSON.stringify(posts));
        await AsyncStorage.setItem("stories", JSON.stringify(stories));
        await AsyncStorage.setItem("reels", JSON.stringify(reels));
        await AsyncStorage.setItem("seenStoryIds", JSON.stringify(Array.from(seenStoryIds)));
        await AsyncStorage.setItem("userProfileImage", userProfileImage);
        await AsyncStorage.setItem("currentBalance", JSON.stringify(currentBalance));
        await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
        await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
        await AsyncStorage.setItem("groupGifts", JSON.stringify(groupGifts));
        await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));
        await AsyncStorage.setItem("accountData", JSON.stringify(accountData));
        await AsyncStorage.setItem("activities", JSON.stringify(activities));
      } catch (error) {
        console.error("Failed to save activity to storage:", error);
      }
    };

    saveData();
  }, [isAuthenticated, posts, stories, reels, seenStoryIds, userProfileImage, currentBalance, transactions, notifications, groupGifts, userProfile, accountData, activities, isLoaded]);

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

  const handleLogin = (userData: { name: string; email: string; birthday: string }) => {
    setUserProfile(prev => ({
      ...prev,
      name: userData.name,
      username: `@${userData.name.toLowerCase().replace(/\s+/g, '_')}`,
      birthday: userData.birthday, // We add birthday to the profile object
    }));
    setAccountData(prev => ({
      ...prev,
      email: userData.email,
    }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleWish = (celebrantName: string) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      text: `Sent a birthday wish to ${celebrantName}`,
      time: "Just now",
      type: "social",
      iconName: "Heart",
      color: "#ec4899",
      bg: "#fdf2f8"
    };
    setActivities([newActivity, ...activities]);
    
    const newNotif: Notification = {
      id: Date.now().toString(),
      type: 'wish',
      user: celebrantName,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      message: `responded to your wish: "Thank you so much! 💖"`,
      time: "Just now",
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
    
    if (Platform.OS === 'web') {
      // Use a custom UI instead of alert if possible, but alert is fine for now
    }
  };

  const handleGiftPurchase = (giftName: string, price: number, celebrantName: string) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      text: `Sent ${giftName} to ${celebrantName}`,
      time: "Just now",
      type: "gift",
      iconName: "Package",
      color: "#f59e0b",
      bg: "#fef3c7"
    };
    setActivities([newActivity, ...activities]);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "gift_received", // From user's perspective it's a purchase/send, but we track it
      amount: price,
      date: "Just now",
      senderName: celebrantName,
      status: "completed"
    };
    setTransactions([newTransaction, ...transactions]);
    setCurrentBalance(prev => Math.max(0, prev - price));

    const newNotif: Notification = {
      id: Date.now().toString(),
      type: 'gift',
      user: celebrantName,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      message: `received your ${giftName} and is so happy! 🎁`,
      time: "Just now",
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const navigateTo = (screen: string, id?: string, mode?: 'post' | 'video', url?: string, title?: string) => {
    // If the destination is one of the main tabs, switch the tab instead of showing a view
    const mainTabs = ["home", "calendar", "video", "gift_shop", "profile"];
    if (mainTabs.includes(screen)) {
      handleTabChange(screen);
      return;
    }

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
    if (!isLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }

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
    if (view === "gift_shop") return (
      <GiftShopScreen 
        onBack={() => setView(null)} 
        onNavigate={navigateTo} 
        searchQuery={searchQuery} 
        onBuyGift={handleGiftPurchase}
      />
    );
    if (view === "wallet") return (
      <WalletScreen 
        balance={currentBalance} 
        transactions={transactions}
        setBalance={setCurrentBalance}
        setTransactions={setTransactions}
        onBack={() => setView(null)} 
      />
    );
    if (view === "notifications") return (
      <NotificationScreen 
        notifications={notifications} 
        setNotifications={setNotifications}
        onBack={() => setView(null)} 
      />
    );
    if (view === "group_gifts") return (
      <GroupGiftScreen 
        pools={groupGifts} 
        setPools={setGroupGifts} 
        onBack={() => setView(null)} 
      />
    );
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
      onToggleBookmark: handleToggleBookmark,
      onWish: handleWish
    };

    const filteredPosts = posts.filter(post => 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorHandle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isAuthenticated) {
      return <AuthScreen onLogin={handleLogin} />;
    }

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
        return (
          <GiftShopScreen 
            onBack={() => handleTabChange("home")} 
            onNavigate={navigateTo} 
            searchQuery={searchQuery} 
            onBuyGift={handleGiftPurchase}
          />
        );
      case "video":
        return <VideoScreen reels={reels} userProfileImage={userProfileImage} onBack={() => setActiveTab("home")} onNavigate={navigateTo} />;
      case "profile":
        return (
          <ProfileScreen 
            searchQuery={searchQuery} 
            userProfileImage={userProfileImage} 
            onUpdateProfileImage={setUserProfileImage} 
            onNavigate={navigateTo}
            profile={userProfile}
            setProfile={setUserProfile}
            accountData={accountData}
            setAccountData={setAccountData}
            activities={activities}
            setActivities={setActivities}
            onLogout={handleLogout}
          />
        );
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


