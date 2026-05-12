import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Home, Calendar, Gift, Video, User, LogOut, Settings, HelpCircle, Heart } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { MotiView } from "moti";

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (screen: string) => void;
}

export default function SideNav({ activeTab, setActiveTab, onNavigate }: SideNavProps) {
  const { theme, darkMode } = useTheme();
  const { logout } = useAuth();

  const tabs = [
    { id: "home", icon: Home, label: "Feeds" },
    { id: "calendar", icon: Calendar, label: "Events" },
    { id: "video", icon: Video, label: "Video" },
    { id: "gift_shop", icon: Gift, label: "Gifts" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  const bottomActions = [
    { id: "notifications", icon: Heart, label: "Notifications" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "help", icon: HelpCircle, label: "Help Center" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderRightColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.logoSquare, { backgroundColor: theme.primary }]}>
          <View style={styles.logoDot} />
        </View>
        <Text style={[styles.logoText, { color: theme.text }]}>Julia Bash</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.navItem,
                  isActive && { backgroundColor: darkMode ? theme.itemBg : '#f5f3ff' }
                ]}
              >
                <Icon 
                  size={24} 
                  color={isActive ? theme.primary : theme.subText} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <Text style={[
                  styles.label, 
                  { color: isActive ? theme.primary : theme.text, fontWeight: isActive ? '800' : '600' }
                ]}>
                  {tab.label}
                </Text>
                {isActive && (
                  <MotiView 
                    from={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={[styles.activeIndicator, { backgroundColor: theme.primary }]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>Social</Text>
          {bottomActions.map((action) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                onPress={() => onNavigate(action.id)}
                style={styles.navItem}
              >
                <Icon size={22} color={theme.subText} />
                <Text style={[styles.label, { color: theme.text }]}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.logoutBtn, { borderTopColor: theme.border }]}
        onPress={logout}
      >
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: '100%',
    borderRightWidth: 1,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDot: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scroll: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 12,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    bottom: '25%',
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  logoutBtn: {
    marginHorizontal: 12,
    paddingTop: 24,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  }
});
