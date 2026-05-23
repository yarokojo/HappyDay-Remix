import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, ActivityIndicator, Platform } from "react-native";
import { ArrowLeft, Wallet, ArrowUpRight, History, Smartphone, ChevronRight, Gift, Plus, X } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { Transaction } from "../types";
import { useTheme } from "../context/ThemeContext";

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "gift_received", amount: 2500, date: "Today, 10:45 AM", senderName: "Julia Mason", status: "completed" },
  { id: "t2", type: "gift_received", amount: 5000, date: "Yesterday, 08:20 PM", senderName: "Kevin Hart", status: "completed" },
  { id: "t3", type: "withdrawal", amount: 10000, date: "2 days ago", status: "completed" },
  { id: "t4", type: "gift_received", amount: 15000, date: "3 days ago", senderName: "Samantha Lee", status: "completed" },
];

export default function WalletScreen({ onBack }: { onBack: () => void }) {
  const { theme, darkMode } = useTheme();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("0244123456");
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(325);

  const networks = [
    { id: "MTN", name: "MTN", color: "#fbbf24" },
    { id: "Telecel", name: "Telecel", color: "#dc2626" },
    { id: "AirtelTigo", name: "AirtelTigo", color: "#2563eb" },
  ];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount > currentBalance) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentBalance(prev => prev - amount);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsWithdrawing(false);
        setWithdrawAmount("");
      }, 3000);
    }, 2000);
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!amount) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentBalance(prev => prev + amount);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsToppingUp(false);
        setTopUpAmount("");
      }, 3000);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
          <View style={styles.balanceHeader}>
            <Wallet size={14} color="#fff" opacity={0.8} />
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balanceValue}>₵ {currentBalance.toLocaleString()}/-</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtnSecondary, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={() => setIsToppingUp(true)}
            >
              <Plus size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtnPrimary, { backgroundColor: '#fff' }]}
              onPress={() => setIsWithdrawing(true)}
            >
              <ArrowUpRight size={18} color={theme.primary} />
              <Text style={[styles.actionBtnText, { color: theme.primary }]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeft}>
              <History size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {MOCK_TRANSACTIONS.map((tx) => (
              <View key={tx.id} style={[styles.transactionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.txLeft}>
                  <View style={[
                    styles.txIconBg, 
                    { backgroundColor: tx.type === 'gift_received' 
                        ? (darkMode ? theme.primary + '20' : '#f0fdf4') 
                        : (darkMode ? theme.secondary + '20' : '#fff7ed') 
                    }
                  ]}>
                    {tx.type === 'gift_received' ? <Gift size={20} color={darkMode ? theme.primary : "#16a34a"} /> : <ArrowUpRight size={20} color={darkMode ? theme.secondary : "#ea580c"} />}
                  </View>
                  <View>
                    <Text style={[styles.txTitle, { color: theme.text }]}>
                      {tx.type === 'gift_received' ? `Gift from ${tx.senderName}` : 'Withdrawal to MM'}
                    </Text>
                    <Text style={[styles.txDate, { color: theme.subText }]}>{tx.date}</Text>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text style={[
                      styles.txAmount, 
                      { 
                        color: tx.type === 'gift_received' 
                            ? (darkMode ? theme.primary : '#16a34a') 
                            : theme.text 
                      }
                  ]}>
                    {tx.type === 'gift_received' ? '+' : '-'} ₵{tx.amount.toLocaleString()}
                  </Text>
                  <Text style={[styles.txStatus, { color: theme.subText }]}>Success</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheets (Modals) */}
      <Modal visible={isWithdrawing || isToppingUp} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.bg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{isWithdrawing ? "Withdraw to MM" : "Top Up Wallet"}</Text>
              <TouchableOpacity onPress={() => { setIsWithdrawing(false); setIsToppingUp(false); }}>
                <X size={24} color={theme.subText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>{isWithdrawing ? "Amount to Withdraw" : "Amount to Top Up"}</Text>
                <View style={styles.amountWrap}>
                  <TextInput 
                    style={[styles.amountInput, { color: theme.text }]}
                    placeholder="0.00"
                    placeholderTextColor={theme.subText}
                    keyboardType="numeric"
                    value={isWithdrawing ? withdrawAmount : topUpAmount}
                    onChangeText={(t) => isWithdrawing ? setWithdrawAmount(t) : setTopUpAmount(t)}
                  />
                  <Text style={[styles.currencyCode, { color: theme.subText }]}>GHS</Text>
                </View>
                <View style={styles.quickAmounts}>
                  {[50, 100, 200].map(amt => (
                    <TouchableOpacity 
                      key={amt} 
                      onPress={() => isWithdrawing ? setWithdrawAmount(amt.toString()) : setTopUpAmount(amt.toString())}
                      style={[styles.quickAmtBtn, { backgroundColor: theme.itemBg, borderColor: theme.border }]}
                    >
                      <Text style={[styles.quickAmtText, { color: theme.text }]}>{amt.toLocaleString()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.networkSection}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>Select Network</Text>
                <View style={styles.networkGrid}>
                  {networks.map((net) => (
                    <TouchableOpacity
                      key={net.id}
                      onPress={() => setSelectedNetwork(net.id)}
                      style={[
                        styles.networkBtn, 
                        { backgroundColor: theme.card, borderColor: theme.border },
                        selectedNetwork === net.id && { borderColor: theme.primary, backgroundColor: darkMode ? theme.primary + '10' : theme.primary + '05' }
                      ]}
                    >
                      <View style={[styles.netIcon, { backgroundColor: net.color }]}>
                        <Text style={styles.netLabelShort}>{net.id.substring(0, 2).toLowerCase()}</Text>
                      </View>
                      <Text style={[
                          styles.netLabel, 
                          { color: theme.subText },
                          selectedNetwork === net.id && { color: theme.primary }
                      ]}>{net.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.accountCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.accountLeft}>
                  <View style={[styles.accIconBg, { backgroundColor: networks.find(n => n.id === selectedNetwork)?.color }]}>
                    <Smartphone size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={[styles.accLabel, { color: theme.subText }]}>{selectedNetwork} Account</Text>
                    <Text style={[styles.accValue, { color: theme.text }]}>{phoneNumber}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={theme.subText} />
              </View>

              {isWithdrawing && (
                <View style={[styles.infoBox, { backgroundColor: darkMode ? theme.itemBg : theme.secondary + '10' }]}>
                  <Text style={[styles.infoText, { color: darkMode ? theme.secondary : '#3b82f6' }]}>
                    NOTE: WITHDRAWALS TO MOBILE MONEY WALLETS TAKE APPROXIMATELY 15-30 MINUTES TO PROCESS.
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={[
                  styles.mainActionBtn, 
                  { backgroundColor: theme.primary, shadowColor: theme.primary },
                  (loading || (!isWithdrawing ? !topUpAmount : (!withdrawAmount || parseFloat(withdrawAmount) > currentBalance))) && { backgroundColor: theme.itemBg, shadowOpacity: 0 }
                ]}
                disabled={loading || (!isWithdrawing ? !topUpAmount : (!withdrawAmount || parseFloat(withdrawAmount) > currentBalance))}
                onPress={isWithdrawing ? handleWithdraw : handleTopUp}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.mainActionBtnText}>
                    {isWithdrawing ? "Confirm Withdrawal" : "Initiate Top Up"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={[styles.successOverlay, { backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }]}>
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={[styles.successCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <View style={[styles.successIconWrapper, { backgroundColor: darkMode ? theme.primary + '20' : '#f0fdf4' }]}>
              <ArrowUpRight size={40} color={darkMode ? theme.primary : "#16a34a"} />
            </View>
            <Text style={[styles.successTitle, { color: theme.text }]}>Success!</Text>
            <Text style={[styles.successDesc, { color: theme.subText }]}>Your request is being processed. You'll receive a notification shortly.</Text>
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
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 2,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 40,
    padding: 32,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.8,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
  },
  actionBtnSecondary: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  historySection: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transactionList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  txDate: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  txStatus: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 2,
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
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
  },
  modalScroll: {
    padding: 24,
  },
  inputContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e293b',
    flex: 1,
    padding: 0,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '900',
    color: '#cbd5e1',
    marginLeft: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  quickAmtBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quickAmtText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  networkSection: {
    marginTop: 32,
  },
  networkGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  networkBtn: {
    flex: 1,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  networkBtnActive: {
    borderColor: '#4f46e5',
    backgroundColor: '#f5f7ff',
  },
  netIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netLabelShort: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
  },
  netLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  netLabelActive: {
    color: '#4f46e5',
  },
  accountCard: {
    marginTop: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  accLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  accValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
  },
  infoBox: {
    marginTop: 24,
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 16,
  },
  infoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3b82f6',
    lineHeight: 15,
  },
  mainActionBtn: {
    height: 56,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 40,
  },
  mainActionBtnDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  mainActionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    backgroundColor: '#fff',
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
    borderColor: '#f1f5f9',
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
});
