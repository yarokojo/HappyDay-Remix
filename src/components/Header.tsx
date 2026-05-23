import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Platform, useWindowDimensions } from "react-native";
import { Bell, Search, PlusCircle, X } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  onNavigate?: (screen: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userProfileImage: string;
}

export default function Header({ onNavigate, searchQuery, onSearchChange, userProfileImage }: HeaderProps) {
  const { theme, darkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      onSearchChange("");
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
      <View style={styles.contentWrap}>
        <View style={styles.left}>
          <View style={[styles.logoSquare, { backgroundColor: theme.primary }]}>
            <View style={styles.logoDot} />
          </View>
          {!isSearching && <Text style={[styles.title, { color: theme.text }]}>BirthDayApp</Text>}
        </View>

        {/* Integrated Search for Large Screens or Active Search for Mobile */}
        {(isLargeScreen || isSearching) ? (
          <MotiView 
            key="search-bar"
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.searchContainer, isLargeScreen && styles.searchContainerLarge]}
          >
            <View style={[styles.searchInputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <Search size={18} color={theme.subText} style={styles.searchIconInside} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search events..."
                placeholderTextColor={theme.subText}
                value={searchQuery}
                onChangeText={onSearchChange}
                autoFocus={isSearching && !isLargeScreen}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => onSearchChange("")}>
                  <X size={18} color={theme.subText} />
                </TouchableOpacity>
              )}
            </View>
            {!isLargeScreen && (
              <TouchableOpacity onPress={handleSearchToggle} style={styles.cancelButton}>
                <Text style={[styles.cancelText, { color: theme.primary }]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </MotiView>
        ) : null}

        {!isSearching && (
          <View style={styles.right}>
            <TouchableOpacity 
              onPress={() => onNavigate?.('post')}
              style={styles.iconButton}
            >
              <PlusCircle size={22} color={theme.primary} />
            </TouchableOpacity>
            {!isLargeScreen && (
              <TouchableOpacity onPress={handleSearchToggle} style={styles.iconButton}>
                <Search size={22} color={theme.subText} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => onNavigate?.('notifications')}
              style={styles.iconButton}
            >
              <Bell size={22} color={theme.subText} />
              <View style={[styles.notificationDot, { borderColor: theme.headerBg }]} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => onNavigate?.('profile')}
              style={[styles.profileButton, { borderColor: theme.border }]}
            >
              <Image 
                source={{ uri: userProfileImage }} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 100 : 70, // Increased for better feel and spacing
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 1000,
  },
  contentWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0, // Reset for integrated
    gap: 12,
  },
  searchContainerLarge: {
    maxWidth: 400,
    marginHorizontal: 20,
  },
  searchInputWrapper: {
    flex: 1,
    height: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchIconInside: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    paddingVertical: 0, // Critical for height consistency
  },
  cancelButton: {
    paddingHorizontal: 4,
  },
  cancelText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoSquare: {
    width: 32,
    height: 32,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDot: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#ec4899',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    marginLeft: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});

