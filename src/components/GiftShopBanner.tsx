import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight, ShoppingBag, Gift } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

interface GiftShopBannerProps {
  onPress?: () => void;
}

export default function GiftShopBanner({ onPress }: GiftShopBannerProps) {
  const { theme, darkMode } = useTheme();
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
    >
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
          <ShoppingBag size={14} color="#f472b6" />
          <Text style={styles.badgeText}>PREMIUM CURATIONS</Text>
        </View>
        
        <View>
          <Text style={styles.title}>The Gift Shop</Text>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Same-day delivery for the perfect surprise.
          </Text>
        </View>
        
        <View style={[styles.button, { backgroundColor: '#fff' }]}>
          <Text style={[styles.buttonText, { color: theme.primary }]}>Browse Gifts</Text>
          <ArrowRight size={14} color={theme.primary} />
        </View>
      </View>
      
      {/* Background Decor */}
      <View style={[styles.decorCircle, { backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)' }]} />
      <View style={styles.decorGifts}>
        <View style={[styles.decorGiftBox, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
          <Gift size={32} color="rgba(255,255,255,0.4)" />
        </View>
        <View style={[styles.decorGiftBoxSmall, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#312e81',
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#312e81',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  content: {
    zIndex: 10,
    gap: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: '#c7d2fe',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 200,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#312e81',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  decorCircle: {
    position: 'absolute',
    right: -50,
    bottom: -50,
    width: 150,
    height: 150,
    backgroundColor: '#4338ca',
    borderRadius: 75,
    opacity: 0.5,
  },
  decorGifts: {
    position: 'absolute',
    right: 32,
    top: '50%',
    transform: [{ translateY: -40 }, { rotate: '12deg' }],
    flexDirection: 'row',
    gap: 12,
  },
  decorGiftBox: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorGiftBoxSmall: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginTop: 16,
  },
});

