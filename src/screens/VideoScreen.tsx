import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Platform, useWindowDimensions } from "react-native";
import { Heart, MessageCircle, Share2, Music, Gift as GiftIcon, ArrowLeft, Volume2, VolumeX, Camera, PartyPopper, Sparkles, Plus, Check, Cake } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { BlurView } from "expo-blur";
import { Video, ResizeMode } from "expo-av";
import { ReelItem } from "../types";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get('window');

const VIRTUAL_GIFTS = [
  { id: 'cake', icon: '🎂', label: 'Cake', price: '₵5' },
  { id: 'balloon', icon: '🎈', label: 'Balloon', price: '₵1' },
  { id: 'party', icon: '🎉', label: 'Popper', price: '₵2' },
  { id: 'spark', icon: '✨', label: 'Magic', price: '₵10' },
];

interface Wish {
  id: string;
  text: string;
  user: string;
}

export default function VideoScreen({ reels = [], userProfileImage, onBack, onNavigate }: { reels?: ReelItem[], userProfileImage: string, onBack?: () => void, onNavigate?: (screen: string, id?: string, mode?: 'post' | 'video') => void }) {
  const { theme } = useTheme();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / screenHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const toggleFollow = (handle: string) => {
    const newFollows = new Set(followedUsers);
    if (newFollows.has(handle)) {
      newFollows.delete(handle);
    } else {
      newFollows.add(handle);
    }
    setFollowedUsers(newFollows);
  };
  const [showGifts, setShowGifts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    const texts = ["Happy Birthday! 🎂", "Looking sharp! ✨", "Enjoy! 🍰", "Turn up! 🥂", "Best vibes! 🎊"];
    const interval = setInterval(() => {
      const newWish = {
        id: Math.random().toString(),
        text: texts[Math.floor(Math.random() * texts.length)],
        user: ["@alex", "@sam", "@maya", "@john", "@lisa"][Math.floor(Math.random() * 5)]
      };
      setWishes(prev => [newWish, ...prev].slice(0, 5));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const [lastTap, setLastTap] = useState<number | null>(null);
  const [showHeart, setShowHeart] = useState<{ id: string, x: number, y: number } | null>(null);

  const handleDoubleTap = (videoId: string, event: any) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      toggleLike(videoId);
      setShowHeart({ id: Math.random().toString(), x: event.nativeEvent.locationX - 40, y: event.nativeEvent.locationY - 40 });
      setTimeout(() => setShowHeart(null), 1000);
    } else {
      setLastTap(now);
    }
  };

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedVideos);
    if (newLiked.has(id)) newLiked.delete(id);
    else newLiked.add(id);
    setLikedVideos(newLiked);
  };

  const handleCelebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.scrollView}
      >
        {reels.map((video, index) => (
          <View key={video.id} style={[styles.videoPage, { height: screenHeight, width: screenWidth }]}>
            {/* Video Player */}
            <Video
              source={{ uri: video.videoUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay={index === activeIndex}
              isLooping
              isMuted={muted}
              posterSource={{ uri: video.poster }}
              usePoster
            />
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={(e) => handleDoubleTap(video.id, e)} 
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.gradientOverlay} pointerEvents="none" />

            {/* Double Tap Heart */}
            <AnimatePresence>
              {showHeart && (
                <MotiView
                  key={showHeart.id}
                  from={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0, scale: 2 }}
                  style={[styles.heartOverlay, { left: showHeart.x, top: showHeart.y }]}
                >
                  <Heart size={80} color="#ef4444" fill="#ef4444" />
                </MotiView>
              )}
            </AnimatePresence>

            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.topBarLeft}>
                {onBack && (
                  <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <BlurView intensity={20} tint="dark" style={styles.blurPad}>
                      <ArrowLeft size={20} color="#fff" />
                    </BlurView>
                  </TouchableOpacity>
                )}
                <View style={styles.navTabs}>
                  <Text style={[styles.navTab, styles.navTabActive]}>For You</Text>
                  <Text style={styles.navTab}>Following</Text>
                  <Text style={styles.navTab}>Live</Text>
                </View>
              </View>
              <View style={styles.topBarRight}>
                <TouchableOpacity onPress={() => onNavigate?.('post', undefined, 'video')} style={styles.cameraBtn}>
                  <BlurView intensity={20} tint="dark" style={styles.blurPad}>
                    <Camera size={20} color="#fff" />
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.muteBtn}>
                  <BlurView intensity={20} tint="dark" style={styles.blurPad}>
                    {muted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Birthday Goal Badge */}
            {video.isBirthday && (
              <View style={styles.goalBadgeContainer}>
                <MotiView 
                  animate={{ scale: [1, 1.05, 1] }} 
                  transition={{ loop: true, duration: 4000 }}
                  style={styles.goalBadge}
                >
                   <BlurView intensity={40} tint="dark" style={styles.goalBlur}>
                      <View style={styles.goalHeader}>
                        <Image source={{ uri: video.avatar }} style={styles.goalAvatar} />
                        <View>
                           <Text style={styles.goalSub}>CELEBRATION DAY</Text>
                           <Text style={styles.goalTitle}>Julia's 24th Birthday</Text>
                        </View>
                      </View>
                      <View style={styles.goalProgress}>
                        <View style={styles.goalLabels}>
                           <Text style={[styles.goalLabelText, { color: theme.secondary }]}>Gift Goal</Text>
                           <Text style={styles.goalLabelPct}>65%</Text>
                        </View>
                        <View style={styles.goalBarBg}>
                           <View style={[styles.goalBarFill, { width: '65%', backgroundColor: theme.primary }]} />
                        </View>
                      </View>
                   </BlurView>
                </MotiView>
              </View>
            )}

            {/* Right Sidebar */}
            <View style={styles.sidebar}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => toggleFollow(video.handle)}
                style={styles.authorSection}
              >
                <Image source={{ uri: video.avatar }} style={styles.sidebarAvatar} />
                <MotiView 
                  animate={{ 
                    scale: followedUsers.has(video.handle) ? 1.1 : 1,
                    backgroundColor: followedUsers.has(video.handle) ? "#10b981" : "#ef4444",
                    rotate: followedUsers.has(video.handle) ? '360deg' : '0deg'
                  }}
                  transition={{ type: 'spring', damping: 12 }}
                  style={styles.followBadge}
                >
                  {followedUsers.has(video.handle) ? (
                    <Check size={10} color="#fff" strokeWidth={4} />
                  ) : (
                    <Plus size={10} color="#fff" strokeWidth={4} />
                  )}
                </MotiView>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleLike(video.id)} style={styles.sidebarBtn}>
                <Heart size={28} color={likedVideos.has(video.id) ? "#ef4444" : "#fff"} fill={likedVideos.has(video.id) ? "#ef4444" : "none"} />
                <Text style={styles.sidebarLabel}>{video.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowComments(true)} style={styles.sidebarBtn}>
                <MessageCircle size={28} color="#fff" />
                <Text style={styles.sidebarLabel}>{video.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCelebrate} style={styles.sidebarBtn}>
                <PartyPopper size={28} color="#fbbf24" />
                <Text style={styles.sidebarLabel}>PARTY</Text>
              </TouchableOpacity>

              <View style={styles.giftWrapper}>
                <TouchableOpacity onPress={() => setShowGifts(!showGifts)} style={styles.giftBtn}>
                  <MotiView 
                    animate={{ scale: [1, 1.1, 1], rotate: ['0deg', '5deg', '-5deg', '0deg'] }}
                    transition={{ loop: true, duration: 2000 }}
                    style={[styles.giftCircle, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                  >
                    <GiftIcon size={24} color="#fff" />
                  </MotiView>
                  <Text style={styles.sidebarLabel}>GIFT</Text>
                </TouchableOpacity>

                <AnimatePresence>
                  {showGifts && (
                    <MotiView 
                      from={{ opacity: 0, scale: 0.5, translateX: 50 }}
                      animate={{ opacity: 1, scale: 1, translateX: 0 }}
                      exit={{ opacity: 0, scale: 0.5, translateX: 50 }}
                      style={styles.giftMenu}
                    >
                      <BlurView intensity={60} tint="dark" style={styles.giftMenuBlur}>
                        {VIRTUAL_GIFTS.map((gift) => (
                          <TouchableOpacity 
                            key={gift.id}
                            onPress={() => { setShowGifts(false); handleCelebrate(); }}
                            style={styles.giftMenuItem}
                          >
                            <Text style={styles.giftEmoji}>{gift.icon}</Text>
                            <View>
                              <Text style={styles.giftItemLabel}>{gift.label}</Text>
                              <Text style={[styles.giftItemPrice, { color: theme.secondary }]}>{gift.price}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </BlurView>
                    </MotiView>
                  )}
                </AnimatePresence>
              </View>

              <TouchableOpacity onPress={() => setShowShare(true)} style={styles.sidebarBtn}>
                <Share2 size={28} color="#fff" />
                <Text style={styles.sidebarLabel}>SHARE</Text>
              </TouchableOpacity>
            </View>

            {/* Birthday Floating Cake */}
            {video.isBirthday && index === activeIndex && (
              <MotiView
                from={{ translateY: 20, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ delay: 1000, duration: 1000, type: 'timing' }}
                style={styles.floatingCake}
              >
                <MotiView
                  animate={{ translateY: [-5, 5, -5], rotate: ['-5deg', '5deg', '-5deg'] }}
                  transition={{ loop: true, duration: 3000, type: 'timing' }}
                >
                  <Cake size={40} color="#ec4899" />
                </MotiView>
              </MotiView>
            )}

            {/* Live Wishes */}
            <View style={styles.wishesContainer}>
              <AnimatePresence>
                {wishes.map((wish) => (
                  <MotiView
                    key={wish.id}
                    from={{ opacity: 0, translateX: -20, scale: 0.8 }}
                    animate={{ opacity: 1, translateX: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: -20, scale: 0.5 }}
                    style={styles.wishBubble}
                  >
                     <View style={[styles.wishDot, { backgroundColor: theme.primary }]} />
                     <Text style={styles.wishText}>
                       <Text style={[styles.wishUser, { color: theme.secondary }]}>{wish.user}</Text> {wish.text}
                     </Text>
                  </MotiView>
                ))}
              </AnimatePresence>
            </View>

            {/* Bottom Info */}
            <MotiView 
              key={`info-${video.id}`}
              from={{ opacity: 0, translateY: 30 }}
              animate={{ 
                opacity: index === activeIndex ? 1 : 0, 
                translateY: index === activeIndex ? 0 : 30 
              }}
              transition={{ type: 'spring', damping: 15 }}
              style={styles.bottomInfo}
            >
              <View style={styles.authorRow}>
                <Text style={styles.authorHandle}>{video.handle}</Text>
                {video.isBirthday && (
                  <View style={styles.birthdayTag}>
                    <Text style={styles.birthdayTagText}>BIRTHDAY</Text>
                  </View>
                )}
              </View>
              <Text style={styles.descText} numberOfLines={3}>{video.description}</Text>
              <View style={styles.footerRow}>
                <BlurView intensity={20} tint="dark" style={styles.musicTag}>
                  <Music size={12} color="#fff" />
                  <Text style={styles.musicText}>{video.music}</Text>
                </BlurView>
                <View style={styles.liveTag}>
                   <Sparkles size={12} color="#fbbf24" />
                   <Text style={styles.liveTagText}>LIVE EVENT</Text>
                </View>
              </View>
            </MotiView>

            {/* Album Disk */}
            <MotiView 
              animate={{ rotate: '360deg' }}
              transition={{ loop: true, type: 'timing', duration: 4000 }}
              style={styles.albumDisk}
            >
              <Image source={{ uri: video.avatar }} style={styles.albumAvatar} />
            </MotiView>

            {/* Video Progress Bar */}
            <View style={styles.progressBarContainer}>
               <MotiView 
                 from={{ width: '0%' }}
                 animate={{ width: index === activeIndex ? '100%' : '0%' }}
                 transition={{ type: 'timing', duration: 15000, loop: true }}
                 style={[styles.progressBar, { backgroundColor: theme.primary }]}
               />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Comments Modal */}
      <AnimatePresence>
        {showComments && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              onPress={() => setShowComments(false)} 
            />
            <MotiView
              from={{ translateY: screenHeight }}
              animate={{ translateY: screenHeight * 0.4 }}
              exit={{ translateY: screenHeight }}
              transition={{ type: 'spring', damping: 20 }}
              style={[styles.bottomSheet, { height: screenHeight * 0.6, backgroundColor: theme.bg }]}
            >
              <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>Comments</Text>
                <TouchableOpacity onPress={() => setShowComments(false)}>
                  <Plus size={24} color={theme.subText} style={{ transform: [{ rotate: '45deg' }] }} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.sheetContent}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View key={i} style={styles.commentItem}>
                    <Image 
                      source={{ uri: `https://i.pravatar.cc/100?u=${i}` }} 
                      style={[styles.commentAvatar, { backgroundColor: theme.itemBg }]} 
                    />
                    <View style={styles.commentBody}>
                      <Text style={[styles.commentUser, { color: theme.text }]}>User_{i}</Text>
                      <Text style={[styles.commentText, { color: theme.subText }]}>This celebration looks amazing! Wish I was there! 🎉🎂</Text>
                      <View style={styles.commentFooter}>
                        <Text style={[styles.commentTime, { color: theme.subText }]}>2h ago</Text>
                        <Text style={[styles.commentReply, { color: theme.primary }]}>Reply</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.commentLike}>
                      <Heart size={14} color={theme.subText} />
                      <Text style={[styles.commentLikeCount, { color: theme.subText }]}>12</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={[styles.sheetInputContainer, { borderTopColor: theme.border, backgroundColor: theme.bg }]}>
                <Image 
                  source={{ uri: userProfileImage }} 
                  style={[styles.inputAvatar, { backgroundColor: theme.itemBg }]} 
                />
                <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg }]}>
                  <Text style={[styles.inputPlaceholder, { color: theme.subText }]}>Add a comment...</Text>
                </View>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              onPress={() => setShowShare(false)} 
            />
            <MotiView
              from={{ translateY: screenHeight }}
              animate={{ translateY: screenHeight * 0.6 }}
              exit={{ translateY: screenHeight }}
              transition={{ type: 'spring', damping: 20 }}
              style={[styles.bottomSheet, { height: screenHeight * 0.4, backgroundColor: theme.bg }]}
            >
              <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>Share to</Text>
                <TouchableOpacity onPress={() => setShowShare(false)}>
                  <Plus size={24} color={theme.subText} style={{ transform: [{ rotate: '45deg' }] }} />
                </TouchableOpacity>
              </View>
              <View style={styles.shareOptions}>
                {[
                  { name: 'WhatsApp', color: '#25D366' },
                  { name: 'Instagram', color: '#E1306C' },
                  { name: 'Snapchat', color: '#FFFC00' },
                  { name: 'Facebook', color: '#1877F2' },
                  { name: 'Copy Link', color: theme.subText }
                ].map((item) => (
                  <TouchableOpacity key={item.name} style={styles.shareOption} onPress={() => setShowShare(false)}>
                    <View style={[styles.shareIconPlace, { backgroundColor: item.color + '15' }]}>
                       <Share2 size={24} color={item.color} />
                    </View>
                    <Text style={[styles.shareLabel, { color: theme.text }]}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>

      {/* Confetti (Overlay) */}
      <AnimatePresence>
        {showConfetti && (
          <View style={styles.confettiLayer} pointerEvents="none">
             {[...Array(15)].map((_, i) => (
               <MotiView
                 key={i}
                 from={{ translateY: -100, translateX: (i * 20), opacity: 1 }}
                 animate={{ translateY: height + 100, opacity: 0 }}
                 transition={{ duration: 3000, delay: i * 100 }}
                 style={styles.confettiItem}
               >
                 <Text style={styles.confettiEmoji}>
                    {['🎉', '🎊', '✨', '🎂', '🎈'][Math.floor(Math.random() * 5)]}
                 </Text>
               </MotiView>
             ))}
          </View>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  videoPage: {
    width: width,
    height: height,
    position: 'relative',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  blurPad: {
    padding: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  navTabs: {
    flexDirection: 'row',
    gap: 20,
  },
  navTab: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  navTabActive: {
    color: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    paddingBottom: 4,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  muteBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  goalBadgeContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  goalBadge: {
    width: '80%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  goalBlur: {
    padding: 16,
    gap: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  goalSub: {
    fontSize: 8,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    marginTop: 2,
  },
  goalProgress: {
    gap: 6,
  },
  goalLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalLabelText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#818cf8',
    textTransform: 'uppercase',
  },
  goalLabelPct: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },
  goalBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 2,
  },
  sidebar: {
    position: 'absolute',
    right: 12,
    bottom: height * 0.15,
    gap: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  authorSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  sidebarAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  followBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  sidebarBtn: {
    alignItems: 'center',
    gap: 4,
  },
  sidebarLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  giftWrapper: {
    alignItems: 'center',
  },
  giftBtn: {
    alignItems: 'center',
    gap: 4,
  },
  giftCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  giftMenu: {
    position: 'absolute',
    right: 60,
    bottom: 0,
    minWidth: 160,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  giftMenuBlur: {
    padding: 8,
  },
  giftMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
  },
  giftEmoji: {
    fontSize: 24,
  },
  giftItemLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  giftItemPrice: {
    fontSize: 8,
    fontWeight: '700',
    color: '#818cf8',
    marginTop: 2,
  },
  wishesContainer: {
    position: 'absolute',
    bottom: height * 0.35,
    left: 16,
    gap: 8,
    zIndex: 50,
  },
  wishBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  wishDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4f46e5',
  },
  wishText: {
    fontSize: 11,
    color: '#fff',
  },
  wishUser: {
    fontWeight: '900',
    color: '#818cf8',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 80,
    zIndex: 100,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  authorHandle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  birthdayTag: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  birthdayTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },
  descText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  musicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  musicText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveTagText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heartOverlay: {
    position: 'absolute',
    zIndex: 1000,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
   progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  floatingCake: {
    position: 'absolute',
    top: height * 0.25,
    right: 20,
    zIndex: 60,
  },
  albumDisk: {
    position: 'absolute',
    right: 12,
    bottom: 40,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    borderWidth: 3,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  albumAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confettiItem: {
    position: 'absolute',
  },
  confettiEmoji: {
    fontSize: 24,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentBody: {
    flex: 1,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  commentFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  commentTime: {
    fontSize: 11,
    color: '#888',
  },
  commentReply: {
    fontSize: 11,
    fontWeight: '900',
    color: '#888',
  },
  commentLike: {
    alignItems: 'center',
  },
  commentLikeCount: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  sheetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  inputWrapper: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  inputPlaceholder: {
    color: '#94a3b8',
    fontSize: 13,
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 20,
    justifyContent: 'center',
  },
  shareOption: {
    alignItems: 'center',
    width: (width - 100) / 3,
    marginBottom: 20,
  },
  shareIconPlace: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    marginBottom: 8,
  },
  shareLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
});
