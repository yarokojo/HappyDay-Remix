import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Platform, RefreshControl, useWindowDimensions } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import Stories from "../components/Stories";
import CelebrantCard from "../components/CelebrantCard";
import GiftShopBanner from "../components/GiftShopBanner";
import UpcomingPanel from "../components/UpcomingPanel";
import { Celebrant, Post, Story, TrendingCeleb } from "../types";
import FeedCard from "../components/FeedCard";
import { LayoutGrid, Sparkles, CalendarRange, PlusCircle, Image as ImageIcon, Cake, Plus, Search, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const TRENDING_CELEBS: TrendingCeleb[] = [
  { id: "tc1", name: "Dwayne Johnson", handle: "@therock", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop", isVerified: true },
  { id: "tc2", name: "Taylor Swift", handle: "@taylorswift", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", isVerified: true },
  { id: "tc3", name: "Zendaya", handle: "@zendaya", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", isVerified: true },
  { id: "tc4", name: "Tom Holland", handle: "@tomholland", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", isVerified: true },
  { id: "tc5", name: "Margot Robbie", handle: "@margorrobbie", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", isVerified: true },
];

const TODAY_CELEBRANTS: Celebrant[] = [
  { id: "1", name: "Julia Mason", age: 24, date: "Today", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
  { id: "2", name: "Kevin Hart", age: 30, date: "Today", imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop" },
  { id: "3", name: "Samantha Lee", age: 21, date: "Today", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
];

interface HomeScreenProps {
  onNavigate: (screen: string, id?: string, mode?: 'post' | 'video', url?: string, title?: string) => void;
  posts: Post[];
  stories: Story[];
  seenStoryIds: Set<string>;
  onSeenStory: (id: string) => void;
  onAddStory: (imageUrl: string, contentUrl: string, isVideo?: boolean) => void;
  onEditPost: (
    id: string, 
    content: string, 
    image?: string, 
    video?: string, 
    location?: string,
    celebrationType?: 'birthday' | 'anniversary' | 'party' | 'general',
    celebrantName?: string,
    feeling?: string
  ) => void;
  onLikePost: (id: string) => void;
  onEditComment: (postId: string, commentId: string, content: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onToggleFollow: (authorHandle: string) => void;
  onRepost: (postId: string) => void;
  onToggleBookmark: (postId: string) => void;
  userProfileImage: string;
}

export default function HomeScreen({ 
  onNavigate, 
  posts, 
  stories,
  seenStoryIds,
  onSeenStory,
  onAddStory,
  onEditPost, 
  onLikePost, 
  onEditComment,
  onAddComment,
  onDeletePost,
  onDeleteComment,
  onToggleFollow,
  onRepost,
  onToggleBookmark,
  userProfileImage
}: HomeScreenProps) {
  const { theme, darkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  const scrollRef = React.useRef<ScrollView>(null);
  const [activeTopTab, setActiveTopTab] = useState("feeds");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedSearchQuery, setFeedSearchQuery] = useState("");
  const [celebrants, setCelebrants] = useState<Celebrant[]>([
    { id: "1", name: "Julia Mason", age: 24, date: "Today", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
    { id: "2", name: "Kevin Hart", age: 30, date: "Today", imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop" },
    { id: "3", name: "Samantha Lee", age: 21, date: "Today", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" },
  ]);
  
  const prevPostsCount = React.useRef(posts.length);

  React.useEffect(() => {
    if (posts.length > prevPostsCount.current) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    prevPostsCount.current = posts.length;
  }, [posts.length]);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate adding a new celebrant
      const newCeleb = { id: Date.now().toString(), name: "Surprise Celeb", age: 25, date: "Today", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop" };
      setCelebrants(prev => [newCeleb, ...prev]);
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const tabs = [
    { id: "feeds", label: "Feeds", icon: LayoutGrid },
    { id: "today", label: "Today", icon: Sparkles },
    { id: "upcoming", label: "Upcoming", icon: CalendarRange },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.mainWrapper}>
        <ScrollView 
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={styles.feedScroll}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
          }
        >
          <View style={[styles.contentLayout, (isLargeScreen || isTablet) && styles.contentLayoutRow]}>
            {/* Center Content (Feed) */}
            <View style={[styles.centerColumn, (isLargeScreen || isTablet) && { flex: 1.5 }]}>
              <Stories 
                stories={stories} 
                seenStoryIds={seenStoryIds} 
                onSeenStory={onSeenStory} 
                onAddStory={onAddStory}
                userProfileImage={userProfileImage}
              />
              
              {/* Top Tabs */}
              <View style={[styles.tabBar, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTopTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveTopTab(tab.id)}
                      style={styles.tabItem}
                    >
                      <Icon size={20} color={isActive ? theme.primary : theme.subText} />
                      <Text style={[styles.tabLabel, { color: isActive ? theme.primary : theme.subText }]}>{tab.label}</Text>
                      {isActive && (
                        <MotiView 
                          style={[styles.tabUnderline, { backgroundColor: theme.primary }]}
                          from={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <AnimatePresence>
                {activeTopTab === "feeds" && (
                  <MotiView
                    key="feeds"
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -10 }}
                    style={styles.screenPadding}
                  >
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Celebrations</Text>
                      <MotiView 
                        from={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, duration: 1500, type: 'timing' }}
                        style={[styles.liveBadge, { backgroundColor: darkMode ? theme.itemBg : '#fef3c7' }]}
                      >
                        <Text style={[styles.liveText, { color: darkMode ? theme.accent : '#d97706' }]}>LIVE</Text>
                      </MotiView>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.celebrantsScroll}>
                      {celebrants.map((celebrant) => (
                        <CelebrantCard 
                          key={celebrant.id} 
                          celebrant={celebrant} 
                          onGiftClick={() => onNavigate('gift_shop')} 
                          onWishClick={() => onNavigate('post')}
                        />
                      ))}
                    </ScrollView>

                    <GiftShopBanner />

                    {/* Feed Search Bar */}
                    <View style={[styles.feedSearchWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <View style={[styles.feedSearchInner, { backgroundColor: theme.itemBg }]}>
                        <Search size={18} color={theme.subText} />
                        <TextInput
                          style={[styles.feedSearchInput, { color: theme.text }]}
                          placeholder="Search in your feed..."
                          placeholderTextColor={theme.subText}
                          value={feedSearchQuery}
                          onChangeText={setFeedSearchQuery}
                        />
                      </View>
                    </View>

                    {/* Trending Celebs */}
                    <View style={styles.trendingContainer}>
                      <View style={styles.sectionHeader}>
                        <Text style={[styles.trendingTitle, { color: theme.subText }]}>Trending Celebs</Text>
                        <TouchableOpacity>
                          <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.celebsScroll}>
                        {TRENDING_CELEBS.map((celeb) => (
                          <TouchableOpacity 
                            key={celeb.id} 
                            style={[styles.celebCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                            onPress={() => onNavigate('profile', celeb.id)}
                          >
                            <Image source={{ uri: celeb.imageUrl }} style={styles.celebAvatar} />
                            <View style={styles.celebInfo}>
                              <View style={styles.celebNameRow}>
                                <Text style={[styles.celebName, { color: theme.text }]} numberOfLines={1}>{celeb.name}</Text>
                                {celeb.isVerified && <CheckCircle2 size={12} color={theme.primary} fill={theme.primary === '#4f46e5' ? '#fff' : theme.primary} />}
                              </View>
                              <Text style={[styles.celebHandle, { color: theme.subText }]}>{celeb.handle}</Text>
                            </View>
                            <TouchableOpacity style={[styles.followBtnSmall, { backgroundColor: theme.primary }]}>
                              <Text style={styles.followBtnTextSmall}>Follow</Text>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Create Post */}
                    <View style={[styles.createPostContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <TouchableOpacity onPress={() => onNavigate('profile')}>
                        <Image 
                          source={{ uri: userProfileImage }} 
                          style={[styles.myAvatar, { backgroundColor: theme.itemBg }]} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => onNavigate('post')}
                        style={[styles.postInputPlaceholder, { backgroundColor: theme.itemBg }]}
                      >
                        <Text style={[styles.placeholderText, { color: theme.subText }]}>What's the celebration? 🎉</Text>
                      </TouchableOpacity>
                      <View style={styles.inputActions}>
                        <TouchableOpacity 
                          style={[styles.inputAction, { backgroundColor: darkMode ? theme.itemBg : '#f5f3ff' }]}
                          onPress={() => onNavigate('post', undefined, 'post')}
                        >
                          <PlusCircle size={22} color={theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.inputAction, { backgroundColor: darkMode ? theme.itemBg : '#f0fdf4' }]}
                          onPress={() => onNavigate('post', undefined, 'post')} // Assuming image selection starts in post screen
                        >
                          <ImageIcon size={22} color="#10b981" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Feed List */}
                    <View style={styles.feedList}>
                      {posts.filter(p => 
                        p.content.toLowerCase().includes(feedSearchQuery.toLowerCase()) ||
                        p.authorName.toLowerCase().includes(feedSearchQuery.toLowerCase())
                      ).length === 0 ? (
                        <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Search size={48} color={theme.subText} strokeWidth={1.5} />
                          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Posts Found</Text>
                          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>Try searching for something else or check back later.</Text>
                        </View>
                      ) : (
                        posts.filter(p => 
                          p.content.toLowerCase().includes(feedSearchQuery.toLowerCase()) ||
                          p.authorName.toLowerCase().includes(feedSearchQuery.toLowerCase())
                        ).map((post) => (
                          <FeedCard 
                            key={post.id} 
                            post={post} 
                            userProfileImage={userProfileImage}
                            onEdit={onEditPost} 
                            onLike={() => onLikePost(post.id)} 
                            onEditComment={onEditComment}
                            onAddComment={(content) => onAddComment(post.id, content)}
                            onDelete={() => onDeletePost(post.id)}
                            onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
                            onToggleFollow={() => onToggleFollow(post.authorHandle)}
                            onSelect={() => onNavigate('post_detail', post.id)}
                            onRepost={() => onRepost(post.id)}
                            onToggleBookmark={() => onToggleBookmark(post.id)}
                            onNavigate={onNavigate}
                          />
                        ))
                      )}
                    </View>

                    {!(isLargeScreen || isTablet) && <UpcomingPanel onNavigate={onNavigate} />}
                  </MotiView>
                )}

                {activeTopTab === "today" && (
                  <MotiView
                    key="today"
                    from={{ opacity: 0, translateX: 20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: -20 }}
                    style={styles.centerSection}
                  >
                    <View style={[styles.featuredCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Image 
                        source={{ uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" }} 
                        style={[styles.featuredImage, { borderColor: theme.card }]}
                      />
                      <Text style={[styles.featuredTitle, { color: theme.text }]}>Julie's 24th Birthday</Text>
                      <Text style={[styles.featuredSubtitle, { color: theme.subText }]}>Celebrating Today • Manhattan, NY</Text>
                      
                      <View style={styles.statsRow}>
                        <View style={[styles.statBox, { backgroundColor: theme.itemBg }]}>
                          <Text style={[styles.statLabel, { color: theme.subText }]}>GUESTS</Text>
                          <Text style={[styles.statValue, { color: theme.primary }]}>42</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: theme.itemBg }]}>
                          <Text style={[styles.statLabel, { color: theme.subText }]}>WISHES</Text>
                          <Text style={[styles.statValue, { color: theme.primary }]}>128</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: theme.itemBg }]}>
                          <Text style={[styles.statLabel, { color: theme.subText }]}>GIFTS</Text>
                          <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
                        </View>
                      </View>

                      <TouchableOpacity 
                         onPress={() => onNavigate('group_gifts')}
                         style={[styles.groupGiftBanner, { backgroundColor: darkMode ? theme.itemBg : '#eef2ff', borderColor: darkMode ? theme.border : '#e0e7ff' }]}
                      >
                        <View style={styles.groupGiftLeft}>
                          <View style={[styles.groupGiftIcon, { backgroundColor: theme.card }]}>
                            <Cake size={20} color={theme.primary} />
                          </View>
                          <View>
                            <Text style={[styles.groupGiftLabel, { color: theme.secondary }]}>GROUP CAKE</Text>
                            <Text style={[styles.groupGiftAmount, { color: darkMode ? theme.text : '#312e81' }]}>$85 raised of $150</Text>
                          </View>
                        </View>
                        <Plus size={20} color={theme.subText} />
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={() => onNavigate('video')}
                        style={[styles.virtualButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                      >
                        <Text style={styles.virtualButtonText}>Join Virtual Celebration</Text>
                      </TouchableOpacity>
                    </View>
                  </MotiView>
                )}

                {activeTopTab === "upcoming" && (
                  <MotiView
                    key="upcoming"
                    from={{ opacity: 0, translateX: 20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: -20 }}
                    style={styles.screenPadding}
                  >
                    <UpcomingPanel onNavigate={onNavigate} />
                    <View style={styles.nextMonthContainer}>
                      <Text style={[styles.nextMonthTitle, { color: theme.text }]}>Next Month</Text>
                      <View style={[styles.emptyEventRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={[styles.emptyAvatar, { backgroundColor: theme.itemBg }]} />
                        <Text style={[styles.emptyText, { color: theme.subText }]}>Loading more events...</Text>
                      </View>
                    </View>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>

            {/* Right Sidebar (Web/Tablet only) */}
            {(isLargeScreen || isTablet) && (
              <View style={styles.rightColumn}>
                <UpcomingPanel onNavigate={onNavigate} />
                <View style={[styles.webBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={[styles.webBannerTitle, { color: theme.text }]}>Premium Events</Text>
                  <Text style={[styles.webBannerDesc, { color: theme.subText }]}>Upgrade to host unlimited virtual parties with HD streaming.</Text>
                  <TouchableOpacity style={[styles.webBannerBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.webBannerBtnText}>UPGRADE NOW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  feedScroll: {
    flex: 1,
  },
  contentLayout: {
    flex: 1,
  },
  contentLayoutRow: {
    flexDirection: 'row',
    paddingHorizontal: 0, // Reset padding for row layout
  },
  centerColumn: {
    flex: 1,
    maxWidth: '100%',
  },
  rightColumn: {
    width: 320,
    padding: 24,
    gap: 24,
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
    backgroundColor: 'transparent',
    display: Platform.OS === 'web' ? 'flex' : 'flex', // Only reachable via isLargeScreen/isTablet
  },
  webBanner: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  webBannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  webBannerDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  webBannerBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  webBannerBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '60%',
    borderRadius: 2,
  },
  screenPadding: {
    padding: 24,
    gap: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
  },
  celebrantsScroll: {
    gap: 16,
    paddingBottom: 4,
  },
  trendingContainer: {
    gap: 12,
  },
  trendingTitle: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagsScroll: {
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  createPostContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInputPlaceholder: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputActions: {
    flexDirection: 'row',
    gap: 4,
  },
  inputAction: {
    padding: 8,
  },
  feedList: {
    gap: 24,
  },
  centerSection: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  featuredCard: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  featuredImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  featuredSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  groupGiftBanner: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupGiftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupGiftIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupGiftLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  groupGiftAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  virtualButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  virtualButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  nextMonthContainer: {
    marginTop: 24,
    gap: 16,
  },
  feedSearchWrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  feedSearchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    gap: 12,
  },
  feedSearchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  celebsScroll: {
    gap: 12,
    paddingRight: 24,
  },
  celebCard: {
    width: 140,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  celebAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 4,
  },
  celebInfo: {
    alignItems: 'center',
    width: '100%',
  },
  celebNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  celebName: {
    fontSize: 13,
    fontWeight: '800',
  },
  celebHandle: {
    fontSize: 11,
    fontWeight: '600',
  },
  followBtnSmall: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  followBtnTextSmall: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  nextMonthTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  emptyEventRow: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.6,
  },
  emptyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

