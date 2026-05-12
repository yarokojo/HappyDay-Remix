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
        <Text style={[styles.lastUpdated, { color: theme.subText }]}>Last Updated: May 12, 2026</Text>
        
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          Welcome to Julia's Birthday Bash ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Information We Collect</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and Services, when you participate in activities on the App or otherwise when you contact us.
        </Text>
        <Text style={[styles.subSectionTitle, { color: theme.text }]}>Personal Information Provided by You</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          The personal information that we collect depends on the context of your interactions with us and the App, the choices you make and the products and features you use. The personal information we collect may include:
          {"\n"}• Names and Email Addresses
          {"\n"}• Profile Pictures and social media handles
          {"\n"}• Transactional information (when sending gifts or using the wallet)
          {"\n"}• Content you post (wishes, comments, photos, videos)
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>2. How We Use Your Information</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          {"\n"}• To facilitate account creation and logon process.
          {"\n"}• To post testimonials and celebration content.
          {"\n"}• To manage user accounts.
          {"\n"}• To send administrative information to you.
          {"\n"}• To protect our Services from fraud or security threats.
          {"\n"}• To process your financial transactions through the Wallet and Gift Shop.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Sharing of Information</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:
          {"\n"}• Consent: We may process your data if you have given us specific consent to use your personal information for a specific purpose.
          {"\n"}• Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.
          {"\n"}• Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Data Security</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Cookies and Tracking</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Privacy Rights</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Contact Us</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          If you have questions or comments about this notice, you may email us at privacy@juliabash.com or by post to our official address.
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
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
});
