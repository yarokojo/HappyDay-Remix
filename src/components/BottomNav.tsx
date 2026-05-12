import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Home, Calendar, Gift, Video, User } from "lucide-react-native";
import { MotiView } from "moti";
import { useTheme } from "../context/ThemeContext";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { theme } = useTheme();
  const tabs = [
    { id: "home", icon: Home, label: "Feeds" },
    { id: "calendar", icon: Calendar, label: "Events" },
    { id: "video", icon: Video, label: "Video" },
    { id: "gift_shop", icon: Gift, label: "Gifts" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <View style={[styles.nav, { backgroundColor: theme.headerBg, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Icon 
              size={24} 
              color={isActive ? theme.primary : theme.subText} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
            <Text style={[
              styles.label, 
              { color: isActive ? theme.primary : theme.subText, opacity: isActive ? 1 : 0.7 }
            ]}>
              {tab.label}
            </Text>
            {isActive && (
              <MotiView 
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={[styles.activeDot, { backgroundColor: theme.primary }]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    backgroundColor: '#4f46e5',
    borderRadius: 2,
    marginTop: 2,
  },
});

