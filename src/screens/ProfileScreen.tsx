import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Modal, Share, Alert, Platform, useWindowDimensions, Clipboard } from "react-native";
import { Settings, Grid, Heart, Package, Edit3, Camera, MapPin, Calendar, Activity, Check, X, Globe, Link as LinkIcon, Instagram, Twitter, Share2, Plus, Users, ArrowLeft, CreditCard, Smartphone, ChevronRight, Lock, Bell, Moon, Shield, Eye, Trash2, Search } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { BlurView } from "expo-blur";
import { useTheme } from "../context/ThemeContext";

import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ 
  onNavigate, 
  userProfileImage, 
  onUpdateProfileImage,
  searchQuery = "",
  profile,
  setProfile,
  accountData,
  setAccountData
}: { 
  onNavigate: (screen: string, id?: string) => void;
  userProfileImage: string;
  onUpdateProfileImage: (image: string) => void;
  searchQuery?: string;
  profile: any;
  setProfile: (p: any) => void;
  accountData: any;
  setAccountData: (a: any) => void;
}) {
  const { darkMode, toggleDarkMode, theme, setPrimaryColor, primaryColor } = useTheme();
  const { width } = useWindowDimensions();
  const postCols = width > 1024 ? 5 : (width > 768 ? 4 : 3);
  const postWidth = (100 / postCols) - 1;

  const [activeTab, setActiveTab] = useState("posts");
  const [activityFilter, setActivityFilter] = useState("All");
  const [internalSearch, setInternalSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState("main"); // "main", "personal", "security", "billing", "linked", "blocked", "privacy", "terms"

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const [billingData, setBillingData] = useState({
    currentPlan: "Professional",
    planPrice: "$9.99/mo",
    nextBillingDate: "June 15, 2024",
    taxInvoices: true,
    currency: "USD",
  });

  const [transactions, setTransactions] = useState([
    { id: '1', item: 'Pro Subscription', date: 'May 15, 2024', amount: '$9.99', status: 'Success' },
    { id: '2', item: 'Gift: Diamond Ring', date: 'May 10, 2024', amount: '$45.00', status: 'Success' },
    { id: '3', item: 'Wallet Top-up', date: 'May 02, 2024', amount: '$100.00', status: 'Success' },
    { id: '4', item: 'Pro Subscription', date: 'Apr 15, 2024', amount: '$9.99', status: 'Success' },
  ]);

  const [activeDevices, setActiveDevices] = useState([
    { id: '1', name: 'iPhone 15 Pro', location: 'New York, USA', time: 'Active now', icon: Smartphone, current: true },
    { id: '2', name: 'MacBook Pro 16"', location: 'London, UK', time: '2 days ago', icon: Globe, current: false },
  ]);

  const [securityLogs, setSecurityLogs] = useState([
    { id: '1', event: 'Password Changed', status: 'Success', time: '3 days ago', icon: Lock, color: '#10b981' },
    { id: '2', event: 'New Login Detected', status: 'Alert', time: '1 week ago', icon: Shield, color: '#f59e0b' },
    { id: '3', event: '2FA Enabled', status: 'Success', time: '2 weeks ago', icon: Check, color: '#10b981' },
  ]);

  const handleToggleSetting = (key: string) => {
    if (key === 'darkMode') {
      toggleDarkMode();
    }
  };
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Media library permission is needed to update your profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onUpdateProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    }
  };

  const tabs = [
    { id: "posts", label: "Posts", Icon: Grid },
    { id: "activity", label: "Activity", Icon: Activity },
    { id: "wishes", label: "Wishes", Icon: Heart },
    { id: "gifts", label: "Gifts", Icon: Package },
  ];

  const activities = [
    { id: "1", text: "Sent a Diamond Ring to Julia", time: "2 hours ago", type: "gift", icon: Package, color: "#f59e0b", bg: "#fef3c7" },
    { id: "2", text: "Updated current wallet balance by ₵100", time: "3 hours ago", type: "wallet", icon: Globe, color: "#10b981", bg: "#ecfdf5" },
    { id: "3", text: "Shared a new birthday reel: 'Dance Off'", time: "4 hours ago", type: "social", icon: Grid, color: "#8b5cf6", bg: "#f5f3ff" },
    { id: "4", text: "Started following Michael Scott", time: "5 hours ago", type: "social", icon: Users, color: "#6366f1", bg: "#eef2ff" },
    { id: "5", text: "Received a Gourmet Cake from Sarah", time: "Yesterday", type: "gift", icon: Heart, color: "#ec4899", bg: "#fdf2f8" },
    { id: "6", text: "Contributed ₵20 to Sam's Group Gift", time: "3 days ago", type: "gift", icon: Package, color: "#d97706", bg: "#fffbeb" },
  ];

  const effectiveSearch = internalSearch || searchQuery;

  const filteredActivities = activities.filter(a => {
    const matchesFilter = activityFilter === "All" || a.type === activityFilter.toLowerCase();
    const matchesSearch = !effectiveSearch || 
      a.text.toLowerCase().includes(effectiveSearch.toLowerCase()) || 
      a.type.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleShare = async () => {
    const shareMessage = `Check out ${profile.name}'s profile on Celebration App!\nhttps://celebration.app/alex_johnson`;
    
    try {
      const result = await Share.share({
        message: shareMessage,
        url: 'https://celebration.app/alex_johnson',
      });

      if (result.action === Share.sharedAction) {
        // Success
      }
    } catch (error: any) {
      // Gracefully handle cancellation
      const errorMessage = error?.message || '';
      const isCanceled = errorMessage.includes('canceled') || errorMessage.includes('Canceled') || error?.name === 'AbortError';
      
      if (isCanceled) {
        return; 
      }

      // Fallback to clipboard
      try {
        Clipboard.setString(shareMessage);
        Alert.alert("Copied", "Profile link copied to clipboard!");
      } catch (clipboardError) {
        console.error('Share and Clipboard fallback both failed:', clipboardError);
      }
    }
  };

  const renderSettingsContent = () => {
    switch (settingsView) {
      case "personal":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>EMAIL ADDRESS</Text>
              <TextInput 
                value={accountData.email} 
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setAccountData(p => ({ ...p, email: t }))} 
                placeholderTextColor={theme.subText}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>PHONE NUMBER</Text>
              <TextInput 
                value={accountData.phone} 
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setAccountData(p => ({ ...p, phone: t }))} 
                keyboardType="phone-pad" 
                placeholderTextColor={theme.subText}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>LOCATION</Text>
              <TextInput 
                value={profile.location} 
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setProfile(p => ({ ...p, location: t }))} 
                placeholderTextColor={theme.subText}
              />
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setSettingsView("main")}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </MotiView>
        );
      case "security":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            {/* Security Health */}
            <View style={styles.securityHealthCard}>
              <View style={styles.healthInfo}>
                <Text style={styles.healthTitle}>Account Security</Text>
                <Text style={styles.healthStatus}>Status: <Text style={{ color: '#10b981' }}>Secure</Text></Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{accountData.securityScore}%</Text>
              </View>
            </View>

            <Text style={[styles.sectionHeader, { color: theme.subText }]}>PROTECTION</Text>
            <View style={[styles.settingToggleItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.toggleTitle, { color: theme.text }]}>Two-Factor Auth</Text>
                <Text style={[styles.toggleDesc, { color: theme.subText }]}>Secure your account with 2FA</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setAccountData(p => ({ ...p, twoFactor: !p.twoFactor }))}
                style={[styles.toggleSwitch, accountData.twoFactor && styles.toggleSwitchActive, { backgroundColor: accountData.twoFactor ? '#6366f1' : theme.border }]}
              >
                <View style={[styles.toggleDot, accountData.twoFactor && styles.toggleDotActive]} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingToggleItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.toggleTitle, { color: theme.text }]}>Login Alerts</Text>
                <Text style={[styles.toggleDesc, { color: theme.subText }]}>Notify me of new login attempts</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setAccountData(p => ({ ...p, loginAlerts: !p.loginAlerts }))}
                style={[styles.toggleSwitch, accountData.loginAlerts && styles.toggleSwitchActive, { backgroundColor: accountData.loginAlerts ? '#6366f1' : theme.border }]}
              >
                <View style={[styles.toggleDot, accountData.loginAlerts && styles.toggleDotActive]} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 12, color: theme.subText }]}>ACTIONS</Text>
            <TouchableOpacity style={[styles.standardOption, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("changePassword")}>
              <View style={styles.optionLeft}>
                <Lock size={16} color={theme.subText} />
                <Text style={[styles.standardOptionText, { color: theme.text }]}>Change Password</Text>
              </View>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.standardOption, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("devices")}>
              <View style={styles.optionLeft}>
                <Smartphone size={16} color={theme.subText} />
                <Text style={[styles.standardOptionText, { color: theme.text }]}>Active Sessions</Text>
              </View>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{activeDevices.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.standardOption, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("logs")}>
              <View style={styles.optionLeft}>
                <Shield size={16} color={theme.subText} />
                <Text style={[styles.standardOptionText, { color: theme.text }]}>Security Logs</Text>
              </View>
              <ChevronRight size={18} color={theme.border} />
            </TouchableOpacity>
          </MotiView>
        );
      case "devices":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <Text style={[styles.infoBoxText, { color: theme.subText }]}>These devices are currently logged into your account. Recognise them or log out.</Text>
            {activeDevices.map(device => (
              <View key={device.id} style={[styles.deviceCard, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
                <View style={[styles.deviceIconBg, { backgroundColor: theme.card }]}>
                  <device.icon size={20} color="#6366f1" />
                </View>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceNameRow}>
                    <Text style={[styles.deviceName, { color: theme.text }]}>{device.name}</Text>
                    {device.current && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>THIS DEVICE</Text></View>}
                  </View>
                  <Text style={[styles.deviceMeta, { color: theme.subText }]}>{device.location} • {device.time}</Text>
                </View>
                {!device.current && (
                  <TouchableOpacity style={styles.logoutDeviceBtn}>
                    <Text style={styles.logoutDeviceText}>Logout</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.logoutAllBtn}>
              <Text style={styles.logoutAllText}>Log out of all other sessions</Text>
            </TouchableOpacity>
          </MotiView>
        );
      case "logs":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <Text style={[styles.infoBoxText, { color: theme.subText }]}>Recent security-related actions on your account.</Text>
            {securityLogs.map(log => (
              <View key={log.id} style={[styles.logCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.logIconBg, { backgroundColor: log.color + '15' }]}>
                  <log.icon size={18} color={log.color} />
                </View>
                <View style={styles.logInfo}>
                  <Text style={[styles.logEvent, { color: theme.text }]}>{log.event}</Text>
                  <Text style={[styles.logMeta, { color: theme.subText }]}>{log.status} • {log.time}</Text>
                </View>
                <ChevronRight size={14} color={theme.border} />
              </View>
            ))}
          </MotiView>
        );
      case "billing":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            {/* Current Plan */}
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planBadge}>CURRENT PLAN</Text>
                  <Text style={styles.planTitle}>{billingData.currentPlan}</Text>
                  <Text style={styles.planPrice}>{billingData.planPrice}</Text>
                </View>
                <View style={styles.planIconBg}>
                  <Package size={24} color="#fff" />
                </View>
              </View>
              <View style={styles.planDetails}>
                <Text style={styles.planMeta}>Next billing date: <Text style={{ fontWeight: '800', color: '#fff' }}>{billingData.nextBillingDate}</Text></Text>
                <TouchableOpacity style={styles.upgradeBtn}>
                  <Text style={styles.upgradeBtnText}>Manage Plan</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.sectionHeader, { color: theme.subText }]}>PAYMENT METHODS</Text>
            <View style={[styles.billingItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View style={[styles.billingIconBg, { backgroundColor: theme.itemBg }]}><CreditCard size={18} color="#4f46e5" /></View>
              <View style={styles.billingInfo}>
                <Text style={[styles.billingTitle, { color: theme.text }]}>Visa •••• 4242</Text>
                <Text style={[styles.billingMeta, { color: theme.subText }]}>EXPIRES 12/26 • PRIMARY</Text>
              </View>
              <TouchableOpacity><Edit3 size={16} color={theme.subText} /></TouchableOpacity>
            </View>
            <View style={[styles.billingItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View style={[styles.billingIconBg, { backgroundColor: theme.itemBg }]}><Smartphone size={18} color="#10b981" /></View>
              <View style={styles.billingInfo}>
                <Text style={[styles.billingTitle, { color: theme.text }]}>MTN Mobile Money</Text>
                <Text style={[styles.billingMeta, { color: theme.subText }]}>0771234567 • BACKUP</Text>
              </View>
              <TouchableOpacity><Trash2 size={16} color="#ef4444" /></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addMethodBtn} onPress={() => setSettingsView("addPayment")}>
              <Plus size={16} color="#4f46e5" />
              <Text style={styles.addMethodText}>Add New Method</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.subText }]}>PREFERENCES</Text>
            <View style={[styles.settingToggleItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.toggleTitle, { color: theme.text }]}>Tax Invoices</Text>
                <Text style={[styles.toggleDesc, { color: theme.subText }]}>Send PDF receipts to my email</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setBillingData(p => ({ ...p, taxInvoices: !p.taxInvoices }))}
                style={[styles.toggleSwitch, billingData.taxInvoices && styles.toggleSwitchActive, { backgroundColor: billingData.taxInvoices ? '#6366f1' : theme.border }]}
              >
                <View style={[styles.toggleDot, billingData.taxInvoices && styles.toggleDotActive]} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.subText }]}>BILLING HISTORY</Text>
            <View style={styles.historyList}>
              {transactions.map((tx) => (
                <View key={tx.id} style={[styles.historyItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.historyLeft}>
                    <Text style={[styles.historyTitle, { color: theme.text }]}>{tx.item}</Text>
                    <Text style={[styles.historyDate, { color: theme.subText }]}>{tx.date}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={[styles.historyAmount, { color: theme.text }]}>{tx.amount}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{tx.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View Full History</Text>
            </TouchableOpacity>
          </MotiView>
        );
      case "changePassword":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <Text style={[styles.infoBoxText, { color: theme.subText }]}>Your new password must be at least 8 characters long and include a mix of letters and numbers.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>CURRENT PASSWORD</Text>
              <TextInput 
                value={passwordForm.current} 
                secureTextEntry
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setPasswordForm(p => ({ ...p, current: t }))} 
                placeholder="••••••••"
                placeholderTextColor={theme.subText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>NEW PASSWORD</Text>
              <TextInput 
                value={passwordForm.new} 
                secureTextEntry
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setPasswordForm(p => ({ ...p, new: t }))} 
                placeholder="Minimum 8 characters"
                placeholderTextColor={theme.subText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>CONFIRM NEW PASSWORD</Text>
              <TextInput 
                value={passwordForm.confirm} 
                secureTextEntry
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setPasswordForm(p => ({ ...p, confirm: t }))} 
                placeholder="Confirm your password"
                placeholderTextColor={theme.subText}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={() => {
              Alert.alert("Success", "Your password has been changed successfully.");
              setSettingsView("security");
            }}>
              <Text style={styles.saveBtnText}>Update Password</Text>
            </TouchableOpacity>
          </MotiView>
        );
      case "addPayment":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <Text style={[styles.infoBoxText, { color: theme.subText }]}>We support all major credit and debit cards. Your payment information is encrypted and secure.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>CARDHOLDER NAME</Text>
              <TextInput 
                value={paymentForm.name} 
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setPaymentForm(p => ({ ...p, name: t }))} 
                placeholder="Full Name"
                placeholderTextColor={theme.subText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>CARD NUMBER</Text>
              <TextInput 
                value={paymentForm.cardNumber} 
                keyboardType="numeric"
                style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                onChangeText={(t) => setPaymentForm(p => ({ ...p, cardNumber: t }))} 
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={theme.subText}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>EXPIRY DATE</Text>
                <TextInput 
                  value={paymentForm.expiry} 
                  placeholder="MM/YY"
                  style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                  onChangeText={(t) => setPaymentForm(p => ({ ...p, expiry: t }))} 
                  placeholderTextColor={theme.subText}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: theme.subText }]}>CVV</Text>
                <TextInput 
                  value={paymentForm.cvv} 
                  secureTextEntry
                  keyboardType="numeric"
                  placeholder="000"
                  style={[styles.settingInput, { backgroundColor: theme.itemBg, color: theme.text, borderColor: theme.border }]} 
                  onChangeText={(t) => setPaymentForm(p => ({ ...p, cvv: t }))} 
                  placeholderTextColor={theme.subText}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={() => {
              Alert.alert("Success", "Payment method added successfully.");
              setSettingsView("billing");
            }}>
              <Text style={styles.saveBtnText}>Add Card</Text>
            </TouchableOpacity>
          </MotiView>
        );
      case "linked":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <Text style={[styles.infoBoxText, { color: theme.subText }]}>Connect social accounts to sync activity and findings across platforms.</Text>
            {[
              { id: 'insta', name: "Instagram", icon: Instagram, color: "#ec4899", connected: true, handle: "@alex_johnson" },
              { id: 'twit', name: "Twitter", icon: Twitter, color: "#06b6d4", connected: false },
              { id: 'goog', name: "Google", icon: Globe, color: "#ef4444", connected: true, handle: "alex.j@gmail.com" },
              { id: 'fb', id_name: "Facebook", name: "Facebook", icon: Globe, color: "#3b5998", connected: false },
            ].map((app, i) => (
              <View key={i} style={[styles.socialItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <View style={styles.socialLeft}>
                  <View style={[styles.socialIconBg, { backgroundColor: app.color + '10' }]}>
                    <app.icon size={18} color={app.color} />
                  </View>
                  <View>
                    <Text style={[styles.socialName, { color: theme.text }]}>{app.name}</Text>
                    {app.handle && <Text style={[styles.socialHandle, { color: theme.subText }]}>{app.handle}</Text>}
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.socialBtn, app.connected && styles.socialBtnConnected]}
                  onPress={() => {
                    if (app.connected) {
                      Alert.alert(
                        "Disconnect Account",
                        `Are you sure you want to disconnect your ${app.name} account?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Disconnect", style: "destructive", onPress: () => Alert.alert("Success", `${app.name} disconnected.`) }
                        ]
                      );
                    } else {
                      Alert.alert("Connect Account", `Sign in to ${app.name} to link your account.`);
                    }
                  }}
                >
                  <Text style={[styles.socialBtnText, app.connected && styles.socialBtnTextConnected]}>
                    {app.connected ? "Disconnect" : "Connect"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                setIsSettingsOpen(false);
                onNavigate("privacy_policy");
              }}>
                <Text style={[styles.addMethodText, { textAlign: 'center', color: theme.primary }]}>Privacy Policy</Text>
              </TouchableOpacity>
              <View style={{ width: 1, height: 14, backgroundColor: theme.border, alignSelf: 'center' }} />
              <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                setIsSettingsOpen(false);
                onNavigate("terms");
              }}>
                <Text style={[styles.addMethodText, { textAlign: 'center', color: theme.primary }]}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        );
      case "blocked":
        return (
          <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} style={[styles.settingsSubView, { backgroundColor: theme.bg }]}>
            <View style={styles.emptyContainer}>
              <Shield size={48} color={theme.border} strokeWidth={1} />
              <Text style={[styles.emptyText, { color: theme.subText }]}>No blocked accounts</Text>
            </View>
          </MotiView>
        );
      default: // main
        return (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={[styles.settingsMainView, { backgroundColor: theme.bg }]}>
            <Text style={[styles.sectionHeader, { color: theme.subText }]}>ACCOUNT</Text>
            <TouchableOpacity style={[styles.optionItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("personal")}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><Users size={16} color="#6366f1" /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Personal Information</Text>
              </View>
              <ChevronRight size={16} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("security")}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><Lock size={16} color="#6366f1" /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Security & Login</Text>
              </View>
              <ChevronRight size={16} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("billing")}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><CreditCard size={16} color="#6366f1" /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Billing & Payments</Text>
              </View>
              <ChevronRight size={16} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("linked")}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><LinkIcon size={16} color="#6366f1" /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Linked Accounts</Text>
              </View>
              <ChevronRight size={16} color={theme.border} />
            </TouchableOpacity>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.subText }]}>PRIVACY & SAFETY</Text>
            <View style={[styles.settingToggleItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><Eye size={16} color={theme.primary} /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Private Account</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => {}}
                style={[styles.toggleSwitch, { backgroundColor: theme.border }]}
              >
                <View style={[styles.toggleDot]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.optionItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]} onPress={() => setSettingsView("blocked")}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><Shield size={16} color="#ef4444" /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Blocked Accounts</Text>
              </View>
              <ChevronRight size={16} color={theme.border} />
            </TouchableOpacity>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.subText }]}>PREFERENCES</Text>
            
            <View style={[styles.settingToggleItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconBg, { backgroundColor: theme.itemBg }]}><Moon size={16} color={theme.primary} /></View>
                <Text style={[styles.optionText, { color: theme.text }]}>Dark Mode</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => toggleDarkMode()} 
                style={[styles.toggleSwitch, darkMode && styles.toggleSwitchActive, { backgroundColor: darkMode ? theme.primary : theme.border }]}
              >
                <View style={[styles.toggleDot, darkMode && styles.toggleDotActive]} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.subText }]}>THEME COLOR</Text>
            <View style={[styles.colorPickerRow, { backgroundColor: theme.card, borderBottomColor: theme.border, paddingVertical: 16 }]}>
              {["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"].map((color) => (
                <TouchableOpacity 
                  key={color}
                  onPress={() => setPrimaryColor(color)}
                  style={[
                    styles.colorOption, 
                    { backgroundColor: color },
                    primaryColor === color && { borderWidth: 3, borderColor: theme.text }
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionHeader, { marginTop: 24, color: theme.subText, textAlign: 'center' }]}>LEGAL</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 12, marginBottom: 30 }}>
              <TouchableOpacity onPress={() => { setIsSettingsOpen(false); onNavigate('privacy_policy'); }}>
                <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>Privacy Policy</Text>
              </TouchableOpacity>
              <View style={{ width: 1, height: 14, backgroundColor: theme.border, alignSelf: 'center' }} />
              <TouchableOpacity onPress={() => { setIsSettingsOpen(false); onNavigate('terms'); }}>
                <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '600' }}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.banner}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1513151233558-d860c53bd81d?w=800&fit=crop" }} 
            style={styles.bannerImage} 
          />
          <TouchableOpacity style={styles.settingsBtn} onPress={() => setIsSettingsOpen(true)}>
            <BlurView intensity={30} tint="dark" style={styles.settingsBlur}>
              <Settings size={20} color="#fff" />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Profile Info Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card, shadowColor: darkMode ? '#000' : theme.primary }]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: userProfileImage }} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEditBtn} onPress={pickImage}>
                <Camera size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editForm}>
                <TextInput 
                  value={profile.name} 
                  onChangeText={(t) => setProfile(p => ({ ...p, name: t }))}
                  style={[styles.nameInput, { color: theme.text, backgroundColor: theme.itemBg }]}
                />
                <TextInput 
                  value={profile.bio} 
                  onChangeText={(t) => setProfile(p => ({ ...p, bio: t }))}
                  multiline
                  style={[styles.bioInput, { color: theme.text, backgroundColor: theme.itemBg }]}
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveAction} onPress={() => setIsEditing(false)}>
                    <Text style={styles.saveActionText}>SAVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelAction} onPress={() => setIsEditing(false)}>
                    <X size={16} color={theme.subText} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.profileMeta}>
                <View style={styles.nameRow}>
                  <Text style={[styles.profileName, { color: theme.text }]}>{profile.name}</Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>PRO</Text>
                  </View>
                </View>
                <Text style={[styles.profileUsername, { color: theme.subText }]}>{profile.username}</Text>
                <Text style={[styles.profileBio, { color: theme.text }]}>{profile.bio}</Text>
                
                <View style={styles.attributes}>
                  <View style={styles.attrItem}>
                    <MapPin size={12} color="#818cf8" />
                    <Text style={[styles.attrText, { color: theme.subText }]}>{profile.location}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Globe size={12} color="#f472b6" />
                    <Text style={[styles.attrText, { color: theme.subText }]}>{profile.website}</Text>
                  </View>
                </View>

                <View style={styles.profileActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                    <Edit3 size={16} color="#fff" />
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.shareBtn, { backgroundColor: theme.itemBg }]} onPress={handleShare}>
                    <Share2 size={16} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
            <TouchableOpacity style={styles.statItem} onPress={() => onNavigate('wallet')}>
              <Text style={[styles.statValue, { color: theme.text }]}>₵320</Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>BALANCE</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>1.2K</Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>FOLLOWING</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>8.4K</Text>
              <Text style={[styles.statLabel, { color: theme.subText }]}>FOLLOWERS</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {tabs.map((tab) => (
              <TouchableOpacity 
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tabItem, 
                  activeTab === tab.id && styles.tabItemActive,
                  { backgroundColor: activeTab === tab.id ? '#6366f1' : 'transparent' }
                ]}
              >
                <tab.Icon size={16} color={activeTab === tab.id ? "#fff" : theme.subText} />
                <Text style={[
                  styles.tabLabel, 
                  activeTab === tab.id && styles.tabLabelActive,
                  { color: activeTab === tab.id ? "#fff" : theme.subText }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "posts" && (
            <View style={styles.postsGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <TouchableOpacity key={i} style={[styles.gridItem, { width: `${postWidth}%`, backgroundColor: theme.card }]}>
                  <Image 
                    source={{ uri: `https://picsum.photos/seed/${i + 130}/300/300` }} 
                    style={styles.gridImage} 
                  />
                  <View style={styles.gridOverlay}>
                    <Heart size={12} color="#fff" fill="#fff" />
                    <Text style={styles.overlayText}>{Math.floor(Math.random() * 100)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === "activity" && (
            <View style={styles.activityList}>
              <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 16 }]}>
                <Search size={18} color={theme.subText} />
                <TextInput 
                  placeholder="Search activities..." 
                  style={[styles.searchInput, { color: theme.text }]}
                  placeholderTextColor={theme.subText}
                  value={internalSearch}
                  onChangeText={setInternalSearch}
                />
              </View>
              <View style={styles.filterRow}>
                {["All", "Social", "Gift", "Wallet"].map(f => (
                  <TouchableOpacity 
                    key={f} 
                    onPress={() => setActivityFilter(f)} 
                    style={[
                      styles.filterChip, 
                      activityFilter === f && styles.filterChipActive,
                      { backgroundColor: theme.card, borderColor: theme.border }
                    ]}
                  >
                    <Text style={[
                      styles.filterText, 
                      activityFilter === f && styles.filterTextActive,
                      { color: activityFilter === f ? "#fff" : theme.subText }
                    ]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {filteredActivities.map(act => (
                <View key={act.id} style={[styles.activityCard, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                  <View style={[styles.activityIcon, { backgroundColor: act.bg }]}>
                    <act.icon size={18} color={act.color} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityText, { color: theme.text }]}>{act.text}</Text>
                    <View style={styles.activityMeta}>
                      <Text style={[styles.activityTime, { color: theme.subText }]}>{act.time}</Text>
                      <View style={[styles.metaDot, { backgroundColor: theme.border }]} />
                      <Text style={[styles.activityType, { color: act.color }]}>{act.type.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab !== "posts" && activeTab !== "activity" && (
            <View style={styles.emptyTab}>
              <Text style={styles.emptyTabText}>No {activeTab} yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal visible={isSettingsOpen} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.bg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <View style={styles.modalTitleRow}>
                {settingsView !== "main" && (
                  <TouchableOpacity style={styles.backBtn} onPress={() => setSettingsView("main")}>
                    <ArrowLeft size={20} color={theme.text} />
                  </TouchableOpacity>
                )}
                <View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    {settingsView === "main" ? "Settings" : 
                     settingsView === "personal" ? "Account Info" : 
                     settingsView === "security" ? "Security" :
                     settingsView === "changePassword" ? "Change Password" :
                     settingsView === "devices" ? "Active Devices" :
                     settingsView === "logs" ? "Security Logs" :
                     settingsView === "billing" ? "Billing" :
                     settingsView === "addPayment" ? "New Payment Method" :
                     settingsView === "privacy" ? "Privacy Policy" :
                     settingsView === "terms" ? "Terms of Service" :
                     settingsView === "linked" ? "Connected Apps" : "Blocked Users"}
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: theme.subText }]}>
                    {settingsView === "main" ? "Configure your app preferences" : 
                     settingsView === "changePassword" ? "Keep your account secure" :
                     settingsView === "addPayment" ? "Securely add a new card" :
                     settingsView === "privacy" || settingsView === "terms" ? "Last updated: May 2024" :
                     "Update your details"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => { setIsSettingsOpen(false); setSettingsView("main"); }} style={styles.closeBtn}>
                <X size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {renderSettingsContent()}
            </ScrollView>
          </View>
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
  scrollContent: {
    paddingBottom: 40,
  },
  banner: {
    height: 180,
    width: '100%',
    backgroundColor: '#4f46e5',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  settingsBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingsBlur: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 32,
    padding: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#4f46e5',
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
  },
  verifiedBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#4f46e5',
  },
  profileUsername: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
    marginTop: 2,
  },
  profileBio: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginTop: 8,
  },
  attributes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  attrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attrText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  editBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  shareBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#94a3b8',
    marginTop: 4,
    letterSpacing: 1,
  },
  tabsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  tabsScroll: {
    gap: 12,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  tabItemActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: '#fff',
  },
  tabContent: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    opacity: 0.8,
  },
  overlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  activityList: {
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  filterChipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  filterTextActive: {
    color: '#fff',
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  activityTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  activityType: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
  },
  emptyTab: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTabText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontStyle: 'italic',
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
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    padding: 24,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6366f1',
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  settingToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    marginBottom: 8,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    padding: 2,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  toggleSwitchActive: {
    backgroundColor: '#4f46e5',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  logoutBtn: {
    marginTop: 32,
    height: 52,
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsSubView: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    marginLeft: 8,
    letterSpacing: 1,
  },
  settingInput: {
    height: 52,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveBtn: {
    height: 52,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legalText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  legalStrong: {
    fontWeight: '900',
    fontSize: 14,
  },
  colorPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  toggleDesc: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  standardOption: {
    height: 52,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  standardOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  billingItem: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  billingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingInfo: {
    flex: 1,
  },
  billingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  billingMeta: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    marginTop: 2,
  },
  addMethodBtn: {
    height: 52,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#c7d2fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#f5f7ff',
  },
  addMethodText: {
    color: '#4f46e5',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  socialHandle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  socialBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
  },
  socialBtnConnected: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  socialBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  socialBtnTextConnected: {
    color: '#94a3b8',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  settingsMainView: {
    flex: 1,
  },
  editForm: {
    flex: 1,
    gap: 12,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bioInput: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveAction: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveActionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  cancelAction: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Security Advanced Styles
  securityHealthCard: {
    backgroundColor: '#4f46e5',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  healthInfo: {
    flex: 1,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  healthStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    marginTop: 4,
  },
  scoreContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#10b981',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  badgeCount: {
    paddingHorizontal: 8,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 12,
  },
  deviceIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#ecfdf5',
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#059669',
  },
  deviceMeta: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  logoutDeviceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  logoutDeviceText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ef4444',
  },
  logoutAllBtn: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4f46e5',
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 12,
  },
  logIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInfo: {
    flex: 1,
  },
  logEvent: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
  },
  logMeta: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  // Billing Advanced Styles
  planCard: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planInfo: {
    flex: 1,
  },
  planBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  planIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planDetails: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  planMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  upgradeBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  upgradeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6366f1',
  },
  historyList: {
    gap: 12,
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  historyLeft: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  historyDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1e293b',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16a34a',
    textTransform: 'uppercase',
  },
  viewAllBtn: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366f1',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
