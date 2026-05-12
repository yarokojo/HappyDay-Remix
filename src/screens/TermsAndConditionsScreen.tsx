import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function TermsAndConditionsScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.lastUpdated, { color: theme.subText }]}>Last Updated: May 10, 2026</Text>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          By accessing or using our application, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>2. User Accounts</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Use of the Service</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          You agree not to use the service for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction while using the service.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Intellectual Property</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          The application and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Termination</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Limitation of Liability</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
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
