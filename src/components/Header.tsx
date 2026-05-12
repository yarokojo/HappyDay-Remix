import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Platform, useWindowDimensions, ScrollView } from "react-native";
import { Bell, Search, PlusCircle, X, Clock, ArrowRight, TrendingUp } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  onNavigate?: (screen: string, id?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  userProfileImage: string;
}

const RECENT_SEARCHES = ["Julia Mason birthday", "Gift shop", "Group gifting", "Party supplies"];

export default function Header({ onNavigate, searchQuery, onSearchChange, userProfileImage }: HeaderProps) {
  const { theme, darkMode } = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      onSearchChange("");
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Timeout to allow clicking suggestions
    setTimeout(() => {
      if (!isLargeScreen && !isTablet) {
        // On mobile, we keep it active if isSearching is true
      } else {
        setShowSuggestions(false);
      }
    }, 200);
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
      <View style={styles.contentWrap}>
        <View style={styles.left}>
          <TouchableOpacity onPress={() => onNavigate?.('home')} style={styles.logoWrapper}>
            <Image 
              source={{ uri: "https://img.icons8.com/color/96/birthday-cake.png" }} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </TouchableOpacity>
          {!isSearching && (
            <TouchableOpacity onPress={() => onNavigate?.('home')}>
              <Text style={[styles.title, { color: theme.text }]}>BirthDayApp</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Integrated Search for Large Screens or Active Search for Mobile */}
        {(isLargeScreen || isTablet || isSearching) ? (
          <MotiView 
            key="search-bar"
            from={{ opacity: 0, translateX: isLargeScreen ? 0 : 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            style={[styles.searchContainer, (isLargeScreen || isTablet) && styles.searchContainerLarge]}
          >
            <View style={[styles.searchInputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <Search size={18} color={theme.subText} style={styles.searchIconInside} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search birthday, gifts, friends..."
                placeholderTextColor={theme.subText}
                value={searchQuery}
                onChangeText={onSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBlur}
                autoFocus={isSearching && !isLargeScreen && !isTablet}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => onSearchChange("")} style={styles.clearBtn}>
                  <X size={16} color={theme.subText} />
                </TouchableOpacity>
              )}
            </View>
            
            {!isLargeScreen && !isTablet && (
              <TouchableOpacity onPress={handleSearchToggle} style={styles.cancelButton}>
                <Text style={[styles.cancelText, { color: theme.primary }]}>Cancel</Text>
              </TouchableOpacity>
            )}

            {/* Global Search Suggestions Dropdown */}
            {showSuggestions && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={[styles.suggestionsDropdown, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <ScrollView keyboardShouldPersistTaps="handled">
                  <View style={styles.suggestionSection}>
                    <View style={styles.suggestionSectionHeader}>
                      <Clock size={14} color={theme.subText} />
                      <Text style={[styles.suggestionSectionTitle, { color: theme.subText }]}>Recent Searches</Text>
                    </View>
                    {RECENT_SEARCHES.map((item, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={styles.suggestionItem}
                        onPress={() => {
                          onSearchChange(item);
                          setShowSuggestions(false);
                        }}
                      >
                        <Text style={[styles.suggestionText, { color: theme.text }]}>{item}</Text>
                        <ArrowRight size={14} color={theme.subText} />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[styles.suggestionDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.suggestionSection}>
                    <View style={styles.suggestionSectionHeader}>
                      <TrendingUp size={14} color={theme.primary} />
                      <Text style={[styles.suggestionSectionTitle, { color: theme.subText }]}>Trending</Text>
                    </View>
                    <View style={styles.trendingChips}>
                      {["#BdayBash", "#Gifts", "#Parties", "#Celebrations"].map((tag, idx) => (
                        <TouchableOpacity 
                          key={idx} 
                          style={[styles.trendingChip, { backgroundColor: theme.itemBg, borderColor: theme.border }]}
                          onPress={() => {
                            onSearchChange(tag);
                            setShowSuggestions(false);
                          }}
                        >
                          <Text style={[styles.trendingChipText, { color: theme.primary }]}>{tag}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </MotiView>
            )}
          </MotiView>
        ) : null}

        {!(isSearching && !isLargeScreen && !isTablet) && (
          <View style={styles.right}>
            {(isLargeScreen || isTablet) && (
              <TouchableOpacity 
                onPress={() => onNavigate?.('post')}
                style={[styles.createPostBtn, { backgroundColor: theme.primary }]}
              >
                <PlusCircle size={18} color="#fff" />
                <Text style={styles.createPostBtnText}>Create Post</Text>
              </TouchableOpacity>
            )}
            {!(isLargeScreen || isTablet) && !isSearching && (
              <TouchableOpacity 
                onPress={() => onNavigate?.('post')}
                style={styles.iconButton}
              >
                <PlusCircle size={22} color={theme.primary} />
              </TouchableOpacity>
            )}
            {!isLargeScreen && !isTablet && !isSearching && (
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
    marginHorizontal: 12,
  },
  searchInputWrapper: {
    flex: 1,
    height: 44,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
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
    fontWeight: '600',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    maxHeight: 300,
    padding: 8,
    zIndex: 2000,
  },
  suggestionSection: {
    padding: 8,
  },
  suggestionSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  suggestionSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionDivider: {
    height: 1,
    marginVertical: 4,
  },
  trendingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  trendingChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  createPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  createPostBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
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
  logoWrapper: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
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

