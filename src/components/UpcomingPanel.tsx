import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const UPCOMING = [
  { id: "1", name: "Alice Cooper", day: "21", daysLeft: 3, color: "#ffedd5", textColor: "#ea580c", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
  { id: "2", name: "Zoe Miller", day: "25", daysLeft: 7, color: "#f3e8ff", textColor: "#9333ea", imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
  { id: "3", name: "Tom Holland", day: "28", daysLeft: 10, color: "#dbeafe", textColor: "#2563eb", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
];

export default function UpcomingPanel({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const { theme, darkMode } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Upcoming</Text>
        <TouchableOpacity onPress={() => onNavigate?.('calendar')}>
          <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.list}>
        {UPCOMING.map((event) => (
          <TouchableOpacity 
            key={event.id} 
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onNavigate?.('calendar')}
          >
            <View style={styles.itemLeft}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: event.imageUrl }} style={[styles.avatar, { borderColor: theme.card }]} />
                <View style={[styles.dayBadge, { backgroundColor: darkMode ? theme.itemBg : event.color, borderColor: theme.card }]}>
                  <Text style={[styles.dayBadgeText, { color: darkMode ? theme.primary : event.textColor }]}>{event.day}</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.name, { color: theme.text }]}>{event.name}</Text>
                <Text style={[styles.daysLeft, { color: theme.subText }]}>In {event.daysLeft} days</Text>
              </View>
            </View>
            <View style={[styles.clockIcon, { backgroundColor: theme.itemBg }]}>
              <Clock size={16} color={theme.subText} />
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={[styles.syncBox, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
          <Text style={[styles.syncText, { color: theme.subText }]}>
            SYNC CALENDAR TO SEE MORE{"\n"}CELEBRATIONS FROM CONTACTS
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.footerTitle, { color: theme.subText }]}>Top Gift Givers</Text>
        <View style={styles.giversList}>
          <View style={styles.giverItem}>
            <View style={styles.giverItemLeft}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" }} 
                style={styles.smallAvatar} 
              />
              <View>
                <Text style={[styles.giverName, { color: theme.text }]}>Chloe Smith</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.dot} />
                  <Text style={[styles.badgeText, { color: darkMode ? theme.accent : "#ca8a04" }]}>Legendary Giver</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.giftCount, { color: theme.primary }]}>12 Gifts</Text>
          </View>
          
          <View style={[styles.giverItem, { opacity: 0.7 }]}>
            <View style={styles.giverItemLeft}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }} 
                style={styles.smallAvatar} 
              />
              <Text style={[styles.giverName, { color: theme.text }]}>David G.</Text>
            </View>
            <Text style={[styles.giftCount, { color: theme.primary }]}>8 Gifts</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  viewAll: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dayBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  daysLeft: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  clockIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  syncText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 16,
  },
  footerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  giversList: {
    gap: 16,
  },
  giverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giverItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  giverName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#facc15',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#ca8a04',
    textTransform: 'uppercase',
  },
  giftCount: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4f46e5',
  },
});

