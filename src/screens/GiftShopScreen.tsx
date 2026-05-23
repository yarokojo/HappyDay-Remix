import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Modal, ActivityIndicator, Platform, useWindowDimensions } from "react-native";
import { ArrowLeft, Gift, Search, Smartphone, Users, Cake, Plus, X } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { Gift as GiftType } from "../types";
import { useTheme } from "../context/ThemeContext";

const GIFTS: GiftType[] = [
  { id: "g1", name: "Gold Bar", price: 100, category: "Luxury", imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop" },
  { id: "g2", name: "Diamond Ring", price: 150, category: "Luxury", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop" },
  { id: "g3", name: "Celebration Cake", price: 50, category: "Food", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop" },
  { id: "g4", name: "Fresh Flowers", price: 40, category: "Flowers", imageUrl: "https://images.unsplash.com/photo-1582794541440-3593a97ed797?w=300&h=300&fit=crop" },
  { id: "g5", name: "Premium Drink", price: 20, category: "Drinks", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=300&fit=crop" },
  { id: "g6", name: "Gift Card", price: 10, category: "Cash", imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop" },
];

export default function GiftShopScreen({ 
  onBack, 
  onNavigate, 
  onBuyGift,
  searchQuery = "" 
}: { 
  onBack: () => void, 
  onNavigate?: (screen: string, id?: string, mode?: 'post' | 'video', url?: string, title?: string) => void,
  onBuyGift?: (giftName: string, price: number, celebrantName: string) => void,
  searchQuery?: string
}) {
  const { theme, darkMode } = useTheme();
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [internalSearch, setInternalSearch] = useState("");

  const networks = [
    { id: "MTN", name: "MTN", color: "#fbbf24" },
    { id: "Telecel", name: "Telecel", color: "#dc2626" },
    { id: "AirtelTigo", name: "AirtelTigo", color: "#2563eb" },
  ];

  const categories = ["All", "Luxury", "Food", "Flowers", "Drinks", "Cash"];

  const effectiveSearch = internalSearch || searchQuery;

  const filteredGifts = GIFTS.filter(gift => {
    const matchesCategory = activeCategory === "All" || gift.category === activeCategory;
    const matchesSearch = !effectiveSearch || 
      gift.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      gift.category.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePay = () => {
    if (!phoneNumber || !selectedGift) return;
    setIsPaying(true);
    // Simulate payment process
    setTimeout(() => {
      setIsPaying(false);
      setShowSuccess(true);
      if (onBuyGift) {
        onBuyGift(selectedGift.name, selectedGift.price, "Julia Mason"); // Hardcoded celebrant for now
      }
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedGift(null);
        setPhoneNumber("");
      }, 3000);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Gift Shop</Text>
        <TouchableOpacity style={styles.searchIconBtn}>
          <Search size={20} color={theme.subText} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={18} color={theme.subText} />
          <TextInput 
            placeholder="Search gifts..." 
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.subText}
            value={internalSearch}
            onChangeText={setInternalSearch}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryBtn,
                { backgroundColor: theme.card, borderColor: theme.border },
                activeCategory === cat && [styles.categoryBtnActive, { backgroundColor: theme.primary, borderColor: theme.primary }]
              ]}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.subText },
                activeCategory === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Group Gift Promotion */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => onNavigate?.('group_gifts')}
          style={[styles.promoCard, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        >
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <View style={styles.promoIconBg}>
                <Users size={16} color="#fff" />
              </View>
              <Text style={styles.promoBadgeText}>Crowdfunding</Text>
            </View>
            <Text style={styles.promoTitle}>Start a Group Gift</Text>
            <Text style={styles.promoDesc}>
              Combine GHS with friends to buy something premium.
            </Text>
          </View>
          <View style={styles.promoIconMain}>
            <Cake size={32} color="#fff" opacity={0.3} />
          </View>
          {/* Decorations */}
          <MotiView 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ loop: true, duration: 4000 }}
            style={styles.decoration1} 
          />
          <MotiView 
            animate={{ scale: [1, 1.3, 1] }} 
            transition={{ loop: true, duration: 5000 }}
            style={styles.decoration2} 
          />
        </TouchableOpacity>

        {/* Gifts Grid */}
        <View style={styles.giftsList}>
          {filteredGifts.map((gift, index) => (
            <MotiView
              key={gift.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedGift(gift)}
                style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={[styles.premiumImageWrapper, { backgroundColor: theme.itemBg }]}>
                  <Image source={{ uri: gift.imageUrl }} style={styles.premiumImage} />
                  {gift.price > 80 && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>Elite</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.premiumDetails}>
                  <View>
                    <Text style={[styles.premiumCategory, { color: theme.subText }]}>{gift.category}</Text>
                    <Text style={[styles.premiumName, { color: theme.text }]}>{gift.name}</Text>
                  </View>
                  
                  <View style={styles.premiumFooter}>
                    <View style={styles.priceTag}>
                      <Text style={styles.currency}>GHS</Text>
                      <Text style={[styles.priceValue, { color: theme.primary }]}>{gift.price.toLocaleString()}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => setSelectedGift(gift)}
                      style={[styles.buyAction, { backgroundColor: theme.primary }]}
                    >
                      <Plus size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </ScrollView>

      {/* Payment Sheet */}
      <Modal visible={!!selectedGift} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <MotiView 
            from={{ translateY: 300 }}
            animate={{ translateY: 0 }}
            style={[styles.modalContent, { backgroundColor: theme.bg }]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Pay with Mobile Money</Text>
                <Text style={[styles.modalSubtitle, { color: theme.subText }]}>Buying {selectedGift?.name} for Julia</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedGift(null)} style={[styles.closeBtn, { backgroundColor: theme.itemBg }]}>
                <X size={20} color={theme.subText} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.networkSelector}>
                {networks.map((net) => (
                  <TouchableOpacity
                    key={net.id}
                    onPress={() => setSelectedNetwork(net.id)}
                    style={[
                      styles.netBtn,
                      { borderColor: theme.border },
                      selectedNetwork === net.id && [styles.netBtnActive, { borderColor: theme.primary, backgroundColor: darkMode ? theme.itemBg : '#f5f7ff' }]
                    ]}
                  >
                    <View style={[styles.netBadge, { backgroundColor: net.color }]}>
                      <Text style={styles.netShort}>{net.id.substring(0, 2).toLowerCase()}</Text>
                    </View>
                    <Text style={[styles.netName, selectedNetwork === net.id && [styles.netNameActive, { color: theme.primary }]]}>{net.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.inputBox, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
                <View style={[styles.inputIconBg, { backgroundColor: theme.bg }]}>
                   <View style={[styles.selectedNetIcon, { backgroundColor: networks.find(n => n.id === selectedNetwork)?.color }]}>
                     <Text style={styles.netShortSmall}>{selectedNetwork.substring(0, 1).toLowerCase()}</Text>
                   </View>
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.boxLabel}>{selectedNetwork} Number</Text>
                  <TextInput 
                    placeholder="e.g. 0244000000"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={[styles.phoneInput, { color: theme.text }]}
                    placeholderTextColor={theme.subText}
                  />
                </View>
              </View>

              <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={[styles.totalValue, { color: theme.primary }]}>₵{selectedGift?.price.toLocaleString()}</Text>
              </View>

              <TouchableOpacity 
                style={[styles.payBtn, (isPaying || !phoneNumber) && styles.payBtnDisabled, !isPaying && phoneNumber && { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                onPress={handlePay}
                disabled={isPaying || !phoneNumber}
              >
                {isPaying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payBtnText}>Confirm Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.successCard, { backgroundColor: theme.bg, borderColor: theme.border }]}
          >
            <View style={[styles.successIconBg, { backgroundColor: darkMode ? theme.itemBg : '#f0fdf4' }]}>
              <Gift size={40} color={darkMode ? theme.primary : '#16a34a'} />
            </View>
            <Text style={[styles.successTitle, { color: theme.text }]}>Gift Sent!</Text>
            <Text style={[styles.successDesc, { color: theme.subText }]}>Julia has received your gift in her wallet. Watch out for her reaction!</Text>
            <View style={[styles.progressContainer, { backgroundColor: theme.border }]}>
              <MotiView 
                from={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3000 }}
                style={[styles.progressBar, { backgroundColor: darkMode ? theme.primary : '#16a34a' }]}
              />
            </View>
          </MotiView>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    flex: 1,
  },
  searchIconBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoriesScroll: {
    gap: 10,
    marginTop: 20,
    paddingVertical: 4,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  categoryBtnActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryTextActive: {
    color: '#fff',
  },
  promoCard: {
    marginTop: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  promoContent: {
    flex: 1,
    zIndex: 10,
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  promoIconBg: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  promoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    lineHeight: 14,
  },
  promoIconMain: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  decoration1: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decoration2: {
    position: 'absolute',
    left: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  giftsList: {
    gap: 16,
    marginTop: 24,
  },
  premiumCard: {
    flexDirection: 'row',
    borderRadius: 32,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  premiumImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumImage: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  premiumDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 4,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  premiumCategory: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  premiumName: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  premiumFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currency: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  buyAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 4,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginTop: 24,
    gap: 20,
  },
  networkSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  netBtn: {
    flex: 1,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  netBtnActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#f5f7ff',
  },
  netBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netShort: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  netName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  netNameActive: {
    color: '#4f46e5',
  },
  inputBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  inputIconBg: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedNetIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netShortSmall: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },
  inputContent: {
    flex: 1,
  },
  boxLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  phoneInput: {
    fontSize: 18,
    fontWeight: '800',
    padding: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  payBtn: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  payBtnDisabled: {
    shadowOpacity: 0,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  successOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    borderRadius: 40,
    padding: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 1,
  },
  successIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
});
