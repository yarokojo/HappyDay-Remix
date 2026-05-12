import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Gift, Heart } from "lucide-react-native";
import { Celebrant } from "../types";
import { useTheme } from "../context/ThemeContext";

interface CelebrantCardProps {
  celebrant: Celebrant;
  onGiftClick?: () => void;
  onWishClick?: () => void;
}

export default function CelebrantCard({ celebrant, onGiftClick, onWishClick }: CelebrantCardProps) {
  const { theme, darkMode } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.itemBg, borderColor: theme.card }]}>
          {celebrant.imageUrl ? (
            <Image source={{ uri: celebrant.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: celebrant.color || theme.primary + '20' }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>{celebrant.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{celebrant.name}</Text>
          <Text style={[styles.age, { color: theme.subText }]}>TURNING {celebrant.age}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={onWishClick}
          style={[styles.wishButton, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Heart size={14} color="#fff" fill="#fff" />
          <Text style={styles.wishText}>Wish</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onGiftClick}
          style={[styles.giftButton, { backgroundColor: theme.itemBg, borderColor: theme.border }]}
          activeOpacity={0.8}
        >
          <Gift size={14} color={darkMode ? theme.secondary : "#ec4899"} />
          <Text style={[styles.giftText, { color: theme.text }]}>Gift</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: '#fff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4f46e5',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  age: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  wishButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
  },
  wishText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  giftButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  giftText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
  },
});

