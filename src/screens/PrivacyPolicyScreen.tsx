import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyPolicyScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.lastUpdated, { color: theme.subText }]}>Last Updated: May 10, 2026</Text>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Information We Collect</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We collect information you provide directly to us when you create an account, post content, or communicate with other users. This includes your name, email address, profile picture, and any celebration details you share.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>2. How We Use Information</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We use the information we collect to operate, maintain, and provide the features of our celebration platform. This includes processing gifts, sending notifications, and personalizing your social feed.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Sharing of Information</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          Your profile information and posts are visible to other users as per your privacy settings. We do not sell your personal data to third parties. We may share information with service providers who perform services on our behalf, such as payment processing.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Data Security</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Your Choices</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          You may update or correct your account information at any time by logging into your account settings. You can also request deletion of your account.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
});
