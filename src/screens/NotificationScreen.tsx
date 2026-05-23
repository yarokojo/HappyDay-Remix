import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { ArrowLeft, Bell, Gift, Heart, UserPlus, Star } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useTheme } from "../context/ThemeContext";

interface Notification {
  id: string;
  type: 'wish' | 'gift' | 'follow' | 'system';
  user: string;
  avatar: string;
  message: string;
  time: string;
  isRead: boolean;
}

const NOTIFICATIONS: Notification[] = [
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
];

export default function NotificationScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'wish': return <Heart size={12} color="#ec4899" fill="#ec4899" />;
      case 'gift': return <Gift size={12} color="#f59e0b" />;
      case 'follow': return <UserPlus size={12} color="#3b82f6" />;
      default: return <Star size={12} color={theme.primary} />;
    }
  };

  const filteredNotifications = NOTIFICATIONS.filter(notif => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mentions') return notif.type === 'wish' || notif.type === 'follow';
    if (activeFilter === 'gifts') return notif.type === 'gift';
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Activity</Text>
        </View>
        
        <View style={[styles.filterBar, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
          {['all', 'mentions', 'gifts'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterBtn,
                activeFilter === filter && [styles.filterBtnActive, { backgroundColor: theme.card, borderColor: theme.border }]
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: theme.subText },
                activeFilter === filter && [styles.filterTextActive, { color: theme.primary }]
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnimatePresence>
          {filteredNotifications.map((notif, index) => (
            <MotiView
              key={notif.id}
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 100 }}
              style={[
                styles.notifCard,
                { backgroundColor: theme.card, borderColor: theme.border },
                !notif.isRead && [styles.notifCardUnread, { borderColor: theme.primary, shadowColor: theme.primary }]
              ]}
            >
              <View style={styles.notifLayout}>
                <View style={styles.avatarContainer}>
                  {notif.avatar ? (
                    <Image source={{ uri: notif.avatar }} style={[styles.avatar, { borderColor: theme.card }]} />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: theme.itemBg, borderColor: theme.card }]}>
                      <Bell size={20} color={theme.primary} />
                    </View>
                  )}
                  <View style={[styles.iconBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    {getIcon(notif.type)}
                  </View>
                </View>

                <View style={styles.notifInfo}>
                  <Text style={[styles.notifMessage, { color: theme.text }]}>
                    <Text style={[styles.userName, { color: theme.text }]}>{notif.user}</Text>{" "}
                    <Text style={[styles.messageBody, { color: theme.subText }]}>{notif.message}</Text>
                  </Text>
                  <Text style={[styles.notifTime, { color: theme.subText }]}>{notif.time}</Text>
                </View>

                {!notif.isRead && (
                  <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
                )}
              </View>
            </MotiView>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.itemBg }]}>
              <Bell size={32} color={theme.subText} />
            </View>
            <Text style={[styles.emptyText, { color: theme.subText }]}>No new updates in {activeFilter}</Text>
          </View>
        )}
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginTop: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  filterText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  filterTextActive: {
    color: '#4f46e5',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  notifCardUnread: {
    borderColor: '#e0e7ff',
    backgroundColor: '#fff',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  notifLayout: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#f5f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  notifInfo: {
    flex: 1,
  },
  notifMessage: {
    fontSize: 14,
    lineHeight: 18,
    color: '#475569',
  },
  userName: {
    fontWeight: '900',
    color: '#1e293b',
  },
  messageBody: {
    fontWeight: '500',
  },
  notifTime: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f46e5',
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 16,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
