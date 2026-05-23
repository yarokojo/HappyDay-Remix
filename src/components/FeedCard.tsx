import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Share, Alert, Platform, Clipboard } from "react-native";
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit2, Check, X, Image as ImageIcon, Trash2, Send, UserPlus, UserCheck, Video as VideoIcon, Repeat, Bookmark, MapPin, Eye, Cake, PartyPopper, Gift } from "lucide-react-native";
import { Post } from "../types";
import { MotiView, AnimatePresence } from "moti";
import { Video, ResizeMode } from "expo-av";
import { useTheme } from "../context/ThemeContext";

interface FeedCardProps {
  post: Post;
  userProfileImage: string;
  onEdit: (id: string, content: string, image?: string, video?: string, location?: string, celebrationType?: any, celebrantName?: string, feeling?: string) => void;
  onLike: () => void;
  onEditComment: (postId: string, commentId: string, content: string) => void;
  onAddComment: (content: string) => void;
  onDelete: () => void;
  onDeleteComment: (commentId: string) => void;
  onToggleFollow: () => void;
  onSelect: () => void;
  onRepost: () => void;
  onToggleBookmark: () => void;
}

export default function FeedCard({ 
  post, 
  userProfileImage,
  onEdit, 
  onLike, 
  onEditComment,
  onAddComment,
  onDelete,
  onDeleteComment,
  onToggleFollow,
  onSelect,
  onRepost,
  onToggleBookmark
}: FeedCardProps) {
  const { theme, darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  // ... rest of state
  const [hasLiked, setHasLiked] = useState(false);
  const [hasReposted, setHasReposted] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(post.image);
  const [editedVideo, setEditedVideo] = useState(post.video);
  const [editedLocation, setEditedLocation] = useState(post.location);
  const [editedCelebrationType, setEditedCelebrationType] = useState(post.celebrationType || 'general');
  const [editedCelebrantName, setEditedCelebrantName] = useState(post.celebrantName || '');
  const [editedFeeling, setEditedFeeling] = useState(post.feeling || '');
  const [showOptions, setShowOptions] = useState(false);
  const [newComment, setNewComment] = useState("");
  
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const isOwnPost = post.authorName === "Alex Johnson";

  const handleLike = () => {
    if (!hasLiked) {
      onLike();
      setHasLiked(true);
    }
  };

  const handleShare = async () => {
    const shareMessage = `${post.content}\n\nShared from Celebration App`;
    const shareUrl = Platform.OS === 'ios' ? 'https://celebration.app' : undefined;

    try {
      const result = await Share.share({
        message: shareMessage,
        url: shareUrl,
      });
      
      if (result.action === Share.sharedAction) {
        // Success
      }
    } catch (error: any) {
      // Gracefully handle cancellation as it's common in web pickers / iframes
      const errorMessage = error?.message || '';
      const isCanceled = errorMessage.includes('canceled') || errorMessage.includes('Canceled') || error?.name === 'AbortError';
      
      if (isCanceled) {
        return; 
      }

      // If it's a real error or API not available (like in some iframes), fallback to clipboard
      try {
        Clipboard.setString(shareMessage);
        Alert.alert("Copied", "Content copied to clipboard!");
      } catch (clipboardError) {
        console.error('Share and Clipboard fallback both failed:', clipboardError);
      }
    }
  };

  const handleRepost = () => {
    if (!hasReposted) {
      onRepost();
      setHasReposted(true);
    }
  };

  const handleSave = () => {
    if (
      (editedContent.trim() && editedContent !== post.content) || 
      editedImage !== post.image || 
      editedVideo !== post.video || 
      editedLocation !== post.location ||
      editedCelebrationType !== post.celebrationType ||
      editedCelebrantName !== post.celebrantName ||
      editedFeeling !== post.feeling
    ) {
      onEdit(post.id, editedContent, editedImage, editedVideo, editedLocation, editedCelebrationType, editedCelebrantName, editedFeeling);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(post.content);
    setEditedImage(post.image);
    setEditedVideo(post.video);
    setEditedLocation(post.location);
    setEditedCelebrationType(post.celebrationType || 'general');
    setEditedCelebrantName(post.celebrantName || '');
    setEditedFeeling(post.feeling || '');
    setIsEditing(false);
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
      if (!showComments) setShowComments(true);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return <Text key={index} style={[styles.hashtag, { color: theme.primary }]}>{part}</Text>;
      }
      if (part.startsWith('@')) {
        return <Text key={index} style={[styles.mention, { color: theme.secondary }]}>{part}</Text>;
      }
      return part;
    });
  };

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={[
        styles.card, 
        { backgroundColor: theme.card, borderColor: theme.border },
        isEditing && [styles.editingCard, { borderColor: theme.primary }]
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.itemBg }]}>
            <Image source={{ uri: post.authorImage }} style={styles.avatar} />
          </View>
          <View>
            <View style={styles.authorRow}>
              <Text style={[styles.authorName, { color: theme.text }]}>{post.authorName}</Text>
              {!isOwnPost && (
                <TouchableOpacity 
                  onPress={onToggleFollow}
                  style={[
                    styles.followButton,
                    post.isFollowed ? [styles.followedButton, { backgroundColor: theme.itemBg }] : [styles.unfollowedButton, { backgroundColor: theme.primary + '15' }]
                  ]}
                >
                  <Text style={[
                    styles.followText,
                    post.isFollowed ? [styles.followedText, { color: theme.subText }] : [styles.unfollowedText, { color: theme.primary }]
                  ]}>
                    {post.isFollowed ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              )}
              {post.views > 100 && (
                <View style={[styles.trendingBadge, { backgroundColor: darkMode ? theme.itemBg : '#fef3c7' }]}>
                  <Text style={[styles.trendingText, { color: darkMode ? theme.accent : '#d97706' }]}>Trending</Text>
                </View>
              )}
            </View>
            <View style={styles.metaRow}>
              <Text style={[styles.timestamp, { color: theme.subText }]}>
                {post.timestamp}
                {post.isEdited && <Text style={[styles.editedIndicator, { color: theme.border }]}> • Edited</Text>}
              </Text>
              {post.location && (
                <View style={styles.locationContainer}>
                  <View style={[styles.metaDot, { backgroundColor: theme.border }]} />
                  <MapPin size={10} color={theme.primary} />
                  <Text style={[styles.locationText, { color: theme.primary }]}>{post.location}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {!isEditing && (
          <TouchableOpacity 
            onPress={() => setShowOptions(!showOptions)}
            style={styles.moreButton}
          >
            <MoreHorizontal size={20} color={theme.subText} />
          </TouchableOpacity>
        )}
      </View>

      {post.celebrationType && post.celebrationType !== 'general' && (
        <View style={styles.tagsRow}>
          <View style={[styles.celebrationTag, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
            {post.celebrationType === 'birthday' ? <Cake size={12} color={theme.primary} /> : post.celebrationType === 'party' ? <PartyPopper size={12} color={theme.primary} /> : <Heart size={12} color={theme.primary} />}
            <Text style={[styles.tagText, { color: theme.primary }]}>
              {post.celebrationType.toUpperCase()} 
              {post.celebrantName ? ` • ${post.celebrantName}` : ''}
            </Text>
          </View>
          {post.feeling && (
            <View style={[styles.feelingTag, { backgroundColor: theme.secondary + '10', borderColor: theme.secondary + '20' }]}>
              <Text style={[styles.feelingLabel, { color: theme.secondary }]}>FEELING</Text>
              <Text style={[styles.tagText, { color: theme.secondary }]}>{post.feeling.toUpperCase()}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.contentPadding}>
        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              multiline
              value={editedContent}
              onChangeText={setEditedContent}
              style={[styles.editInput, { backgroundColor: theme.itemBg, color: theme.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.subText}
            />
            
            <View style={styles.editActions}>
              <TouchableOpacity onPress={handleCancel} style={[styles.cancelButton, { backgroundColor: theme.itemBg }]}>
                <Text style={[styles.cancelText, { color: theme.subText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={onSelect} activeOpacity={0.9}>
            <Text style={[styles.content, { color: theme.text }]}>
              {renderContent(post.content)}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!isEditing && post.image && (
        <TouchableOpacity onPress={onSelect} activeOpacity={0.9} style={styles.mediaContainer}>
          <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
        </TouchableOpacity>
      )}

      {!isEditing && post.video && (
        <View style={styles.mediaContainer}>
          <Video
            source={{ uri: post.video }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={false}
            isMuted
            style={styles.postVideo}
          />
        </View>
      )}

      {!isEditing && (
        <View style={styles.footer}>
          <View style={styles.interactions}>
            <View style={styles.leftInteractions}>
              <TouchableOpacity onPress={handleLike} style={styles.interactionButton}>
                <Heart size={20} color={hasLiked ? "#ec4899" : theme.subText} fill={hasLiked ? "#ec4899" : "transparent"} />
                <Text style={[styles.interactionValue, { color: theme.subText }, hasLiked && { color: '#ec4899' }]}>{post.likes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.interactionButton}>
                <MessageCircle size={20} color={showComments ? theme.primary : theme.subText} />
                <Text style={[styles.interactionValue, { color: theme.subText }, showComments && { color: theme.primary }]}>{post.comments}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleRepost} style={styles.interactionButton}>
                <Repeat size={20} color={hasReposted ? "#10b981" : theme.subText} />
                <Text style={[styles.interactionValue, { color: theme.subText }, hasReposted && { color: '#10b981' }]}>{post.reposts}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rightInteractions}>
              <TouchableOpacity onPress={onToggleBookmark} style={styles.interactionButton}>
                <Bookmark size={20} color={post.isBookmarked ? "#f59e0b" : theme.subText} fill={post.isBookmarked ? "#f59e0b" : "transparent"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.interactionButton}>
                <Share2 size={20} color={theme.subText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {!isEditing && (
        <AnimatePresence>
          {showComments && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={[styles.commentsSection, { backgroundColor: theme.itemBg, borderTopColor: theme.border }]}
            >
              {post.commentsList?.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image source={{ uri: comment.authorImage }} style={[styles.smallAvatar, { backgroundColor: theme.border }]} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={[styles.commentAuthor, { color: theme.text }]}>{comment.authorName}</Text>
                      <Text style={[styles.commentTime, { color: theme.subText }]}>{comment.timestamp}</Text>
                    </View>
                    <Text style={[styles.commentText, { color: theme.text, opacity: 0.8 }]}>{comment.content}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.addComment}>
                <Image 
                  source={{ uri: userProfileImage }} 
                  style={[styles.smallAvatar, { backgroundColor: theme.border }]} 
                />
                <TextInput
                  style={[styles.commentInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                  placeholder="Write a comment..."
                  placeholderTextColor={theme.subText}
                  value={newComment}
                  onChangeText={setNewComment}
                  onSubmitEditing={handlePostComment}
                />
                <TouchableOpacity onPress={handlePostComment} disabled={!newComment.trim()}>
                  <Send size={18} color={newComment.trim() ? theme.primary : theme.border} />
                </TouchableOpacity>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      )}

      {/* Options Menu Modal */}
      {showOptions && (
        <View style={styles.optionsOverlay}>
          <TouchableOpacity style={styles.overlayClose} onPress={() => setShowOptions(false)} />
          <MotiView 
            from={{ translateY: 100 }}
            animate={{ translateY: 0 }}
            style={[styles.optionsContent, { backgroundColor: theme.card }]}
          >
            {isOwnPost ? (
              <>
                <TouchableOpacity 
                  onPress={() => {
                    setIsEditing(true);
                    setShowOptions(false);
                  }}
                  style={styles.optionItem}
                >
                  <Edit2 size={18} color={theme.text} />
                  <Text style={[styles.optionText, { color: theme.text }]}>Edit Post</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    Alert.alert('Delete Post', 'Are you sure?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', onPress: onDelete, style: 'destructive' }
                    ]);
                    setShowOptions(false);
                  }}
                  style={styles.optionItem}
                >
                  <Trash2 size={18} color="#ef4444" />
                  <Text style={[styles.optionText, { color: '#ef4444' }]}>Delete Post</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                onPress={() => {
                  onToggleFollow();
                  setShowOptions(false);
                }}
                style={styles.optionItem}
              >
                {post.isFollowed ? <UserCheck size={18} color={theme.text} /> : <UserPlus size={18} color={theme.text} />}
                <Text style={[styles.optionText, { color: theme.text }]}>{post.isFollowed ? 'Unfollow User' : 'Follow User'}</Text>
              </TouchableOpacity>
            )}
          </MotiView>
        </View>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24, // Consistent spacing
    borderRadius: 16,
    // Removed overflow: 'hidden' to prevent layout clipping during height animations
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  editingCard: {
    borderColor: '#c7d2fe',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  followButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unfollowedButton: {
    backgroundColor: '#eef2ff',
  },
  followedButton: {
    backgroundColor: '#f1f5f9',
  },
  followText: {
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  unfollowedText: {
    color: '#4f46e5',
  },
  followedText: {
    color: '#64748b',
  },
  trendingBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendingText: {
    color: '#d97706',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  editedIndicator: {
    color: '#cbd5e1',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDot: {
    width: 2,
    height: 2,
    backgroundColor: '#cbd5e1',
    borderRadius: 1,
  },
  locationText: {
    fontSize: 10,
    color: '#6366f1',
    fontWeight: '700',
  },
  moreButton: {
    padding: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  celebrationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  feelingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  tagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4f46e5',
    letterSpacing: 0.5,
  },
  feelingLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#f472b6',
    opacity: 0.7,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  hashtag: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  mention: {
    color: '#9333ea',
    fontWeight: '700',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postVideo: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 8,
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftInteractions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rightInteractions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10, // Increased touch target for mobile
  },
  interactionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  commentsSection: {
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
    gap: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 24, // Extra padding at the bottom of the comments to prevent overlap
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  commentTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  commentText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  editForm: {
    gap: 12,
    paddingVertical: 8,
  },
  editInput: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  cancelText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
  },
  saveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  optionsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  overlayClose: {
    ...StyleSheet.absoluteFillObject,
  },
  optionsContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});

