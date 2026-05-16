import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, Alert, Modal, TextInput, ActivityIndicator } from "react-native";
import { ArrowLeft, Users, Target, Clock, Cake, DollarSign, Plus, X, Landmark, Smartphone, ShieldCheck } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { GroupGift } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useActivity } from "../context/ActivityContext";

const INITIAL_MOCK_GROUP_GIFTS: GroupGift[] = [
  {
    id: "1",
    celebrantName: "Julia Mason",
    giftName: "Premium Velvet Cake",
    targetAmount: 150,
    currentAmount: 85,
    contributorsCount: 4,
    deadline: "5h left",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    celebrantName: "Kevin Hart",
    giftName: "Surprise Gift Box",
    targetAmount: 200,
    currentAmount: 45,
    contributorsCount: 2,
    deadline: "12h left",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop"
  }
];

const PAYMENT_METHODS = [
  { id: 'momo', name: 'MTN MoMo', icon: Smartphone, color: '#fbbf24' },
  { id: 'vodacash', name: 'Vodafone Cash', icon: Smartphone, color: '#ef4444' },
  { id: 'atmoney', name: 'AirtelTigo Money', icon: Smartphone, color: '#3b82f6' },
  { id: 'card', name: 'Visa/MasterCard', icon: Landmark, color: '#6366f1' },
];

