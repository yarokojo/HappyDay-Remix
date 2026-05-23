import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Platform, RefreshControl, useWindowDimensions } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import Stories from "../components/Stories";
import CelebrantCard from "../components/CelebrantCard";
import UpcomingPanel from "../components/UpcomingPanel";
import { Celebrant, Post, Story } from "../types";
import FeedCard from "../components/FeedCard";
import { LayoutGrid, Sparkles, CalendarRange, PlusCircle, Image as ImageIcon, Cake, Plus, Search, TrendingUp, Heart, MessageCircle, Gift, Trophy, Star } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

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
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "today", label: "Today", icon: Sparkles },
    { id: "upcoming", label: "Upcoming", icon: CalendarRange },
  ];

  const trendingItems = [
    { id: '1', title: 'Julia\'s 24th', score: '2.4k wishes', type: 'birthday', image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?w=400' },
    { id: '2', title: 'Golden Cake', score: '850 sends', type: 'gift', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400' },
    { id: '3', title: 'Summer Party', score: '1.2k likes', type: 'reels', image: 'https://images.unsplash.com/photo-1530103578275-21127a7c569a?w=400' },
    { id: '4', title: 'David\'s Grad', score: '560 gifts', type: 'graduation', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.mainWrapper}>
        <ScrollView 
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={styles.feedScroll}
          contentContainerStyle={{ paddingBottom: 100 }}
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

                     {/* Trending */}
                    <View style={styles.trendingContainer}>
                      <Text style={[styles.trendingTitle, { color: theme.subText }]}>Trending Celebs</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                        {['#Julia24th', '#SweetSixteen', '#GoldenJubilee', '#SurpriseParty'].map((tag, i) => (
                          <TouchableOpacity key={i} style={[styles.tag, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Create Post */}
                    <View style={[styles.createPostContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Image 
                        source={{ uri: userProfileImage }} 
                        style={[styles.myAvatar, { backgroundColor: theme.itemBg }]} 
                      />
                      <TouchableOpacity 
                        onPress={() => onNavigate('post')}
                        style={[styles.postInputPlaceholder, { backgroundColor: theme.itemBg }]}
                      >
                        <Text style={[styles.placeholderText, { color: theme.subText }]}>Share a celebration...</Text>
                      </TouchableOpacity>
                      <View style={styles.inputActions}>
                        <TouchableOpacity style={styles.inputAction}>
                          <PlusCircle size={20} color={theme.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputAction}>
                          <ImageIcon size={20} color={theme.secondary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Feed List */}
                    <View style={styles.feedList}>
                      {posts.length === 0 ? (
                        <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Search size={48} color={theme.subText} strokeWidth={1.5} />
                          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Posts Found</Text>
                          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>Try searching for something else or check back later.</Text>
                        </View>
                      ) : (
                        posts.map((post) => (
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
                          />
                        ))
                      )}
                    </View>
                  </MotiView>
                )}

                {activeTopTab === "trending" && (
                  <MotiView
                    key="trending"
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -10 }}
                    style={styles.screenPadding}
                  >
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: theme.text }]}>What's Trending</Text>
                      <View style={[styles.liveBadge, { backgroundColor: theme.primary + '15' }]}>
                        <TrendingUp size={12} color={theme.primary} />
                        <Text style={[styles.liveText, { color: theme.primary, marginLeft: 4 }]}>HOT</Text>
                      </View>
                    </View>

                    {/* Trending Hashtags Section */}
                    <View style={styles.trendingContainer}>
                      <Text style={[styles.trendingTitle, { color: theme.subText }]}>Popular Topics</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                        {['#Julia24th', '#SweetSixteen', '#GoldenJubilee', '#SurpriseParty', '#WeddingVibes', '#Graduation2026'].map((tag, i) => (
                          <TouchableOpacity key={i} style={[styles.tag, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Trending Grid */}
                    <View style={styles.trendingGrid}>
                      {trendingItems.map((item, index) => (
                        <TouchableOpacity 
                          key={item.id} 
                          style={[styles.trendingItemCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                          onPress={() => item.type === 'gift' ? onNavigate('gift_shop') : (item.type === 'reels' ? onNavigate('video') : onNavigate('post_detail', 'p1'))}
                        >
                          <Image source={{ uri: item.image }} style={styles.trendingItemImage} />
                          <View style={styles.trendingItemInfo}>
                            <View style={styles.trendingItemHeader}>
                              <Text style={[styles.trendingItemTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                              <View style={[styles.rankBadge, { backgroundColor: index === 0 ? '#fbbf24' : (index === 1 ? '#94a3b8' : '#d97706') }]}>
                                <Text style={styles.rankText}>{index + 1}</Text>
                              </View>
                            </View>
                            <View style={styles.trendingItemMeta}>
                              <View style={styles.trendingItemStat}>
                                {item.type === 'gift' ? <Gift size={12} color={theme.subText} /> : (item.type === 'reels' ? <MessageCircle size={12} color={theme.subText} /> : <Heart size={12} color={theme.subText} />)}
                                <Text style={[styles.trendingItemScore, { color: theme.subText }]}>{item.score}</Text>
                              </View>
                              <View style={[styles.trendingTypeTag, { backgroundColor: theme.itemBg }]}>
                                <Text style={[styles.trendingTypeText, { color: theme.primary }]}>{item.type.toUpperCase()}</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={[styles.celebrationLeaderboard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <View style={styles.leaderboardHeader}>
                        <Trophy size={20} color="#fbbf24" />
                        <Text style={[styles.leaderboardTitle, { color: theme.text }]}>Celebration Leaderboard</Text>
                      </View>
                      
                      {[
                        { name: 'Sarah Jenkins', points: 4500, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
                        { name: 'Marcus Chen', points: 3800, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
                        { name: 'Elena Rodriguez', points: 3200, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                      ].map((winner, idx) => (
                        <View key={idx} style={[styles.leaderboardRow, { borderBottomColor: theme.border }]}>
                          <View style={styles.leaderboardUser}>
                            <Image source={{ uri: winner.avatar }} style={styles.leaderboardAvatar} />
                            <Text style={[styles.leaderboardName, { color: theme.text }]}>{winner.name}</Text>
                          </View>
                          <View style={styles.leaderboardPoints}>
                            <Star size={12} color="#fbbf24" fill="#fbbf24" />
                            <Text style={[styles.pointsText, { color: theme.primary }]}>{winner.points}</Text>
                          </View>
                        </View>
                      ))}
                    </View>

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
                        <TouchableOpacity 
                          onPress={() => onNavigate('gift_shop')}
                          style={[styles.statBox, { backgroundColor: theme.itemBg }]}
                        >
                          <Text style={[styles.statLabel, { color: theme.subText }]}>GIFTS</Text>
                          <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
                        </TouchableOpacity>
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
                    <UpcomingPanel />
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
                <UpcomingPanel />
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
    padding: 16, // More standard mobile padding
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
    paddingBottom: 40,
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
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  trendingItemCard: {
    width: '47%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingItemImage: {
    width: '100%',
    height: 120,
  },
  trendingItemInfo: {
    padding: 12,
    gap: 8,
  },
  trendingItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingItemTitle: {
    fontSize: 13,
    fontWeight: '900',
    flex: 1,
  },
  rankBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  trendingItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingItemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingItemScore: {
    fontSize: 10,
    fontWeight: '700',
  },
  trendingTypeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendingTypeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  celebrationLeaderboard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    marginTop: 8,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  leaderboardTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leaderboardUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderboardAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: '700',
  },
  leaderboardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '900',
  },
});

