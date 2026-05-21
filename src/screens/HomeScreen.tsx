import React, { useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Platform, RefreshControl, useWindowDimensions, Pressable } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import Stories from "../components/Stories";
import CelebrantCard from "../components/CelebrantCard";
import GiftShopBanner from "../components/GiftShopBanner";
import UpcomingPanel from "../components/UpcomingPanel";
import { Celebrant, Post, Story, TrendingCeleb } from "../types";
import FeedCard from "../components/FeedCard";
import { LayoutGrid, Sparkles, CalendarRange, PlusCircle, Image as ImageIcon, Cake, Plus, Search, CheckCircle2, X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const TRENDING_CELEBS: TrendingCeleb[] = [
  { id: "tc1", name: "Dwayne Johnson", handle: "@therock", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop", isVerified: true },
  { id: "tc2", name: "Taylor Swift", handle: "@taylorswift", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", isVerified: true },
  { id: "tc3", name: "Zendaya", handle: "@zendaya", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop", isVerified: true },
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
  onIncrementViews: (postId: string) => void;
  userProfileImage: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  onIncrementViews,
  userProfileImage,
  searchQuery,
  onSearchChange
}: HomeScreenProps) {
  const { theme, darkMode } = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  
  const scrollRef = React.useRef<ScrollView>(null);
  const [activeTopTab, setActiveTopTab] = useState("feeds");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [internalCelebrants, setInternalCelebrants] = useState<Celebrant[]>(TODAY_CELEBRANTS);

  const displayCelebrants = useMemo(() => {
    if (!user?.birthDate) return internalCelebrants;

    const today = new Date();
    const birthDate = new Date(user.birthDate);
    
    const isBirthday = today.getMonth() === birthDate.getMonth() && 
                      today.getDate() === birthDate.getDate();

    if (isBirthday) {
      const age = today.getFullYear() - birthDate.getFullYear();
      const userCelebrant: Celebrant = {
        id: 'me',
        name: 'You',
        age: age,
        date: 'Today',
        imageUrl: userProfileImage
      };
      
      // Check if already in list to avoid duplicates
      if (!internalCelebrants.some(c => c.id === 'me')) {
        return [userCelebrant, ...internalCelebrants];
      }
    }

    return internalCelebrants;
  }, [user, internalCelebrants, userProfileImage]);
  
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
      setInternalCelebrants(prev => [newCeleb, ...prev]);
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
        <View style={[styles.contentLayout, (isLargeScreen || isTablet) && styles.contentLayoutRow]}>
          {/* Center Column */}
          <View style={[styles.centerColumn, (isLargeScreen || isTablet) && { flex: 1.5 }]}>
            <Stories 
              stories={stories} 
              seenStoryIds={seenStoryIds} 
              onSeenStory={onSeenStory} 
              onAddStory={onAddStory}
              userProfileImage={userProfileImage}
            />
            
            {/* Top Tabs (Static) */}
            <View style={[styles.tabBar, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTopTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => {
                      setActiveTopTab(tab.id);
                    }}
                    style={({ pressed }) => [
                      styles.tabItem,
                      { opacity: pressed ? 0.7 : 1 }
                    ]}
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
                  </Pressable>
                );
              })}
            </View>

            {/* Scrollable Content */}
            <ScrollView 
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              style={styles.feedScroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
              }
            >
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
                      <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => onNavigate('video')}
                        style={styles.liveContainer}
                      >
                        <MotiView 
                          from={{ opacity: 0.6, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ loop: true, duration: 2000, type: 'timing' }}
                          style={[styles.liveBadge, { backgroundColor: darkMode ? theme.itemBg : '#fef2f2', borderColor: '#fee2e2', borderWidth: 1 }]}
                        >
                          <View style={styles.liveIndicatorRow}>
                            <MotiView 
                              from={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1.2, opacity: 1 }}
                              transition={{ loop: true, duration: 1000, type: 'timing' }}
                              style={styles.redDot} 
                            />
                            <Text style={[styles.liveText, { color: '#ef4444' }]}>LIVE</Text>
                          </View>
                        </MotiView>
                        <Text style={[styles.watchingCount, { color: theme.subText }]}>2.4k watching</Text>
                      </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.celebrantsScroll}>
                      {displayCelebrants.map((celebrant) => (
                        <CelebrantCard 
                          key={celebrant.id} 
                          celebrant={celebrant} 
                          onGiftClick={() => onNavigate('gift_shop')} 
                          onWishClick={() => onNavigate('post')}
                        />
                      ))}
                    </ScrollView>

                    <GiftShopBanner onPress={() => onNavigate('gift_shop')} />

                    {/* Feed Search Bar */}
                    <View style={[styles.feedSearchWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <View style={[styles.feedSearchInner, { backgroundColor: theme.itemBg }]}>
                        <Search size={18} color={theme.subText} />
                        <TextInput
                          style={[styles.feedSearchInput, { color: theme.text }]}
                          placeholder="Search in your feed..."
                          placeholderTextColor={theme.subText}
                          value={searchQuery}
                          onChangeText={onSearchChange}
                        />
                        {searchQuery.length > 0 && (
                          <TouchableOpacity onPress={() => onSearchChange("")}>
                            <X size={16} color={theme.subText} />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {/* Filter Chips */}
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={styles.filterChipsContainer}
                      >
                        {[
                          { id: 'all', label: 'All Feeds' },
                          { id: 'birthday', label: 'Birthdays' },
                          { id: 'media', label: 'Media' },
                          { id: 'wishes', label: 'Wishes Only' }
                        ].map((cat) => {
                          const isActive = selectedCategory === cat.id;
                          return (
                            <TouchableOpacity
                              key={cat.id}
                              onPress={() => {
                                setSelectedCategory(cat.id);
                              }}
                              style={[
                                styles.filterChip,
                                { backgroundColor: isActive ? theme.primary : theme.itemBg, borderColor: theme.border },
                                !isActive && { borderWidth: 1 }
                              ]}
                            >
                              <Text style={[styles.filterChipText, { color: isActive ? '#fff' : theme.subText }]}>{cat.label}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
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
                      {posts.filter(p => {
                        const content = p.content?.toLowerCase() || "";
                        const authorName = p.authorName?.toLowerCase() || "";
                        const authorHandle = p.authorHandle?.toLowerCase() || "";
                        const query = searchQuery.toLowerCase();
                        
                        const matchesSearch = content.includes(query) || 
                          authorName.includes(query) || 
                          authorHandle.includes(query);
                        
                        if (!matchesSearch) return false;
                        
                        if (selectedCategory === 'birthday') return p.celebrationType === 'birthday';
                        if (selectedCategory === 'media') return !!(p.image || p.video);
                        if (selectedCategory === 'wishes') return p.celebrationType === 'birthday' || p.celebrationType === 'anniversary';
                        
                        return true;
                      }).length === 0 ? (
                        <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                          <Search size={48} color={theme.subText} strokeWidth={1.5} />
                          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Posts Found</Text>
                          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>Try searching for something else or change your filters.</Text>
                        </View>
                      ) : (
                        posts.filter(p => {
                          const content = p.content?.toLowerCase() || "";
                          const authorName = p.authorName?.toLowerCase() || "";
                          const authorHandle = p.authorHandle?.toLowerCase() || "";
                          const query = searchQuery.toLowerCase();
                          
                          const matchesSearch = content.includes(query) || 
                            authorName.includes(query) || 
                            authorHandle.includes(query);
                          
                          if (!matchesSearch) return false;
                          
                          if (selectedCategory === 'birthday') return p.celebrationType === 'birthday';
                          if (selectedCategory === 'media') return !!(p.image || p.video);
                          if (selectedCategory === 'wishes') return p.celebrationType === 'birthday' || p.celebrationType === 'anniversary';
                          
                          return true;
                        }).map((post) => (
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
                            onIncrementViews={() => onIncrementViews(post.id)}
                            onNavigate={onNavigate}
                          />
                        ))
                      )}
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
            </ScrollView>
          </View>

          {/* Right Sidebar (Web/Tablet only) - Fixed or scrolls independently */}
          {(isLargeScreen || isTablet) && (
            <View style={styles.rightColumn}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.rightColumnInternal}>
                  <View style={[styles.webBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.webBannerTitle, { color: theme.text }]}>Premium Events</Text>
                    <Text style={[styles.webBannerDesc, { color: theme.subText }]}>Upgrade to host unlimited virtual parties with HD streaming.</Text>
                    <TouchableOpacity style={[styles.webBannerBtn, { backgroundColor: theme.primary }]}>
                      <Text style={styles.webBannerBtnText}>UPGRADE NOW</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
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
    paddingHorizontal: 0,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  centerColumn: {
    flex: 2,
    maxWidth: 700,
    height: '100%',
  },
  rightColumn: {
    width: 350,
    padding: 24,
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
    backgroundColor: 'transparent',
    display: Platform.OS === 'web' ? 'flex' : 'flex',
  },
  rightColumnInternal: {
    gap: 24,
  },
  scrollContent: {
    paddingBottom: 100, // Add space at bottom for better scrolling
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
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  watchingCount: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
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
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  feedSearchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    gap: 12,
  },
  filterChipsContainer: {
    gap: 8,
    paddingTop: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '800',
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

