import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Post } from "../types";
import FeedCard from "../components/FeedCard";
import { useTheme } from "../context/ThemeContext";

interface PostDetailScreenProps {
  post: Post;
  userProfileImage: string;
  onBack: () => void;
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
}

export default function PostDetailScreen({ 
  post, 
  userProfileImage,
  onBack,
  onEditPost,
  onLikePost,
  onEditComment,
  onAddComment,
  onDeletePost,
  onDeleteComment,
  onToggleFollow,
  onRepost,
  onToggleBookmark
}: PostDetailScreenProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Post Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <FeedCard 
          post={post} 
          userProfileImage={userProfileImage}
          onEdit={onEditPost} 
          onLike={() => onLikePost(post.id)} 
          onEditComment={onEditComment}
          onAddComment={(content) => onAddComment(post.id, content)}
          onDelete={() => {
            onDeletePost(post.id);
            onBack();
          }}
          onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
          onToggleFollow={() => onToggleFollow(post.authorHandle)}
          onSelect={() => {}} 
          onRepost={() => onRepost(post.id)}
          onToggleBookmark={() => onToggleBookmark(post.id)}
        />
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
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 16,
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
  content: {
    flex: 1,
  },
});