export default function GroupGiftScreen({ onBack }: { onBack: () => void }) {
  const { theme, darkMode } = useTheme();
  const { addNotification } = useActivity();
  const [gifts, setGifts] = useState<GroupGift[]>(INITIAL_MOCK_GROUP_GIFTS);
  const [selectedGift, setSelectedGift] = useState<GroupGift | null>(null);
  const [contribution, setContribution] = useState("10");
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPoolModalVisible, setIsPoolModalVisible] = useState(false);
  
  // New pool form state
  const [newCelebrant, setNewCelebrant] = useState("");
  const [newGift, setNewGift] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const handleContribute = async () => {
    if (!selectedGift) return;
    
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const amt = parseInt(contribution);
    let targetReached = false;
    let finalAmount = 0;

    setGifts(prev => {
      const newGifts = prev.map(g => {
        if (g.id === selectedGift.id) {
          const updatedAmount = g.currentAmount + amt;
          finalAmount = updatedAmount;
          if (updatedAmount >= g.targetAmount && g.currentAmount < g.targetAmount) {
            targetReached = true;
          }
          return {
            ...g,
            currentAmount: updatedAmount,
            contributorsCount: g.contributorsCount + 1
          };
        }
        return g;
      });
      return newGifts;
    });
    
    setIsProcessing(false);

    if (targetReached) {
      // Trigger automatic payout and alerts
      Alert.alert(
        "Target Reached! 🎉",
        `₵${finalAmount} has been automatically sent to ${selectedGift.celebrantName}'s wallet. Everyone has been notified!`,
        [{ text: "Great!" }]
      );

      addNotification({
        type: 'gift',
        user: "System",
        avatar: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=200",
        message: `Goal met! ₵${finalAmount} sent to ${selectedGift.celebrantName}'s wallet for ${selectedGift.giftName}. 🎊`
      });
    } else {
      Alert.alert("Success", `Contributed ₵${contribution} via ${PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name} successfully!`);
    }

    setSelectedGift(null);
  };

  const handleCreatePool = () => {
    if (!newCelebrant || !newGift || !newTarget) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newPool: GroupGift = {
      id: Date.now().toString(),
      celebrantName: newCelebrant,
      giftName: newGift,
      targetAmount: parseInt(newTarget) || 100,
      currentAmount: 0,
      contributorsCount: 0,
      deadline: "24h left",
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop"
    };

    setGifts([newPool, ...gifts]);
    setIsPoolModalVisible(false);
    setNewCelebrant("");
    setNewGift("");
    setNewTarget("");
    Alert.alert("Success", "New contribution pool started!");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          onPress={selectedGift ? () => setSelectedGift(null) : onBack}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {selectedGift ? "Group Contribution" : "Group Gifts"}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {!selectedGift ? (
          <View style={styles.mainView}>
            <View style={[styles.promoCard, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Buy a Cake Together!</Text>
                <Text style={styles.promoDesc}>
                  Contribute small amounts with friends to get a premium gift for your favorite celebrants.
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsPoolModalVisible(true)}
                  style={[styles.newPoolBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                >
                  <Plus size={16} color="#fff" />
                  <Text style={styles.newPoolText}>Start New Pool</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.promoIconBg}>
                <Cake size={80} color="#fff" opacity={0.1} />
              </View>
            </View>

            <View style={styles.giftList}>
              {gifts.map((gift) => {
                const progress = (gift.currentAmount / gift.targetAmount) * 100;
                return (
                  <TouchableOpacity
                    key={gift.id}
                    onPress={() => setSelectedGift(gift)}
                    style={[styles.giftCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  >
                    <View style={styles.giftLayout}>
                      <Image source={{ uri: gift.imageUrl }} style={[styles.giftThumb, { backgroundColor: theme.itemBg }]} />
                      <View style={styles.giftInfo}>
                        <Text style={[styles.giftName, { color: theme.text }]} numberOfLines={1}>{gift.giftName}</Text>
                        <Text style={[styles.celebrantName, { color: theme.subText }]}>For {gift.celebrantName}</Text>
                        
                        <View style={styles.giftMeta}>
                          <View style={styles.metaItem}>
                            <DollarSign size={12} color={theme.accent} />
                            <Text style={[styles.metaValue, { color: theme.text }]}>₵{gift.currentAmount} / ₵{gift.targetAmount}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Clock size={12} color={theme.subText} />
                            <Text style={[styles.deadlineText, { color: theme.subText }]}>{gift.deadline}</Text>
                          </View>
                        </View>

                        <View style={[styles.progressBarBg, { backgroundColor: theme.itemBg }]}>
                          <MotiView 
                            from={{ width: 0 }}
                            animate={{ width: `${Math.min(100, progress)}%` }}
                            transition={{ type: 'timing', duration: 1000 }}
                            style={[styles.progressBarFill, { backgroundColor: theme.primary }]}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <MotiView 
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={styles.detailHeader}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedGift.imageUrl }} style={[styles.detailImage, { borderColor: theme.card }]} />
                <View style={[styles.detailIconBadge, { backgroundColor: theme.primary, borderColor: theme.card }]}>
                  <DollarSign size={24} color="#fff" />
                </View>
              </View>
              
              <View style={styles.detailTitles}>
                <Text style={[styles.detailGiftName, { color: theme.text }]}>{selectedGift.giftName}</Text>
                <Text style={[styles.detailCelebrant, { color: theme.primary }]}>For {selectedGift.celebrantName}</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: theme.itemBg }]}>
                  <Target size={20} color={theme.primary} />
                  <Text style={styles.statLabel}>Target</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>₵{selectedGift.targetAmount}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: darkMode ? theme.itemBg : '#f0fdf4' }]}>
                  <DollarSign size={20} color={theme.accent} />
                  <Text style={[styles.statLabel, { color: theme.subText }]}>Raised</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>₵{selectedGift.currentAmount}</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: darkMode ? theme.itemBg : '#eff6ff' }]}>
                  <Users size={20} color={theme.secondary} />
                  <Text style={[styles.statLabel, { color: theme.subText }]}>Givers</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>{selectedGift.contributorsCount}</Text>
                </View>
              </View>

              <View style={styles.contributionSection}>
                <Text style={[styles.contributeHeader, { color: theme.text }]}>How much to give?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contributeScroll}>
                  {["5", "10", "20", "50", "100"].map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      onPress={() => setContribution(amt)}
                      style={[
                        styles.amtBtn,
                        { backgroundColor: theme.itemBg, borderColor: theme.border },
                        contribution === amt && [styles.amtBtnActive, { backgroundColor: theme.primary, borderColor: theme.primary, shadowColor: theme.primary }]
                      ]}
                    >
                      <Text style={[
                        styles.amtText,
                        { color: theme.subText },
                        contribution === amt && styles.amtTextActive
                      ]}>₵{amt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.paymentMethodSection}>
                  <Text style={[styles.contributeHeader, { color: theme.text, marginTop: 24 }]}>Pay via Mobile Money</Text>
                  <View style={styles.paymentGrid}>
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <TouchableOpacity
                          key={method.id}
                          onPress={() => setPaymentMethod(method.id)}
                          style={[
                            styles.methodBtn,
                            { backgroundColor: theme.itemBg, borderColor: theme.border },
                            isSelected && { borderColor: method.color, backgroundColor: darkMode ? theme.itemBg : method.color + '10' }
                          ]}
                        >
                          <View style={[styles.methodIconWrapper, { backgroundColor: isSelected ? method.color : 'transparent' }]}>
                            <Icon size={20} color={isSelected ? '#fff' : theme.subText} />
                          </View>
                          <Text style={[styles.methodName, { color: isSelected ? theme.text : theme.subText }]}>{method.name}</Text>
                          {isSelected && (
                            <View style={[styles.selectedCheck, { backgroundColor: method.color }]}>
                              <ShieldCheck size={12} color="#fff" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={handleContribute}
                  disabled={isProcessing}
                  style={[
                    styles.joinBtn, 
                    { backgroundColor: theme.primary, shadowColor: theme.primary },
                    isProcessing && { opacity: 0.7 }
                  ]}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.joinBtnText}>Authorize Payment</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.secureBadge}>
                  <ShieldCheck size={14} color={theme.accent} />
                  <Text style={[styles.secureText, { color: theme.subText }]}>Secure 256-bit SSL encrypted payment</Text>
                </View>
              </View>
            </View>
          </MotiView>
        )}
      </ScrollView>

      {/* Start Pool Modal */}
      <Modal
        visible={isPoolModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPoolModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.modalContent, { backgroundColor: theme.card }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Start a Gift Pool</Text>
              <TouchableOpacity onPress={() => setIsPoolModalVisible(false)}>
                <X size={24} color={theme.subText} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>Celebrant Name</Text>
                <TextInput
                  placeholder="Who is this for?"
                  placeholderTextColor={theme.subText}
                  style={[styles.input, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]}
                  value={newCelebrant}
                  onChangeText={setNewCelebrant}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>Gift Name</Text>
                <TextInput
                  placeholder="What are we buying?"
                  placeholderTextColor={theme.subText}
                  style={[styles.input, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]}
                  value={newGift}
                  onChangeText={setNewGift}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>Target Amount (₵)</Text>
                <TextInput
                  placeholder="e.g. 500"
                  placeholderTextColor={theme.subText}
                  keyboardType="numeric"
                  style={[styles.input, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]}
                  value={newTarget}
                  onChangeText={setNewTarget}
                />
              </View>

              <TouchableOpacity 
                onPress={handleCreatePool}
                style={[styles.createBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              >
                <Text style={styles.createBtnText}>Create Pool</Text>
              </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
  },
  mainView: {
    gap: 24,
  },
  promoCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 32,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  promoContent: {
    zIndex: 10,
    gap: 8,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  promoDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  newPoolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  newPoolText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  promoIconBg: {
    position: 'absolute',
    bottom: -20,
    right: -10,
  },
  giftList: {
    gap: 12,
  },
  giftCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  giftLayout: {
    flexDirection: 'row',
    gap: 16,
  },
  giftThumb: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
  },
  giftInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  giftName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b',
  },
  celebrantName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 12,
  },
  giftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 3,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  detailHeader: {
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  detailImage: {
    width: 200,
    height: 200,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  detailIconBadge: {
    position: 'absolute',
    bottom: -12,
    right: -12,
    backgroundColor: '#4f46e5',
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  detailTitles: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 32,
  },
  detailGiftName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
  },
  detailCelebrant: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  contributionSection: {
    width: '100%',
  },
  contributeHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  contributeScroll: {
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  amtBtn: {
    width: 80,
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  amtBtnActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  amtText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#64748b',
  },
  amtTextActive: {
    color: '#fff',
  },
  joinBtn: {
    height: 64,
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paymentMethodSection: {
    marginTop: 8,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodBtn: {
    width: '48%',
    height: 100,
    borderRadius: 24,
    borderWidth: 2,
    padding: 16,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  methodIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: 13,
    fontWeight: '800',
  },
  selectedCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  secureText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 32,
    padding: 24,
    gap: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  modalForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  createBtn: {
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
